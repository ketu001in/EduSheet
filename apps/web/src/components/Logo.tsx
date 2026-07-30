interface LogoProps {
  size?: number;
  className?: string;
}

// The Bosket's EduSheet mark: a graduation cap over a checked worksheet page,
// on a rounded tile. Kept to simple primitives (rect/line/circle/path/polygon)
// so the exact same geometry can be re-drawn with react-pdf's <Svg> primitives
// for the generated PDF header — see apps/api/src/services/pdfService.tsx.
export function Logo({ size = 32, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Bosket's EduSheet"
    >
      <rect width="32" height="32" rx="8" fill="url(#logo-tile)" />
      {/* Worksheet page */}
      <rect x="9" y="12.5" width="14" height="13.5" rx="1.6" fill="white" fillOpacity="0.96" />
      <line x1="11.6" y1="17" x2="18.5" y2="17" stroke="#1B2A6B" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
      <line x1="11.6" y1="20" x2="20.4" y2="20" stroke="#1B2A6B" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
      {/* Graduation cap */}
      <polygon points="16,4.2 27,9 16,13.8 5,9" fill="#E2963A" />
      <path d="M11 10.6V15C11 16.4 13.2 17.5 16 17.5C18.8 17.5 21 16.4 21 15V10.6" stroke="#E2963A" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <line x1="27" y1="9" x2="27" y2="14.5" stroke="#E2963A" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="27" cy="15.6" r="1.1" fill="#E2963A" />
      {/* Checkmark badge */}
      <circle cx="23.5" cy="23.5" r="5.4" fill="#2F8F6F" stroke="white" strokeWidth="1.3" />
      <path d="M21 23.6L22.8 25.4L26.2 21.7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <defs>
        <linearGradient id="logo-tile" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2F4CC7" />
          <stop offset="1" stopColor="#1B2A6B" />
        </linearGradient>
      </defs>
    </svg>
  );
}
