import type { Metadata } from "next";
import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { FAQS, PROCESS } from "@/lib/site";

export const metadata: Metadata = {
  title: "How we work",
  description:
    "Four steps from first call to launch: talk, scope, build, ship. What we do at each one, what we need from you, and what you get.",
  alternates: { canonical: "/process" },
};

const RULES = [
  {
    title: "No estimate becomes an invoice",
    body: "The number in the scope document is the number on the bill. If we misjudged the work, that is our problem, not a change order.",
  },
  {
    title: "No silent weeks",
    body: "Every week has a demo and a written update, including the weeks where the honest update is that something took longer than we thought.",
  },
  {
    title: "No hostage-taking",
    body: "Repository, hosting, domains and third-party accounts are in your name from the start. Leaving us costs you nothing but a goodbye.",
  },
  {
    title: "No sub-contracting behind your back",
    body: "If we ever bring in a specialist — a photographer, a compliance reviewer — you know who they are before they start.",
  },
];

export default function ProcessPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <section className="mx-auto w-full max-w-6xl px-4 pt-12 sm:pt-16">
        <h1 className="iso-display max-w-3xl text-[2.5rem] sm:text-[3.75rem]">
          From first call to live, in four steps.
        </h1>
        <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-text-2">
          The same shape whether it is a three-week website or a three-month
          product. The difference is how long step three runs — not how much of
          it you get to see.
        </p>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4">
        {PROCESS.map((step, i) => (
          <section
            key={step.title}
            className="mt-12 grid gap-8 border-t-2 border-iso-black pt-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-12"
          >
            <div>
              <span className="nums iso-display block text-[3.5rem] text-iso-sky-text">
                0{i + 1}
              </span>
              <h2 className="iso-display mt-2 text-[2rem] sm:text-[2.5rem]">
                {step.title}
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-text-2">{step.body}</p>
            </div>

            <div>
              <p className="max-w-prose text-[17px] leading-relaxed">{step.detail}</p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="iso-block bg-surface p-5">
                  <h3 className="text-[13px] font-bold uppercase text-text-3">
                    What we need from you
                  </h3>
                  <ul className="mt-3 flex flex-col gap-2 text-[14px]">
                    {step.yours.map((y) => (
                      <li key={y} className="flex gap-2">
                        <CheckIcon className="mt-0.5 size-4 shrink-0 text-iso-sky-text" />
                        <span className="text-text-2">{y}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="iso-block bg-iso-yellow p-5 text-iso-black">
                  <h3 className="text-[13px] font-bold uppercase opacity-70">
                    What you get
                  </h3>
                  <ul className="mt-3 flex flex-col gap-2 text-[14px]">
                    {step.ours.map((o) => (
                      <li key={o} className="flex gap-2">
                        <CheckIcon className="mt-0.5 size-4 shrink-0" />
                        <span className="opacity-90">{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="mx-auto w-full max-w-6xl px-4 pt-24">
        <h2 className="iso-display text-[2rem] sm:text-[2.75rem]">
          Four rules we hold ourselves to.
        </h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {RULES.map((r) => (
            <li key={r.title} className="iso-block bg-surface p-6">
              <h3 className="iso-display text-[1.5rem]">{r.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-text-2">{r.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pt-24">
        <h2 className="iso-display text-[2rem] sm:text-[2.75rem]">
          The questions this usually raises.
        </h2>
        <ul className="mt-10 grid gap-3 lg:grid-cols-2">
          {FAQS.map((f) => (
            <li key={f.q} className="iso-block bg-surface p-6">
              <h3 className="text-[16px] font-semibold tracking-tight">{f.q}</h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-text-2">{f.a}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pt-24">
        <div className="iso-block bg-iso-black px-6 py-14 text-center text-white sm:px-12">
          <h2 className="iso-display mx-auto max-w-xl text-[2rem] sm:text-[3rem]">
            Step one is a free hour.
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-[15px] text-white/70">
            Book it, describe the problem, and leave with a plan either way.
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
