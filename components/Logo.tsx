import Image from "next/image";

export function LogoMark({
  size = 28,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-block overflow-hidden rounded-md ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/myellelab-logo.svg"
        width={size}
        height={size}
        alt="MyElleLab logo"
        priority
      />
    </span>
  );
}
