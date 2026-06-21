-- BloodChain Pakistan — Content CMS + contact messages inbox
-- Lets admins manage site content (team, FAQ, testimonials, case studies, open
-- roles) and read messages submitted through the contact form.

create table team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  group_name text,                 -- 'bog' | 'core_cabinet' | etc.
  photo_url text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
  type text,                       -- volunteer | internship | full-time
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

-- updated_at triggers
create trigger trg_team_updated         before update on team_members for each row execute function set_updated_at();
create trigger trg_faqs_updated         before update on faqs         for each row execute function set_updated_at();
create trigger trg_testimonials_updated before update on testimonials for each row execute function set_updated_at();
create trigger trg_case_studies_updated before update on case_studies for each row execute function set_updated_at();
create trigger trg_open_roles_updated   before update on open_roles   for each row execute function set_updated_at();

-- audit
create trigger audit_team         after insert or update or delete on team_members for each row execute function audit_trigger();
create trigger audit_faqs         after insert or update or delete on faqs         for each row execute function audit_trigger();
create trigger audit_testimonials after insert or update or delete on testimonials for each row execute function audit_trigger();
create trigger audit_case_studies after insert or update or delete on case_studies for each row execute function audit_trigger();
create trigger audit_open_roles   after insert or update or delete on open_roles   for each row execute function audit_trigger();
create trigger audit_messages     after insert or update or delete on messages     for each row execute function audit_trigger();

-- RLS
alter table team_members enable row level security;
alter table faqs         enable row level security;
alter table testimonials enable row level security;
alter table case_studies enable row level security;
alter table open_roles   enable row level security;
alter table messages     enable row level security;

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

-- Messages: public submit; admin read/update.
create policy messages_public_insert on messages for insert to anon, authenticated with check (true);
create policy messages_admin_read    on messages for select using (is_admin());
create policy messages_admin_update  on messages for update using (is_admin()) with check (is_admin());

-- Grants (new tables created after the Sprint 1 grant block)
grant select, insert, update, delete on team_members, faqs, testimonials, case_studies, open_roles, messages to authenticated;
grant select on team_members, faqs, testimonials, case_studies, open_roles to anon;
grant insert on messages to anon;

-- Allow admins to manage the admin allowlist from the UI (table from 20260618120600).
create policy admin_emails_admin_write on admin_emails for all using (is_admin()) with check (is_admin());
grant select, insert, update, delete on admin_emails to authenticated;
