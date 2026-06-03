export function LogoMark({
  size = 28,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 180 180"
      className={className}
      aria-hidden
    >
      <rect width="180" height="180" rx="32" ry="32" fill="#ffffff" />
      <g fill="currentColor" stroke="currentColor">
        <rect x="34" y="35" width="14" height="110" />
        <rect x="70" y="35" width="14" height="110" />
        <path
          d="M 41 35 L 59 107 L 77 35"
          fill="none"
          strokeWidth="14"
          strokeLinejoin="round"
          strokeLinecap="butt"
        />
        <path
          d="M 103 35 L 121 90 L 139 35"
          fill="none"
          strokeWidth="14"
          strokeLinejoin="round"
          strokeLinecap="butt"
        />
        <rect x="114" y="83" width="14" height="62" />
      </g>
    </svg>
  );
}
