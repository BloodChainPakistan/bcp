-- ============================================================================
-- BloodChain Pakistan — consolidated initial schema (single baseline migration)
-- ----------------------------------------------------------------------------
-- This replaces the original 22 incremental Sprint migrations with one clean
-- baseline representing their final state. Safe to run on an empty database.
-- Posture: RLS deny-by-default; PII tables are server-only (writes via Edge
-- Functions using the service_role key, which bypasses RLS). Public visitors may
-- INSERT into registration/request/message tables only — never SELECT/UPDATE.
-- ============================================================================

-- ── Extensions ───────────────────────────────────────────────────────────────
create extension if not exists postgis;    -- geography type, ST_DWithin, ST_Distance
create extension if not exists pgcrypto;    -- gen_random_uuid(), digest()
create extension if not exists pg_trgm;     -- trigram GIN indexes for ILIKE search

-- ── Enums ────────────────────────────────────────────────────────────────────
create type blood_group   as enum ('A+','A-','B+','B-','AB+','AB-','O+','O-');
create type gender_type    as enum ('male','female','other');
create type user_role      as enum ('admin','hospital','donor');
create type donor_status   as enum ('pending','verified','active','inactive');
create type request_status as enum ('open','matching','fulfilled','cancelled','expired');
create type match_status   as enum ('notified','accepted','declined','contacted','donated');
create type urgency_level  as enum ('routine','urgent','critical');
create type contact_source as enum ('web','whatsapp','admin');
create type partner_type   as enum ('hospital','blood_bank','thalassemia_centre','welfare_society','corporate','educational','other');

-- ============================================================================
-- TABLES
-- ============================================================================

-- ── profiles (1:1 with auth.users; drives role-based access) ─────────────────
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       user_role not null default 'donor',
  full_name  text,
  phone      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── donors ───────────────────────────────────────────────────────────────────
create table donors (
  id                            uuid primary key default gen_random_uuid(),
  profile_id                    uuid references profiles(id) on delete set null,
  full_name                     text not null,
  dob                           date,
  gender                        gender_type,
  blood_group                   blood_group not null,
  phone                         text not null,
  whatsapp                      text,
  email                         text,
  occupation                    text,
  city                          text not null,
  district                      text,
  address                       text,
  location                      geography(Point, 4326),
  weight_kg                     numeric(5,1),
  donated_before                boolean,
  last_donation_date            date,
  chronic_disease               boolean,
  on_medication                 boolean,
  recent_surgery                boolean,
  recent_vaccination            boolean,
  travel_history                text,
  female_pregnant_or_breastfeeding text,
  available_for                 text,
  preferred_time                text,
  consent_accuracy              boolean not null default false,
  consent_voluntary             boolean not null default false,
  consent_contact               boolean not null default false,
  referral_code                 text,
  status                        donor_status not null default 'pending',
  source                        contact_source not null default 'web',
  metadata                      jsonb not null default '{}'::jsonb,
  tags                          text[] not null default '{}',
  deleted_at                    timestamptz,
  created_by                    uuid references profiles(id),
  updated_by                    uuid references profiles(id),
  consent_at                    timestamptz,
  consent_policy_version        text,
  lat                           double precision,
  lng                           double precision,
  created_at                    timestamptz not null default now(),
  updated_at                    timestamptz not null default now()
);
create unique index donors_phone_key       on donors (phone) where deleted_at is null;
create index        donors_location_gix    on donors using gist (location);
create index        donors_blood_group_idx on donors (blood_group);
create index        donors_city_idx        on donors (lower(city));
create index        donors_status_idx      on donors (status);
create index        donors_tags_gin        on donors using gin (tags);
create index        donors_metadata_gin    on donors using gin (metadata);
create index        donors_name_trgm       on donors using gin (full_name gin_trgm_ops);
create index        donors_phone_trgm      on donors using gin (phone gin_trgm_ops);
create index        donors_created_idx     on donors (created_at desc);

