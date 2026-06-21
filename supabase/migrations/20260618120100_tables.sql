-- BloodChain Pakistan — Sprint 1: tables & indexes

-- ── profiles ────────────────────────────────────────────────────────────────
-- 1:1 with auth.users. Drives role-based access. A profile exists only for people
-- with a login (admins, hospital staff). Public donors/volunteers do NOT need one.
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       user_role not null default 'donor',
  full_name  text,
  phone      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── donors ──────────────────────────────────────────────────────────────────
-- Eligibility is NOT stored as a boolean (it depends on today's date); it is computed
-- by find_eligible_donors(). profile_id is nullable: most donors register via web/
-- WhatsApp with no account.
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
  female_pregnant_or_breastfeeding text,           -- 'yes' | 'no' | 'na'
  available_for                 text,               -- emergency | camps | both
  preferred_time                text,
  consent_accuracy              boolean not null default false,
  consent_voluntary             boolean not null default false,
  consent_contact               boolean not null default false,
  referral_code                 text,
  status                        donor_status not null default 'pending',
  source                        contact_source not null default 'web',
  created_at                    timestamptz not null default now(),
  updated_at                    timestamptz not null default now()
);
create unique index donors_phone_key       on donors (phone);
create index        donors_location_gix    on donors using gist (location);
create index        donors_blood_group_idx on donors (blood_group);
create index        donors_city_idx        on donors (lower(city));
create index        donors_status_idx      on donors (status);

-- ── volunteers (fixes the dead RegisterMember form) ──────────────────────────
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
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);
create index volunteers_city_idx on volunteers (lower(city));

-- ── partners (fixes the dead RegisterPartner form) ───────────────────────────
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
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

-- ── hospitals (portal accounts) ──────────────────────────────────────────────
-- A hospital is owned by one staff login (profile_id). partner_id links the original
-- partnership application, if any.
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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index        hospitals_location_gix on hospitals using gist (location);
create unique index hospitals_profile_key  on hospitals (profile_id) where profile_id is not null;

-- ── blood_requests ───────────────────────────────────────────────────────────
create table blood_requests (
  id               uuid primary key default gen_random_uuid(),
  hospital_id      uuid references hospitals(id) on delete set null,  -- null for public/WhatsApp
  requester_name   text not null,
  requester_phone  text not null,
  requester_whatsapp text,
  patient_name     text,
  blood_group      blood_group not null,
  units_needed     int not null default 1 check (units_needed > 0),
  urgency          urgency_level not null default 'urgent',
  hospital_name    text,                  -- free text when no hospital_id
  city             text,
  location         geography(Point, 4326),
  notes            text,
  status           request_status not null default 'open',
  created_via      contact_source not null default 'web',
  created_at       timestamptz not null default now(),
  expires_at       timestamptz,
  fulfilled_at     timestamptz
);
create index blood_requests_location_gix    on blood_requests using gist (location);
create index blood_requests_status_idx      on blood_requests (status);
create index blood_requests_blood_group_idx on blood_requests (blood_group);
create index blood_requests_hospital_idx    on blood_requests (hospital_id);

-- ── request_matches (notify-and-consent relay ledger) ────────────────────────
create table request_matches (
  id           uuid primary key default gen_random_uuid(),
  request_id   uuid not null references blood_requests(id) on delete cascade,
  donor_id     uuid not null references donors(id) on delete cascade,
  distance_m   numeric,
  status       match_status not null default 'notified',
  notified_at  timestamptz not null default now(),
  responded_at timestamptz,
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
  match_compatible       boolean not null default true,  -- true: compatible groups; false: exact
  updated_at             timestamptz not null default now()
);
insert into eligibility_settings (id) values (1) on conflict (id) do nothing;
