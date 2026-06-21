-- BloodChain Pakistan — Sprint 2 (additive): public registration intake
-- Public visitors may INSERT into the three registration tables (and nothing else).
-- They cannot SELECT/UPDATE/DELETE — so no one can harvest or tamper with PII.
-- A BEFORE-INSERT trigger forces safe values for non-admin submitters, so a spammer
-- cannot self-activate or self-tag. Anti-bot (Turnstile) is added in hardening.

-- ── Force safe values on public intake ───────────────────────────────────────
create or replace function enforce_registration_intake()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not is_admin() then
    new.status      := 'pending';   -- admin verifies before a record becomes active
    new.tags        := '{}';        -- labels are an internal/admin concern
    new.created_by  := auth.uid();  -- null for anonymous web submissions
    new.updated_by  := null;
  end if;
  return new;
end;
$$;

create trigger trg_donors_intake     before insert on donors     for each row execute function enforce_registration_intake();
create trigger trg_volunteers_intake before insert on volunteers for each row execute function enforce_registration_intake();
create trigger trg_partners_intake   before insert on partners   for each row execute function enforce_registration_intake();

-- ── Insert-only policies (anon + authenticated) ──────────────────────────────
create policy donors_public_insert     on donors     for insert to anon, authenticated with check (true);
create policy volunteers_public_insert on volunteers for insert to anon, authenticated with check (true);
create policy partners_public_insert   on partners   for insert to anon, authenticated with check (true);

-- anon needs the INSERT privilege (authenticated already granted in 20260618120300).
grant insert on donors, volunteers, partners to anon;
