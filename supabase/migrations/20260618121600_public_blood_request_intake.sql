-- BloodChain Pakistan — public blood-request intake (additive)
-- Lets the public submit an emergency blood request from the website (the
-- "Request Blood" form under "Become A Member"), mirroring the donor/volunteer/
-- partner public-intake model. Visitors may INSERT only — never SELECT/UPDATE/
-- DELETE — so request PII stays admin-only. A BEFORE-INSERT trigger forces safe
-- values for non-admin submitters so a spammer cannot self-fulfill, claim a
-- hospital, or back-date a request. Admin inserts (is_admin()) are untouched, so
-- the admin command center can still set status='matching' etc.
--
-- Note: the service-role Edge Function (submit-registration) runs with
-- auth.uid() = null, so is_admin() is false there too — the same trigger guards
-- both the direct-anon path (Turnstile off) and the verified path (Turnstile on).

-- ── Force safe values on public intake ───────────────────────────────────────
create or replace function enforce_blood_request_intake()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not is_admin() then
    new.status       := 'open';   -- public can never self-advance/-fulfill
    new.created_via  := 'web';
    new.hospital_id  := null;      -- public requests are never tied to a hospital row
    new.fulfilled_at := null;
    new.tags         := '{}';      -- labels are an internal/admin concern
  end if;
  return new;
end;
$$;

-- Fires before the existing location + request_code triggers (alphabetical order:
-- b… < r… < s…), and none of them read the columns this one writes.
drop trigger if exists trg_blood_requests_intake on blood_requests;
create trigger trg_blood_requests_intake
  before insert on blood_requests
  for each row execute function enforce_blood_request_intake();

-- ── Insert-only policy (anon + authenticated) ────────────────────────────────
drop policy if exists br_public_insert on blood_requests;
create policy br_public_insert on blood_requests for insert to anon, authenticated with check (true);

-- anon needs the INSERT privilege (authenticated already granted in 20260618120300).
grant insert on blood_requests to anon;
