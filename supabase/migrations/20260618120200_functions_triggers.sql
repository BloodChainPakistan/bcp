-- BloodChain Pakistan — Sprint 1: functions & triggers

-- ── updated_at maintenance ───────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated     before update on profiles     for each row execute function set_updated_at();
create trigger trg_donors_updated       before update on donors       for each row execute function set_updated_at();
create trigger trg_volunteers_updated   before update on volunteers   for each row execute function set_updated_at();
create trigger trg_partners_updated     before update on partners     for each row execute function set_updated_at();
create trigger trg_hospitals_updated    before update on hospitals    for each row execute function set_updated_at();
create trigger trg_elig_updated         before update on eligibility_settings for each row execute function set_updated_at();
create trigger trg_wa_sessions_updated  before update on whatsapp_sessions    for each row execute function set_updated_at();

-- ── auto-create a profile when an auth user is created ───────────────────────
-- Role defaults to 'donor'; promote to 'admin'/'hospital' manually or via admin UI.
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data->>'full_name', new.phone)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── donation → refresh donor cooldown ────────────────────────────────────────
create or replace function apply_donation()
returns trigger language plpgsql as $$
begin
  update donors
     set last_donation_date = greatest(coalesce(last_donation_date, new.donated_at), new.donated_at),
         status = case when status = 'pending' then 'active' else status end
   where id = new.donor_id;
  return new;
end;
$$;

create trigger trg_apply_donation
  after insert on donations
  for each row execute function apply_donation();

-- ── RLS helper predicates (SECURITY DEFINER → bypass RLS, no recursion) ──────
create or replace function is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function current_hospital_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from hospitals where profile_id = auth.uid() limit 1;
$$;

-- ── blood compatibility (RBC / whole-blood donor → recipient) ────────────────
-- Standard transfusion compatibility: which DONOR groups can give to a RECIPIENT.
-- Confidence: High (textbook RBC compatibility). Plasma compatibility is the inverse
-- and is intentionally not modeled here (this platform recruits whole-blood donors).
create or replace function compatible_donor_groups(recipient blood_group)
returns blood_group[] language sql immutable as $$
  select case recipient
    when 'O-'  then array['O-']::blood_group[]
    when 'O+'  then array['O-','O+']::blood_group[]
    when 'A-'  then array['O-','A-']::blood_group[]
    when 'A+'  then array['O-','O+','A-','A+']::blood_group[]
    when 'B-'  then array['O-','B-']::blood_group[]
    when 'B+'  then array['O-','O+','B-','B+']::blood_group[]
    when 'AB-' then array['O-','A-','B-','AB-']::blood_group[]
    when 'AB+' then array['O-','O+','A-','A+','B-','B+','AB-','AB+']::blood_group[]
  end;
$$;

-- ── core matching engine ─────────────────────────────────────────────────────
-- Returns ranked nearest ELIGIBLE donors for a request. Returns NO PII (no phone) —
-- contact is brokered server-side via the notify-and-consent flow. SECURITY DEFINER
-- so hospital-role users can call it without direct SELECT on the donors table.
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
   where d.status in ('verified','active')
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