-- ── volunteers ───────────────────────────────────────────────────────────────
create table volunteers (
  id                      uuid primary key default gen_random_uuid(),
  profile_id              uuid references profiles(id) on delete set null,
  full_name               text not null,
  father_name             text,
  cnic                    text,
  dob                     date,
  gender                  gender_type,
  qualification           text,
  profession              text,
  phone                   text not null,
  whatsapp                text,
  email                   text,
  city                    text not null,
  district                text,
  interests               text[] not null default '{}',
  prev_volunteer_experience text,
  leadership_experience   text,
  skill_social_media      text,
  skill_design            text,
  skill_public_speaking   text,
  hours_per_week          int,
  willing_to_travel       boolean,
  willing_to_lead         boolean,
  motivation_join         text,
  motivation_activism     text,
  unique_contribution     text,
  agree_policies          boolean not null default false,
  commit_voluntary        boolean not null default false,
  status                  donor_status not null default 'pending',
  source                  contact_source not null default 'web',
  metadata                jsonb not null default '{}'::jsonb,
  tags                    text[] not null default '{}',
  deleted_at              timestamptz,
  created_by              uuid references profiles(id),
  updated_by              uuid references profiles(id),
  engagement_stage        text not null default 'new',
  assigned_to             text,
  contacted_at            timestamptz,
  contacted_by            text,
  is_trained              boolean not null default false,
  guidance_done           boolean not null default false,
  followup_notes          text,
  last_followup_at        timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  constraint volunteers_engagement_stage_chk
    check (engagement_stage in ('new','contacted','trained','active','dropped'))
);
create index volunteers_city_idx       on volunteers (lower(city));
create index volunteers_name_trgm      on volunteers using gin (full_name gin_trgm_ops);
create index volunteers_status_idx     on volunteers (status);
create index volunteers_created_idx    on volunteers (created_at desc);
create index volunteers_engagement_idx on volunteers (engagement_stage);

-- ── partners ─────────────────────────────────────────────────────────────────
create table partners (
  id                          uuid primary key default gen_random_uuid(),
  profile_id                  uuid references profiles(id) on delete set null,
  org_name                    text not null,
  org_type                    partner_type not null,
  reg_number                  text,
  year_established            text,
  license_number              text,
  address                     text,
  city                        text,
  province                    text,
  phone                       text,
  email                       text,
  website                     text,
  focal_name                  text,
  focal_designation           text,
  focal_phone                 text,
  focal_email                 text,
  has_screening               boolean,
  provides_without_replacement boolean,
  monthly_blood_volume        text,
  partnership_types           text[] not null default '{}',
  confirm_legal               boolean not null default false,
  confirm_transparency        boolean not null default false,
  confirm_no_misuse           boolean not null default false,
  status                      donor_status not null default 'pending',
  source                      contact_source not null default 'web',
  metadata                    jsonb not null default '{}'::jsonb,
  tags                        text[] not null default '{}',
  deleted_at                  timestamptz,
  created_by                  uuid references profiles(id),
  updated_by                  uuid references profiles(id),
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);
create index partners_name_trgm   on partners using gin (org_name gin_trgm_ops);
create index partners_status_idx  on partners (status);
create index partners_city_idx    on partners (lower(city));
create index partners_created_idx on partners (created_at desc);

