/**
 * Hanubees Technologies — the company site's content.
 *
 * Kept in one place because the home page shows a slice of each list and the
 * dedicated pages show all of it. Copy lives here, layout lives in the pages.
 */

export type Tone = "yellow" | "sky" | "black" | "white";

export const TONE_CLASS: Record<Tone, string> = {
  yellow: "bg-iso-yellow text-iso-black",
  sky: "bg-iso-sky text-iso-black",
  black: "bg-iso-black text-white",
  white: "bg-iso-white text-iso-black",
};

/** No phone here on purpose — add one only when it is a real, answered line. */
export const CONTACT = {
  email: "hello@hanubees.com",
  city: "Coimbatore, Tamil Nadu",
};

/* ------------------------------------------------------------------ services */

export type Service = {
  slug: string;
  name: string;
  short: string;
  body: string;
  tone: Tone;
  includes: string[];
  from: string;
  timeline: string;
};

export const SERVICES: Service[] = [
  {
    slug: "websites",
    name: "Websites",
    short: "The site your customers judge you by.",
    body: "Marketing sites, landing pages and company sites — written, designed and built by the same team, so the words and the layout arrive together instead of one waiting on the other.",
    tone: "yellow",
    includes: [
      "Copy and design, not just a template fill",
      "Built for phones first",
      "Search-ready markup and metadata",
      "You get the code, on your own GitHub",
    ],
    from: "₹35,000",
    timeline: "2–3 weeks",
  },
  {
    slug: "web-apps",
    name: "Web apps & SaaS",
    short: "Software with users, accounts and money in it.",
    body: "Dashboards, portals, booking systems, internal tools — the kind of product where the hard part is the twentieth screen, not the first. Auth, roles, billing and an admin that your own team can actually run.",
    tone: "sky",
    includes: [
      "Accounts, roles and permissions",
      "An admin your staff can use unattended",
      "Payments and subscriptions",
      "Deployed on infrastructure you own",
    ],
    from: "₹1,50,000",
    timeline: "6–12 weeks",
  },
  {
    slug: "ecommerce",
    name: "E-commerce",
    short: "Storefronts that take orders on day one.",
    body: "A store, a catalogue and a real order pipeline — on our own commerce platform, or on Shopify if that is where your business already lives. Either way it ships with the boring parts finished: stock, discounts, invoices, courier handoff.",
    tone: "black",
    includes: [
      "Catalogue, variants and stock",
      "Payments and shipping wired up",
      "Discounts and abandoned-cart recovery",
      "Migration from an existing store",
    ],
    from: "₹60,000",
    timeline: "3–5 weeks",
  },
  {
    slug: "mobile",
    name: "Mobile apps",
    short: "One build, both stores.",
    body: "Customer apps and field apps built once and shipped to Android and iOS, sharing a backend with your web product so there is one source of truth rather than two that drift apart.",
    tone: "white",
    includes: [
      "Android and iOS from one codebase",
      "Push notifications and offline handling",
      "Store submission handled for you",
      "Shares its backend with your website",
    ],
    from: "₹2,00,000",
    timeline: "8–14 weeks",
  },
  {
    slug: "ai",
    name: "AI & automation",
    short: "The repetitive half of the job, done by software.",
    body: "Assistants that answer from your own documents, extraction pipelines that read invoices and forms, and automations that move work between the tools you already pay for. Scoped to a task with a measurable before and after.",
    tone: "yellow",
    includes: [
      "Assistants grounded in your own data",
      "Document and image understanding",
      "Workflow automation across your tools",
      "Cost per request measured, not guessed",
    ],
    from: "₹75,000",
    timeline: "3–6 weeks",
  },
  {
    slug: "care",
    name: "Care & support",
    short: "Someone who answers after launch.",
    body: "Most agencies disappear at handover. A care plan keeps the same people on your product: updates, monitoring, security patches and a monthly block of hours for the changes every live business needs.",
    tone: "sky",
    includes: [
      "Uptime and error monitoring",
      "Dependency and security updates",
      "A block of change hours each month",
      "One channel, same people who built it",
    ],
    from: "₹8,000",
    timeline: "monthly",
  },
];

/* ---------------------------------------------------------------------- work */

