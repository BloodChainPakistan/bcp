-- BloodChain Pakistan — switch admin allowlist to the official org email.
-- Replaces nawazktk99@gmail.com with bloodchainpakistan@gmail.com.

-- 1. Add the new official admin email to the allowlist.
insert into admin_emails (email) values ('bloodchainpakistan@gmail.com')
  on conflict do nothing;

-- 2. Remove the old personal email from the allowlist.
delete from admin_emails where email = 'nawazktk99@gmail.com';

-- 3. Promote the new admin now, if that auth user already exists (idempotent).
update profiles p
   set role = 'admin'
  from auth.users u
 where p.id = u.id
   and lower(u.email) = 'bloodchainpakistan@gmail.com';
