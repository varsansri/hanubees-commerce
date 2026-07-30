import Link from "next/link";
import { IsoStage } from "@/components/fx/iso-stage";
import { CheckIcon } from "@/components/icons";
import { Logo, Wordmark } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { listStores } from "@/lib/data";

/*
 * The isometric world.
 *
 * Built from solid blocks in the brand's four primaries — yellow, black, white,
 * sky — each carrying a hard offset edge that stands in for the extruded side
 * face a solid has in isometric projection. Type is heavy and tight. There is
 * no soft-shadowed card anywhere on the page.
 */

const STEPS = [
  {
    title: "Add what you make",
    body: "Products, variants, prices, stock. Bulk import if your catalogue already lives somewhere else.",
    tone: "yellow",
  },
  {
    title: "Open the doors",
    body: "Your storefront is live on yourstore.hanubees.com the moment you publish. Bring your own domain whenever you like.",
    tone: "sky",
  },
  {
    title: "Run it from one screen",
    body: "Orders, fulfilment, customers, discounts and analytics in a single admin. Nothing to install.",
    tone: "black",
  },
] as const;

const PLANS = [
  {
    name: "Starter",
    price: "₹0",
    note: "until your 50th customer",
    points: ["Up to 50 products", "hanubees.com subdomain", "2% per transaction"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Growth",
    price: "₹1,499",
    note: "per month",
    points: [
      "Unlimited products",
      "Your own domain",
      "No transaction fee",
      "Abandoned cart recovery",
    ],
    cta: "Start 14-day trial",
    featured: true,
  },
  {
    name: "Scale",
    price: "₹4,999",
    note: "per month",
    points: [
      "Everything in Growth",
      "Several storefronts",
      "Staff accounts",
      "Priority support",
    ],
    cta: "Talk to us",
    featured: false,
  },
];

const TONE_CLASS = {
  yellow: "bg-iso-yellow text-iso-black",
  sky: "bg-iso-sky text-iso-black",
  black: "bg-iso-black text-white",
} as const;

export default async function Landing() {
  const stores = await listStores();

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-30 border-b-2 border-iso-black bg-bg">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
          <Link href="/">
            <Wordmark size={28} priority />
          </Link>
          <nav className="ml-8 hidden items-center gap-6 text-[14px] font-medium text-text-2 md:flex">
            <a href="#how" className="hover:text-text">
              How it works
            </a>
            <a href="#stores" className="hover:text-text">
              Stores
            </a>
            <a href="#pricing" className="hover:text-text">
              Pricing
            </a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/admin"
              className="hidden h-9 items-center px-3 text-[14px] font-medium text-text-2 hover:text-text sm:inline-flex"
            >
              Log in
            </Link>
            <Link
              href="/admin"
              className="iso-block-sm iso-press inline-flex h-10 items-center bg-iso-yellow px-4 text-[14px] font-semibold text-iso-black"
            >
              Start free
            </Link>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------------------- hero */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-12 sm:pt-16">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-12">
          <div>
            <h1 className="iso-display rise text-[2.75rem] sm:text-[4.25rem]">
              Sell the things
              <br />
              you make.
            </h1>
            <p className="rise rise-1 mt-6 max-w-md text-[17px] leading-relaxed text-text-2">
              A storefront and a real admin, running the same evening you set it
              up. No plugin maze, no per-feature pricing.
            </p>
            <div className="rise rise-2 mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/admin"
                className="iso-block iso-press inline-flex h-12 items-center bg-iso-yellow px-6 text-[15px] font-semibold text-iso-black"
              >
                Start free
              </Link>
              <Link
                href="/store/bloom"
                className="iso-block iso-press inline-flex h-12 items-center bg-iso-white px-6 text-[15px] font-semibold text-iso-black"
              >
                See a live store
              </Link>
            </div>
            <p className="rise rise-2 mt-5 text-[13px] font-medium text-text-3">
              Free until your 50th customer. No card.
            </p>
          </div>

          <IsoStage className="rise rise-3" />
        </div>
      </section>

      {/* ----------------------------------------------------------------- how */}
      <section id="how" className="mx-auto w-full max-w-6xl px-4 pt-24">
        <h2 className="iso-display max-w-lg text-[2rem] sm:text-[2.75rem]">
          Three steps, then you are selling.
        </h2>

        <ol className="mt-10 grid gap-5 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className={`iso-block p-6 ${TONE_CLASS[s.tone]}`}>
              <span className="nums block text-[13px] font-bold opacity-70">
                0{i + 1}
              </span>
              <h3 className="iso-display mt-2 text-[1.5rem]">{s.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed opacity-90">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* -------------------------------------------------------------- stores */}
      <section id="stores" className="mx-auto w-full max-w-6xl px-4 pt-24">
        <h2 className="iso-display text-[2rem] sm:text-[2.75rem]">
          Stores already open.
        </h2>
        <p className="mt-3 max-w-md text-[15px] text-text-2">
          Same platform underneath, three brands that look nothing alike.
        </p>

        <ul className="mt-10 grid gap-5 sm:grid-cols-3">
          {stores.map((s) => (
            <li key={s.id}>
              <Link href={`/store/${s.handle}`} className="group block">
                <div
                  className="iso-block aspect-[3/2] [transition:transform_200ms_var(--ease-out)] group-hover:-translate-y-1"
                  style={{ background: s.theme.heroImage }}
                  aria-hidden
                />
                <p className="mt-4 text-[16px] font-semibold tracking-tight">
                  {s.name}
                </p>
                <p className="mt-0.5 text-[14px] text-text-2">{s.tagline}</p>
                <p className="mt-1 font-mono text-[12px] text-iso-sky-text">
                  {s.customDomain ?? `${s.handle}.hanubees.com`}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------------- pricing */}
      <section id="pricing" className="mx-auto w-full max-w-6xl px-4 pt-24">
        <h2 className="iso-display text-[2rem] sm:text-[2.75rem]">
          One price. Every feature.
        </h2>

        <ul className="mt-10 grid gap-5 lg:grid-cols-3">
          {PLANS.map((p) => (
            <li
              key={p.name}
              className={`iso-block flex flex-col p-6 ${
                p.featured ? "bg-iso-yellow text-iso-black" : "bg-surface"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-bold tracking-tight">{p.name}</h3>
                {p.featured ? (
                  <span className="iso-block-sm bg-iso-black px-2 py-0.5 text-[11px] font-bold text-white">
                    Popular
                  </span>
                ) : null}
              </div>
              <p className="nums iso-display mt-5 text-[2.5rem]">{p.price}</p>
              <p className="mt-1 text-[13px] font-medium opacity-70">{p.note}</p>
              <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-[14px]">
                {p.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <CheckIcon
                      className={`mt-0.5 size-4 shrink-0 ${
                        p.featured ? "text-iso-black" : "text-iso-sky-text"
                      }`}
                    />
                    <span className={p.featured ? "" : "text-text-2"}>{point}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/admin"
                className={`iso-block-sm iso-press mt-7 inline-flex h-11 items-center justify-center text-[14px] font-semibold ${
                  p.featured ? "bg-iso-black text-white" : "bg-iso-yellow text-iso-black"
                }`}
              >
                {p.cta}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ----------------------------------------------------------------- cta */}
      <section className="mx-auto w-full max-w-6xl px-4 py-24">
        <div className="iso-block bg-iso-black px-6 py-14 text-center text-white sm:px-12">
          <h2 className="iso-display mx-auto max-w-xl text-[2rem] sm:text-[3rem]">
            Your store could be open tonight.
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-[15px] text-white/70">
            Set it up this evening. Take orders in the morning.
          </p>
          <Link
            href="/admin"
            className="iso-block-sm iso-press mt-8 inline-flex h-12 items-center bg-iso-yellow px-7 text-[15px] font-semibold text-iso-black"
          >
            Start free
          </Link>
        </div>
      </section>

      <footer className="mt-auto border-t-2 border-iso-black">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-[13px] text-text-2">
          <span className="flex items-center gap-2">
            <Logo size={20} />© {new Date().getFullYear()} Hanubees
          </span>
          <span>Made in Coimbatore</span>
        </div>
      </footer>
    </div>
  );
}
