/**
 * Spam honeypot. A real human never sees or fills this field (it's pushed
 * off-screen and hidden from assistive tech); many bots fill every input they
 * find. Forms check `isHoneypotFilled(formData)` and silently drop the
 * submission when it's non-empty. Zero friction for real users.
 */
export const HONEYPOT_FIELD = 'fax';

export function isHoneypotFilled(fd: FormData): boolean {
  return String(fd.get(HONEYPOT_FIELD) || '').trim() !== '';
}

export default function Honeypot() {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: 0, width: 1, height: 1, overflow: 'hidden' }}>
      <label>
        Leave this field empty
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
