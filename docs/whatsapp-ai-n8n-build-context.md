# BloodChain Pakistan — WhatsApp AI Assistant on n8n (Build Context & Prompt)

> Hand this whole file to Claude Code (with the **n8n MCP** connected) to build the
> workflow. It contains the mission, the exact database schema, the memory design,
> the AI tools, the node-by-node workflow, and a ready-to-run build prompt at the end.

---

## 1. Mission — what we are building

An **AI-powered WhatsApp assistant** for an NGO blood-donation registry. A person
messages our WhatsApp number and the assistant:

1. **Understands** the message (Urdu/English, e.g. "I need O+ blood in Peshawar urgently").
2. **Remembers** the conversation (per phone number) so follow-ups make sense.
3. **Looks at the database** (donors, requests, team, FAQs) using tools.
4. **Replies naturally** with real data — e.g. the matching donor's **name, phone,
   and location/city**, or registers them, or gives a request status.

Example the client gave: *"If someone asks for blood, the assistant should look
around the contacts / memory / database and reply with that person's name, number
and location."* → that is a **tool-backed lookup**, described in §6.

## 2. Why this stack (context)

- We first tried **whatsapp-web.js** (unofficial). It got the number **banned** — not viable for a lifeline service.
- New stack (official, ban-proof, smart):
  - **Meta WhatsApp Cloud API** — official messaging transport (no ban risk).
  - **n8n** — visual orchestration (triggers, memory, DB, AI agent) — low-code.
  - **Supabase (Postgres + PostGIS)** — our existing live database (unchanged).
  - **LLM (Claude or OpenAI)** — natural-language understanding + replies.

## 3. Architecture

```
WhatsApp user
     │  (message)
     ▼
Meta WhatsApp Cloud API ──webhook──► n8n  ◄──► Supabase (donors, requests, memory…)
     ▲                                 │
     │  (reply)                        └──► LLM (Claude/OpenAI) with TOOLS + MEMORY
     └─────────────────────────────────────
```

Two workflows:
- **A. Inbound assistant** — the conversational AI agent (this is the main one).
- **B. Outbound alerter** — when a new blood request is created, proactively message nearby donors (template message).

## 4. Supabase schema (the source of truth — already live)

