-- BloodChain Pakistan — Sprint 3: admin bootstrap
-- An allowlist of emails that are automatically granted the 'admin' role on signup.
-- This lets an admin be created via the Supabase dashboard (Add User) with zero
-- manual SQL afterwards — the signup trigger reads this list and promotes them.

create table admin_emails (
  email      text primary key,
  created_at timestamptz not null default now()
);

alter table admin_emails enable row level security;
create policy admin_emails_admin_read on admin_emails for select using (is_admin());
-- No public access; managed via SQL editor / service role.

insert into admin_emails (email) values ('nawazktk99@gmail.com') on conflict do nothing;

-- Promote allowlisted emails on signup (replaces the Sprint 1 version).
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

-- If the admin account already exists, promote it now (idempotent).
update profiles p
   set role = 'admin'
  from auth.users u
 where p.id = u.id
   and lower(u.email) in (select lower(email) from admin_emails);
