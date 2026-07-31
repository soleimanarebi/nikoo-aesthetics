/**
 * Standard floating WhatsApp contact button, fixed to the bottom-right
 * corner on every page. Update WHATSAPP_NUMBER (international format,
 * digits only, no leading + or 00) to change the destination — it's the
 * only thing that needs editing if the number ever changes.
 */
const WHATSAPP_NUMBER = "447496800655";

function WhatsAppIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16.004 3C9.007 3 3.334 8.66 3.334 15.64c0 2.29.605 4.44 1.75 6.33L3 29l7.2-2.06a12.66 12.66 0 0 0 5.8 1.41h.005c6.996 0 12.67-5.66 12.67-12.64C28.675 8.72 23.001 3 16.004 3Z"
        fill="#25D366"
      />
      <path
        d="M22.1 19.02c-.33-.17-1.95-.96-2.25-1.07-.3-.11-.52-.17-.74.17-.22.33-.85 1.07-1.04 1.29-.19.22-.38.24-.71.08-.33-.17-1.4-.51-2.66-1.63-.98-.87-1.65-1.95-1.84-2.28-.19-.33-.02-.5.15-.67.15-.15.33-.39.5-.58.17-.2.22-.33.33-.55.11-.22.06-.42-.03-.58-.08-.17-.74-1.77-1.02-2.43-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.58.08-.88.42-.3.33-1.15 1.12-1.15 2.73s1.18 3.16 1.34 3.38c.17.22 2.32 3.53 5.61 4.95.78.34 1.4.54 1.87.69.79.25 1.5.21 2.07.13.63-.09 1.95-.79 2.22-1.56.27-.76.27-1.42.19-1.56-.08-.13-.3-.21-.63-.38Z"
        fill="#FFF"
      />
    </svg>
  );
}

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[#25D366] shadow-soft flex items-center justify-center hover:scale-105 transition-transform duration-300"
    >
      <WhatsAppIcon />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