Project ref: `fgitbfqekoshtjjshvda` (client's own Supabase account).
Connect n8n via the **Postgres node** (host `db.fgitbfqekoshtjjshvda.supabase.co`,
db `postgres`, user `postgres`, the DB password) **or** the Supabase node (URL +
service-role key). Service role bypasses RLS — keep it server-side in n8n only.

### Tables the assistant uses

**`donors`** (people who can give blood)
- `id` uuid, `full_name`, `blood_group` (enum: A+,A-,B+,B-,AB+,AB-,O+,O-),
  `phone`, `whatsapp`, `email`, `city`, `district`, `address`,
  `lat`/`lng` (geocoded), `location` (PostGIS geography), `weight_kg`,
  `last_donation_date`, `status` (pending|verified|active|inactive),
  `consent_contact` (bool), `deleted_at`.

**`blood_requests`** (emergency requests)
- `id` uuid, `request_code` (e.g. BC-RQ-1001), `requester_name`,
  `requester_phone`, `requester_whatsapp`, `patient_name`, `blood_group`,
  `units_needed`, `urgency` (routine|urgent|critical), `hospital_name`,
  `city`, `lat`/`lng`, `notes`, `status` (open|matching|fulfilled|cancelled|expired),
  `created_via`, `created_at`.

**`request_matches`** (notify-and-consent ledger)
- `id`, `request_id`→blood_requests, `donor_id`→donors, `distance_m`,
  `status` (notified|accepted|declined|contacted|donated), `notified_at`, `responded_at`.

**`team_members`** — `name`, `role`, `group_name` (bog|core_cabinet), `is_current`, `is_published`.
**`faqs`** — `question`, `answer`, `is_published`, `sort_order`.
**`feature_flags`** — `key`, `enabled`.

### The matching function (use this, don't hand-write geo SQL)

```sql
-- Returns nearest ELIGIBLE donors (no PII): donor_id, blood_group, city, distance_m
select * from find_eligible_donors(
  p_blood_group := 'O+',          -- blood_group enum
  p_lng         := 71.5249,       -- request longitude
  p_lat         := 34.0151,       -- request latitude
  p_radius_m    := 25000,         -- search radius (m)
  p_limit       := 20
);
```
It already filters: not deleted, status verified/active, `consent_contact=true`,
compatible blood group, within radius, age/weight/cooldown eligible. To then get
contact details for an authorized lookup, select from `donors` by the returned ids.

## 5. Memory design (create this table)

The LLM is stateless — we store conversation turns and feed the last N back each time.

```sql
create table if not exists wa_conversations (
  id          bigint generated always as identity primary key,
  phone       text not null,                  -- WhatsApp number (e.g. 923001234567)
  role        text not null check (role in ('user','assistant')),
  content     text not null,
  created_at  timestamptz not null default now()
);
create index if not exists wa_conversations_phone_idx on wa_conversations (phone, created_at desc);
```

Memory rule in the workflow: on each inbound message, **load the last ~10 rows**
for that `phone` (oldest→newest) and pass as chat history; after replying, **insert
both** the user message and the assistant reply.

## 6. The AI Agent — tools (function calling)

Give the agent these tools; each maps to a Supabase query/RPC. The agent NEVER
queries the DB directly — it calls a tool, n8n runs the SQL, the result returns to
the agent, the agent phrases the reply.

| Tool | Input | What n8n runs | Returns |
|------|-------|---------------|---------|
| `find_donors` | blood_group, lat, lng (or city→geocode), radius | `find_eligible_donors(...)` then join `donors` for name/phone/city | list of {name, phone, city, distance} |
| `register_donor` | full_name, blood_group, phone, city, (lat/lng) | `insert into donors (... status='pending')` | confirmation + id |
| `create_blood_request` | requester_name, phone, blood_group, city, urgency, (lat/lng) | `insert into blood_requests (... status='open')` | request_code |
| `get_request_status` | request_code or phone | `select status, request_code from blood_requests …` + counts from `request_matches` | status summary |
| `search_faqs` | query text | `select question, answer from faqs where is_published and question ilike …` | top FAQs |
| `get_team_info` | (none / name) | `select name, role, group_name from team_members where is_current and is_published` | team list |

> ⚠️ Privacy rule: returning a donor's **name + phone + location** is sensitive.
> Restrict that lookup to **authorized staff numbers** (an allowlist of admin WhatsApp
> numbers checked at the start of the workflow). Public users get the **notify-and-
> consent** flow (we message the donor on their behalf), not raw contact details.

## 7. Workflow A — Inbound AI assistant (node by node)

1. **WhatsApp Trigger** (Meta) — receives inbound messages (webhook). Output: from-number, text.
2. **Set / Normalize** — extract `phone` (digits, e.g. 92300…) and `text`.
3. **Postgres — Load memory** — `select role, content from wa_conversations where phone = $phone order by created_at desc limit 10` (then reverse to chronological).
4. **Postgres — Is admin?** (optional) — check `phone` against an admin allowlist → boolean used for the privacy gate.
5. **AI Agent** node:
   - **Chat model:** Claude (Anthropic) or OpenAI.
   - **System prompt:** see §9.
   - **Memory:** the rows from step 3 as prior turns (or n8n's Postgres Chat Memory node keyed by `phone`).
   - **Tools:** the six tools in §6, each implemented as a **Tool → Postgres/Supabase** sub-node or HTTP call.
6. **WhatsApp — Send message** (Meta) — send the agent's reply to `phone`.
7. **Postgres — Save memory** — insert the user message and the assistant reply into `wa_conversations`.

## 8. Workflow B — Outbound alerter (new request → notify donors)

1. **Trigger** — Supabase DB webhook on `insert into blood_requests where status='open'`, **or** an n8n Schedule node polling every 1–2 min.
2. **Postgres — find donors** — `find_eligible_donors(blood_group, lng, lat, …)`.
3. **Postgres — record matches** — upsert into `request_matches (request_id, donor_id, distance_m, status='notified')`.
4. **Loop + WhatsApp Send (template)** — send the approved **template message** to each donor (business-initiated messages require an approved template). Add a small delay between sends.
5. **Postgres — flip status** — `update blood_requests set status='matching' where id=…`.
6. **(Inbound handles replies)** — donor replies YES/NO → Workflow A updates `request_matches` to accepted/declined and relays the requester's contact.

## 9. The AI Agent system prompt (paste into the AI Agent node)

```
You are the WhatsApp assistant for Blood Chain Pakistan, a voluntary blood-donation
NGO. Be warm, concise, and bilingual (reply in the user's language — Urdu or English).

You help people: (1) request blood in an emergency, (2) register as a donor,
(3) check a request's status, (4) answer FAQs about donating.

Rules:
- Use TOOLS to get real data. Never invent donor details, phone numbers, or availability.
- Only reveal a donor's name/phone/location if the tool result marks the requester as
  authorized staff. For the public, offer to notify matching donors on their behalf
  (we contact donors; we don't hand out their numbers).
- For an emergency, collect: blood group, city/location, units, urgency, and a callback
  number, then create the request and confirm with the request code.
- Keep replies short for WhatsApp. Ask one question at a time. Never give medical advice.
```

## 10. Credentials n8n needs

- **Meta WhatsApp Cloud API:** Phone Number ID, permanent Access Token, Verify Token, App Secret.
- **Supabase/Postgres:** host, port 5432, db `postgres`, user `postgres`, password (Settings → Database) — OR Supabase node with URL + service-role key.
- **LLM:** Anthropic API key (Claude) or OpenAI API key.

---

## 11. ✅ THE BUILD PROMPT (paste this into Claude Code with the n8n MCP)

> Using the n8n MCP, build the two workflows described in this document for the
> Blood Chain Pakistan WhatsApp AI assistant. Do the following:
>
> 1. First create the `wa_conversations` memory table in Supabase (§5) if it doesn't exist.
> 2. **Workflow A — "BCP WhatsApp Assistant" (inbound):** WhatsApp Trigger (Meta Cloud
>    API) → normalize phone+text → Postgres "load last 10 memory rows for phone" →
>    AI Agent (Claude chat model) with the system prompt from §9, Postgres chat memory
>    keyed by phone, and the six tools from §6 (each wired to the exact SQL/RPC listed) →
>    WhatsApp Send → Postgres "insert user+assistant turns into wa_conversations".
>    Add the admin-allowlist privacy gate from §6/§9.
> 3. **Workflow B — "BCP Donor Alerter" (outbound):** trigger on new `blood_requests`
>    with status='open' (Supabase webhook or 90s Schedule poll) → call
>    `find_eligible_donors` → upsert `request_matches` (status='notified') → send the
>    approved WhatsApp template to each donor with a 4s delay between sends → update the
>    request to status='matching'.
> 4. Use the Supabase schema, the `find_eligible_donors` signature, the tool→SQL
>    mappings, and the credential names exactly as specified in this document.
> 5. Create the workflows in a disabled/inactive state, validate each node's connections,
>    and give me: the list of credentials I must fill in, the webhook URL to register in
>    the Meta dashboard, and the template text to submit for Meta approval.
>
> Ask me for any credential IDs you need; do not hardcode secrets.

---

## 12. What only the client must do (can't be automated)

1. **Meta Business onboarding** — verify business, create app, add WhatsApp product,
   register the number, get Phone Number ID + permanent token + set the webhook.
2. **Template approval** — submit the donor-alert template (Meta reviews it, ~1–2 days).
3. **Host n8n** — n8n Cloud (easiest) or self-host (Docker/VPS).
4. **Fill credentials** in n8n (Meta, Supabase, LLM keys).

Critical path = the Meta approvals. Start those first; the workflow build can happen in parallel.
