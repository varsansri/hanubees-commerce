import { BeeMark } from "../bee-mark";

/**
 * The animated Hanubees mark.
 *
 * Vector, not sprites: the mark is traced from the artwork so it is sharp at
 * any size, weighs ~3 KB, and every part transforms on its own — no fill
 * artefacts behind moving layers, which is what the PNG version suffered from.
 *
 * Motion is CSS transforms only, so it runs on the compositor thread, needs no
 * JavaScript, and ships inside the prerendered HTML. GSAP and Lottie were
 * considered and rejected: GSAP earns its 30 KB on complex timelines, and
 * Lottie means authoring the animation in After Effects. Neither buys anything
 * for a hover and a wingbeat.
 */
export function Bee2D({
  size = 340,
  className = "",
}: {
  /** Rendered width in px; height follows the artwork's 706:622 ratio. */
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`bee-stage relative select-none ${className}`}
      style={{ width: size, height: (size * 622) / 706 }}
    >
      <BeeMark className="relative block size-full overflow-visible" />
      {/* Contact shadow, counter-timed to the hover — this sells the lift */}
      <span className="bee-shadow" aria-hidden />
    </div>
  );
}
