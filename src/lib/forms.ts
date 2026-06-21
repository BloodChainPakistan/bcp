import { supabase } from './supabaseClient';
import { normalizePakPhone } from './validation';
import type {
  DonorInsert,
  VolunteerInsert,
  PartnerInsert,
  BloodRequestInsert,
  PartnerType,
  BloodGroup,
  GenderType,
} from '../types/database';

/** Current consent/privacy policy version recorded with each submission (legal trail). */
export const CONSENT_POLICY_VERSION = 'v1';

export type SubmitResult = { ok: true } | { ok: false; error: string };

// ── Small, shared FormData coercers (clarity: one place, used by all 3 forms) ──
const str = (v: FormDataEntryValue | null): string | null => {
  if (v == null) return null;
  const s = String(v).trim();
  return s === '' ? null : s;
};
const num = (v: FormDataEntryValue | null): number | null => {
  const s = str(v);
  if (s == null) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};
const yesNo = (v: FormDataEntryValue | null): boolean | null => {
  const s = str(v)?.toLowerCase();
  if (s === 'yes' || s === 'true') return true;
  if (s === 'no' || s === 'false') return false;
  return null;
};
/** Checkbox is present in FormData only when checked. */
const checked = (fd: FormData, name: string): boolean => fd.get(name) != null;
const lower = (v: FormDataEntryValue | null): string | null => str(v)?.toLowerCase() ?? null;

const GENDERS: GenderType[] = ['male', 'female', 'other'];
const asGender = (v: FormDataEntryValue | null): GenderType | null => {
  const s = lower(v);
  return s && (GENDERS as string[]).includes(s) ? (s as GenderType) : null;
};
const asFemaleScreening = (v: FormDataEntryValue | null): string | null => {
  const s = lower(v);
  if (!s) return null;
  return s === 'n/a' ? 'na' : s; // 'yes' | 'no' | 'na'
};

/**
 * Collect any submitted fields NOT explicitly mapped to a column into `metadata`.
 * This is the flexible escape hatch: new form fields are preserved as data even
 * before they get a dedicated typed column.
 */
function collectExtras(fd: FormData, mappedNames: string[]): Record<string, string> {
  const known = new Set(mappedNames);
  const extras: Record<string, string> = {};
  for (const [key, value] of fd.entries()) {
    if (known.has(key)) continue;
    if (value instanceof File) continue; // files go to Storage later, not the row
    const v = String(value).trim();
    if (v !== '') extras[key] = v;
  }
  return extras;
}

// ── Donor ─────────────────────────────────────────────────────────────────────
const DONOR_FIELDS = [
  'full_name', 'dob', 'gender', 'blood_group', 'occupation', 'phone_primary', 'whatsapp',
  'email', 'city', 'district', 'address', 'donated_before', 'last_donation', 'weight',
  'chronic_disease', 'medication', 'recent_surgery', 'vaccination', 'travel_history',
  'female_screening', 'available_for', 'preferred_time', 'consent_accuracy',
  'consent_voluntary', 'consent_contact', 'referral_code', 'report_file',
];

