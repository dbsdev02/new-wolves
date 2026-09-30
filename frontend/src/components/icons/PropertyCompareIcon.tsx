interface Props {
  className?: string;
  strokeWidth?: number;
}

// Custom recreation of the reference icon: a balance scale weighing two
// properties (house + $) against each other — no standard icon library
// (Heroicons, Font Awesome, etc.) has this exact composite design.
export function PropertyCompareIcon({ className, strokeWidth = 4 }: Props) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {/* pivot */}
        <circle cx="50" cy="16" r="7" />
        {/* beam */}
        <line x1="30" y1="24" x2="70" y2="24" />
        {/* strings down to each house's roof peak */}
        <line x1="34" y1="24" x2="22" y2="44" />
        <line x1="46" y1="24" x2="34" y2="44" />
        <line x1="54" y1="24" x2="66" y2="44" />
        <line x1="66" y1="24" x2="78" y2="44" />
        {/* houses */}
        <path d="M14 44 L28 31 L42 44 L42 67 L14 67 Z" />
        <path d="M58 44 L72 31 L86 44 L86 67 L58 67 Z" />
        {/* stem + base */}
        <line x1="50" y1="23" x2="50" y2="83" />
        <path d="M32 91 L68 91 L60 83 L40 83 Z" />
      </g>
      <text x="28" y="61" fontSize="17" textAnchor="middle" fill="currentColor" fontFamily="system-ui, sans-serif" fontWeight="600">$</text>
      <text x="72" y="61" fontSize="17" textAnchor="middle" fill="currentColor" fontFamily="system-ui, sans-serif" fontWeight="600">$</text>
    </svg>
  );
}
