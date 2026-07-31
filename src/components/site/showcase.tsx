import Link from "next/link";
import { ChevronIcon } from "@/components/icons";
import { ProjectPreview } from "@/components/site/previews";
import type { Project } from "@/lib/site";

/**
 * The work strip.
 *
 * Two identical runs of the same projects slide past at a constant speed; at
 * the halfway mark the track is exactly where it started, so the loop has no
 * seam. Hovering or tabbing in stops it — reading beats moving — and the second
 * run is hidden from assistive technology and from the tab order, since it is
 * the same four links again.
 */

function Card({ project, clone }: { project: Project; clone: boolean }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block w-[17rem] shrink-0 sm:w-[26rem]"
      aria-hidden={clone || undefined}
      tabIndex={clone ? -1 : undefined}
    >
      <ProjectPreview
        slug={project.slug}
        swatch={project.swatch}
        className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:-translate-y-1"
      />
      <div className="mt-4 flex items-baseline gap-2">
        <p className="text-[16px] font-semibold tracking-tight">{project.name}</p>
        {project.inHouse ? (
          <span className="iso-block-sm ml-auto bg-iso-sky px-2 py-0.5 text-[11px] font-bold text-iso-black">
            In-house
          </span>
        ) : null}
      </div>
      <p className="mt-0.5 text-[14px] text-text-2">{project.kind}</p>
      <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-iso-sky-text">
        Read the case study
        <ChevronIcon className="size-3.5 transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export function WorkShowcase({ projects }: { projects: Project[] }) {
  return (
    <div className="marquee-hold marquee-fade overflow-hidden py-2">
      <div className="marquee gap-5" style={{ ["--marquee-dur" as string]: "56s" }}>
        {projects.map((p) => (
          <Card key={p.slug} project={p} clone={false} />
        ))}
        {projects.map((p) => (
          <Card key={`${p.slug}-clone`} project={p} clone />
        ))}
      </div>
    </div>
  );
}
