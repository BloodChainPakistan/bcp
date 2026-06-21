-- BloodChain Pakistan — feature flags
-- Admin-controlled on/off switches for site features. Public can READ (so the
-- frontend can hide disabled features); only admins can change them.

create table feature_flags (
  key        text primary key,
  label      text not null,
  enabled    boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table feature_flags enable row level security;
create policy ff_public_read on feature_flags for select using (true);
create policy ff_admin_write on feature_flags for all using (is_admin()) with check (is_admin());

grant select on feature_flags to anon, authenticated;
grant insert, update, delete on feature_flags to authenticated;

create trigger trg_ff_updated before update on feature_flags for each row execute function set_updated_at();

insert into feature_flags (key, label) values
  ('donor_registration',     'Donor registration form'),
  ('volunteer_registration', 'Volunteer registration form'),
  ('partner_registration',   'Partner registration form'),
  ('whatsapp_button',        'WhatsApp chat button'),
  ('blog',                   'Blog section'),
  ('gallery',                'Gallery page')
on conflict do nothing;
