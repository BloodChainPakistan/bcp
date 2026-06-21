-- BloodChain Pakistan — volunteer engagement / follow-up tracking (additive)
-- After a seminar/workshop, volunteers register but some are never contacted or
-- onboarded for lack of tracking. These columns give the admin a follow-up
-- pipeline so management can see who's pending and no one slips through.
--
-- Kept SEPARATE from `status` (which is the verify/active admin state): a
-- volunteer can be verified yet never contacted. `engagement_stage` is the
-- onboarding funnel.

alter table volunteers
  add column if not exists engagement_stage text not null default 'new',
  add column if not exists assigned_to      text,
  add column if not exists contacted_at     timestamptz,
  add column if not exists contacted_by     text,
  add column if not exists is_trained       boolean not null default false,
  add column if not exists guidance_done    boolean not null default false,
  add column if not exists followup_notes   text,
  add column if not exists last_followup_at timestamptz;

-- Funnel stages: new → contacted → trained → active (or dropped).
alter table volunteers drop constraint if exists volunteers_engagement_stage_chk;
alter table volunteers
  add constraint volunteers_engagement_stage_chk
  check (engagement_stage in ('new', 'contacted', 'trained', 'active', 'dropped'));

create index if not exists volunteers_engagement_idx on volunteers (engagement_stage);
