import { describe, it, expect } from 'vitest';
import { donorFromForm, volunteerFromForm, partnerFromForm } from '../forms';

function fd(obj: Record<string, string | string[]>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(obj)) {
    if (Array.isArray(v)) v.forEach((x) => f.append(k, x));
    else f.set(k, v);
  }
  return f;
}

describe('donorFromForm', () => {
  it('maps core fields and normalizes gender', () => {
    const d = donorFromForm(
      fd({ full_name: 'Ali', blood_group: 'O+', phone_primary: '03001234567', city: 'Peshawar', gender: 'Male' }),
    );
    expect(d.full_name).toBe('Ali');
    expect(d.blood_group).toBe('O+');
    expect(d.phone).toBe('+923001234567'); // normalized to canonical +92 form
    expect(d.whatsapp).toBe('+923001234567'); // mirrored from the same field
    expect(d.city).toBe('Peshawar');
    expect(d.gender).toBe('male');
    expect(d.source).toBe('web');
  });

  it('records consent_at only when all three consents are present', () => {
    const none = donorFromForm(fd({ full_name: 'A', blood_group: 'A+', phone_primary: '1', city: 'X' }));
    expect(none.consent_at).toBeUndefined();
    const all = donorFromForm(
      fd({
        full_name: 'A', blood_group: 'A+', phone_primary: '1', city: 'X',
        consent_accuracy: 'on', consent_voluntary: 'on', consent_contact: 'on',
      }),
    );
    expect(all.consent_at).toBeTruthy();
    expect(all.consent_contact).toBe(true);
  });

  it('maps Yes/No radios to booleans and female screening to lowercase', () => {
    const d = donorFromForm(
      fd({ full_name: 'A', blood_group: 'A+', phone_primary: '1', city: 'X', chronic_disease: 'No', female_screening: 'N/A' }),
    );
    expect(d.chronic_disease).toBe(false);
    expect(d.female_pregnant_or_breastfeeding).toBe('na');
  });
});

describe('volunteerFromForm', () => {
  it('collects multi-select interests as an array', () => {
    const v = volunteerFromForm(
      fd({ full_name: 'V', phone: '1', city: 'X', interests: ['Fundraising', 'Event Management'] }),
    );
    expect(v.interests).toEqual(['Fundraising', 'Event Management']);
    expect(v.agree_policies).toBe(false);
  });
});

describe('partnerFromForm', () => {
  it('defaults org_type to "other" and reads partnership types', () => {
    const p = partnerFromForm(fd({ org_name: 'Org', partnership_types: ['a', 'b'] }));
    expect(p.org_name).toBe('Org');
    expect(p.org_type).toBe('other');
    expect(p.partnership_types).toEqual(['a', 'b']);
  });
});
