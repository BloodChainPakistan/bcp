/**
 * WhatsApp message templates for the emergency blood relay. These pre-fill the
 * wa.me link's text so staff send a complete, consistent message in one tap
 * instead of retyping request details each time. Interim until the Meta
 * WhatsApp Cloud API bot (Sprint 5) automates the send.
 */

export interface RequestInfo {
  request_code: string | null;
  blood_group: string;
  units_needed: number;
  urgency: string;
  hospital_name: string | null;
  city: string | null;
  requester_name: string;
  requester_phone: string | null;
}

/** Build a wa.me link, optionally with a pre-filled message body. */
export function waLink(phone?: string | null, text?: string): string {
  let d = (phone || '').replace(/\D/g, '');
  if (d.startsWith('0')) d = '92' + d.slice(1);
  if (!d) return '#';
  const base = `https://wa.me/${d}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

const codeLine = (r: RequestInfo) => (r.request_code ? `\nRequest ID: ${r.request_code}` : '');

/** To a matched donor — asks them to donate and how to reach the requester. */
export function donorAlertMessage(r: RequestInfo, donorName?: string): string {
  const hi = donorName ? `Assalam-o-Alaikum ${donorName},` : 'Assalam-o-Alaikum,';
  return `${hi}

Blood Chain Pakistan needs *${r.blood_group}* blood 🩸
Patient location: ${r.hospital_name ?? '—'}, ${r.city ?? '—'}
Units needed: ${r.units_needed}
Urgency: ${r.urgency}

If you can donate, please contact ${r.requester_name} at ${r.requester_phone ?? '—'}.${codeLine(r)}

JazakAllah — you could save a life today. 🙏`;
}

/** To the requester — confirms donors have been alerted. */
export function requesterAlertedMessage(r: RequestInfo, count: number): string {
  return `Assalam-o-Alaikum ${r.requester_name},

We have alerted ${count} nearby eligible ${r.blood_group} donor(s) for your request${r.request_code ? ` ${r.request_code}` : ''}. They may contact you on this number, in sha Allah.

— Blood Chain Pakistan`;
}

/** To the requester — closes the loop once the request is fulfilled. */
export function requesterFulfilledMessage(r: RequestInfo): string {
  return `Assalam-o-Alaikum ${r.requester_name},

Alhamdulillah — your blood request${r.request_code ? ` ${r.request_code}` : ''} (${r.blood_group}) is now marked fulfilled. We pray for the patient's swift recovery. 🙏

— Blood Chain Pakistan`;
}
