import { useFeature } from '../lib/featureFlags';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '923149967653';
const PREFILL = encodeURIComponent(
  "Hi Blood Chain Pakistan! I'd like to ask about blood donation.",
);

/**
 * Floating click-to-chat WhatsApp button (public site).
 * Opens a chat to the configured number. This is the interim step before the
 * automated WhatsApp Cloud API bot (which requires Meta Business onboarding).
 * Set VITE_WHATSAPP_NUMBER (digits only, international, e.g. 923149967653).
 */
export default function WhatsAppButton() {
  const enabled = useFeature('whatsapp_button');
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${PREFILL}`;
  if (!enabled) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-[60] group flex items-center gap-3"
    >
      <span className="hidden sm:block bg-white text-bcp-dark text-sm font-semibold px-4 py-2 rounded-full shadow-lg translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
        Chat with us
      </span>
      <span className="relative flex items-center justify-center">
        {/* Pulsing attention ring */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-60 motion-safe:animate-ping" />
        <span className="relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white flex items-center justify-center shadow-xl shadow-green-600/40 ring-4 ring-white/60 transition-transform duration-200 hover:scale-110 active:scale-95">
          <svg viewBox="0 0 32 32" className="w-8 h-8 fill-current" aria-hidden="true">
            <path d="M16.04 4C9.95 4 5 8.95 5 15.04c0 2.13.6 4.13 1.66 5.84L5 28l7.32-1.6a11 11 0 0 0 3.72.65h.01C22.14 27.05 27.09 22.1 27.09 16 27.09 8.95 22.13 4 16.04 4zm0 20.1h-.01c-1.1 0-2.18-.3-3.13-.86l-.22-.13-3.94.86.84-3.84-.15-.24a8.94 8.94 0 0 1-1.37-4.75c0-4.95 4.03-8.98 8.99-8.98 2.4 0 4.65.94 6.35 2.64a8.93 8.93 0 0 1 2.63 6.35c0 4.95-4.03 8.98-8.98 8.98zm4.93-6.73c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.72-1.34-1.6-1.5-1.87-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.46l-.52-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.35.98 2.66 1.12 2.84.14.18 1.93 2.95 4.68 4.14.65.28 1.16.45 1.56.58.65.21 1.25.18 1.72.11.52-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32z" />
          </svg>
        </span>
      </span>
    </a>
  );
}
