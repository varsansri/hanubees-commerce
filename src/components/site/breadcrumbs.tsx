import Link from "next/link";
import { ChevronIcon } from "@/components/icons";

/** The trail back out of a detail page. The last item is where you are. */
export function Breadcrumbs({ trail }: { trail: { name: string; href: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-[13px] font-medium text-text-3">
        {trail.map((t, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={t.href} className="flex items-center gap-1">
              {last ? (
                <span aria-current="page" className="text-text-2">
                  {t.name}
                </span>
              ) : (
                <Link href={t.href} className="hover:text-text">
                  {t.name}
                </Link>
              )}
              {last ? null : <ChevronIcon className="size-3.5" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
