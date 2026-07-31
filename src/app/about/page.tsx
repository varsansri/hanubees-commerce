import type { Metadata } from "next";
import Link from "next/link";
import { Bee2D } from "@/components/fx/bee-2d";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { CAPABILITIES, FAQS, TONE_CLASS } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Hanubees Technologies is a small software studio in Coimbatore. We design, build and maintain websites, products and AI tools for businesses.",
};

const BELIEFS = [
  {
    title: "Small team, no layers",
    body: "The people on the first call write the code. There is no account manager between you and the person who can answer your question.",
    tone: "yellow",
  },
  {
    title: "Design is not decoration",
    body: "We design the software before we build it, because the twentieth screen is where products fall apart — not the landing page.",
    tone: "sky",
  },
  {
    title: "We use what we sell",
    body: "Our own commerce platform and AI products run on the same stack we hand to clients. If it is not good enough for us, it does not go out.",
    tone: "black",
  },
  {
    title: "Boring where it counts",
    body: "Typed code, tested paths, real error monitoring, no clever framework of the month. The interesting part should be your business, not our infrastructure.",
    tone: "white",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <section className="mx-auto w-full max-w-6xl px-4 pt-12 sm:pt-16">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-12">
          <div>
            <h1 className="iso-display rise max-w-2xl text-[2.5rem] sm:text-[3.75rem]">
              A software studio in Coimbatore.
            </h1>
            <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-text-2">
              Hanubees Technologies builds the websites, products and internal
              tools businesses run on. We started by building our own — a
              commerce platform, an AI product, a handful of stores — and we
              build client work the same way: designed first, shipped in weeks,
              handed over in full.
            </p>
            <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-text-2">
              We stay deliberately small. It is the only way the same people who
              scope a project are still the ones on it three months later.
            </p>
          </div>

          <div className="iso-block flex items-center justify-center bg-iso-white p-8">
            <Bee2D size={260} className="max-w-[80%]" />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pt-24">
        <h2 className="iso-display v-wipe text-[2rem] sm:text-[2.75rem]">How we think.</h2>
        <ul className="v-stagger mt-10 grid gap-5 sm:grid-cols-2">
          {BELIEFS.map((b, i) => (
            <li key={b.title} className={`iso-block p-6 ${TONE_CLASS[b.tone]}`} style={{ ["--i" as string]: i }}>
              <h3 className="iso-display text-[1.5rem]">{b.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed opacity-90">{b.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pt-24">
        <h2 className="iso-display v-wipe text-[2rem] sm:text-[2.75rem]">What we work in.</h2>
        <p className="mt-3 max-w-md text-[15px] text-text-2">
          One stack, known deeply, rather than a list of everything that exists.
        </p>
        <ul className="mt-8 flex flex-wrap gap-2">
          {CAPABILITIES.map((c) => (
            <li
              key={c}
              className="iso-block-sm bg-surface px-3 py-1.5 text-[14px] font-semibold tracking-tight"
            >
              {c}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pt-24">
        <h2 className="iso-display text-[2rem] sm:text-[2.75rem]">
          Before you ask.
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
        <div className="iso-block v-scale bg-iso-black px-6 py-14 text-center text-white sm:px-12">
          <h2 className="iso-display mx-auto max-w-xl text-[2rem] sm:text-[3rem]">
            Come and talk to us.
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-[15px] text-white/70">
            An hour, free, and you leave with a plan whether or not you hire us.
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
