import Image from "next/image";

/**
 * The Hanubees mark — an isometric parcel with wings.
 *
 * One asset, used at every size: header, sidebar, footer, icons, and as the
 * source image for the liquid-metal treatment on the landing page. It is
 * full-colour artwork, so it is never tinted by a text colour the way the old
 * single-path glyph was.
 */

const RATIO = 706 / 622;

export function Logo({
  size = 28,
  className = "",
  priority = false,
}: {
  /** Rendered height in px; width follows the artwork's ratio. */
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/bee.png"
      alt=""
      width={Math.round(size * RATIO)}
      height={size}
      priority={priority}
      className={`shrink-0 select-none ${className}`}
      style={{ height: size, width: "auto" }}
    />
  );
}

/** Mark plus wordmark, the standard lockup for headers. */
export function Wordmark({
  size = 28,
  className = "",
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <Logo size={size} priority={priority} />
      <span className="text-[15px] font-semibold tracking-tight">Hanubees</span>
    </span>
  );
}
