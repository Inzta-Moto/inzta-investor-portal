import Image from "next/image";

/** The orange Z mark from the internal dashboard (`public/logo.png` there), the only logo used in the portal. */
export function LogoMark({ size = 32, decorative = false }: { size?: number; decorative?: boolean }) {
  return (
    <Image
      src="/brand/inzta-mark.png"
      alt={decorative ? "" : "Logo Inzta"}
      width={size}
      height={size}
      className="shrink-0"
      priority={!decorative}
    />
  );
}
