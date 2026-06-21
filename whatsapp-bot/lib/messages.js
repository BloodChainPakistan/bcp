// WhatsApp message text + phone↔WhatsApp-id helpers. Mirrors the frontend's
// src/lib/messageTemplates.ts, but worded for a two-way bot (asks the donor to
// reply YES/NO instead of being a one-tap click-to-chat link).

/** "+923358043653" / "923358043653" / "03358043653" → "923358043653@c.us" */
function toWaId(phone) {
  let d = String(phone || '').replace(/\D/g, '');
  if (d.startsWith('0092')) d = d.slice(2);
  if (d.startsWith('0')) d = '92' + d.slice(1);
  if (!d.startsWith('92')) d = '92' + d; // assume local 10-digit
  return `${d}@c.us`;
}

/** Incoming WhatsApp id → canonical +92 phone we store in the DB. */
function waIdToPhone(waId) {
  const d = String(waId || '').split('@')[0].replace(/\D/g, '');
  return '+' + d;
}

const code = (r) => (r.request_code ? `\nRequest ID: ${r.request_code}` : '');

/** Alert to a matched donor — asks them to reply YES / NO. */
function donorAlert(r, donorName) {
  const hi = donorName ? `Assalam-o-Alaikum ${donorName},` : 'Assalam-o-Alaikum,';
  return `${hi}

Blood Chain Pakistan needs *${r.blood_group}* blood 🩸
Location: ${r.hospital_name || '—'}, ${r.city || '—'}
Units: ${r.units_needed}  ·  Urgency: ${r.urgency}${code(r)}

Can you donate? Reply *YES* to help or *NO* if you can't right now.
JazakAllah 🙏`;
}

/** Sent to a donor who replied YES — relays the requester's contact. */
function donorAccepted(r) {
  return `JazakAllah! 🙏 Please coordinate directly with the requester:

Requester: ${r.requester_name}
Phone: ${r.requester_phone || '—'}
Hospital: ${r.hospital_name || '—'}, ${r.city || '—'}
Blood group: ${r.blood_group}${code(r)}

Thank you for saving a life. ❤️`;
}

const donorDeclined = () => 'Understood — thank you for responding. We’ll reach out next time. 🙏';

module.exports = { toWaId, waIdToPhone, donorAlert, donorAccepted, donorDeclined };
