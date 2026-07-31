import type { Metadata } from "next";
import Link from "next/link";
import { IsoStage } from "@/components/fx/iso-stage";
import { CheckIcon, ChevronIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { CAPABILITIES, FAQS, PROCESS, PROJECTS, SERVICES, TONE_CLASS } from "@/lib/site";

/*
 * Hanubees Technologies — the company home page.
 *
 * Same isometric world as the rest of the brand: solid blocks in the four
 * primaries, each with the hard offset edge that stands in for an extruded
 * side face, and heavy tight display type. No soft-shadowed card anywhere.
 */

export const metadata: Metadata = {
  title: "Hanubees Technologies — websites and software for businesses",
  description:
    "We design and build websites, web apps, e-commerce and AI tools for businesses. Fixed scope, fixed price, and you own the code.",
};

const PROMISES = [
  {
    title: "A price before we start",
    body: "A written scope with screens, milestones and a fixed number. The invoice at the end is the one you agreed to at the beginning.",
  },
  {
    title: "You own everything",
    body: "Code in your GitHub, hosting in your account, domains in your name. Nothing we build is hostage to us staying around.",
  },
  {
    title: "A live link from week one",
    body: "You watch it get built instead of waiting for a reveal. Weekly demo, written update, no month of silence.",
  },
  {
    title: "The people who built it",
    body: "The team on the call is the team writing the code. Nobody gets handed to an account manager after signing.",
  },
];

const ENGAGEMENTS = [
  {
    name: "Project",
    price: "from ₹35,000",
    note: "fixed scope, fixed price",
    body: "A website, a store or a defined tool. One number, one date, agreed before anyone writes a line.",
    points: ["Written scope up front", "Weekly demos", "Two weeks of fixes after launch"],
    featured: false,
  },
  {
    name: "Product team",
    price: "from ₹1,50,000",
    note: "per month, dedicated",
    body: "For products that keep going. A team on your roadmap month to month, shipping every week.",
    points: ["Design, build and deploy", "Weekly releases", "Cancel with a month's notice"],
    featured: true,
  },
  {
    name: "Care plan",
    price: "from ₹8,000",
    note: "per month",
    body: "Keeps a live product healthy: monitoring, updates, and hours for the small changes every business needs.",
    points: ["Uptime and error monitoring", "Security updates", "A block of change hours"],
    featured: false,
  },
];

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      {/* ---------------------------------------------------------------- hero */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-12 sm:pt-16">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-12">
          <div>
            <span className="iso-block-sm rise inline-flex items-center bg-iso-sky px-3 py-1 text-[13px] font-bold tracking-tight text-iso-black">
              Software studio · Coimbatore
            </span>
            <h1 className="iso-display rise rise-1 mt-5 text-[2.75rem] sm:text-[4.25rem]">
              We build the software
              <br />
              your business runs on.
            </h1>
            <p className="rise rise-2 mt-6 max-w-md text-[17px] leading-relaxed text-text-2">
              Websites, web apps, online stores and AI tools — designed, built
              and maintained by one small team. Fixed scope, fixed price, and
              the code is yours from the first commit.
            </p>
            <div className="rise rise-3 mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="iso-block iso-press inline-flex h-12 items-center bg-iso-yellow px-6 text-[15px] font-semibold text-iso-black"
              >
                Start a project
              </Link>
              <Link
                href="/work"
                className="iso-block iso-press inline-flex h-12 items-center bg-iso-white px-6 text-[15px] font-semibold text-iso-black"
              >
                See our work
              </Link>
            </div>
            <p className="rise rise-3 mt-5 text-[13px] font-medium text-text-3">
              First call is free, and you leave it with a plan either way.
            </p>
          </div>

          <IsoStage className="rise rise-4" />
        </div>

        <ul className="mt-12 flex flex-wrap gap-2 border-t-2 border-iso-black pt-6">
          {CAPABILITIES.map((c) => (
            <li
              key={c}
              className="iso-block-sm bg-surface px-3 py-1.5 text-[13px] font-semibold tracking-tight"
            >
              {c}
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------------ services */}
      <section id="services" className="mx-auto w-full max-w-6xl px-4 pt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="iso-display max-w-lg text-[2rem] sm:text-[2.75rem]">
            What we build.
          </h2>
          <Link
            href="/services"
            className="inline-flex items-center gap-1 text-[14px] font-semibold text-iso-sky-text hover:underline"
          >
            All services and prices
            <ChevronIcon className="size-4" />
          </Link>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services#${s.slug}`}
                className={`iso-block iso-press flex h-full flex-col p-6 transition-transform duration-200 ease-[var(--ease-out)] hover:-translate-y-1 ${TONE_CLASS[s.tone]}`}
              >
                <h3 className="iso-display text-[1.5rem]">{s.name}</h3>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed opacity-90">
                  {s.short}
                </p>
                <span className="nums mt-6 text-[13px] font-bold opacity-70">
                  {s.from} · {s.timeline}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------------------------------------------------------- work */}
      <section id="work" className="mx-auto w-full max-w-6xl px-4 pt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="iso-display max-w-lg text-[2rem] sm:text-[2.75rem]">
            Things we have shipped.
          </h2>
          <Link
            href="/work"
            className="inline-flex items-center gap-1 text-[14px] font-semibold text-iso-sky-text hover:underline"
          >
            All work
            <ChevronIcon className="size-4" />
          </Link>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {PROJECTS.slice(0, 4).map((p) => (
            <li key={p.slug} className="group">
              <div
                className="iso-block aspect-[16/10] transition-transform duration-200 ease-[var(--ease-out)] group-hover:-translate-y-1"
                style={{ background: p.swatch }}
                aria-hidden
              />
              <div className="mt-4 flex items-baseline gap-2">
                <p className="text-[16px] font-semibold tracking-tight">{p.name}</p>
                <span className="nums text-[13px] text-text-3">{p.year}</span>
                {p.inHouse ? (
                  <span className="iso-block-sm ml-auto bg-iso-sky px-2 py-0.5 text-[11px] font-bold text-iso-black">
                    In-house
                  </span>
                ) : null}
              </div>
              <p className="mt-0.5 text-[14px] text-text-2">{p.kind}</p>
              <p className="mt-2 max-w-prose text-[14px] leading-relaxed text-text-2">
                {p.summary}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------------- process */}
      <section id="process" className="mx-auto w-full max-w-6xl px-4 pt-24">
        <h2 className="iso-display max-w-lg text-[2rem] sm:text-[2.75rem]">
          How a project goes.
        </h2>

        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((step, i) => (
            <li key={step.title} className="iso-block bg-surface p-6">
              <span className="nums block text-[13px] font-bold text-iso-sky-text">
                0{i + 1}
              </span>
              <h3 className="iso-display mt-2 text-[1.375rem]">{step.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-text-2">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ------------------------------------------------------------ promises */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-24">
        <div className="iso-block bg-iso-black p-6 text-white sm:p-10">
          <h2 className="iso-display max-w-lg text-[2rem] sm:text-[2.75rem]">
            What you get either way.
          </h2>
          <ul className="mt-10 grid gap-8 sm:grid-cols-2">
            {PROMISES.map((p) => (
              <li key={p.title} className="flex gap-3">
                <CheckIcon className="mt-1 size-5 shrink-0 text-iso-yellow" />
                <div>
                  <h3 className="text-[16px] font-bold tracking-tight">{p.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-white/70">
                    {p.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --------------------------------------------------------- engagements */}
      <section id="pricing" className="mx-auto w-full max-w-6xl px-4 pt-24">
        <h2 className="iso-display text-[2rem] sm:text-[2.75rem]">
          Three ways to work with us.
        </h2>
        <p className="mt-3 max-w-md text-[15px] text-text-2">
          Every number below is a starting point. The real one comes with the
          scope document, before any work begins.
        </p>

        <ul className="mt-10 grid gap-5 lg:grid-cols-3">
          {ENGAGEMENTS.map((e) => (
            <li
              key={e.name}
              className={`iso-block flex flex-col p-6 ${
                e.featured ? "bg-iso-yellow text-iso-black" : "bg-surface"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-bold tracking-tight">{e.name}</h3>
                {e.featured ? (
                  <span className="iso-block-sm bg-iso-black px-2 py-0.5 text-[11px] font-bold text-white">
                    Most common
                  </span>
                ) : null}
              </div>
              <p className="nums iso-display mt-5 text-[2rem]">{e.price}</p>
              <p className="mt-1 text-[13px] font-medium opacity-70">{e.note}</p>
              <p
                className={`mt-4 text-[14px] leading-relaxed ${
                  e.featured ? "opacity-90" : "text-text-2"
                }`}
              >
                {e.body}
              </p>
              <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-[14px]">
                {e.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <CheckIcon
                      className={`mt-0.5 size-4 shrink-0 ${
                        e.featured ? "text-iso-black" : "text-iso-sky-text"
                      }`}
                    />
                    <span className={e.featured ? "" : "text-text-2"}>{point}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className={`iso-block-sm iso-press mt-7 inline-flex h-11 items-center justify-center text-[14px] font-semibold ${
                  e.featured ? "bg-iso-black text-white" : "bg-iso-yellow text-iso-black"
                }`}
              >
                Talk to us
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ----------------------------------------------------------------- faq */}
      <section id="faq" className="mx-auto w-full max-w-6xl px-4 pt-24">
        <h2 className="iso-display text-[2rem] sm:text-[2.75rem]">
          Questions we get asked.
        </h2>

        <ul className="mt-10 grid gap-3 lg:grid-cols-2">
          {FAQS.map((f) => (
            <li key={f.q}>
              <details className="iso-block group bg-surface p-5 [&[open]_.faq-mark]:-rotate-90">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-semibold tracking-tight">
                  {f.q}
                  <ChevronIcon className="faq-mark size-4 shrink-0 rotate-90 text-text-3 transition-transform duration-[180ms] ease-[var(--ease-out)]" />
                </summary>
                <p className="mt-3 text-[14px] leading-relaxed text-text-2">{f.a}</p>
              </details>
            </li>
          ))}
        </ul>
      </section>

      {/* ----------------------------------------------------------------- cta */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-24">
        <div className="iso-block bg-iso-yellow px-6 py-14 text-center text-iso-black sm:px-12">
          <h2 className="iso-display mx-auto max-w-2xl text-[2rem] sm:text-[3rem]">
            Tell us what you are trying to build.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] opacity-80">
            One call, an hour, no charge. You leave with a plan — whether or not
            we are the ones who build it.
          </p>
          <Link
            href="/contact"
            className="iso-block-sm iso-press mt-8 inline-flex h-12 items-center bg-iso-black px-7 text-[15px] font-semibold text-white"
          >
            Start a project
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
