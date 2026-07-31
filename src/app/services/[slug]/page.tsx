import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChatPhoneIcon, CheckIcon, ChevronIcon } from "@/components/icons";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/site/json-ld";
import { ProjectPreview } from "@/components/site/previews";
import { ServiceGlyph } from "@/components/site/service-icons";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import {
  PROCESS,
  PROJECTS,
  SERVICES,
  TONE_CLASS,
  serviceBySlug,
  whatsappLink,
} from "@/lib/site";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const service = serviceBySlug((await params).slug);
  if (!service) return { title: "Service" };
  return {
    title: service.name,
    description: `${service.short} ${service.body}`.slice(0, 160),
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) notFound();

  const related = PROJECTS.filter((p) => service.related.includes(p.slug));
  const others = SERVICES.filter((s) => s.slug !== service.slug);
  const trail = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: service.name, href: `/services/${service.slug}` },
  ];

  return (
    <div className="flex min-h-full flex-col">
      <ServiceJsonLd
        name={service.name}
        description={service.short}
        slug={service.slug}
        price={service.from}
      />
      <BreadcrumbJsonLd trail={trail} />
      <SiteHeader />

      {/* --------------------------------------------------------------- head */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-8 sm:pt-10">
        <Breadcrumbs trail={trail} />

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-12">
          <div>
            <ServiceGlyph slug={service.slug} className="size-11 text-iso-sky-text" />
            <h1 className="iso-display mt-5 text-[2.5rem] sm:text-[3.75rem]">
              {service.name}
            </h1>
            <p className="mt-5 max-w-lg text-[19px] leading-snug font-medium">
              {service.short}
            </p>
            <p className="mt-5 max-w-prose text-[16px] leading-relaxed text-text-2">
              {service.body}
            </p>
          </div>

          <div className={`iso-block h-fit p-6 ${TONE_CLASS[service.tone]}`}>
            <span className="text-[13px] font-bold uppercase opacity-70">Starts at</span>
            <p className="nums iso-display mt-2 text-[2.5rem]">{service.from}</p>
            <p className="mt-3 text-[14px] font-medium opacity-80">
              Typical timeline: {service.timeline}
            </p>
            <Link
              href={`/contact?service=${service.slug}`}
              className="iso-block-sm iso-press mt-6 inline-flex h-11 w-full items-center justify-center bg-bg text-[14px] font-semibold text-text"
            >
              Get a quote
            </Link>
            <a
              href={whatsappLink(service.name.toLowerCase())}
              target="_blank"
              rel="noopener noreferrer"
              className="iso-block-sm iso-press mt-2 inline-flex h-11 w-full items-center justify-center gap-2 bg-bg text-[14px] font-semibold text-text"
            >
              <ChatPhoneIcon className="size-4" />
              WhatsApp us
            </a>
            <p className="mt-3 text-[12px] leading-relaxed opacity-70">
              The real number comes in a written scope, before any work starts.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ problem */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-16">
        <div className="iso-block v-scale bg-surface p-6 sm:p-10">
          <h2 className="text-[13px] font-bold tracking-tight uppercase text-text-3">
            When people come to us for this
          </h2>
          <p className="mt-4 max-w-3xl text-[19px] leading-relaxed">{service.problem}</p>
        </div>
      </section>

      {/* ----------------------------------------------------------- includes */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="iso-display v-wipe text-[2rem]">What is included</h2>
            <ul className="mt-6 flex flex-col gap-3 text-[15px]">
              {service.includes.map((point) => (
                <li key={point} className="flex gap-2.5">
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-iso-sky-text" />
                  <span className="text-text-2">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="iso-display v-wipe text-[2rem]">What you end up holding</h2>
            <ul className="mt-6 flex flex-col gap-3 text-[15px]">
              {service.deliverables.map((point) => (
                <li key={point} className="flex gap-2.5">
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-iso-sky-text" />
                  <span className="text-text-2">{point}</span>
                </li>
              ))}
            </ul>

            <div className="iso-block mt-8 bg-iso-black p-6 text-white">
              <h3 className="text-[13px] font-bold tracking-tight uppercase text-iso-yellow">
                What this is not
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/80">
                {service.notFor}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ process */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="iso-display v-wipe text-[2rem] sm:text-[2.5rem]">How it runs.</h2>
          <Link
            href="/process"
            className="inline-flex items-center gap-1 text-[14px] font-semibold text-iso-sky-text hover:underline"
          >
            The process in full
            <ChevronIcon className="size-4" />
          </Link>
        </div>
        <ol className="v-stagger mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* ------------------------------------------------------------ related */}
      {related.length ? (
        <section className="mx-auto w-full max-w-6xl px-4 pt-20">
          <h2 className="iso-display v-wipe text-[2rem] sm:text-[2.5rem]">
            Where we have done it.
          </h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.slug}>
                <Link href={`/work/${p.slug}`} className="group block">
                  <ProjectPreview
                    slug={p.slug}
                    swatch={p.swatch}
                    className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:-translate-y-1"
                  />
                  <p className="mt-4 text-[16px] font-semibold tracking-tight">{p.name}</p>
                  <p className="mt-0.5 text-[14px] text-text-2">{p.kind}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* -------------------------------------------------------------- other */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-20">
        <h2 className="iso-display text-[2rem] sm:text-[2.5rem]">Or something else.</h2>
        <ul className="mt-8 flex flex-wrap gap-2">
          {others.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className={`iso-block-sm iso-press inline-flex px-3 py-1.5 text-[14px] font-semibold tracking-tight ${TONE_CLASS[s.tone]}`}
              >
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------------------------------------------------------- cta */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-20">
        <div className="iso-block v-scale bg-iso-yellow px-6 py-14 text-center text-iso-black sm:px-12">
          <h2 className="iso-display mx-auto max-w-xl text-[2rem] sm:text-[2.75rem]">
            Get a price for this.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] opacity-80">
            Tell us the situation. You get a scope, a number and a date — or an
            honest no.
          </p>
          <Link
            href={`/contact?service=${service.slug}`}
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
