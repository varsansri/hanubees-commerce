import type { Metadata } from "next";
import Link from "next/link";
import { CheckIcon, ChevronIcon } from "@/components/icons";
import { ServiceGlyph } from "@/components/site/service-icons";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { INDUSTRIES, PROCESS, SERVICES, TONE_CLASS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Websites, web apps, e-commerce, mobile apps, AI tools and care plans — what each one includes, what it costs to start, and how long it takes.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <section className="mx-auto w-full max-w-6xl px-4 pt-12 sm:pt-16">
        <h1 className="iso-display rise max-w-3xl text-[2.5rem] sm:text-[3.75rem]">
          Six things we do, properly.
        </h1>
        <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-text-2">
          Every price below is where the work starts. The real number arrives in
          a written scope with your screens and your dates in it — before anyone
          begins.
        </p>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pt-12">
        <ul className="v-stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <li key={s.slug} id={s.slug} className="scroll-mt-24" style={{ ["--i" as string]: i }}>
              <Link
                href={`/services/${s.slug}`}
                className={`iso-block iso-press group flex h-full flex-col p-6 transition-transform duration-200 ease-[var(--ease-out)] hover:-translate-y-1 ${TONE_CLASS[s.tone]}`}
              >
                <ServiceGlyph
                  slug={s.slug}
                  className="size-9 transition-transform duration-300 ease-[var(--ease-out)] group-hover:-rotate-6 group-hover:scale-110"
                />
                <h2 className="iso-display mt-5 text-[1.75rem]">{s.name}</h2>
                <p className="mt-3 text-[15px] leading-relaxed opacity-90">{s.short}</p>

                <ul className="mt-5 flex flex-col gap-2 text-[13px]">
                  {s.includes.slice(0, 3).map((point) => (
                    <li key={point} className="flex gap-2">
                      <CheckIcon className="mt-0.5 size-3.5 shrink-0 opacity-70" />
                      <span className="opacity-80">{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <span className="nums block text-[13px] font-bold opacity-70">
                    From {s.from} · {s.timeline}
                  </span>
                  <span className="mt-2 inline-flex items-center gap-1 text-[14px] font-bold">
                    What it involves
                    <ChevronIcon className="size-4" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------------------------------------------------- industries */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-24">
        <h2 className="iso-display v-wipe text-[2rem] sm:text-[2.75rem]">Who we build for.</h2>
        <p className="mt-3 max-w-md text-[15px] text-text-2">
          Not a list of everyone. These are the businesses whose problems we
          already know the shape of.
        </p>
        <ul className="v-stagger mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((ind, i) => (
            <li key={ind.name} className="iso-block bg-surface p-6" style={{ ["--i" as string]: i }}>
              <h3 className="text-[16px] font-bold tracking-tight">{ind.name}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-text-2">{ind.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------------ process */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="iso-display v-wipe text-[2rem] sm:text-[2.75rem]">
            The same four steps, every time.
          </h2>
          <Link
            href="/process"
            className="inline-flex items-center gap-1 text-[14px] font-semibold text-iso-sky-text hover:underline"
          >
            The process in full
            <ChevronIcon className="size-4" />
          </Link>
        </div>
        <ol className="v-stagger mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((step, i) => (
            <li key={step.title} className="iso-block bg-surface p-6" style={{ ["--i" as string]: i }}>
              <span className="nums block text-[13px] font-bold text-iso-sky-text">
                0{i + 1}
              </span>
              <h3 className="iso-display mt-2 text-[1.375rem]">{step.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-text-2">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pt-24">
        <div className="iso-block v-scale bg-iso-black px-6 py-14 text-center text-white sm:px-12">
          <h2 className="iso-display mx-auto max-w-xl text-[2rem] sm:text-[3rem]">
            Not sure which one you need?
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-[15px] text-white/70">
            Describe the problem instead of the solution. We will tell you what
            it actually takes.
          </p>
          <Link
            href="/contact"
            className="iso-block-sm iso-press mt-8 inline-flex h-12 items-center bg-iso-yellow px-7 text-[15px] font-semibold text-iso-black"
          >
            Start a project
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
