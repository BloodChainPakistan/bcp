// Core notify-and-consent relay against the Supabase backend.
//  Outbound: poll 'open' blood_requests → find eligible donors → alert each →
//            write request_matches → flip request to 'matching'.
//  Inbound:  donor replies YES/NO → update their match → relay requester contact.
const { supabase } = require('./supabase');
const { toWaId, waIdToPhone, donorAlert, donorAccepted, donorDeclined } = require('./messages');

const RADIUS_M = Number(process.env.MATCH_RADIUS_M || 50000);
const MAX_DONORS = Number(process.env.MAX_DONORS_PER_REQUEST || 10);
const DRY_RUN = String(process.env.DRY_RUN || 'true') === 'true';

const YES_RE = /^(yes|y|accept|ok|okay|haan|han|ji|theek)\b/i;
const NO_RE = /^(no|n|decline|nahi|nai|cant|can't)\b/i;

async function send(client, waId, text) {
  if (DRY_RUN) {
    console.log(`[dry-run] → ${waId}\n${text}\n`);
    return;
  }
  await client.sendMessage(waId, text);
}

/** Alert nearby eligible donors for one request, then mark it 'matching'. */
async function alertRequest(client, req) {
  if (req.lat == null || req.lng == null) {
    console.log(`Skip ${req.request_code || req.id}: no geocoded location.`);
    return;
  }
  const { data: elig, error } = await supabase.rpc('find_eligible_donors', {
    p_blood_group: req.blood_group,
    p_lng: req.lng,
    p_lat: req.lat,
    p_radius_m: RADIUS_M,
    p_limit: MAX_DONORS,
  });
  if (error) {
    console.error('find_eligible_donors error:', error.message);
    return;
  }
  const matches = elig || [];
  if (matches.length) {
    await supabase.from('request_matches').upsert(
      matches.map((d) => ({ request_id: req.id, donor_id: d.donor_id, distance_m: d.distance_m })),
      { onConflict: 'request_id,donor_id' },
    );
    const ids = matches.map((d) => d.donor_id);
    const { data: donors } = await supabase
      .from('donors')
      .select('id, full_name, phone, whatsapp')
      .in('id', ids);
    for (const d of donors || []) {
      try {
        await send(client, toWaId(d.whatsapp || d.phone), donorAlert(req, d.full_name));
      } catch (e) {
        console.error(`send to ${d.full_name} failed:`, e.message);
      }
    }
  }
  // Flip out of 'open' so we don't re-alert on the next poll.
  await supabase.from('blood_requests').update({ status: 'matching' }).eq('id', req.id).eq('status', 'open');
  console.log(`Alerted ${matches.length} donor(s) for ${req.request_code || req.id} (${req.blood_group}).`);
}

/** Poll for new public requests waiting to be matched. */
async function pollOpenRequests(client) {
  const { data, error } = await supabase
    .from('blood_requests')
    .select('id, request_code, requester_name, requester_phone, blood_group, units_needed, urgency, hospital_name, city, lat, lng, status')
    .eq('status', 'open')
    .order('created_at', { ascending: true })
    .limit(5);
  if (error) {
    console.error('poll error:', error.message);
    return;
  }
  for (const req of data || []) await alertRequest(client, req);
}

/** Handle a donor's inbound WhatsApp reply (YES / NO). */
async function handleInbound(client, waId, body) {
  const text = (body || '').trim();
  const yes = YES_RE.test(text);
  const no = NO_RE.test(text);
  if (!yes && !no) return; // ignore anything that isn't a clear reply

  const phone = waIdToPhone(waId);
  const { data: donor } = await supabase
    .from('donors')
    .select('id')
    .or(`phone.eq.${phone},whatsapp.eq.${phone}`)
    .limit(1)
    .maybeSingle();
  if (!donor) return;

  const { data: match } = await supabase
    .from('request_matches')
    .select('id, request_id')
    .eq('donor_id', donor.id)
    .in('status', ['notified', 'contacted'])
    .order('notified_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!match) return;

  const next = yes ? 'accepted' : 'declined';
  await supabase
    .from('request_matches')
    .update({ status: next, responded_at: new Date().toISOString() })
    .eq('id', match.id);

  if (yes) {
    const { data: req } = await supabase
      .from('blood_requests')
      .select('requester_name, requester_phone, hospital_name, city, blood_group, request_code')
      .eq('id', match.request_id)
      .single();
    await send(client, waId, donorAccepted(req));
  } else {
    await send(client, waId, donorDeclined());
  }
  console.log(`Donor ${donor.id} replied ${next}.`);
}

module.exports = { pollOpenRequests, handleInbound, DRY_RUN };