-- ── hospitals (portal accounts) ──────────────────────────────────────────────
create table hospitals (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete set null,
  partner_id uuid references partners(id) on delete set null,
  name       text not null,
  city       text,
  address    text,
  location   geography(Point, 4326),
  phone      text,
  verified   boolean not null default false,
  metadata   jsonb not null default '{}'::jsonb,
  deleted_at timestamptz,
  created_by uuid references profiles(id),
  updated_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index        hospitals_location_gix on hospitals using gist (location);
create unique index hospitals_profile_key  on hospitals (profile_id) where profile_id is not null;

-- ── blood_requests ───────────────────────────────────────────────────────────
create table blood_requests (
  id               uuid primary key default gen_random_uuid(),
  hospital_id      uuid references hospitals(id) on delete set null,
  requester_name   text not null,
  requester_phone  text not null,
  requester_whatsapp text,
  patient_name     text,
  blood_group      blood_group not null,
  units_needed     int not null default 1 check (units_needed > 0),
  urgency          urgency_level not null default 'urgent',
  hospital_name    text,
  city             text,
  location         geography(Point, 4326),
  notes            text,
  status           request_status not null default 'open',
  created_via      contact_source not null default 'web',
  metadata         jsonb not null default '{}'::jsonb,
  tags             text[] not null default '{}',
  deleted_at       timestamptz,
  created_by       uuid references profiles(id),
  updated_by       uuid references profiles(id),
  lat              double precision,
  lng              double precision,
  request_code     text unique,
  created_at       timestamptz not null default now(),
  expires_at       timestamptz,
  fulfilled_at     timestamptz
);
create index blood_requests_location_gix    on blood_requests using gist (location);
create index blood_requests_status_idx      on blood_requests (status);
create index blood_requests_blood_group_idx on blood_requests (blood_group);
create index blood_requests_hospital_idx    on blood_requests (hospital_id);
create index blood_requests_created_idx     on blood_requests (created_at desc);

-- ── request_matches (notify-and-consent relay ledger) ────────────────────────
create table request_matches (
  id           uuid primary key default gen_random_uuid(),
  request_id   uuid not null references blood_requests(id) on delete cascade,
  donor_id     uuid not null references donors(id) on delete cascade,
  distance_m   numeric,
  status       match_status not null default 'notified',
  notified_at  timestamptz not null default now(),
  responded_at timestamptz,
  metadata     jsonb not null default '{}'::jsonb,
  unique (request_id, donor_id)
);
create index request_matches_request_idx on request_matches (request_id);
create index request_matches_donor_idx   on request_matches (donor_id);

-- ── donations (drives the cooldown) ──────────────────────────────────────────
create table donations (
  id          uuid primary key default gen_random_uuid(),
  donor_id    uuid not null references donors(id) on delete cascade,
  request_id  uuid references blood_requests(id) on delete set null,
  donated_at  date not null default current_date,
  units       int not null default 1 check (units > 0),
  verified_by uuid references profiles(id),
  notes       text,
  metadata    jsonb not null default '{}'::jsonb,
  created_by  uuid references profiles(id),
  created_at  timestamptz not null default now()
);
create index donations_donor_idx on donations (donor_id);

-- ── WhatsApp bot state + OTP (server-only) ───────────────────────────────────
create table whatsapp_sessions (
  phone      text primary key,
  state      text not null default 'MAIN_MENU',
  context    jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table otp_verifications (
  id         uuid primary key default gen_random_uuid(),
  phone      text not null,
  code_hash  text not null,
  purpose    text not null default 'donor_registration',
  expires_at timestamptz not null,
  attempts   int not null default 0,
  verified   boolean not null default false,
  created_at timestamptz not null default now()
);
create index otp_phone_idx on otp_verifications (phone);

-- ── eligibility_settings (singleton, admin-editable) ─────────────────────────
create table eligibility_settings (
  id                     int primary key default 1 check (id = 1),
  min_age                int not null default 18,
  max_age                int not null default 60,
  cooldown_days          int not null default 90,
  max_active_requests    int not null default 1,
  max_requests_per_month int not null default 4,
  min_weight_kg          numeric not null default 50,
  match_compatible       boolean not null default true,
  updated_at             timestamptz not null default now()
);

-- ── audit_log (immutable who/what/when) ──────────────────────────────────────
create table audit_log (
  id         bigint generated always as identity primary key,
  table_name text not null,
  row_id     text not null,
  action     text not null check (action in ('INSERT','UPDATE','DELETE')),
  old_data   jsonb,
  new_data   jsonb,
  changed_by uuid,
  changed_at timestamptz not null default now()
);
create index audit_log_table_row_idx  on audit_log (table_name, row_id);
create index audit_log_changed_at_idx on audit_log (changed_at);

-- ── admin_emails (allowlist auto-promoted to admin on signup) ────────────────
create table admin_emails (
  email      text primary key,
  created_at timestamptz not null default now()
);

-- ── Content CMS ──────────────────────────────────────────────────────────────
create table team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  group_name text,
  photo_url text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  bio          text,
  email        text,
  phone        text,
  linkedin_url text,
  facebook_url text,
  twitter_url  text,
  tenure_start date,
  tenure_end   date,
  is_current   boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index team_members_current_idx on team_members (is_current, group_name, sort_order);

create table faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text,
  quote text not null,
  photo_url text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table case_studies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  body text,
  cover_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table open_roles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text,
  type text,
  description text,
  is_open boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  from_name text,
  phone text,
  email text,
  city text,
  blood_group text,
  purpose text,
  message text,
  is_read boolean not null default false,
  source contact_source not null default 'web',
  created_at timestamptz not null default now()
);

create table feature_flags (
  key        text primary key,
  label      text not null,
  enabled    boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Human-readable request codes (BC-RQ-1001, …) ─────────────────────────────
create sequence if not exists blood_request_code_seq start 1001;

-- ── Phone / CNIC format constraints (defense in depth; NOT VALID = new rows) ─
alter table donors add constraint donors_phone_pk_format
  check (phone ~ '^\+92[0-9]{10}$') not valid;
alter table donors add constraint donors_whatsapp_pk_format
  check (whatsapp is null or whatsapp ~ '^\+92[0-9]{10}$') not valid;
alter table volunteers add constraint volunteers_phone_pk_format
  check (phone ~ '^\+92[0-9]{10}$') not valid;
alter table volunteers add constraint volunteers_whatsapp_pk_format
  check (whatsapp is null or whatsapp ~ '^\+92[0-9]{10}$') not valid;
alter table volunteers add constraint volunteers_cnic_format
  check (cnic is null or cnic ~ '^[0-9]{5}-[0-9]{7}-[0-9]{1}$') not valid;
alter table partners add constraint partners_focal_phone_pk_format
  check (focal_phone is null or focal_phone ~ '^\+92[0-9]{10}$') not valid;
alter table blood_requests add constraint blood_requests_phone_pk_format
  check (requester_phone ~ '^\+92[0-9]{10}$') not valid;
alter table blood_requests add constraint blood_requests_whatsapp_pk_format
  check (requester_whatsapp is null or requester_whatsapp ~ '^\+92[0-9]{10}$') not valid;

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

create or replace function set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Auto-create a profile on signup; promote allowlisted emails to admin.
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_role user_role := 'donor';
begin
  if exists (select 1 from admin_emails a where lower(a.email) = lower(new.email)) then
    v_role := 'admin';
  end if;
  insert into profiles (id, role, full_name, phone)
  values (new.id, v_role, new.raw_user_meta_data->>'full_name', new.phone)
  on conflict (id) do update set role = excluded.role;
  return new;
end;
$$;

create or replace function apply_donation()
returns trigger language plpgsql set search_path = public as $$
begin
  update donors
     set last_donation_date = greatest(coalesce(last_donation_date, new.donated_at), new.donated_at),
         status = case when status = 'pending' then 'active' else status end
   where id = new.donor_id;
  return new;
end;
$$;

create or replace function is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function current_hospital_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from hospitals where profile_id = auth.uid() limit 1;
$$;

create or replace function compatible_donor_groups(recipient blood_group)
returns blood_group[] language sql immutable set search_path = public as $$
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

-- Ranked nearest ELIGIBLE donors for a request (returns no PII).
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

-- Force safe values for non-admin registration intake.
create or replace function enforce_registration_intake()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not is_admin() then
    new.status      := 'pending';
    new.tags        := '{}';
    new.created_by  := auth.uid();
    new.updated_by  := null;
  end if;
  return new;
end;
$$;

-- Force safe values for non-admin public blood-request intake.
create or replace function enforce_blood_request_intake()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not is_admin() then
    new.status       := 'open';
    new.created_via  := 'web';
    new.hospital_id  := null;
    new.fulfilled_at := null;
    new.tags         := '{}';
  end if;
  return new;
end;
$$;

-- Build the PostGIS point from supplied lat/lng.
create or replace function set_location_from_coords()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.lat is not null and new.lng is not null then
    new.location := st_setsrid(st_makepoint(new.lng, new.lat), 4326)::geography;
  end if;
  return new;
end;
$$;

create or replace function set_request_code()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.request_code is null then
    new.request_code := 'BC-RQ-' || lpad(nextval('blood_request_code_seq')::text, 4, '0');
  end if;
  return new;
end;
$$;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- updated_at maintenance
create trigger trg_profiles_updated     before update on profiles            for each row execute function set_updated_at();
create trigger trg_donors_updated       before update on donors              for each row execute function set_updated_at();
create trigger trg_volunteers_updated   before update on volunteers          for each row execute function set_updated_at();
create trigger trg_partners_updated     before update on partners            for each row execute function set_updated_at();
create trigger trg_hospitals_updated    before update on hospitals           for each row execute function set_updated_at();
create trigger trg_elig_updated         before update on eligibility_settings for each row execute function set_updated_at();
create trigger trg_wa_sessions_updated  before update on whatsapp_sessions    for each row execute function set_updated_at();
create trigger trg_team_updated         before update on team_members for each row execute function set_updated_at();
create trigger trg_faqs_updated         before update on faqs         for each row execute function set_updated_at();
create trigger trg_testimonials_updated before update on testimonials for each row execute function set_updated_at();
create trigger trg_case_studies_updated before update on case_studies for each row execute function set_updated_at();
create trigger trg_open_roles_updated   before update on open_roles   for each row execute function set_updated_at();
create trigger trg_ff_updated           before update on feature_flags for each row execute function set_updated_at();

-- profile on signup
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

-- donation → cooldown
create trigger trg_apply_donation after insert on donations for each row execute function apply_donation();

-- public intake guards (BEFORE INSERT)
create trigger trg_donors_intake     before insert on donors     for each row execute function enforce_registration_intake();
create trigger trg_volunteers_intake before insert on volunteers for each row execute function enforce_registration_intake();
create trigger trg_partners_intake   before insert on partners   for each row execute function enforce_registration_intake();
create trigger trg_blood_requests_intake before insert on blood_requests for each row execute function enforce_blood_request_intake();

-- lat/lng → location (BEFORE INSERT/UPDATE)
create trigger trg_donors_location   before insert or update on donors         for each row execute function set_location_from_coords();
create trigger trg_requests_location before insert or update on blood_requests for each row execute function set_location_from_coords();

-- request_code (BEFORE INSERT; fires after intake + location by name order)
create trigger trg_set_request_code before insert on blood_requests for each row execute function set_request_code();

-- audit trail
create trigger audit_donors          after insert or update or delete on donors          for each row execute function audit_trigger();
create trigger audit_volunteers      after insert or update or delete on volunteers      for each row execute function audit_trigger();
create trigger audit_partners        after insert or update or delete on partners        for each row execute function audit_trigger();
create trigger audit_hospitals       after insert or update or delete on hospitals       for each row execute function audit_trigger();
create trigger audit_blood_requests  after insert or update or delete on blood_requests  for each row execute function audit_trigger();
create trigger audit_request_matches after insert or update or delete on request_matches for each row execute function audit_trigger();
create trigger audit_donations       after insert or update or delete on donations       for each row execute function audit_trigger();
create trigger audit_profiles        after insert or update or delete on profiles        for each row execute function audit_trigger();
create trigger audit_eligibility     after insert or update or delete on eligibility_settings for each row execute function audit_trigger();
create trigger audit_team         after insert or update or delete on team_members for each row execute function audit_trigger();
create trigger audit_faqs         after insert or update or delete on faqs         for each row execute function audit_trigger();
create trigger audit_testimonials after insert or update or delete on testimonials for each row execute function audit_trigger();
create trigger audit_case_studies after insert or update or delete on case_studies for each row execute function audit_trigger();
create trigger audit_open_roles   after insert or update or delete on open_roles   for each row execute function audit_trigger();
create trigger audit_messages     after insert or update or delete on messages     for each row execute function audit_trigger();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

alter table profiles             enable row level security;
alter table donors               enable row level security;
alter table volunteers           enable row level security;
alter table partners             enable row level security;
alter table hospitals            enable row level security;
alter table blood_requests       enable row level security;
alter table request_matches      enable row level security;
alter table donations            enable row level security;
alter table whatsapp_sessions    enable row level security;
alter table otp_verifications    enable row level security;
alter table eligibility_settings enable row level security;
alter table audit_log            enable row level security;
alter table admin_emails         enable row level security;
alter table team_members         enable row level security;
alter table faqs                 enable row level security;
alter table testimonials         enable row level security;
alter table case_studies         enable row level security;
alter table open_roles           enable row level security;
alter table messages             enable row level security;
alter table feature_flags        enable row level security;

-- profiles (auth calls wrapped in scalar subqueries for initplan performance)
create policy profiles_select_self on profiles for select using (((id = (select auth.uid())) or (select is_admin())));
create policy profiles_update_self on profiles for update using ((id = (select auth.uid()))) with check ((id = (select auth.uid())));
create policy profiles_admin_all   on profiles for all    using ((select is_admin())) with check ((select is_admin()));

-- donors / volunteers / partners (admin manage; owner reads own; public insert)
create policy donors_admin_all     on donors for all    using ((select is_admin())) with check ((select is_admin()));
create policy donors_select_self   on donors for select using ((profile_id = (select auth.uid())));
create policy donors_public_insert on donors for insert to anon, authenticated with check (true);

create policy volunteers_admin_all     on volunteers for all    using ((select is_admin())) with check ((select is_admin()));
create policy volunteers_select_self   on volunteers for select using ((profile_id = (select auth.uid())));
create policy volunteers_public_insert on volunteers for insert to anon, authenticated with check (true);

create policy partners_admin_all     on partners for all    using ((select is_admin())) with check ((select is_admin()));
create policy partners_select_self   on partners for select using ((profile_id = (select auth.uid())));
create policy partners_public_insert on partners for insert to anon, authenticated with check (true);

-- hospitals
create policy hospitals_admin_all   on hospitals for all    using ((select is_admin())) with check ((select is_admin()));
create policy hospitals_select_self on hospitals for select using ((profile_id = (select auth.uid())));
create policy hospitals_update_self on hospitals for update using ((profile_id = (select auth.uid()))) with check ((profile_id = (select auth.uid())));

-- blood_requests (admin all; hospital sees/creates its own; public insert)
create policy br_admin_all       on blood_requests for all    using (is_admin()) with check (is_admin());
create policy br_hospital_select on blood_requests for select using (hospital_id = current_hospital_id());
create policy br_hospital_insert on blood_requests for insert with check (hospital_id = current_hospital_id());
create policy br_hospital_update on blood_requests for update using (hospital_id = current_hospital_id()) with check (hospital_id = current_hospital_id());
create policy br_public_insert   on blood_requests for insert to anon, authenticated with check (true);

-- request_matches / donations (admin all; hospital sees rows for its requests)
create policy rm_admin_all       on request_matches for all using (is_admin()) with check (is_admin());
create policy rm_hospital_select on request_matches for select using (
  exists (select 1 from blood_requests r where r.id = request_id and r.hospital_id = current_hospital_id())
);
create policy don_admin_all       on donations for all using (is_admin()) with check (is_admin());
create policy don_hospital_select on donations for select using (
  exists (select 1 from blood_requests r where r.id = request_id and r.hospital_id = current_hospital_id())
);

-- eligibility_settings (readable by anyone; writable by admin)
create policy es_select_all  on eligibility_settings for select using (true);
create policy es_admin_write on eligibility_settings for all using (is_admin()) with check (is_admin());

-- audit_log (append-only; admin read)
create policy audit_admin_read on audit_log for select using (is_admin());

-- admin_emails (admin read + manage)
create policy admin_emails_admin_read  on admin_emails for select using (is_admin());
create policy admin_emails_admin_write on admin_emails for all using (is_admin()) with check (is_admin());

-- Content CMS (public reads published; admin manages)
create policy team_public_read on team_members for select using (is_published or is_admin());
create policy team_admin_all   on team_members for all    using (is_admin()) with check (is_admin());
create policy faqs_public_read on faqs for select using (is_published or is_admin());
create policy faqs_admin_all   on faqs for all    using (is_admin()) with check (is_admin());
create policy testimonials_public_read on testimonials for select using (is_published or is_admin());
create policy testimonials_admin_all   on testimonials for all    using (is_admin()) with check (is_admin());
create policy case_studies_public_read on case_studies for select using (is_published or is_admin());
create policy case_studies_admin_all   on case_studies for all    using (is_admin()) with check (is_admin());
create policy open_roles_public_read on open_roles for select using (is_open or is_admin());
create policy open_roles_admin_all   on open_roles for all    using (is_admin()) with check (is_admin());

-- messages (public submit; admin read/update)
create policy messages_public_insert on messages for insert to anon, authenticated with check (true);
create policy messages_admin_read    on messages for select using (is_admin());
create policy messages_admin_update  on messages for update using (is_admin()) with check (is_admin());

-- feature_flags (public read; admin write)
create policy ff_public_read on feature_flags for select using (true);
create policy ff_admin_write on feature_flags for all using (is_admin()) with check (is_admin());

-- whatsapp_sessions & otp_verifications: RLS on, NO policies → server-only.

-- ============================================================================
-- GRANTS
-- ============================================================================

grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on all tables in schema public to authenticated, service_role;
grant all on all sequences in schema public to authenticated, service_role;
grant execute on all functions in schema public to anon, authenticated, service_role;

-- Public (anon) may INSERT into intake tables only.
grant insert on donors, volunteers, partners, blood_requests, messages to anon;
-- Public (anon) may READ published content + flags.
grant select on team_members, faqs, testimonials, case_studies, open_roles, feature_flags to anon;
grant select on audit_log to authenticated;   -- RLS still restricts rows to admins

-- Donor privacy: anon must NOT call the matching RPC directly.
revoke execute on function
  public.find_eligible_donors(blood_group, double precision, double precision, integer, integer)
  from anon, public;
grant execute on function
  public.find_eligible_donors(blood_group, double precision, double precision, integer, integer)
  to authenticated, service_role;

-- ============================================================================
-- STORAGE (team photo bucket: 2 MB, images only)
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('team-photos', 'team-photos', true, 2097152,
        array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy team_photos_public_read on storage.objects
  for select using (bucket_id = 'team-photos');
create policy team_photos_admin_insert on storage.objects
  for insert to authenticated with check (bucket_id = 'team-photos' and public.is_admin());
create policy team_photos_admin_update on storage.objects
  for update to authenticated using (bucket_id = 'team-photos' and public.is_admin());
create policy team_photos_admin_delete on storage.objects
  for delete to authenticated using (bucket_id = 'team-photos' and public.is_admin());

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Eligibility settings singleton
insert into eligibility_settings (id) values (1) on conflict (id) do nothing;

-- Admin allowlist (official org email).
insert into admin_emails (email) values ('bloodchainpakistan@gmail.com') on conflict do nothing;

-- Feature flags (all default ON).
insert into feature_flags (key, label) values
  ('donor_registration',     'Donor registration form'),
  ('volunteer_registration', 'Volunteer registration form'),
  ('partner_registration',   'Partner registration form'),
  ('whatsapp_button',        'WhatsApp chat button'),
  ('blog',                   'Blog section'),
  ('gallery',                'Gallery page')
on conflict do nothing;

-- Starter FAQs (admin can edit at /admin/faq).
insert into faqs (question, answer, sort_order)
select q, a, o from (values
  ('Who can donate blood?',
   'Generally, healthy individuals aged 18–60, weighing at least 50 kg, with no major illness can donate. A quick screening at the time of donation confirms eligibility.', 1),
  ('How often can I donate blood?',
   'A healthy donor can usually give blood once every 3 months (about 90 days). This lets your body fully replenish before the next donation.', 2),
  ('Is donating blood safe?',
   'Yes. A fresh, sterile, single-use needle and kit are used for every donor, so there is no risk of infection from donating.', 3),
  ('How do I register as a donor?',
   'Tap “Become a Donor” and fill the short form, or message us on WhatsApp. Once registered, we contact you only when a matching patient nearby needs blood.', 4),
  ('What should I do before and after donating?',
   'Before: eat a proper meal, drink plenty of water, and get good sleep. After: rest a few minutes, keep hydrated, and avoid heavy exertion for the rest of the day.', 5),
  ('How will you contact me for an emergency?',
   'When a patient needs your blood group near your city, we reach out by phone or WhatsApp. Donating is always your choice — you can decline any request.', 6),
  ('Does donating blood cost anything?',
   'No. Blood Chain Pakistan is a voluntary, non-profit network — donating and requesting through us is completely free.', 7)
) as t(q, a, o)
where not exists (select 1 from faqs f where f.question = t.q);

-- Current Board of Governance + Core Cabinet (photos matched by name in-app).
insert into team_members (name, role, group_name, sort_order, is_current, is_published)
select n, r, g, o, true, true from (values
  ('Dr Luqman Hakim',         'Founder',    'bog', 1),
  ('Engr Rehan Khan',         'Co Founder', 'bog', 2),
  ('Afaq Karim',              'Member',     'bog', 3),
  ('Engr Kamran Khan',        'Member',     'bog', 4),
  ('Ibadullah Jan',           'Member',     'bog', 5),
  ('Muhamad Waqas Bloodwala', 'Member',     'bog', 6),
  ('Saeed Anwar',             'Member',     'bog', 7),
  ('Usman Ali',               'Member',     'bog', 8),
  ('Sajjad Saeed',            'Member',     'bog', 9),
  ('Sana Ur Rehman',  'Country Governor',                                          'core_cabinet', 1),
  ('Qandeel Saleem',  'Secretary General',                                         'core_cabinet', 2),
  ('Arsal Imran',     'Director Media and Communication',                          'core_cabinet', 3),
  ('Saif Ullah',      'Assistant Director Media and Communication',                'core_cabinet', 4),
  ('Arshia Amraiz',   'Director Communications and Liaisons',                      'core_cabinet', 5),
  ('Ayesha Javaid',   'Director Donor Database and Volunteer Management',          'core_cabinet', 6),
  ('Harnain Ayub',    'Assistant Director Donor Database and Volunteer Management', 'core_cabinet', 7),
  ('Masood Khan',     'Director Training and Development',                         'core_cabinet', 8),
  ('Jehan Badshah',   'Director Thalassemia Prevention',                           'core_cabinet', 9)
) as t(n, r, g, o)
where not exists (select 1 from team_members m where m.name = t.n);
