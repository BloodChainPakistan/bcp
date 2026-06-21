# Deploying the WhatsApp Bot (whatsapp-web.js)

This bot is a **long-running Node service** that drives a headless Chromium
(WhatsApp Web). It therefore needs a host that stays on 24/7 and can run Chromium
— **not** Vercel / Netlify / Hostinger *shared* hosting (those are serverless or
PHP-only). Use a small VPS or a container host.

> ⚠️ Ban risk is real (whatsapp-web.js is unofficial). Use a **dedicated WhatsApp
> number** on a spare SIM — **never the main NGO line.** Start with `DRY_RUN=true`.

---

## 1. Get your secrets (from the NEW Supabase project)

In the BCP Supabase dashboard → **Settings → API**:

| Env var | Where |
|---------|-------|
| `SUPABASE_URL` | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | **`service_role`** key (secret — server only, bypasses RLS) |

Other knobs (optional): `DRY_RUN`, `POLL_INTERVAL_MS`, `MATCH_RADIUS_M`,
`MAX_DONORS_PER_REQUEST`. See `README.md`.

---

## 2A. Run with Docker (recommended — works on any VPS / Railway / Render / Fly.io)

A `Dockerfile` is included; it bundles Chromium so there's nothing to install by hand.

```bash
cd whatsapp-bot

# Build
docker build -t bcp-wa-bot .

# First run — attach so you can see and scan the QR code.
docker run --name bcp-wa-bot -it \
  -e SUPABASE_URL="https://<your-project>.supabase.co" \
  -e SUPABASE_SERVICE_ROLE_KEY="<service-role-key>" \
  -e DRY_RUN=true \
  -v bcp_wa_auth:/app/.wwebjs_auth \
  bcp-wa-bot
```

- Scan the QR with the bot's phone: WhatsApp → **Linked Devices → Link a device**.
- The session is saved in the `bcp_wa_auth` volume, so future restarts **don't**
  need a re-scan.
- Once verified, stop it, then run **detached** and live:

```bash
docker rm bcp-wa-bot
docker run -d --restart unless-stopped --name bcp-wa-bot \
  -e SUPABASE_URL="https://<your-project>.supabase.co" \
  -e SUPABASE_SERVICE_ROLE_KEY="<service-role-key>" \
  -e DRY_RUN=false \
  -v bcp_wa_auth:/app/.wwebjs_auth \
  bcp-wa-bot

docker logs -f bcp-wa-bot   # watch it
```

### Managed container hosts
Railway / Render / Fly.io can deploy this `Dockerfile` directly from the GitHub repo
(root directory = `whatsapp-bot`). Set the two env vars in their dashboard and add a
**persistent volume** mounted at `/app/.wwebjs_auth` so the login survives redeploys.
For the very first deploy, open the live logs to scan the QR.

---

## 2B. Run directly on a VPS (no Docker)

On Ubuntu/Debian:

```bash
sudo apt-get update && sudo apt-get install -y chromium-browser
cd whatsapp-bot
cp .env.example .env     # fill SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
npm install
# point Puppeteer at the system Chromium:
echo 'PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser' >> .env
npm start                # scan the QR once
```

Keep it alive with **pm2** so it restarts on crash/reboot:

```bash
npm install -g pm2
pm2 start index.js --name bcp-wa-bot
pm2 save && pm2 startup   # run the printed command to enable boot startup
```

---

## 3. Go-live checklist

1. ✅ Dedicated WhatsApp number linked (not the main line).
2. ✅ `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` point to the **new** project.
3. ✅ Tested with `DRY_RUN=true` — terminal logs the messages it *would* send.
4. ✅ At least one **verified/active** donor with a geocoded location near the test city.
5. ✅ Submit a test **Request Blood** form → confirm donor alert → reply **YES** →
   confirm `request_matches.status = accepted` and requester contact relayed.
6. ✅ Flip `DRY_RUN=false`, set conservative `MAX_DONORS_PER_REQUEST` / `MATCH_RADIUS_M`.
7. ✅ Watch `docker logs` / `pm2 logs` for the first few real requests.

---

## How it ties into the site

- The public **Request Blood** form creates a `blood_requests` row with `status='open'`.
- The bot polls those, matches donors via the `find_eligible_donors` RPC, alerts them,
  and records everything in `request_matches` — the **same** ledger the admin panel reads.
- The bot and the admin dashboard's manual `wa.me` links are two ways to drive the
  same flow; you can run both.
