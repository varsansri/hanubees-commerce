import Link from "next/link";
import { LiquidMark } from "@/components/fx/liquid-mark";
import { BeeMark, CheckIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { listStores } from "@/lib/data";

const FEATURES = [
  {
    title: "One admin, the whole business",
    body: "Orders, products, customers, discounts, and analytics in a single dashboard that doesn't need a training session.",
  },
  {
    title: "A storefront that already looks good",
    body: "Every store ships with a fast, responsive theme. Set your accent and typography — no theme marketplace, no upsell.",
  },
  {
    title: "Built for how India buys",
    body: "Rupee-first pricing, GST on every order, cash on delivery, and WhatsApp as a real sales channel.",
  },
  {
    title: "Your domain from day one",
    body: "Start on yourstore.hanubees.com, connect your own domain when you're ready. Both stay live.",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "₹0",
    note: "while you find your first 50 customers",
    points: ["Up to 50 products", "hanubees.com subdomain", "2% transaction fee"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Growth",
    price: "₹1,499",
    note: "per month",
    points: [
      "Unlimited products",
      "Custom domain",
      "0% transaction fee",
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
      "Multiple storefronts",
      "Staff accounts",
      "Priority support",
    ],
    cta: "Talk to us",
    featured: false,
  },
];

export default async function Landing() {
  const stores = await listStores();

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
          <Link href="/" className="flex items-center gap-2 text-accent">
            <BeeMark className="size-7" />
            <span className="text-[15px] font-semibold tracking-tight text-text">
              Hanubees
            </span>
          </Link>
          <nav className="ml-6 hidden items-center gap-5 text-[13px] text-text-2 md:flex">
            <a href="#features" className="transition-colors hover:text-text">
              Features
            </a>
            <a href="#pricing" className="transition-colors hover:text-text">
              Pricing
            </a>
            <a href="#examples" className="transition-colors hover:text-text">
              Examples
            </a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/admin"
              className="hidden h-9 items-center rounded-[var(--radius)] px-3 text-[13px] font-medium text-text-2 transition-colors hover:bg-surface-2 hover:text-text sm:inline-flex"
            >
              Log in
            </Link>
            <Link
              href="/admin"
              className="pressable inline-flex h-9 items-center rounded-[var(--radius)] bg-accent px-3.5 text-[13px] font-medium text-white [transition:background-color_140ms_var(--ease-out),transform_140ms_var(--ease-out)] hover:bg-accent-hover"
            >
              Open dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------------------- hero */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-8 pt-16 text-center sm:pt-20">
        <div className="rise mb-6">
          <LiquidMark />
        </div>
        <h1 className="rise rise-1 mx-auto max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
          Commerce for people who
          <br className="hidden sm:block" /> actually make things
        </h1>
        <p className="rise rise-2 mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-text-2">
          Launch a storefront, take orders, and run the whole business from one
          admin. No plugin maze, no per-feature pricing. Free while you find your
          first 50 customers.
        </p>
        <div className="rise rise-3 mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/admin"
            className="pressable inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-medium text-white"
          >
            Open the dashboard
          </Link>
          <Link
            href="/store/bloom"
            className="pressable inline-flex h-11 items-center rounded-full border border-line-strong px-6 text-sm font-medium [transition:background-color_140ms_var(--ease-out),transform_140ms_var(--ease-out)] hover:bg-surface-2"
          >
            See a live storefront
          </Link>
        </div>
      </section>

      {/* The product itself is the hero image */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-6">
        <div className="rise rise-4 overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-lg)]">
          <div className="flex items-center gap-1.5 border-b border-line bg-surface-2 px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-[var(--border-strong)]" />
            <span className="size-2.5 rounded-full bg-[var(--border-strong)]" />
            <span className="size-2.5 rounded-full bg-[var(--border-strong)]" />
            <span className="ml-3 font-mono text-[11px] text-text-3">
              hanubees.com/admin/bloom
            </span>
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-4">
            {[
              ["Revenue", "₹4,82,300", "+18.4%"],
              ["Orders", "132", "+9.2%"],
              ["Sessions", "5,808", "−3.1%"],
              ["Conversion", "2.27%", "+12.6%"],
            ].map(([label, value, change], i) => (
              <div key={label} className="rounded-[var(--radius)] border border-line p-4">
                <p className="text-[13px] text-text-2">{label}</p>
                <p className="nums mt-1.5 text-xl font-semibold tracking-tight">{value}</p>
                <p
                  className="nums mt-1 text-xs font-medium"
                  style={{ color: i === 2 ? "var(--danger)" : "var(--success)" }}
                >
                  {change}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ features */}
      <section id="features" className="mx-auto w-full max-w-6xl px-4 pt-24">
        <h2 className="text-2xl font-semibold tracking-tight">
          Everything a small brand actually needs
        </h2>
        <p className="mt-2 max-w-xl text-[15px] text-text-2">
          And nothing it doesn&apos;t. The features below are in the box, not in an app
          store.
        </p>
        {/* A ruled list, not a grid of identical cards — the card is the lazy
            container, and these four claims are prose, not tiles. */}
        <dl className="mt-10 border-t border-line">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="grid gap-2 border-b border-line py-7 sm:grid-cols-[minmax(0,18rem)_1fr] sm:gap-10"
            >
              <dt className="text-[17px] font-medium tracking-tight">{f.title}</dt>
              <dd className="max-w-[68ch] text-[15px] leading-relaxed text-text-2">
                {f.body}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ------------------------------------------------------------ examples */}
      <section id="examples" className="mx-auto w-full max-w-6xl px-4 pt-24">
        <h2 className="text-2xl font-semibold tracking-tight">Stores on Hanubees</h2>
        <p className="mt-2 text-[15px] text-text-2">
          Same platform, three very different brands.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {stores.map((s) => (
            <li key={s.id}>
              <Link href={`/store/${s.handle}`} className="group block">
                <div
                  className="aspect-[3/2] rounded-xl border border-line [transition:transform_200ms_var(--ease-out)] group-hover:-translate-y-1"
                  style={{ background: s.theme.heroImage }}
                  aria-hidden
                />
                <p className="mt-3 text-[15px] font-medium">{s.name}</p>
                <p className="text-[13px] text-text-2">{s.tagline}</p>
                <p className="mt-1 font-mono text-[12px] text-text-3">
                  {s.customDomain ?? `${s.handle}.hanubees.com`}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------------- pricing */}
      <section id="pricing" className="mx-auto w-full max-w-6xl px-4 pt-24">
        <h2 className="text-2xl font-semibold tracking-tight">Pricing</h2>
        <p className="mt-2 text-[15px] text-text-2">
          One price, every feature. Change or cancel whenever.
        </p>
        <ul className="mt-8 grid gap-4 lg:grid-cols-3">
          {PLANS.map((p) => (
            <li
              key={p.name}
              className={`flex flex-col rounded-xl border bg-surface p-6 ${
                p.featured
                  ? "border-accent shadow-[var(--shadow)]"
                  : "border-line shadow-[var(--shadow-sm)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-semibold tracking-tight">{p.name}</h3>
                {p.featured ? (
                  <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent-text">
                    Most popular
                  </span>
                ) : null}
              </div>
              <p className="nums mt-4 text-3xl font-semibold tracking-tight">{p.price}</p>
              <p className="mt-1 text-[13px] text-text-3">{p.note}</p>
              <ul className="mt-5 flex flex-1 flex-col gap-2 text-[14px] text-text-2">
                {p.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-accent" />
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href="/admin"
                className={`pressable mt-6 inline-flex h-10 items-center justify-center rounded-[var(--radius)] text-sm font-medium [transition:background-color_140ms_var(--ease-out),transform_140ms_var(--ease-out)] ${
                  p.featured
                    ? "bg-accent text-white hover:bg-accent-hover"
                    : "border border-line-strong hover:bg-surface-2"
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
        <div className="rounded-2xl border border-line bg-surface-2 px-6 py-14 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Your store could be live tonight
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[15px] text-text-2">
            Set it up in an evening, sell in the morning.
          </p>
          <Link
            href="/admin"
            className="pressable mt-7 inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-medium text-white"
          >
            Open the dashboard
          </Link>
        </div>
      </section>

      <footer className="mt-auto border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-[13px] text-text-3">
          <span className="flex items-center gap-2">
            <span className="text-accent">
              <BeeMark className="size-5" />
            </span>
            © {new Date().getFullYear()} Hanubees
          </span>
          <span>Made in Coimbatore</span>
        </div>
      </footer>
    </div>
  );
}
