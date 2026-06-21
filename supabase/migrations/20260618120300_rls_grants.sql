-- BloodChain Pakistan — Sprint 1: Row-Level Security & grants
-- Posture: deny by default. PII tables (donors, otp, sessions) are server-only —
-- public writes go through Edge Functions using the service_role key, which bypasses
-- RLS. Hospitals never SELECT donors directly; they use find_eligible_donors().

-- Enable RLS on every table.
alter table profiles            enable row level security;
alter table donors              enable row level security;
alter table volunteers          enable row level security;
alter table partners            enable row level security;
alter table hospitals           enable row level security;
alter table blood_requests      enable row level security;
alter table request_matches     enable row level security;
alter table donations           enable row level security;
alter table whatsapp_sessions   enable row level security;
alter table otp_verifications   enable row level security;
alter table eligibility_settings enable row level security;

-- ── profiles ────────────────────────────────────────────────────────────────
create policy profiles_select_self on profiles for select using (id = auth.uid() or is_admin());
create policy profiles_update_self on profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_admin_all   on profiles for all    using (is_admin())      with check (is_admin());

-- ── donors / volunteers / partners (admin manage; owner reads own) ───────────
create policy donors_admin_all   on donors   for all    using (is_admin()) with check (is_admin());
create policy donors_select_self on donors   for select using (profile_id = auth.uid());

create policy volunteers_admin_all   on volunteers for all    using (is_admin()) with check (is_admin());
create policy volunteers_select_self on volunteers for select using (profile_id = auth.uid());

create policy partners_admin_all   on partners for all    using (is_admin()) with check (is_admin());
create policy partners_select_self on partners for select using (profile_id = auth.uid());

-- ── hospitals ────────────────────────────────────────────────────────────────
create policy hospitals_admin_all   on hospitals for all    using (is_admin()) with check (is_admin());
create policy hospitals_select_self on hospitals for select using (profile_id = auth.uid());
create policy hospitals_update_self on hospitals for update using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- ── blood_requests (admin all; a hospital sees/creates only its own) ─────────
create policy br_admin_all      on blood_requests for all    using (is_admin()) with check (is_admin());
create policy br_hospital_select on blood_requests for select using (hospital_id = current_hospital_id());
create policy br_hospital_insert on blood_requests for insert with check (hospital_id = current_hospital_id());
create policy br_hospital_update on blood_requests for update using (hospital_id = current_hospital_id()) with check (hospital_id = current_hospital_id());

-- ── request_matches / donations (admin all; hospital sees rows for its requests) ─
create policy rm_admin_all       on request_matches for all using (is_admin()) with check (is_admin());
create policy rm_hospital_select on request_matches for select using (
  exists (select 1 from blood_requests r where r.id = request_id and r.hospital_id = current_hospital_id())
);

create policy don_admin_all       on donations for all using (is_admin()) with check (is_admin());
create policy don_hospital_select on donations for select using (
  exists (select 1 from blood_requests r where r.id = request_id and r.hospital_id = current_hospital_id())
);

-- ── eligibility_settings (readable by anyone; writable by admin) ─────────────
create policy es_select_all  on eligibility_settings for select using (true);
create policy es_admin_write on eligibility_settings for all using (is_admin()) with check (is_admin());

-- ── whatsapp_sessions & otp_verifications: NO policies (server-only) ─────────
-- RLS is on with zero policies → anon/authenticated get nothing; service_role bypasses.

-- ── Grants (PostgREST needs table privileges; RLS still gates rows) ──────────
grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on all tables in schema public to authenticated, service_role;
grant all on all sequences in schema public to authenticated, service_role;
grant execute on all functions in schema public to anon, authenticated, service_role;
-- anon intentionally gets NO table DML: public writes are brokered by Edge Functions.
