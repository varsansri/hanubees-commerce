import Image from "next/image";

/**
 * The animated Hanubees mark, in 2D.
 *
 * The logo is cut into three layers taken straight from the artwork — body,
 * back wing, front wing — so every pixel is yours; nothing here is redrawn or
 * reconstructed. Layer geometry is measured, not eyeballed: each wing is placed
 * by the bounding box it occupies in the source file.
 *
 * All CSS transforms, so it runs on any device with no WebGL, no canvas and no
 * JavaScript. That is the whole reason this beats the 3D version — the 3D only
 * ran where WebGL did, and it never carried the logo's real colours.
 *
 * Wings rotate about the end that meets the body, so the joint stays put while
 * the tip travels, the way a real wing hinges.
 */

const FRAME = { w: 706, h: 622 };
const pc = (n: number, total: number) => `${(n / total) * 100}%`;

const WINGS = [
  // back wing — hinges at its lower-right, where it meets the box
  {
    src: "/bee-wing-0.png",
    x: 87,
    y: 20,
    w: 226,
    h: 173,
    origin: "88% 92%",
    cls: "bee-wing-back",
  },
  // front wing — hinges at its left edge, against the box side
  {
    src: "/bee-wing-1.png",
    x: 365,
    y: 223,
    w: 321,
    h: 135,
    origin: "6% 42%",
    cls: "bee-wing-front",
  },
];

export function Bee2D({
  size = 320,
  className = "",
  priority = false,
}: {
  /** Rendered width in px; height follows the artwork's ratio. */
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`bee-stage relative select-none ${className}`}
      style={{ width: size, height: (size * FRAME.h) / FRAME.w }}
      role="img"
      aria-label="Hanubees"
    >
      <div className="bee-hover absolute inset-0">
        <Image
          src="/bee-body.png"
          alt=""
          width={FRAME.w}
          height={FRAME.h}
          priority={priority}
          className="absolute inset-0 size-full"
        />

        {WINGS.map((w) => (
          <Image
            key={w.src}
            src={w.src}
            alt=""
            width={w.w}
            height={w.h}
            priority={priority}
            className={`absolute ${w.cls}`}
            style={{
              left: pc(w.x, FRAME.w),
              top: pc(w.y, FRAME.h),
              width: pc(w.w, FRAME.w),
              height: pc(w.h, FRAME.h),
              transformOrigin: w.origin,
            }}
          />
        ))}
      </div>

      {/* Contact shadow, counter-timed to the hover — it is what sells the lift */}
      <span className="bee-shadow" aria-hidden />
    </div>
  );
}
