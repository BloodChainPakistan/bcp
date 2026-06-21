-- BloodChain Pakistan — local dev seed (runs on `supabase db reset`)
-- Idempotent. Safe to run repeatedly.

-- Ensure the singleton eligibility settings row exists.
insert into eligibility_settings (id) values (1) on conflict (id) do nothing;

-- ── Optional sample donors for local matching tests (Peshawar / Islamabad) ──
-- Comment out before seeding any real/shared environment. Coordinates are lng/lat.
insert into donors (full_name, blood_group, phone, city, location, consent_contact, status)
values
  ('Test Donor A', 'O+',  '+923000000001', 'Peshawar',  st_setsrid(st_makepoint(71.5249, 34.0151), 4326), true, 'active'),
  ('Test Donor B', 'O-',  '+923000000002', 'Peshawar',  st_setsrid(st_makepoint(71.5300, 34.0200), 4326), true, 'verified'),
  ('Test Donor C', 'A+',  '+923000000003', 'Islamabad', st_setsrid(st_makepoint(73.0479, 33.6844), 4326), true, 'active')
on conflict (phone) do nothing;
