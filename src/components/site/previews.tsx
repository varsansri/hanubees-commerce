/**
 * Project previews.
 *
 * Each one is a small working rendition of the real interface — a browser
 * frame around an admin, a phone running the camera screen, a storefront with
 * its product row moving — drawn in CSS and animated on a loop. Nothing here is
 * a screenshot and nothing is stock: the same reason product imagery on this
 * platform is generated, not photographed.
 *
 * They are decorative, so every one is hidden from assistive technology; the
 * card around it carries the name and the link.
 */

const DOTS = ["bg-iso-yellow", "bg-iso-sky", "bg-iso-black/25"];

function Chrome({
  host,
  children,
  dark = false,
}: {
  host: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden ${dark ? "bg-iso-black" : "bg-iso-white"}`}
    >
      <div
        className={`flex h-[9%] items-center gap-[1%] border-b-2 border-iso-black px-[2%] ${
          dark ? "bg-white/5" : "bg-black/[0.04]"
        }`}
      >
        {DOTS.map((d) => (
          <span key={d} className={`aspect-square h-[38%] rounded-full ${d}`} />
        ))}
        <span
          className={`ml-[2%] flex h-[52%] w-[46%] items-center rounded-full px-[2%] font-mono text-[0.5rem] leading-none ${
            dark ? "bg-white/10 text-white/60" : "bg-black/[0.06] text-iso-black/50"
          }`}
        >
          {host}
        </span>
      </div>
      <div className="relative h-[91%]">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------ Hanubees Commerce */

const BARS = [46, 68, 40, 84, 58, 92, 71, 55];

function CommercePreview() {
  return (
    <Chrome host="hanubees.com/admin">
      <div className="flex h-full">
        {/* sidebar */}
        <div className="flex h-full w-[17%] flex-col gap-[6%] bg-iso-black p-[4%]">
          <span className="h-[6%] w-[70%] rounded-full bg-iso-yellow" />
          {[70, 55, 62, 48, 58, 44].map((w, i) => (
            <span
              key={i}
              className="h-[4%] rounded-full bg-white/25"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>

        {/* main */}
        <div className="flex h-full flex-1 flex-col gap-[3%] p-[3%]">
          <div className="flex items-center gap-[2%]">
            <span className="h-[7px] w-[22%] rounded-full bg-iso-black/70" />
            <span className="ml-auto h-[9px] w-[16%] rounded-[3px] border border-iso-black bg-iso-yellow" />
          </div>

          <div className="flex gap-[2.5%]">
            {["bg-iso-yellow", "bg-iso-sky", "bg-iso-white"].map((tone, i) => (
              <div
                key={i}
                className={`flex flex-1 flex-col gap-[6px] rounded-[3px] border border-iso-black p-[5%] ${tone}`}
              >
                <span className="h-[4px] w-[60%] rounded-full bg-iso-black/30" />
                <span className="h-[7px] w-[45%] rounded-full bg-iso-black/70" />
              </div>
            ))}
          </div>

          {/* chart */}
          <div className="flex flex-1 items-end gap-[2%] rounded-[3px] border border-iso-black p-[3%]">
            {BARS.map((h, i) => (
              <span
                key={i}
                className={`anim-bar flex-1 rounded-[2px] ${
                  i === 5 ? "bg-iso-yellow" : "bg-iso-sky"
                }`}
                style={{ height: `${h}%`, animationDelay: `${i * 140}ms` }}
              />
            ))}
          </div>

          {/* orders, scrolling slowly */}
          <div className="h-[26%] overflow-hidden rounded-[3px] border border-iso-black">
            <div className="marquee-y" style={{ ["--marquee-dur" as string]: "16s" }}>
              {[0, 1].map((copy) => (
                <div key={copy}>
                  {[70, 52, 61, 44, 66, 49].map((w, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-[3%] border-b border-iso-black/15 px-[3%] py-[4px]"
                    >
                      <span className="size-[5px] rounded-full bg-iso-yellow" />
                      <span
                        className="h-[4px] rounded-full bg-iso-black/25"
                        style={{ width: `${w}%` }}
                      />
                      <span className="ml-auto h-[4px] w-[10%] rounded-full bg-iso-black/40" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Chrome>
  );
}

/* ------------------------------------------------------------------ Annam */

const MACROS = [
  { label: "Protein", w: "72%", tone: "bg-iso-yellow" },
  { label: "Carbs", w: "58%", tone: "bg-iso-sky" },
  { label: "Fat", w: "34%", tone: "bg-iso-black" },
];

function AnnamPreview() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-iso-sky">
      {/* the room behind the phone */}
      <span className="anim-drift absolute -inset-[10%] bg-[radial-gradient(circle_at_30%_25%,#ffffff_0%,transparent_55%),radial-gradient(circle_at_75%_70%,#f0b000_0%,transparent_50%)] opacity-70" />

      <div className="relative h-[86%] w-auto" style={{ aspectRatio: "10 / 19" }}>
        <div className="flex h-full w-full flex-col overflow-hidden rounded-[9%/4.5%] border-2 border-iso-black bg-iso-black p-[3%]">
          <span className="mx-auto mb-[3%] h-[4px] w-[28%] rounded-full bg-white/30" />

          {/* the plate, being read */}
          <div className="relative h-[42%] overflow-hidden rounded-[6%] border border-white/15">
            <span className="anim-drift absolute -inset-[15%] bg-[radial-gradient(circle_at_50%_50%,#f4e2c0_0%,#d9a441_45%,#8a5a1e_100%)]" />
            <span className="absolute top-[18%] left-[16%] size-[26%] rounded-full bg-[#f7efe0]/90" />
            <span className="absolute right-[18%] bottom-[20%] size-[30%] rounded-full bg-[#c96a2a]/85" />
            <span className="absolute top-[46%] left-[44%] size-[22%] rounded-full bg-[#7d9a3e]/85" />
            <span className="anim-sweep absolute inset-x-0 top-0 h-[14%] bg-gradient-to-b from-transparent via-white/70 to-transparent" />
          </div>

          {/* what came back */}
          <div className="mt-[4%] flex flex-1 flex-col gap-[4%]">
            {MACROS.map((m, i) => (
              <div
                key={m.label}
                className="anim-pop flex items-center gap-[3%] rounded-[10%/38%] border border-white/15 bg-white/10 px-[5%] py-[4%]"
                style={{ animationDelay: `${400 + i * 260}ms` }}
              >
                <span className={`size-[7px] rounded-full ${m.tone}`} />
                <span className="text-[0.5rem] leading-none text-white/80">{m.label}</span>
                <span className="ml-auto h-[4px] w-[34%] overflow-hidden rounded-full bg-white/15">
                  <span
                    className={`block h-full rounded-full ${m.tone}`}
                    style={{ width: m.w }}
                  />
                </span>
              </div>
            ))}

            <div className="anim-pop mt-auto flex items-center justify-center rounded-[8%/34%] bg-iso-yellow py-[5%] text-[0.5rem] leading-none font-bold text-iso-black" style={{ animationDelay: "1200ms" }}>
              Add to today
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------- Reaching Dreams */

const TEES = [
  "linear-gradient(160deg,#221a14,#4a3a1c)",
  "linear-gradient(160deg,#f0b000,#d09400)",
  "linear-gradient(160deg,#90d0f0,#6bb4dd)",
  "linear-gradient(160deg,#fbfaf7,#e5e0d6)",
  "linear-gradient(160deg,#8a3324,#c96a2a)",
  "linear-gradient(160deg,#1f6088,#90d0f0)",
];

function Tee({ background }: { background: string }) {
  return (
    <div className="w-[86px] shrink-0 sm:w-[104px]">
      <div
        className="aspect-[4/5] rounded-[3px] border border-iso-black"
        style={{ background }}
      />
      <span className="mt-[6px] block h-[4px] w-[70%] rounded-full bg-iso-black/25" />
      <span className="mt-[4px] block h-[4px] w-[40%] rounded-full bg-iso-black/40" />
    </div>
  );
}

function ReachingPreview() {
  return (
    <Chrome host="reachingdreams.in">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-[3%] border-b border-iso-black/15 px-[3%] py-[2.5%]">
          <span className="h-[6px] w-[16%] rounded-full bg-iso-black/70" />
          {[8, 7, 6].map((w, i) => (
            <span
              key={i}
              className="h-[4px] rounded-full bg-iso-black/25"
              style={{ width: `${w}%` }}
            />
          ))}
          <span className="ml-auto size-[10px] rounded-full border border-iso-black" />
        </div>

        {/* hero */}
        <div className="relative m-[3%] h-[38%] overflow-hidden rounded-[4px] border border-iso-black bg-iso-black">
          <span className="anim-drift absolute -inset-[10%] bg-[radial-gradient(circle_at_25%_30%,#f0b000_0%,transparent_60%)] opacity-80" />
          <div className="relative flex h-full flex-col justify-center gap-[6px] px-[5%]">
            <span className="h-[8px] w-[52%] rounded-full bg-white/85" />
            <span className="h-[6px] w-[34%] rounded-full bg-white/40" />
            <span className="mt-[4px] h-[12px] w-[24%] rounded-[3px] bg-iso-yellow" />
          </div>
        </div>

        {/* the drop, moving past */}
        <div className="marquee-hold marquee-fade flex-1 overflow-hidden px-[1%]">
          <div className="marquee gap-3" style={{ ["--marquee-dur" as string]: "26s" }}>
            {[...TEES, ...TEES].map((bg, i) => (
              <Tee key={i} background={bg} />
            ))}
          </div>
        </div>
      </div>
    </Chrome>
  );
}

/* ----------------------------------------------------------- GS Cosmatics */

function GsPreview() {
  return (
    <Chrome host="gs-cosmatics.hanubees.com" dark>
      <div className="flex h-full flex-col text-white">
        <div className="flex items-center gap-[3%] border-b border-white/10 px-[3%] py-[2.5%]">
          <span className="h-[6px] w-[18%] rounded-full bg-[#d9a441]" />
          {[7, 6, 6].map((w, i) => (
            <span
              key={i}
              className="h-[4px] rounded-full bg-white/25"
              style={{ width: `${w}%` }}
            />
          ))}
          <span className="ml-auto size-[10px] rounded-full border border-white/40" />
        </div>

        <div className="relative m-[3%] h-[44%] overflow-hidden rounded-[4px] border border-[#d9a441]/50">
          <span className="anim-drift absolute -inset-[12%] bg-[conic-gradient(from_140deg_at_50%_50%,#8a6318,#f7e3a1,#a06912,#f0d9a8,#8a6318)] opacity-90" />
          <div className="relative flex h-full flex-col justify-end gap-[6px] p-[5%]">
            <span className="h-[9px] w-[46%] rounded-full bg-iso-black/80" />
            <span className="h-[10px] w-[22%] rounded-[3px] bg-iso-black" />
          </div>
        </div>

        <div className="flex flex-1 gap-[3%] px-[3%] pb-[3%]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="anim-pop flex-1 rounded-[3px] border border-white/15 p-[5%]"
              style={{ animationDelay: `${i * 320}ms` }}
            >
              <div
                className="aspect-square w-full rounded-[2px]"
                style={{
                  background:
                    "linear-gradient(150deg,#f7e3a1 0%,#d9a441 45%,#5a3d0c 100%)",
                }}
              />
              <span className="mt-[6px] block h-[4px] w-[80%] rounded-full bg-white/35" />
              <span className="mt-[4px] block h-[4px] w-[45%] rounded-full bg-[#d9a441]" />
            </div>
          ))}
        </div>
      </div>
    </Chrome>
  );
}

/* ---------------------------------------------------------------- exports */

const PREVIEWS: Record<string, (() => React.ReactElement) | undefined> = {
  "hanubees-commerce": CommercePreview,
  annam: AnnamPreview,
  "reaching-dreams": ReachingPreview,
  "gs-cosmatics": GsPreview,
};

export function ProjectPreview({
  slug,
  swatch,
  className = "",
}: {
  slug: string;
  /** Fallback for a project that has no drawn preview yet. */
  swatch: string;
  className?: string;
}) {
  const Inner = PREVIEWS[slug];
  return (
    <div
      className={`iso-block aspect-[16/10] overflow-hidden ${className}`}
      style={Inner ? undefined : { background: swatch }}
      aria-hidden
    >
      {Inner ? <Inner /> : null}
    </div>
  );
}
