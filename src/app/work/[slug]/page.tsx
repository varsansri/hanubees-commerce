import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckIcon, ChevronIcon } from "@/components/icons";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ProjectPreview } from "@/components/site/previews";
import { BreadcrumbJsonLd } from "@/components/site/json-ld";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { PROJECTS, SERVICES, TONE_CLASS, projectBySlug } from "@/lib/site";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const project = projectBySlug((await params).slug);
  if (!project) return { title: "Work" };
  return {
    title: `${project.name} — ${project.kind}`,
    description: project.summary.slice(0, 160),
    alternates: { canonical: `/work/${project.slug}` },
  };
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  const index = PROJECTS.findIndex((p) => p.slug === project.slug);
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const services = SERVICES.filter((s) => project.services.includes(s.slug));
  const trail = [
    { name: "Home", href: "/" },
    { name: "Work", href: "/work" },
    { name: project.name, href: `/work/${project.slug}` },
  ];

  return (
    <div className="flex min-h-full flex-col">
      <BreadcrumbJsonLd trail={trail} />
      <SiteHeader />

      {/* --------------------------------------------------------------- head */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-8 sm:pt-10">
        <Breadcrumbs trail={trail} />

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="iso-block-sm bg-surface px-2.5 py-1 text-[12px] font-bold tracking-tight">
            {project.kind}
          </span>
          <span className="nums text-[13px] font-medium text-text-3">{project.year}</span>
          {project.inHouse ? (
            <span className="iso-block-sm bg-iso-sky px-2.5 py-1 text-[12px] font-bold text-iso-black">
              In-house product
            </span>
          ) : null}
        </div>

        <h1 className="iso-display mt-5 text-[2.5rem] sm:text-[3.75rem]">
          {project.name}
        </h1>
        <p className="mt-5 max-w-2xl text-[19px] leading-relaxed text-text-2">
          {project.summary}
        </p>

        <ProjectPreview
          slug={project.slug}
          swatch={project.swatch}
          className="v-scale mt-10 w-full"
        />

        <dl className="mt-10 grid gap-5 border-t-2 border-iso-black pt-8 sm:grid-cols-3">
          <div>
            <dt className="text-[13px] font-bold uppercase text-text-3">Our part</dt>
            <dd className="mt-1.5 text-[15px] font-medium">{project.role}</dd>
          </div>
          <div>
            <dt className="text-[13px] font-bold uppercase text-text-3">Time</dt>
            <dd className="mt-1.5 text-[15px] font-medium">{project.duration}</dd>
          </div>
          <div>
            <dt className="text-[13px] font-bold uppercase text-text-3">Built with</dt>
            <dd className="mt-1.5 flex flex-wrap gap-1.5">
              {project.stack.map((t) => (
                <span
                  key={t}
                  className="iso-block-sm bg-bg px-2 py-0.5 text-[12px] font-semibold tracking-tight"
                >
                  {t}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </section>

      {/* -------------------------------------------------------------- story */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-12">
          <h2 className="iso-display v-wipe text-[2rem] sm:text-[2.5rem]">Where it started.</h2>
          <p className="max-w-prose text-[17px] leading-relaxed text-text-2">
            {project.context}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pt-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-12">
          <h2 className="iso-display v-wipe text-[2rem] sm:text-[2.5rem]">What we did.</h2>
          <div>
            <p className="max-w-prose text-[17px] leading-relaxed text-text-2">
              {project.body}
            </p>
            <ul className="v-stagger mt-8 flex flex-col gap-4">
              {project.did.map((d, i) => (
                <li key={d} className="iso-block flex gap-4 bg-surface p-5" style={{ ["--i" as string]: i }}>
                  <span className="nums text-[13px] font-bold text-iso-sky-text">
                    0{i + 1}
                  </span>
                  <span className="text-[15px] leading-relaxed text-text-2">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pt-16">
        <div className="iso-block v-scale bg-iso-black p-6 text-white sm:p-10">
          <h2 className="text-[13px] font-bold tracking-tight uppercase text-iso-yellow">
            Where it stands
          </h2>
          <p className="mt-4 max-w-3xl text-[19px] leading-relaxed">{project.result}</p>
          {project.href ? (
            <Link
              href={project.href}
              className="iso-block-sm iso-press mt-8 inline-flex h-11 items-center bg-iso-yellow px-5 text-[14px] font-semibold text-iso-black"
            >
              Look at it
            </Link>
          ) : null}
        </div>
      </section>

      {/* ----------------------------------------------------------- services */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-16">
        <h2 className="iso-display text-[2rem]">What this took.</h2>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className={`iso-block iso-press flex h-full flex-col p-6 transition-transform duration-200 ease-[var(--ease-out)] hover:-translate-y-1 ${TONE_CLASS[s.tone]}`}
              >
                <h3 className="iso-display text-[1.5rem]">{s.name}</h3>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed opacity-90">
                  {s.short}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-[13px] font-bold opacity-80">
                  What it involves
                  <ChevronIcon className="size-3.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* --------------------------------------------------------------- next */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-20">
        <Link
          href={`/work/${next.slug}`}
          className="iso-block iso-press flex flex-wrap items-center gap-6 bg-surface p-6 transition-transform duration-200 ease-[var(--ease-out)] hover:-translate-y-1"
        >
          <div
            className="iso-block-sm size-20 shrink-0"
            style={{ background: next.swatch }}
            aria-hidden
          />
          <div>
            <span className="text-[13px] font-bold uppercase text-text-3">Next</span>
            <p className="iso-display mt-1 text-[1.75rem]">{next.name}</p>
            <p className="mt-1 text-[14px] text-text-2">{next.kind}</p>
          </div>
          <ChevronIcon className="ml-auto hidden size-6 text-text-3 sm:block" />
        </Link>
      </section>

      {/* ---------------------------------------------------------------- cta */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-20">
        <div className="iso-block bg-iso-yellow px-6 py-14 text-center text-iso-black sm:px-12">
          <h2 className="iso-display mx-auto max-w-xl text-[2rem] sm:text-[2.75rem]">
            Want one of these?
          </h2>
          <ul className="mx-auto mt-6 flex max-w-md flex-col gap-2 text-left text-[14px]">
            {[
              "A scope and a fixed price before anything starts",
              "A live link from the first week",
              "The code in your account at the end",
            ].map((p) => (
              <li key={p} className="flex gap-2">
                <CheckIcon className="mt-0.5 size-4 shrink-0" />
                <span className="opacity-80">{p}</span>
              </li>
            ))}
          </ul>
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
