import type { Metadata } from "next";
import Link from "next/link";
import { ChevronIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { PROJECTS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Commerce platforms, AI products and online stores built by Hanubees Technologies — what each one is, and what it is built on.",
};

export default function WorkPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <section className="mx-auto w-full max-w-6xl px-4 pt-12 sm:pt-16">
        <h1 className="iso-display max-w-3xl text-[2.5rem] sm:text-[3.75rem]">
          Shipped, and still running.
        </h1>
        <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-text-2">
          Some of these are client work and some are our own products — the ones
          marked in-house. We build the second kind so the first kind gets the
          benefit: the commerce platform below is what our store clients ship on.
        </p>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4">
        {PROJECTS.map((p, i) => (
          <article
            key={p.slug}
            className="mt-12 grid gap-8 border-t-2 border-iso-black pt-12 lg:grid-cols-2 lg:gap-12"
          >
            <Link
              href={`/work/${p.slug}`}
              aria-label={`${p.name} case study`}
              className={`iso-block aspect-[16/10] transition-transform duration-200 ease-[var(--ease-out)] hover:-translate-y-1 ${i % 2 ? "lg:order-2" : ""}`}
              style={{ background: p.swatch }}
            />

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="iso-block-sm bg-surface px-2.5 py-1 text-[12px] font-bold tracking-tight">
                  {p.kind}
                </span>
                <span className="nums text-[13px] font-medium text-text-3">{p.year}</span>
                {p.inHouse ? (
                  <span className="iso-block-sm bg-iso-sky px-2.5 py-1 text-[12px] font-bold text-iso-black">
                    In-house product
                  </span>
                ) : null}
              </div>

              <h2 className="iso-display mt-4 text-[2rem] sm:text-[2.5rem]">{p.name}</h2>
              <p className="mt-4 max-w-prose text-[16px] leading-relaxed text-text-2">
                {p.summary}
              </p>
              <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-text-2">
                {p.body}
              </p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {p.stack.map((t) => (
                  <li
                    key={t}
                    className="iso-block-sm bg-bg px-2.5 py-1 text-[12px] font-semibold tracking-tight"
                  >
                    {t}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href={`/work/${p.slug}`}
                  className="iso-block-sm iso-press inline-flex h-11 items-center bg-iso-yellow px-4 text-[14px] font-semibold text-iso-black"
                >
                  Read the case study
                </Link>
                {p.href ? (
                  <Link
                    href={p.href}
                    className="inline-flex items-center gap-1 text-[14px] font-semibold text-iso-sky-text hover:underline"
                  >
                    Look at it
                    <ChevronIcon className="size-4" />
                  </Link>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="mx-auto w-full max-w-6xl px-4 pt-24">
        <div className="iso-block bg-iso-yellow px-6 py-14 text-center text-iso-black sm:px-12">
          <h2 className="iso-display mx-auto max-w-xl text-[2rem] sm:text-[3rem]">
            Yours could be the next one.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] opacity-80">
            Tell us what the software has to do. We will tell you what it takes
            and what it costs.
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
