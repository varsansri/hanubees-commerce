import Link from "next/link";
import { Logo } from "@/components/logo";
import { CONTACT, SERVICES } from "@/lib/site";

const COMPANY = [
  { href: "/work", label: "Work" },
  { href: "/process", label: "How we work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/commerce", label: "Hanubees Commerce" },
];

const LEGAL = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t-2 border-iso-black">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo size={32} />
          <p className="mt-4 max-w-[22ch] text-[14px] leading-relaxed text-text-2">
            Hanubees Technologies builds websites, software and AI tools for
            businesses.
          </p>
        </div>

        <div>
          <h2 className="text-[13px] font-bold tracking-tight uppercase">Services</h2>
          <ul className="mt-4 flex flex-col gap-2 text-[14px] text-text-2">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="hover:text-text">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[13px] font-bold tracking-tight uppercase">Company</h2>
          <ul className="mt-4 flex flex-col gap-2 text-[14px] text-text-2">
            {COMPANY.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-text">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[13px] font-bold tracking-tight uppercase">Get in touch</h2>
          <ul className="mt-4 flex flex-col gap-2 text-[14px] text-text-2">
            <li>
              <a href={`mailto:${CONTACT.email}`} className="hover:text-text">
                {CONTACT.email}
              </a>
            </li>
            <li>{CONTACT.city}</li>
          </ul>
          <Link
            href="/contact"
            className="iso-block-sm iso-press mt-5 inline-flex h-10 items-center bg-iso-yellow px-4 text-[14px] font-semibold text-iso-black"
          >
            Start a project
          </Link>
        </div>
      </div>

      <div className="border-t-2 border-iso-black">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-3 px-4 py-6 text-[13px] text-text-2">
          <span>© {new Date().getFullYear()} Hanubees Technologies</span>
          {LEGAL.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-text">
              {l.label}
            </Link>
          ))}
          <span className="ml-auto">Made in Coimbatore</span>
        </div>
      </div>
    </footer>
  );
}
