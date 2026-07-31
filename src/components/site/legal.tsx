import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

/**
 * The shell the two legal pages share.
 *
 * Deliberately plainer than the rest of the world — long text wants one narrow
 * column, ordinary weight and generous line height, not blocks.
 */
export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: { heading: string; paragraphs: string[]; list?: string[] }[];
}) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <article className="mx-auto w-full max-w-3xl px-4 pt-12 sm:pt-16">
        <h1 className="iso-display text-[2.5rem] sm:text-[3.25rem]">{title}</h1>
        <p className="mt-4 text-[13px] font-medium text-text-3">
          Last updated {updated}
        </p>
        <p className="mt-6 text-[17px] leading-relaxed text-text-2">{intro}</p>

        {sections.map((s) => (
          <section key={s.heading} className="mt-12">
            <h2 className="iso-display text-[1.5rem]">{s.heading}</h2>
            {s.paragraphs.map((p) => (
              <p key={p} className="mt-4 text-[16px] leading-relaxed text-text-2">
                {p}
              </p>
            ))}
            {s.list ? (
              <ul className="mt-4 flex flex-col gap-2 text-[16px] leading-relaxed text-text-2">
                {s.list.map((li) => (
                  <li key={li} className="flex gap-3">
                    <span aria-hidden className="text-iso-sky-text">
                      —
                    </span>
                    <span>{li}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </article>

      <SiteFooter />
    </div>
  );
}
