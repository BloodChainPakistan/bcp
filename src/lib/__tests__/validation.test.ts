import { describe, it, expect } from 'vitest';
import {
  digitsOnly, isValidPakPhone, validateBloodRequest, MAX_UNITS,
  normalizePakPhone, localPakDigits, isValidCnic, formatCnic,
} from '../validation';

describe('digitsOnly', () => {
  it('strips spaces, dashes and plus signs', () => {
    expect(digitsOnly('+92 314-996 7653')).toBe('923149967653');
  });
  it('is null-safe', () => {
    expect(digitsOnly(undefined as unknown as string)).toBe('');
  });
});

describe('isValidPakPhone', () => {
  it('accepts local 03XXXXXXXXX form', () => {
    expect(isValidPakPhone('03001234567')).toBe(true);
    expect(isValidPakPhone('0300-123 4567')).toBe(true);
  });
  it('accepts international 92/+92 form', () => {
    expect(isValidPakPhone('923001234567')).toBe(true);
    expect(isValidPakPhone('+92 300 1234567')).toBe(true);
  });
  it('rejects too short / wrong-prefix numbers', () => {
    expect(isValidPakPhone('12345')).toBe(false);
    expect(isValidPakPhone('0400123456')).toBe(false);
    expect(isValidPakPhone('')).toBe(false);
  });
});

describe('normalizePakPhone', () => {
  it('normalizes every accepted form to +92XXXXXXXXXX', () => {
    expect(normalizePakPhone('03001234567')).toBe('+923001234567');
    expect(normalizePakPhone('3001234567')).toBe('+923001234567');
    expect(normalizePakPhone('923001234567')).toBe('+923001234567');
    expect(normalizePakPhone('+92 300 1234567')).toBe('+923001234567');
    expect(normalizePakPhone('0092 300 1234567')).toBe('+923001234567');
  });
  it('returns null for invalid numbers', () => {
    expect(normalizePakPhone('12345')).toBeNull();
    expect(normalizePakPhone('0400123456')).toBeNull();
    expect(normalizePakPhone('')).toBeNull();
    expect(normalizePakPhone(null)).toBeNull();
  });
});

describe('localPakDigits (the +92 field strips the leading 0 every way)', () => {
  it('reduces any input to the 10 local digits, dropping a leading 0', () => {
    expect(localPakDigits('3358043653')).toBe('3358043653');
    expect(localPakDigits('03358043653')).toBe('3358043653');
    expect(localPakDigits('0335 8043653')).toBe('3358043653');
    expect(localPakDigits('+92 335 8043653')).toBe('3358043653');
    expect(localPakDigits('923358043653')).toBe('3358043653');
    expect(localPakDigits('0092 335 8043653')).toBe('3358043653');
  });
});

describe('CNIC', () => {
  it('validates 13-digit CNICs with or without dashes', () => {
    expect(isValidCnic('17301-1234567-1')).toBe(true);
    expect(isValidCnic('1730112345671')).toBe(true);
    expect(isValidCnic('12345')).toBe(false);
    expect(isValidCnic('')).toBe(false);
  });
  it('auto-formats to 00000-0000000-0 as digits are entered', () => {
    expect(formatCnic('17301')).toBe('17301');
    expect(formatCnic('173011234567')).toBe('17301-1234567');
    expect(formatCnic('1730112345671')).toBe('17301-1234567-1');
    expect(formatCnic('17301-1234567-1')).toBe('17301-1234567-1');
  });
});

describe('validateBloodRequest', () => {
  const valid = {
    requester_name: 'Ali Nawaz',
    requester_phone: '03001234567',
    blood_group: 'O+',
    units_needed: 2,
    city: 'Peshawar',
    hospital_name: 'Lady Reading Hospital',
  };

  it('returns no errors for a complete valid request', () => {
    expect(validateBloodRequest(valid)).toEqual({});
  });

  it('flags a missing name and bad phone', () => {
    const errs = validateBloodRequest({ ...valid, requester_name: 'A', requester_phone: 'abc' });
    expect(errs.requester_name).toBeTruthy();
    expect(errs.requester_phone).toBeTruthy();
  });

  it('rejects out-of-range and non-integer units', () => {
    expect(validateBloodRequest({ ...valid, units_needed: 0 }).units_needed).toBeTruthy();
    expect(validateBloodRequest({ ...valid, units_needed: MAX_UNITS + 1 }).units_needed).toBeTruthy();
    expect(validateBloodRequest({ ...valid, units_needed: 1.5 }).units_needed).toBeTruthy();
  });

  it('requires city and hospital for matching', () => {
    const errs = validateBloodRequest({ ...valid, city: '', hospital_name: '' });
    expect(errs.city).toBeTruthy();
    expect(errs.hospital_name).toBeTruthy();
  });
});
