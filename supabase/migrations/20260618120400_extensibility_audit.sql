-- BloodChain Pakistan — Sprint 1 (additive): extensibility + auditability
-- Goal: make the data a long-term, legally-defensible, investigable ASSET via
-- structure + history + provenance — NOT by loosening types.
--   • metadata jsonb : ad-hoc future fields without a migration (promote to real
--                      columns when a field starts driving decisions)
--   • tags text[]    : flexible labels for rules/restrictions (flagged, do-not-contact…)
--   • deleted_at     : soft delete — nothing is ever truly lost
--   • created_by/updated_by + source : provenance
--   • audit_log      : immutable who/what/when/old→new for investigation & legal

-- ── 1. Provenance + flexibility columns ──────────────────────────────────────
alter table donors
  add column metadata    jsonb       not null default '{}'::jsonb,
  add column tags        text[]      not null default '{}',
  add column deleted_at  timestamptz,
  add column created_by  uuid references profiles(id),
  add column updated_by  uuid references profiles(id),
  add column consent_at  timestamptz,
  add column consent_policy_version text;

alter table volunteers
  add column metadata   jsonb not null default '{}'::jsonb,
  add column tags       text[] not null default '{}',
  add column deleted_at timestamptz,
  add column created_by uuid references profiles(id),
  add column updated_by uuid references profiles(id);

alter table partners
  add column metadata   jsonb not null default '{}'::jsonb,
  add column tags       text[] not null default '{}',
  add column deleted_at timestamptz,
  add column created_by uuid references profiles(id),
  add column updated_by uuid references profiles(id);

alter table hospitals
  add column metadata   jsonb not null default '{}'::jsonb,
  add column deleted_at timestamptz,
  add column created_by uuid references profiles(id),
  add column updated_by uuid references profiles(id);

alter table blood_requests
  add column metadata   jsonb not null default '{}'::jsonb,
  add column tags       text[] not null default '{}',
  add column deleted_at timestamptz,
  add column created_by uuid references profiles(id),
  add column updated_by uuid references profiles(id);

alter table request_matches add column metadata jsonb not null default '{}'::jsonb;
alter table donations       add column metadata jsonb not null default '{}'::jsonb,
                            add column created_by uuid references profiles(id);

-- ── 2. Soft-delete-safe uniqueness + flexible indexes ────────────────────────
drop index if exists donors_phone_key;
create unique index donors_phone_key on donors (phone) where deleted_at is null;

create index donors_tags_gin     on donors using gin (tags);
create index donors_metadata_gin on donors using gin (metadata);

-- ── 3. Eligibility matching must ignore soft-deleted donors ──────────────────
create or replace function find_eligible_donors(
  p_blood_group blood_group,
  p_lng         double precision,
  p_lat         double precision,
  p_radius_m    integer default 25000,
  p_limit       integer default 20
)
returns table (
  donor_id    uuid,
  blood_group blood_group,
  city        text,
  distance_m  double precision
)
language plpgsql stable security definer set search_path = public as $$
declare
  s        eligibility_settings;
  v_point  geography;
  v_groups blood_group[];
begin
  select * into s from eligibility_settings where id = 1;
  v_point  := st_setsrid(st_makepoint(p_lng, p_lat), 4326)::geography;
  v_groups := case when s.match_compatible
                   then compatible_donor_groups(p_blood_group)
                   else array[p_blood_group] end;

  return query
  select d.id, d.blood_group, d.city, st_distance(d.location, v_point) as distance_m
    from donors d
   where d.deleted_at is null
     and d.status in ('verified','active')
     and d.consent_contact = true
     and d.blood_group = any(v_groups)
     and d.location is not null
     and st_dwithin(d.location, v_point, p_radius_m)
     and (d.dob is null or extract(year from age(d.dob)) between s.min_age and s.max_age)
     and (d.weight_kg is null or d.weight_kg >= s.min_weight_kg)
     and (d.last_donation_date is null or d.last_donation_date <= current_date - s.cooldown_days)
   order by st_distance(d.location, v_point) asc
   limit p_limit;
end;
$$;

-- ── 4. Immutable audit trail ─────────────────────────────────────────────────
create table audit_log (
  id         bigint generated always as identity primary key,
  table_name text not null,
  row_id     text not null,
  action     text not null check (action in ('INSERT','UPDATE','DELETE')),
  old_data   jsonb,
  new_data   jsonb,
  changed_by uuid,                         -- auth.uid(); null = system/server (Edge Fn / migration)
  changed_at timestamptz not null default now()
);
create index audit_log_table_row_idx  on audit_log (table_name, row_id);
create index audit_log_changed_at_idx on audit_log (changed_at);

create or replace function audit_trigger()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_old jsonb;
  v_new jsonb;
  v_id  text;
begin
  if tg_op = 'DELETE' then
    v_old := to_jsonb(old); v_new := null; v_id := old.id::text;
  elsif tg_op = 'UPDATE' then
    v_old := to_jsonb(old); v_new := to_jsonb(new); v_id := new.id::text;
  else
    v_old := null; v_new := to_jsonb(new); v_id := new.id::text;
  end if;

  insert into audit_log (table_name, row_id, action, old_data, new_data, changed_by)
  values (tg_table_name, v_id, tg_op, v_old, v_new, auth.uid());

  if tg_op = 'DELETE' then return old; else return new; end if;
end;
$$;

-- Audit the entities that matter for decisions / legal / investigation.
-- (whatsapp_sessions & otp_verifications are intentionally NOT audited: high-churn,
--  transient, low investigative value.)
create trigger audit_donors          after insert or update or delete on donors          for each row execute function audit_trigger();
create trigger audit_volunteers      after insert or update or delete on volunteers      for each row execute function audit_trigger();
create trigger audit_partners        after insert or update or delete on partners        for each row execute function audit_trigger();
create trigger audit_hospitals       after insert or update or delete on hospitals       for each row execute function audit_trigger();
create trigger audit_blood_requests  after insert or update or delete on blood_requests  for each row execute function audit_trigger();
create trigger audit_request_matches after insert or update or delete on request_matches for each row execute function audit_trigger();
create trigger audit_donations       after insert or update or delete on donations       for each row execute function audit_trigger();
create trigger audit_profiles        after insert or update or delete on profiles        for each row execute function audit_trigger();
create trigger audit_eligibility     after insert or update or delete on eligibility_settings for each row execute function audit_trigger();

-- ── 5. audit_log: append-only, admin-readable ────────────────────────────────
alter table audit_log enable row level security;
create policy audit_admin_read on audit_log for select using (is_admin());
-- No insert/update/delete policies → clients cannot write or tamper.
-- The SECURITY DEFINER trigger (owned by postgres) bypasses RLS to record entries.
grant select on audit_log to authenticated;   -- RLS still restricts rows to admins
