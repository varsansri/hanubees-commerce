import type { Metadata } from "next";
import { CheckIcon } from "@/components/icons";
import { ContactForm } from "@/components/site/contact-form";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { CONTACT, PROCESS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us what you are trying to build. First call is free and you leave with a plan either way.",
};

const HELPFUL = [
  "What the software has to do, in plain words",
  "Who uses it — customers, staff, or both",
  "Anything already built that it must live with",
  "A date you are working towards, if there is one",
];

export default function ContactPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <section className="mx-auto w-full max-w-6xl px-4 pt-12 sm:pt-16">
        <h1 className="iso-display max-w-3xl text-[2.5rem] sm:text-[3.75rem]">
          Start a project.
        </h1>
        <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-text-2">
          Describe the problem rather than the solution — working out the second
          one is our job. The first call takes an hour, costs nothing, and ends
          with a plan whether or not you hire us.
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-12">
          <ContactForm />

          <div className="flex flex-col gap-5">
            <div className="iso-block bg-iso-yellow p-6 text-iso-black">
              <h2 className="iso-display text-[1.5rem]">Rather just email?</h2>
              <a
                href={`mailto:${CONTACT.email}`}
                className="mt-3 inline-block text-[16px] font-semibold underline underline-offset-4"
              >
                {CONTACT.email}
              </a>
              <p className="mt-4 text-[14px] leading-relaxed opacity-80">
                {CONTACT.city}. We work with clients across time zones — a
                written update every day, a call every week.
              </p>
            </div>

            <div className="iso-block bg-surface p-6">
              <h2 className="text-[16px] font-bold tracking-tight">
                Useful things to include
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5 text-[14px]">
                {HELPFUL.map((h) => (
                  <li key={h} className="flex gap-2">
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-iso-sky-text" />
                    <span className="text-text-2">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pt-24">
        <h2 className="iso-display text-[2rem] sm:text-[2.75rem]">What happens next.</h2>
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

      <SiteFooter />
    </div>
  );
}
