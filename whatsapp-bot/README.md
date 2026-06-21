# BCP WhatsApp Bot — pilot (whatsapp-web.js)

A **testing-only** WhatsApp relay for Blood Chain Pakistan. It watches for new
public blood requests, alerts nearby eligible donors on WhatsApp, and records
their YES/NO replies into the Supabase `request_matches` ledger.

This is a **separate Node service** — it is NOT part of the React frontend and is
not deployed to Hostinger. Run it on your machine for testing, or a small VPS.

## ⚠️ Read this first (ban risk)

`whatsapp-web.js` automates **WhatsApp Web** through a headless browser. This is
**against WhatsApp's Terms of Service**, and WhatsApp can **permanently ban** the
number. For an NGO whose number is an emergency lifeline, a ban means the line
goes dark.

- ✅ Use a **dedicated, disposable test number** — never the main NGO number.
- ✅ Keep volumes low while testing; start with `DRY_RUN=true`.
- ✅ Plan to migrate to the **official Meta WhatsApp Cloud API** for production
  (webhook-based, ToS-compliant, runs as a Supabase Edge Function — no VPS, no
  ban risk). The relay logic here maps directly onto it.

## What it needs

- **Node 18+** and a machine that can run Chromium (whatsapp-web.js uses Puppeteer).
- The Supabase **service-role** key (server-side only — bypasses RLS).
- A WhatsApp account on a phone to scan the QR once.

## Setup

```bash
cd whatsapp-bot
cp .env.example .env        # then fill in SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
npm install                 # downloads Chromium — can take a minute
npm start
```

On first run a **QR code** prints in the terminal. On the bot's phone:
WhatsApp → **Linked Devices** → **Link a device** → scan it. The session is saved
in `.wwebjs_auth/` so you only scan once.

## How it works

- **Outbound** — every `POLL_INTERVAL_MS`, it reads `blood_requests` with
  `status = 'open'` (the status the public "Request Blood" form creates), calls
  the `find_eligible_donors` RPC, messages each donor, writes `request_matches`,
  and flips the request to `matching` so it isn't alerted twice.
- **Inbound** — when a donor replies **YES** (or haan/ok/…) the bot marks their
  match `accepted` and sends them the requester's contact; **NO** marks it
  `declined`. Everything else is ignored.

## Safety knobs (.env)

| Var | Purpose |
|-----|---------|
| `DRY_RUN` | `true` = log messages instead of sending. **Start here.** |
| `POLL_INTERVAL_MS` | How often to check for new requests (default 20s). |
| `MATCH_RADIUS_M` | Donor search radius in metres (default 50 km). |
| `MAX_DONORS_PER_REQUEST` | Cap donors alerted per request (default 10). |

## Testing flow

1. `DRY_RUN=true`, `npm start`, scan QR.
2. Submit a test request on the site's **Request Blood** form (make sure at least
   one **verified/active** donor exists near that city with a geocoded location).
3. Watch the terminal — it logs the donor messages it *would* send.
4. Flip `DRY_RUN=false` to actually send, using your test number.

## Production

Do **not** point this at the real NGO number. When ready, replace this service
with a `whatsapp-webhook` Supabase Edge Function on the Meta Cloud API — the
`lib/messages.js` text and the `request_matches` flow carry straight over.