export type Project = {
  slug: string;
  name: string;
  kind: string;
  year: string;
  summary: string;
  body: string;
  stack: string[];
  href?: string;
  /** In-house product rather than client work — labelled as such on the page. */
  inHouse?: boolean;
  swatch: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "hanubees-commerce",
    name: "Hanubees Commerce",
    kind: "Commerce platform",
    year: "2026",
    summary:
      "A multi-tenant commerce platform: every merchant gets a storefront on its own subdomain plus a full admin — orders, inventory, customers, discounts, analytics.",
    body: "Built as a platform rather than a site. One codebase serves every storefront, tenants are resolved at the edge from the hostname, and the merchant admin covers the whole order lifecycle. It is also what our own e-commerce clients ship on.",
    stack: ["Next.js", "React", "Tailwind", "Postgres"],
    href: "/commerce",
    inHouse: true,
    swatch: "linear-gradient(135deg, #f0b000 0%, #d09400 55%, #221a14 100%)",
  },
  {
    slug: "annam",
    name: "Annam",
    kind: "AI product",
    year: "2026",
    summary:
      "Photograph a plate of Indian food, get calories and macros back per item — idli, sambar, poha, the katori of dal included.",
    body: "A vision model tuned for Indian plates, where the hard part is not detection but portions: a katori, a ladle of sambar, a spoon of ghee. Built end to end, from the camera screen to the macro breakdown.",
    stack: ["Next.js", "Vision models", "Vercel"],
    inHouse: true,
    swatch: "linear-gradient(135deg, #90d0f0 0%, #6bb4dd 50%, #1f6088 100%)",
  },
  {
    slug: "reaching-dreams",
    name: "Reaching Dreams",
    kind: "Online store",
    year: "2026",
    summary:
      "A print-on-demand apparel brand — storefront, catalogue and a fulfilment pipeline that hands each order to the printer automatically.",
    body: "Brand, store and operations set up together so the founder never touches a spreadsheet: an order placed on the site becomes a print job without anyone re-typing it.",
    stack: ["Shopify", "Liquid", "Fulfilment API"],
    swatch: "linear-gradient(135deg, #221a14 0%, #4a3a1c 55%, #f0b000 100%)",
  },
  {
    slug: "gs-cosmatics",
    name: "GS Cosmatics",
    kind: "Online store",
    year: "2026",
    summary:
      "A cosmetics label brought online — a gold-accented storefront on our own platform, with the catalogue and campaign pages run by the owner.",
    body: "The brand had an identity and no way to sell. We kept the gold, built the storefront on Hanubees Commerce, and handed over an admin the owner runs without us.",
    stack: ["Hanubees Commerce", "Next.js"],
    swatch: "linear-gradient(135deg, #fbfaf7 0%, #f0d9a8 50%, #a06912 100%)",
  },
];

/* ------------------------------------------------------------------- process */

export const PROCESS = [
  {
    title: "Talk",
    body: "A call, an hour, free. We work out what the software has to do, what it must not do, and whether we are the right people to build it.",
  },
  {
    title: "Scope",
    body: "A written plan with screens, milestones, a fixed price and a date. Nothing starts until you have read it and agreed to it.",
  },
  {
    title: "Build",
    body: "You get a live link from week one and it updates as we go. Weekly demos, no black box, no month of silence ending in a surprise.",
  },
  {
    title: "Ship & keep",
    body: "We launch, hand over the code and the accounts, and stay on a care plan if you want the same people maintaining it.",
  },
];

/* ---------------------------------------------------------------------- faqs */

export const FAQS = [
  {
    q: "Who owns the code?",
    a: "You do, from the first commit. It lives in your GitHub organisation and your hosting account, and nothing we build depends on us staying around.",
  },
  {
    q: "How do you charge?",
    a: "Fixed price against a written scope for defined projects, and a monthly rate for ongoing product work. No hourly billing, no invoice you could not have predicted.",
  },
  {
    q: "How long does it take?",
    a: "A website is two to three weeks. A product with accounts and payments is six to twelve. We give you a date in the scope document and we hold it.",
  },
  {
    q: "Do you work with businesses outside India?",
    a: "Yes. We are in Coimbatore and work across time zones — most clients get a written update daily and a call weekly, which turns out to matter more than sharing an office.",
  },
  {
    q: "Can you take over something already half built?",
    a: "Often. We start with a paid audit of the existing code, tell you honestly whether it is worth continuing, and only then quote for the rest.",
  },
  {
    q: "What do you need from us?",
    a: "One person who can make decisions, and an hour a week. We handle design, copy, build, deployment and the store submissions.",
  },
];

/* ------------------------------------------------------------------ services */

export const CAPABILITIES = [
  "Next.js & React",
  "TypeScript",
  "Postgres",
  "React Native",
  "AI integration",
  "Payments",
  "Cloud & DevOps",
];
