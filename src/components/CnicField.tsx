import { useState } from 'react';
import { formatCnic } from '../lib/validation';

interface CnicFieldProps {
  name: string;
  required?: boolean;
  defaultValue?: string;
}

/**
 * Pakistani CNIC input that auto-formats to 00000-0000000-0 as the user types
 * and caps at 13 digits. Stored with dashes; validation strips them.
 */
export default function CnicField({ name, required, defaultValue = '' }: CnicFieldProps) {
  const [val, setVal] = useState(formatCnic(defaultValue));
  return (
    <input
      name={name}
      required={required}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      placeholder="00000-0000000-0"
      value={val}
      onChange={(e) => setVal(formatCnic(e.target.value))}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none"
    />
  );
}