export function donorFromForm(fd: FormData): DonorInsert {
  const consentAccuracy = checked(fd, 'consent_accuracy');
  const consentVoluntary = checked(fd, 'consent_voluntary');
  const consentContact = checked(fd, 'consent_contact');
  const allConsented = consentAccuracy && consentVoluntary && consentContact;
  const extras = collectExtras(fd, DONOR_FIELDS);

  return {
    full_name: str(fd.get('full_name')) ?? '',
    dob: str(fd.get('dob')),
    gender: asGender(fd.get('gender')),
    blood_group: (str(fd.get('blood_group')) ?? '') as BloodGroup,
    // One combined "Contact / WhatsApp" field, normalized to +92…; mirror it into
    // both columns so the admin WhatsApp links and donor matching keep working.
    phone: normalizePakPhone(str(fd.get('phone_primary'))) ?? '',
    whatsapp: normalizePakPhone(str(fd.get('phone_primary'))),
    email: str(fd.get('email')),
    occupation: str(fd.get('occupation')),
    city: str(fd.get('city')) ?? '',
    district: str(fd.get('district')),
    address: str(fd.get('address')),
    weight_kg: num(fd.get('weight')),
    donated_before: yesNo(fd.get('donated_before')),
    last_donation_date: str(fd.get('last_donation')),
    chronic_disease: yesNo(fd.get('chronic_disease')),
    on_medication: yesNo(fd.get('medication')),
    recent_surgery: yesNo(fd.get('recent_surgery')),
    recent_vaccination: yesNo(fd.get('vaccination')),
    travel_history: str(fd.get('travel_history')),
    female_pregnant_or_breastfeeding: asFemaleScreening(fd.get('female_screening')),
    available_for: str(fd.get('available_for')),
    preferred_time: str(fd.get('preferred_time')),
    consent_accuracy: consentAccuracy,
    consent_voluntary: consentVoluntary,
    consent_contact: consentContact,
    referral_code: str(fd.get('referral_code')),
    source: 'web',
    ...(allConsented
      ? { consent_at: new Date().toISOString(), consent_policy_version: CONSENT_POLICY_VERSION }
      : {}),
    ...(Object.keys(extras).length ? { metadata: extras } : {}),
  } as DonorInsert;
}

// ── Volunteer ───────────────────────────────────────────────────────────────
const VOLUNTEER_FIELDS = [
  'full_name', 'father_name', 'cnic', 'dob', 'gender', 'qualification', 'profession',
  'phone', 'whatsapp', 'email', 'city', 'district', 'interests', 'prev_volunteer_experience',
  'leadership_experience', 'skill_social_media', 'skill_design', 'skill_public_speaking',
  'hours_per_week', 'willing_to_travel', 'willing_to_lead', 'motivation_join',
  'motivation_activism', 'unique_contribution', 'agree_policies', 'commit_voluntary',
  'cv_file', 'photo_file',
];

export function volunteerFromForm(fd: FormData): VolunteerInsert {
  const extras = collectExtras(fd, VOLUNTEER_FIELDS);
  return {
    full_name: str(fd.get('full_name')) ?? '',
    father_name: str(fd.get('father_name')),
    cnic: str(fd.get('cnic')),
    dob: str(fd.get('dob')),
    gender: asGender(fd.get('gender')),
    qualification: str(fd.get('qualification')),
    profession: str(fd.get('profession')),
    // Combined contact/WhatsApp field, normalized to +92…, mirrored to both columns.
    phone: normalizePakPhone(str(fd.get('phone'))) ?? '',
    whatsapp: normalizePakPhone(str(fd.get('phone'))),
    email: str(fd.get('email')),
    city: str(fd.get('city')) ?? '',
    district: str(fd.get('district')),
    interests: fd.getAll('interests').map((v) => String(v)),
    prev_volunteer_experience: str(fd.get('prev_volunteer_experience')),
    leadership_experience: str(fd.get('leadership_experience')),
    skill_social_media: str(fd.get('skill_social_media')),
    skill_design: str(fd.get('skill_design')),
    skill_public_speaking: str(fd.get('skill_public_speaking')),
    hours_per_week: num(fd.get('hours_per_week')),
    willing_to_travel: yesNo(fd.get('willing_to_travel')),
    willing_to_lead: yesNo(fd.get('willing_to_lead')),
    motivation_join: str(fd.get('motivation_join')),
    motivation_activism: str(fd.get('motivation_activism')),
    unique_contribution: str(fd.get('unique_contribution')),
    agree_policies: checked(fd, 'agree_policies'),
    commit_voluntary: checked(fd, 'commit_voluntary'),
    source: 'web',
    ...(Object.keys(extras).length ? { metadata: extras } : {}),
  } as VolunteerInsert;
}

// ── Partner ─────────────────────────────────────────────────────────────────
const PARTNER_FIELDS = [
  'org_name', 'org_type', 'reg_number', 'year_established', 'license_number', 'address',
  'city', 'province', 'phone', 'email', 'website', 'focal_name', 'focal_designation',
  'focal_phone', 'focal_email', 'has_screening', 'provides_without_replacement',
  'monthly_blood_volume', 'partnership_types', 'confirm_legal', 'confirm_transparency',
  'confirm_no_misuse', 'registration_certificate', 'mou_file',
];

