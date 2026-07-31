import Link from "next/link";
import { ChatPhoneIcon, MenuIcon } from "@/components/icons";
import { Wordmark } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { whatsappLink } from "@/lib/site";

/**
 * The company site's header.
 *
 * The small-screen menu is a checkbox and a label — no JavaScript, so it works
 * on the first paint of a static page, the same trick the admin drawer uses.
 */

const LINKS = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/process", label: "How we work" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-iso-black bg-bg">
      <input id="hb-menu" type="checkbox" className="peer sr-only" />

      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link href="/" aria-label="Hanubees home">
          <Wordmark size={28} priority />
        </Link>

        <nav className="ml-8 hidden items-center gap-6 text-[14px] font-medium text-text-2 md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-text">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/contact"
            className="iso-block-sm iso-press hidden h-10 items-center bg-iso-yellow px-4 text-[14px] font-semibold text-iso-black md:inline-flex"
          >
            Start a project
          </Link>

          <label
            htmlFor="hb-menu"
            className="iso-block-sm iso-press inline-flex size-10 cursor-pointer items-center justify-center bg-iso-white text-iso-black md:hidden"
            aria-label="Open menu"
          >
            <MenuIcon />
          </label>
        </div>
      </div>

      <div className="hidden border-t-2 border-iso-black bg-bg peer-checked:block md:!hidden">
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 text-[15px] font-medium">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="py-2 text-text-2 hover:text-text">
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="iso-block-sm iso-press mt-2 inline-flex h-11 items-center justify-center bg-iso-yellow font-semibold text-iso-black"
          >
            Start a project
          </Link>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="iso-block-sm iso-press mt-1 inline-flex h-11 items-center justify-center gap-2 bg-iso-white font-semibold text-iso-black"
          >
            <ChatPhoneIcon className="size-[18px]" />
            WhatsApp us
          </a>
        </nav>
      </div>
    </header>
  );
}
