import { useEffect, useState } from 'react';

/** Droplet path on a 0 0 24 24 viewBox (point up, rounded bottom). */
const DROP_PATH = 'M12 2.5 C12 2.5 5 11 5 16 a7 7 0 0 0 14 0 C19 11 12 2.5 12 2.5 Z';

const MIN_VISIBLE_MS = 1100;

/**
 * Full-screen blood-drop loader shown on first paint. The drop "fills" with a
 * rising red rect clipped to the droplet shape, then the overlay fades out once
 * the window has loaded (and at least MIN_VISIBLE_MS has passed so it never
 * flickers on fast connections).
 */
export default function PageLoader() {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const start = performance.now();

    function dismiss() {
      const elapsed = performance.now() - start;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
      window.setTimeout(() => setHidden(true), wait);
    }

    if (document.readyState === 'complete') dismiss();
    else window.addEventListener('load', dismiss, { once: true });

    return () => window.removeEventListener('load', dismiss);
  }, []);

  // Unmount after the fade-out transition finishes.
  useEffect(() => {
    if (!hidden) return;
    const t = window.setTimeout(() => setRemoved(true), 550);
    return () => window.clearTimeout(t);
  }, [hidden]);

  if (removed) return null;

  return (
    <div className="bcp-loader" data-hidden={hidden} role="status" aria-live="polite" aria-label="Loading Blood Chain Pakistan">
      <div className="bcp-drop-wrap">
        <span className="bcp-ripple" />
        <span className="bcp-ripple bcp-ripple-2" />
        <svg className="bcp-drop-svg" viewBox="0 0 24 24" aria-hidden="true">
          <defs>
            <clipPath id="bcp-drop-clip">
              <path d={DROP_PATH} />
            </clipPath>
          </defs>
          {/* Empty (light) drop background */}
          <rect x="0" y="0" width="24" height="24" fill="#FBE0E1" clipPath="url(#bcp-drop-clip)" />
          {/* Rising red fill */}
          <rect className="bcp-drop-fill" x="0" y="0" width="24" height="24" fill="var(--color-bcp-red)" clipPath="url(#bcp-drop-clip)" />
          {/* Glossy highlight */}
          <ellipse cx="9.5" cy="13" rx="1.7" ry="2.7" fill="#fff" opacity="0.35" clipPath="url(#bcp-drop-clip)" transform="rotate(-20 9.5 13)" />
          {/* Outline */}
          <path d={DROP_PATH} fill="none" stroke="var(--color-bcp-red)" strokeWidth="1.1" strokeLinejoin="round" />
        </svg>
      </div>
      <svg className="bcp-pulse" viewBox="0 0 170 30" aria-hidden="true">
        <polyline points="0,15 62,15 70,5 78,26 86,15 96,15 102,10 108,20 114,15 170,15" />
      </svg>
      <span className="bcp-loader-text">Blood Chain Pakistan</span>
      <span className="bcp-loader-bar" aria-hidden="true">
        <span className="bcp-loader-bar-fill" />
      </span>
    </div>
  );
}
