/**
 * Pure, framework-free validation helpers. Kept out of components so the same
 * rules power both the live forms and the unit tests (see validation.test.ts).
 */

/** Strip everything except digits. */
export function digitsOnly(raw: string): string {
  return (raw ?? '').replace(/\D/g, '');
}

/**
 * Accepts Pakistani mobile numbers in either local (03XXXXXXXXX) or
 * international (92XXXXXXXXXX / +92XXXXXXXXXX) form.
 */
export function isValidPakPhone(raw: string): boolean {
  return normalizePakPhone(raw) !== null;
}

/**
 * Normalize any Pakistani mobile to canonical +92 form (+923XXXXXXXXX).
 * Accepts 03XXXXXXXXX, 3XXXXXXXXX, 92…, 0092…, +92…. Returns null if it isn't a
 * valid PK mobile (10 local digits starting with 3). This is the single source
 * of truth — the UI, forms mapping, and the DB CHECK all agree on +92… format.
 */
export function normalizePakPhone(raw: string | null | undefined): string | null {
  let d = digitsOnly(raw ?? '');
  if (d.startsWith('0092')) d = d.slice(2); // 0092… → 92…
  if (d.startsWith('92')) d = d.slice(2); // 92XXXXXXXXXX → XXXXXXXXXX
  else if (d.startsWith('0')) d = d.slice(1); // 03XX… → 3XX…
  return /^3\d{9}$/.test(d) ? `+92${d}` : null;
}

/**
 * Reduce any input to the 10 local digits behind the +92 prefix. Handles a
 * leading 0 (03358043653 → 3358043653), a pasted country code (92… / +92…), and
 * spaces/dashes — so the user can paste a number any way and the 0 is dropped.
 */
export function localPakDigits(raw: string | null | undefined): string {
  const n = normalizePakPhone(raw);
  if (n) return n.slice(3); // already a valid full number → take the 10 local digits
  let d = digitsOnly(raw ?? '');
  if (d.startsWith('0092')) d = d.slice(4);
  else if (d.startsWith('92') && d.length > 10) d = d.slice(2);
  return d.replace(/^0+/, '').slice(0, 10);
}

/** Pakistani CNIC: 13 digits, formatted 00000-0000000-0 (dashes optional input). */
export function isValidCnic(raw: string | null | undefined): boolean {
  return /^\d{13}$/.test(digitsOnly(raw ?? ''));
}

/** Insert CNIC dashes as the user types: 00000-0000000-0. */
export function formatCnic(raw: string): string {
  const d = digitsOnly(raw).slice(0, 13);
  if (d.length <= 5) return d;
  if (d.length <= 12) return `${d.slice(0, 5)}-${d.slice(5)}`;
  return `${d.slice(0, 5)}-${d.slice(5, 12)}-${d.slice(12)}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function isValidEmail(raw: string | null | undefined): boolean {
  const s = (raw ?? '').trim();
  return s === '' || EMAIL_RE.test(s);
}

/** Donor form: format checks (native `required` handles emptiness). */
export function validateDonor(f: {
  phone: string; email?: string; weight?: string | number;
}): Record<string, string> {
  const e: Record<string, string> = {};
  if (!isValidPakPhone(f.phone)) e.phone = 'Enter a valid mobile, e.g. 3001234567.';
  if (!isValidEmail(f.email)) e.email = 'Enter a valid email address.';
  const w = Number(f.weight);
  if (f.weight !== undefined && f.weight !== '' && (!Number.isFinite(w) || w < 30 || w > 250))
    e.weight = 'Enter a weight in kg (30–250).';
  return e;
}

/** Volunteer form: phone + CNIC + email format checks. */
export function validateVolunteer(f: {
  phone: string; cnic?: string; email?: string;
}): Record<string, string> {
  const e: Record<string, string> = {};
  if (!isValidPakPhone(f.phone)) e.phone = 'Enter a valid mobile, e.g. 3001234567.';
  if (f.cnic && f.cnic.trim() !== '' && !isValidCnic(f.cnic)) e.cnic = 'CNIC must be 13 digits (00000-0000000-0).';
  if (!isValidEmail(f.email)) e.email = 'Enter a valid email address.';
  return e;
}

/** Partner form: contact + focal mobile + email format checks. */
export function validatePartner(f: {
  focal_phone?: string; email?: string; focal_email?: string;
}): Record<string, string> {
  const e: Record<string, string> = {};
  if (f.focal_phone && f.focal_phone.trim() !== '' && !isValidPakPhone(f.focal_phone))
    e.focal_phone = 'Enter a valid mobile, e.g. 3001234567.';
  if (!isValidEmail(f.email)) e.email = 'Enter a valid email address.';
  if (!isValidEmail(f.focal_email)) e.focal_email = 'Enter a valid email address.';
  return e;
}

export interface BloodRequestInput {
  requester_name: string;
  requester_phone: string;
  blood_group: string;
  units_needed: number;
  city: string;
  hospital_name: string;
}

export const MAX_UNITS = 20;

/**
 * Returns a map of field → error message. An empty object means the input is
 * valid. Designed for inline display next to each field.
 */
export function validateBloodRequest(f: Partial<BloodRequestInput>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!f.requester_name || f.requester_name.trim().length < 2) {
    errors.requester_name = 'Enter the requester’s full name.';
  }
  if (!f.requester_phone || !isValidPakPhone(f.requester_phone)) {
    errors.requester_phone = 'Enter a valid Pakistani number (e.g. 03001234567).';
  }
  if (!f.blood_group) {
    errors.blood_group = 'Select a blood group.';
  }
  const units = Number(f.units_needed);
  if (!Number.isInteger(units) || units < 1 || units > MAX_UNITS) {
    errors.units_needed = `Units must be between 1 and ${MAX_UNITS}.`;
  }
  if (!f.city || f.city.trim().length < 2) {
    errors.city = 'Enter the city so we can match nearby donors.';
  }
  if (!f.hospital_name || f.hospital_name.trim().length < 2) {
    errors.hospital_name = 'Enter the hospital name.';
  }

  return errors;
}
