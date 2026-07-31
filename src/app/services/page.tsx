import type { Metadata } from "next";
import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { PROCESS, SERVICES, TONE_CLASS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Websites, web apps, e-commerce, mobile apps, AI tools and care plans — what each one includes, what it costs to start, and how long it takes.",
};

export default function ServicesPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <section className="mx-auto w-full max-w-6xl px-4 pt-12 sm:pt-16">
        <h1 className="iso-display max-w-3xl text-[2.5rem] sm:text-[3.75rem]">
          Six things we do, properly.
        </h1>
        <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-text-2">
          Every price below is where the work starts. The real number arrives in
          a written scope with your screens and your dates in it — before anyone
          begins.
        </p>

        <ul className="mt-10 flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <li key={s.slug}>
              <a
                href={`#${s.slug}`}
                className={`iso-block-sm iso-press inline-flex px-3 py-1.5 text-[13px] font-semibold tracking-tight ${TONE_CLASS[s.tone]}`}
              >
                {s.name}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4">
        {SERVICES.map((s) => (
          <section
            key={s.slug}
            id={s.slug}
            className="mt-12 grid scroll-mt-24 gap-8 border-t-2 border-iso-black pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-12"
          >
            <div>
              <h2 className="iso-display text-[2rem] sm:text-[2.5rem]">{s.name}</h2>
              <p className="mt-3 text-[17px] font-medium">{s.short}</p>
              <p className="mt-5 max-w-prose text-[15px] leading-relaxed text-text-2">
                {s.body}
              </p>

              <ul className="mt-8 grid gap-2.5 text-[14px] sm:grid-cols-2">
                {s.includes.map((point) => (
                  <li key={point} className="flex gap-2">
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-iso-sky-text" />
                    <span className="text-text-2">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`iso-block h-fit p-6 ${TONE_CLASS[s.tone]}`}>
              <span className="text-[13px] font-bold uppercase opacity-70">
                Starts at
              </span>
              <p className="nums iso-display mt-2 text-[2.5rem]">{s.from}</p>
              <p className="mt-3 text-[14px] font-medium opacity-80">
                Typical timeline: {s.timeline}
              </p>
              <Link
                href={`/contact?service=${s.slug}`}
                className="iso-block-sm iso-press mt-6 inline-flex h-11 w-full items-center justify-center bg-bg text-[14px] font-semibold text-text"
              >
                Get a quote
              </Link>
            </div>
          </section>
        ))}
      </div>

      <section className="mx-auto w-full max-w-6xl px-4 pt-24">
        <h2 className="iso-display text-[2rem] sm:text-[2.75rem]">
          The same four steps, every time.
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

      <section className="mx-auto w-full max-w-6xl px-4 pt-24">
        <div className="iso-block bg-iso-black px-6 py-14 text-center text-white sm:px-12">
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
