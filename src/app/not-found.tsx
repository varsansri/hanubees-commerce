import Link from "next/link";
import { Bee2D } from "@/components/fx/bee-2d";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

const ELSEWHERE = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/process", label: "How we work" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <section className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-20">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
          <div>
            <span className="nums iso-display block text-[5rem] text-iso-sky-text sm:text-[7rem]">
              404
            </span>
            <h1 className="iso-display mt-2 text-[2.25rem] sm:text-[3rem]">
              Nothing lives at this address.
            </h1>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-text-2">
              The page moved, or it never existed. Either way it is our filing,
              not your typing.
            </p>

            <ul className="mt-8 flex flex-wrap gap-2">
              {ELSEWHERE.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="iso-block-sm iso-press inline-flex h-11 items-center bg-surface px-4 text-[14px] font-semibold"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/"
                  className="iso-block-sm iso-press inline-flex h-11 items-center bg-iso-yellow px-4 text-[14px] font-semibold text-iso-black"
                >
                  Home
                </Link>
              </li>
            </ul>
          </div>

          <div className="iso-block hidden items-center justify-center bg-iso-white p-8 lg:flex">
            <Bee2D size={220} className="max-w-[80%]" />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