export function partnerFromForm(fd: FormData): PartnerInsert {
  const extras = collectExtras(fd, PARTNER_FIELDS);
  return {
    org_name: str(fd.get('org_name')) ?? '',
    org_type: (str(fd.get('org_type')) ?? 'other') as PartnerType,
    reg_number: str(fd.get('reg_number')),
    year_established: str(fd.get('year_established')),
    license_number: str(fd.get('license_number')),
    address: str(fd.get('address')),
    city: str(fd.get('city')),
    province: str(fd.get('province')),
    phone: str(fd.get('phone')),
    email: str(fd.get('email')),
    website: str(fd.get('website')),
    focal_name: str(fd.get('focal_name')),
    focal_designation: str(fd.get('focal_designation')),
    focal_phone: normalizePakPhone(str(fd.get('focal_phone'))),
    focal_email: str(fd.get('focal_email')),
    has_screening: yesNo(fd.get('has_screening')),
    provides_without_replacement: yesNo(fd.get('provides_without_replacement')),
    monthly_blood_volume: str(fd.get('monthly_blood_volume')),
    partnership_types: fd.getAll('partnership_types').map((v) => String(v)),
    confirm_legal: checked(fd, 'confirm_legal'),
    confirm_transparency: checked(fd, 'confirm_transparency'),
    confirm_no_misuse: checked(fd, 'confirm_no_misuse'),
    source: 'web',
    ...(Object.keys(extras).length ? { metadata: extras } : {}),
  } as PartnerInsert;
}

// ── Blood request (public "Request Blood" form) ───────────────────────────────
const REQUEST_FIELDS = [
  'patient_name', 'requester_name', 'requester_phone', 'requester_whatsapp',
  'blood_group', 'units_needed', 'urgency', 'hospital_name', 'city', 'needed_by', 'notes',
];

export function requesterFromForm(fd: FormData): BloodRequestInsert {
  const units = num(fd.get('units_needed'));
  const neededBy = str(fd.get('needed_by'));
  const extras = collectExtras(fd, REQUEST_FIELDS);

  return {
    requester_name: str(fd.get('requester_name')) ?? '',
    // Combined contact/WhatsApp field, normalized to +92…, mirrored to both columns.
    requester_phone: normalizePakPhone(str(fd.get('requester_phone'))) ?? '',
    requester_whatsapp: normalizePakPhone(str(fd.get('requester_phone'))),
    patient_name: str(fd.get('patient_name')),
    blood_group: (str(fd.get('blood_group')) ?? '') as BloodGroup,
    units_needed: units && units > 0 ? units : 1,
    urgency: (str(fd.get('urgency')) ?? 'urgent') as BloodRequestInsert['urgency'],
    hospital_name: str(fd.get('hospital_name')),
    city: str(fd.get('city')),
    notes: str(fd.get('notes')),
    // status / created_via / hospital_id are forced by the DB intake trigger.
    ...(neededBy ? { expires_at: new Date(neededBy).toISOString() } : {}),
    ...(Object.keys(extras).length ? { metadata: extras } : {}),
  } as BloodRequestInsert;
}

/**
 * Insert a public registration. Returns a friendly result; never throws.
 *
 * Direct anon INSERT — each public table has an INSERT-only RLS policy and a
 * BEFORE-INSERT intake trigger that forces safe values (status, created_via,
 * etc.), so the client cannot self-activate or tamper with privileged fields.
 */
export async function insertRegistration(
  table: 'donors' | 'volunteers' | 'partners' | 'blood_requests',
  payload: DonorInsert | VolunteerInsert | PartnerInsert | BloodRequestInsert,
): Promise<SubmitResult> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase.from(table).insert(payload as any);
  if (error) {
    if (error.code === '23505') {
      return { ok: false, error: 'This phone number is already registered.' };
    }
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
