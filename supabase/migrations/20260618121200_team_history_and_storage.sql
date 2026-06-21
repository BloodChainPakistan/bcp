-- Team: lifetime member history + richer fields, and a Storage bucket for photos.

-- ── Richer, history-aware columns ──────────────────────────────────────────
alter table team_members
  add column if not exists bio          text,
  add column if not exists email        text,
  add column if not exists phone        text,
  add column if not exists linkedin_url text,
  add column if not exists facebook_url text,
  add column if not exists twitter_url  text,
  add column if not exists tenure_start date,
  add column if not exists tenure_end   date,
  add column if not exists is_current   boolean not null default true;

comment on column team_members.is_current is
  'true = serving member shown on the site; false = retained historical record (past cabinet/board).';

-- Fast lookup of the current board/cabinet in display order.
create index if not exists team_members_current_idx
  on team_members (is_current, group_name, sort_order);

-- ── Storage bucket for team photos (server-enforced limits) ────────────────
-- 2 MB cap, images only — Supabase rejects anything else even if a client
-- bypasses the UI validation.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('team-photos', 'team-photos', true, 2097152,
        array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists team_photos_public_read  on storage.objects;
drop policy if exists team_photos_admin_insert on storage.objects;
drop policy if exists team_photos_admin_update on storage.objects;
drop policy if exists team_photos_admin_delete on storage.objects;

create policy team_photos_public_read on storage.objects
  for select using (bucket_id = 'team-photos');
create policy team_photos_admin_insert on storage.objects
  for insert to authenticated with check (bucket_id = 'team-photos' and public.is_admin());
create policy team_photos_admin_update on storage.objects
  for update to authenticated using (bucket_id = 'team-photos' and public.is_admin());
create policy team_photos_admin_delete on storage.objects
  for delete to authenticated using (bucket_id = 'team-photos' and public.is_admin());
