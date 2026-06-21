-- BloodChain Pakistan — Sprint 1: extensions & enums
-- Note: PostGIS is installed into the public schema for simplicity (bare `geography`,
-- `st_dwithin`, etc. resolve without qualification). Supabase's linter may raise an
-- "extension in public" advisory; acceptable for this single-tenant project (KISS).

create extension if not exists postgis;     -- geospatial: geography type, ST_DWithin, ST_Distance
create extension if not exists pgcrypto;     -- gen_random_uuid(), digest() for OTP hashing

-- ── Enums (stable, type-safe sets) ──────────────────────────────────────────
-- Tradeoff: adding a value later needs `ALTER TYPE ... ADD VALUE`; removal is hard.
-- Fine for fixed medical/status sets. partner_type includes 'other' as an escape hatch.
create type blood_group   as enum ('A+','A-','B+','B-','AB+','AB-','O+','O-');
create type gender_type    as enum ('male','female','other');
create type user_role      as enum ('admin','hospital','donor');
create type donor_status   as enum ('pending','verified','active','inactive');
create type request_status as enum ('open','matching','fulfilled','cancelled','expired');
create type match_status   as enum ('notified','accepted','declined','contacted','donated');
create type urgency_level  as enum ('routine','urgent','critical');
create type contact_source as enum ('web','whatsapp','admin');
create type partner_type   as enum ('hospital','blood_bank','thalassemia_centre','welfare_society','corporate','educational','other');
