-- BloodChain Pakistan — phone & CNIC format constraints (defense in depth)
-- The UI normalizes phones to +92XXXXXXXXXX and CNIC to 00000-0000000-0; these
-- DB CHECKs make the database reject anything malformed even if a write bypasses
-- the form. Added NOT VALID so existing rows are NOT re-checked (no migration
-- failure on legacy data) — only new inserts/updates are enforced.

-- Canonical Pakistani mobile: +92 followed by 10 digits (3XXXXXXXXX).
-- CNIC: 13 digits formatted 00000-0000000-0.

-- ── donors ───────────────────────────────────────────────────────────────────
alter table donors drop constraint if exists donors_phone_pk_format;
alter table donors add constraint donors_phone_pk_format
  check (phone ~ '^\+92[0-9]{10}$') not valid;
alter table donors drop constraint if exists donors_whatsapp_pk_format;
alter table donors add constraint donors_whatsapp_pk_format
  check (whatsapp is null or whatsapp ~ '^\+92[0-9]{10}$') not valid;

-- ── volunteers ───────────────────────────────────────────────────────────────
alter table volunteers drop constraint if exists volunteers_phone_pk_format;
alter table volunteers add constraint volunteers_phone_pk_format
  check (phone ~ '^\+92[0-9]{10}$') not valid;
alter table volunteers drop constraint if exists volunteers_whatsapp_pk_format;
alter table volunteers add constraint volunteers_whatsapp_pk_format
  check (whatsapp is null or whatsapp ~ '^\+92[0-9]{10}$') not valid;
alter table volunteers drop constraint if exists volunteers_cnic_format;
alter table volunteers add constraint volunteers_cnic_format
  check (cnic is null or cnic ~ '^[0-9]{5}-[0-9]{7}-[0-9]{1}$') not valid;

-- ── partners (focal person's mobile; org phone may be a landline → unconstrained)
alter table partners drop constraint if exists partners_focal_phone_pk_format;
alter table partners add constraint partners_focal_phone_pk_format
  check (focal_phone is null or focal_phone ~ '^\+92[0-9]{10}$') not valid;

-- ── blood_requests ───────────────────────────────────────────────────────────
alter table blood_requests drop constraint if exists blood_requests_phone_pk_format;
alter table blood_requests add constraint blood_requests_phone_pk_format
  check (requester_phone ~ '^\+92[0-9]{10}$') not valid;
alter table blood_requests drop constraint if exists blood_requests_whatsapp_pk_format;
alter table blood_requests add constraint blood_requests_whatsapp_pk_format
  check (requester_whatsapp is null or requester_whatsapp ~ '^\+92[0-9]{10}$') not valid;
