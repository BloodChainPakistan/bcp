import { useState } from 'react';
import { localPakDigits } from '../lib/validation';

interface PhoneFieldProps {
  name: string;
  required?: boolean;
  defaultValue?: string;
}

/**
 * Pakistani mobile input with a fixed +92 prefix. The user types only the 10
 * local digits (3XXXXXXXXX); a leading 0 is stripped automatically. FormData
 * carries those 10 digits and the forms layer (normalizePakPhone) prepends +92
 * on submit, so storage is always canonical +92XXXXXXXXXX.
 */
export default function PhoneField({ name, required, defaultValue = '' }: PhoneFieldProps) {
  const [val, setVal] = useState(localPakDigits(defaultValue));
  return (
    <>
      <div className="flex rounded-xl border border-gray-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-bcp-red transition-shadow">
        <span className="px-3 flex items-center bg-gray-50 text-gray-600 border-r border-gray-200 select-none text-sm font-medium">
          +92
        </span>
        <input
          name={name}
          required={required}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="3358043653"
          value={val}
          onChange={(e) => setVal(localPakDigits(e.target.value))}
          className="flex-1 min-w-0 px-4 py-3 outline-none bg-transparent"
        />
      </div>
      <p className="mt-1 text-xs text-gray-400">Enter without the leading 0 — e.g. 3358043653</p>
    </>
  );
}
