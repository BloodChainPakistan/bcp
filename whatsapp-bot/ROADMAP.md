# WhatsApp Bot — Production Roadmap

> **Status (2026-06-21):** The pilot in this folder is **code-complete and works**
> for testing, but runs on `whatsapp-web.js` (unofficial WhatsApp Web automation)
> which carries a **permanent-ban risk** and needs an always-on VPS. This roadmap
> takes the same proven logic to the **official Meta WhatsApp Cloud API** so it is
> ToS-compliant, serverless, and safe to point at the real NGO number.

---

## The decision

| Option | Use it for | Trade-off |
|--------|-----------|-----------|
| **A. `whatsapp-web.js` pilot** (this folder) | Internal testing on a **throwaway number** | Free, instant, but ToS-violating → ban risk; needs a VPS running Chromium. **Never use the real number.** |
| **B. Meta WhatsApp Cloud API** (recommended) | **Production** | Official, no ban risk, serverless (Supabase Edge Function). Requires Meta Business onboarding + template approval (a few days, mostly waiting). |

**Recommendation:** Keep A only as a throwaway test harness; ship **B** for go-live.

---

## What already exists (reusable)

- ✅ `find_eligible_donors` RPC (geo + blood-group + eligibility matching)
- ✅ `request_matches` ledger + `blood_requests` status flow (`open → matching → fulfilled`)
- ✅ Message copy + YES/NO consent logic (`lib/messages.js`, `lib/relay.js`)
- ✅ Public "Request Blood" form that creates `open` requests with `lat`/`lng`

Only the **transport layer** (how messages are sent/received) changes for production.

---

## Phase 1 — Meta Business onboarding *(external, ~1–3 days, mostly waiting)*

Owner: **BCP / admin**. No code.

1. Create a **Meta Business account** (business.facebook.com) and verify the NGO.
2. In **Meta for Developers**, create an app → add the **WhatsApp** product.
3. Add a **phone number** for WhatsApp Business (a number **not** already on the
   WhatsApp consumer app). Many NGOs use a fresh SIM dedicated to the bot.
4. Collect these secrets (used in Phase 2):
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_BUSINESS_ACCOUNT_ID`
   - `WHATSAPP_ACCESS_TOKEN` (generate a **permanent** System User token, not the 24h test token)
   - `WHATSAPP_VERIFY_TOKEN` (any random string you choose for webhook verification)

## Phase 2 — Backend (Supabase Edge Functions) *(code, ~1–2 days)*

Owner: **dev**. Replace the VPS bot with two serverless functions.

1. **`whatsapp-webhook`** (public Edge Function)
   - `GET`: webhook verification handshake (echo `hub.challenge` when `hub.verify_token` matches `WHATSAPP_VERIFY_TOKEN`).
   - `POST`: receive inbound messages → parse YES/NO → update `request_matches`
     → reply with the requester's contact. (Port `handleInbound` from `lib/relay.js`.)
2. **`match-and-notify`** (triggered when a new request needs alerting)
   - Reads the `open` request, calls `find_eligible_donors`, sends a **template
     message** to each donor via the Cloud API, writes `request_matches`, flips to `matching`.
   - Trigger options (pick one):
     - **DB webhook / `pg_net`**: fire on `insert into blood_requests` where `status='open'`.
     - **`pg_cron`** every 1–2 min as a fallback sweep (mirrors the current poll loop).
3. Store secrets via `supabase secrets set` (never in the repo).
4. Outbound send helper = a single `fetch` to
   `https://graph.facebook.com/v21.0/{PHONE_NUMBER_ID}/messages`.

## Phase 3 — Message templates *(external approval, ~1–2 days waiting)*

Owner: **admin**, with dev drafting the copy.

- WhatsApp requires **pre-approved templates** to message a user who hasn't
  messaged you in the last 24h (the "donor alert" is business-initiated → must be a template).
- Submit one **utility template**, e.g. `donor_blood_alert` with variables:
  `{{blood_group}}`, `{{hospital}}`, `{{city}}`, `{{urgency}}`, `{{request_code}}`.
- The YES/NO reply + requester-contact response happen inside the 24h service
  window → can be free-form text (no template needed).

## Phase 4 — Testing *(½ day)*

1. Set secrets, deploy both functions, register the webhook URL + `verify_token` in the Meta dashboard.
2. Add a **verified/active test donor** with a geocoded location near a test city.
3. Submit a test **Request Blood** form → confirm the donor receives the template.
4. Reply **YES** → confirm `request_matches.status = accepted` and the requester
   contact is sent back. Reply **NO** → confirm `declined`.
5. Check the `audit_log` and `request_matches` ledger for a clean trail.

## Phase 5 — Go-live & monitoring *(½ day)*

1. Point the real (dedicated) NGO WhatsApp number at the app.
2. Set conservative caps (`MAX_DONORS_PER_REQUEST`, radius) to avoid over-messaging.
3. Add basic alerting on Edge Function errors (Supabase logs).
4. Keep the `whatsapp-web.js` pilot **only** as an offline test harness on a throwaway number.

---

## Effort summary

| Phase | Owner | Effort | Blocking? |
|-------|-------|--------|-----------|
| 1. Meta onboarding | admin | ~1–3 days (waiting) | Yes — gates everything |
| 2. Edge Functions | dev | ~1–2 days | Needs Phase 1 secrets |
| 3. Template approval | admin | ~1–2 days (waiting) | Needs Phase 1 |
| 4. Testing | dev + admin | ~½ day | Needs 2 & 3 |
| 5. Go-live | both | ~½ day | Needs 4 |

**Critical path is the Meta approvals (Phases 1 & 3), not the code.** Start those first.

---

## Interim (works today, no onboarding)

Until the Cloud API is live, the **manual relay already in the admin panel** is the
safe fallback: the admin dashboard's blood-request and Find-Donors screens generate
one-tap **click-to-chat `wa.me` links** with the message pre-filled, so staff alert
donors from the real number with zero ban risk. The bot only *automates* this same flow.
