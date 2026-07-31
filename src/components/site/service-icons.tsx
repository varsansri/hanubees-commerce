import type { SVGProps } from "react";

/**
 * One glyph per service, drawn rather than borrowed.
 *
 * Same stroke weight and joins as the interface icon set, but on a 32px grid
 * and built from the isometric world's own shapes — boxes seen from a corner,
 * stacked faces, a parcel. They sit inside the coloured block, so they inherit
 * its ink.
 */

function Glyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-8 shrink-0"
      aria-hidden
      {...props}
    />
  );
}

/** A browser window, seen straight on: the one thing everyone recognises. */
const WebsitesGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <rect x="3" y="6" width="26" height="20" rx="2.5" />
    <path d="M3 12h26" />
    <circle cx="7" cy="9" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="10.5" cy="9" r="0.9" fill="currentColor" stroke="none" />
    <path d="M8 17h7M8 21h11" />
  </Glyph>
);

/** Two panels and a control — an admin, from above. */
const WebAppsGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <rect x="3" y="5" width="26" height="22" rx="2.5" />
    <path d="M12 5v22" />
    <path d="M16 11h9M16 16h9M16 21h5" />
    <path d="M6.5 10h2.5M6.5 14h2.5M6.5 18h2.5" />
  </Glyph>
);

/** A parcel seen at the isometric angle, the way the logo sees one. */
const EcommerceGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <path d="M16 4 28 10.5v11L16 28 4 21.5v-11L16 4Z" />
    <path d="M4 10.5 16 17l12-6.5M16 17v11" />
    <path d="M10 7.2 22 13.8" />
  </Glyph>
);

/** A phone, with the thumb's reach marked. */
const MobileGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <rect x="9" y="3" width="14" height="26" rx="3" />
    <path d="M13.5 6.5h5" />
    <path d="M12.5 24.5h7" />
    <path d="M12.5 11h7M12.5 15h4" />
  </Glyph>
);

/** A node with what it reaches, and the spark that decides. */
const AiGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <circle cx="16" cy="16" r="4.5" />
    <path d="M16 4v7M16 21v7M4 16h7M21 16h7" />
    <circle cx="16" cy="4" r="1.6" />
    <circle cx="4" cy="16" r="1.6" />
    <circle cx="28" cy="16" r="1.6" />
    <circle cx="16" cy="28" r="1.6" />
  </Glyph>
);

/** A shield around a heartbeat: something live, being watched. */
const CareGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <path d="M16 3.5 27 7.5v8c0 6.4-4.5 11.4-11 13.5C9.5 26.9 5 21.9 5 15.5v-8L16 3.5Z" />
    <path d="M9.5 16.5h3l2-3.5 2.5 6 2-2.5h3.5" />
  </Glyph>
);

export const SERVICE_GLYPH: Record<
  string,
  ((p: SVGProps<SVGSVGElement>) => React.ReactElement) | undefined
> = {
  websites: WebsitesGlyph,
  "web-apps": WebAppsGlyph,
  ecommerce: EcommerceGlyph,
  mobile: MobileGlyph,
  ai: AiGlyph,
  care: CareGlyph,
};

export function ServiceGlyph({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const Component = SERVICE_GLYPH[slug];
  return Component ? <Component className={className} /> : null;
}
