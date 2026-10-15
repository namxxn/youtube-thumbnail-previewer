interface IconProps {
  className?: string;
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 6h18M3 12h18M3 18h18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function YouTubeLogo({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 90 20" fill="none" aria-hidden="true">
      <rect x="0" y="1" width="28" height="18" rx="5" fill="#FF0000" />
      <path d="M11 6l7 4-7 4V6z" fill="#fff" />
      <text
        x="33"
        y="15"
        fontFamily="Roboto, Arial, sans-serif"
        fontSize="15"
        fontWeight="700"
        fill="currentColor"
      >
        Preview
      </text>
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function MicIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" />
      <path
        d="M5 11a7 7 0 0014 0M12 18v3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CreateIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function BellIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 9a6 6 0 0112 0c0 5 1.5 6 2 7H4c.5-1 2-2 2-7z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M10 20a2 2 0 004 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function HomeIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 11l8-6 8 6v8a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-8z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShortsIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="6"
        y="3"
        width="12"
        height="18"
        rx="5"
        transform="rotate(18 12 12)"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M11 9.5l4 2.3-4 2.3V9.5z" fill="currentColor" />
    </svg>
  );
}

export function SubscriptionsIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 7h12M4 11h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="4" y="14" width="16" height="7" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11 16l3 1.5-3 1.5V16z" fill="currentColor" />
    </svg>
  );
}

export function LibraryIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h10M4 11h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M4 15h7M17 8v11l4-2.5V5.5L17 8z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HistoryIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12a8 8 0 108-8 8 8 0 00-6 2.7M4 4v3h3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
