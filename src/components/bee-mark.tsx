/**
 * The Hanubees mark, traced to vector from the artwork.
 *
 * Every path here was extracted from bee.png by tracing its flat colour
 * regions, then simplified — 96.5% of pixels match the original, and the whole
 * mark is ~3 KB of path data instead of 30 KB of sprites. Being vector, it is
 * sharp at any size and every part animates on its own, which the PNG layers
 * could not do without leaving fill artefacts behind them.
 *
 * Colours are CSS variables so a single token change restyles the mark.
 */
export function BeeMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 706 622"
      className={className}
      role="img"
      aria-label="Hanubees"
      shapeRendering="geometricPrecision"
    >
      <g className="bee-body">
        <path d="M313,144 L364,123 L370,119 L376,119 L524,189 L551,200 L551,202 L553,201 L591,220 L594,220 L594,251 L580,245 L557,257 L551,258 L524,244 L523,242 L518,241 L517,239 L489,226 L486,223 L478,227 L467,223 L466,221 L463,221 L363,170 L348,164 L343,160 L338,159 L337,157 L315,147 L313,144Z" fill="var(--bee-shade)" />
        <path d="M511,333 L524,329 L529,333 L532,333 L533,335 L579,358 L595,351 L594,479 L514,519 L512,519 L511,333Z" fill="var(--bee-shade)" />
        <path d="M400,321 L401,562 L400,321Z" fill="var(--bee-shade)" />
        <path d="M462,334 L464,334 L464,544 L462,544 L462,334Z" fill="var(--bee-shade)" />
        <path d="M302,461 L303,587 L302,461Z" fill="var(--bee-shade)" />
        <path d="M64,234 L184,182 L193,188 L200,190 L207,195 L210,195 L219,201 L222,201 L315,248 L316,250 L321,251 L370,276 L369,278 L365,279 L366,286 L390,297 L391,299 L394,299 L395,301 L400,302 L399,576 L394,577 L346,602 L254,602 L227,588 L224,588 L214,582 L211,582 L188,570 L133,546 L111,534 L67,515 L67,483 L131,512 L133,512 L133,487 L132,400 L65,369 L65,319 L77,316 L92,309 L92,271 L88,271 L64,280 L64,234Z" fill="var(--bee-yellow)" />
        <path d="M463,335 L487,347 L490,344 L512,334 L512,519 L465,543 L463,543 L463,335Z" fill="var(--bee-yellow)" />
        <path d="M264,168 L314,145 L315,147 L337,157 L338,159 L343,160 L348,164 L363,170 L476,227 L434,247 L423,250 L418,246 L411,244 L402,238 L348,212 L347,210 L344,210 L265,170 L264,168Z" fill="var(--bee-yellow)" />
        <path d="M400,317 L401,304 L403,304 L462,334 L462,544 L402,574 L400,568 L400,317Z" fill="var(--bee-black)" />
        <path d="M209,193 L264,169 L403,239 L404,241 L417,246 L424,251 L372,276 L369,276 L262,222 L261,220 L223,201 L220,201 L219,199 L209,195 L209,193Z" fill="var(--bee-black)" />
        <path d="M91,322 L156,298 L156,337 L129,346 L117,352 L113,352 L93,361 L91,347 L91,322Z" fill="var(--bee-black)" />
        <path d="M168,348 L231,323 L231,362 L171,386 L168,386 L168,348Z" fill="var(--bee-black)" />
        <path d="M215,476 L249,492 L255,493 L255,440 L302,461 L302,587 L218,547 L215,547 L215,476Z" fill="var(--bee-black)" />
        <path d="M65,370 L88,379 L92,383 L91,430 L132,448 L132,511 L120,507 L104,498 L67,482 L65,370Z" fill="var(--bee-black)" />
        <path d="M215,422 L253,439 L251,442 L254,446 L254,491 L251,492 L249,489 L246,490 L239,487 L237,484 L235,485 L235,483 L233,484 L232,481 L229,482 L229,480 L227,481 L227,479 L225,480 L225,478 L221,476 L215,476 L215,422Z" fill="var(--bee-sky)" />
        <path d="M92,401 L93,383 L131,400 L131,445 L130,439 L128,442 L129,444 L127,444 L122,441 L109,438 L109,436 L107,437 L105,434 L102,435 L100,432 L98,433 L98,431 L93,429 L92,401Z" fill="var(--bee-sky)" />
      </g>

      <g className="bee-antenna">
        <path d="M21,296 L91,271 L91,310 L31,331 L24,335 L21,335 L21,296Z" fill="var(--bee-black)" />
      </g>

      <g className="bee-wing bee-wing-back">
        <path d="M87,70 L131,49 L150,42 L194,20 L199,20 L313,79 L313,86 L278,101 L279,103 L300,113 L308,119 L313,120 L313,127 L294,134 L294,136 L312,144 L312,146 L265,166 L262,169 L211,193 L205,193 L184,182 L192,178 L192,176 L159,158 L121,134 L115,132 L106,125 L93,119 L93,113 L95,111 L126,98 L126,96 L89,78 L87,76 L87,70Z" fill="var(--bee-sky)" />
      </g>

      <g className="bee-wing bee-wing-front">
        <path d="M365,280 L380,271 L383,271 L395,264 L398,264 L423,251 L426,251 L486,223 L489,226 L517,239 L518,241 L523,242 L524,244 L551,258 L557,257 L581,245 L684,295 L686,297 L686,307 L612,344 L579,358 L533,335 L532,333 L529,333 L524,329 L520,329 L493,343 L490,343 L488,346 L485,346 L484,344 L473,340 L464,334 L460,334 L459,332 L423,315 L418,311 L415,311 L401,302 L367,286 L365,284 L365,280Z" fill="var(--bee-sky)" />
      </g>
    </svg>
  );
}
