/**
 * Hanubees Technologies — the company site's content.
 *
 * Kept in one place because the home page shows a slice of each list, the index
 * pages show all of it, and the detail pages show the long form. Copy lives
 * here, layout lives in the pages.
 */

export const SITE = {
  name: "Hanubees Technologies",
  short: "Hanubees",
  url: "https://hanubees.com",
  tagline: "Websites and software for businesses",
  founded: "2026",
};

export type Tone = "yellow" | "sky" | "black" | "white";

export const TONE_CLASS: Record<Tone, string> = {
  yellow: "bg-iso-yellow text-iso-black",
  sky: "bg-iso-sky text-iso-black",
  black: "bg-iso-black text-white",
  white: "bg-iso-white text-iso-black",
};

export const CONTACT = {
  email: "hello@hanubees.com",
  /** E.164, for tel: and wa.me links. */
  phone: "+917695971495",
  /** Grouped the way an Indian number is read aloud. */
  phoneDisplay: "+91 76959 71495",
  city: "Coimbatore, Tamil Nadu",
  country: "India",
};

/**
 * WhatsApp is how businesses here actually start a conversation, so it gets a
 * real button rather than a footer link. The message is pre-filled but plain —
 * enough that the reply has context, short enough that nobody deletes it.
 */
export function whatsappLink(about?: string) {
  const text = about
    ? `Hi Hanubees — I'd like to talk about ${about}.`
    : "Hi Hanubees — I'd like to talk about a project.";
  return `https://wa.me/${CONTACT.phone.replace("+", "")}?text=${encodeURIComponent(text)}`;
}

/* ------------------------------------------------------------------ services */

export type Service = {
  slug: string;
  name: string;
  short: string;
  body: string;
  tone: Tone;
  /** The situation a client is usually in when they ask for this. */
  problem: string;
  includes: string[];
  /** What physically lands in your hands at the end. */
  deliverables: string[];
  /** Honest limits — the work we would turn down or send elsewhere. */
  notFor: string;
  from: string;
  timeline: string;
  /** Slugs from PROJECTS that show this service in the wild. */
  related: string[];
};

export const SERVICES: Service[] = [
  {
    slug: "websites",
    name: "Websites",
    short: "The site your customers judge you by.",
    body: "Marketing sites, landing pages and company sites — written, designed and built by the same team, so the words and the layout arrive together instead of one waiting on the other.",
    tone: "yellow",
    problem:
      "You have a business that works and a website that does not represent it — built years ago by someone unreachable, or never built at all, so every enquiry starts with you explaining what you do from scratch.",
    includes: [
      "Copy and design, not just a template fill",
      "Built for phones first",
      "Search-ready markup, metadata and sitemaps",
      "A page you can edit without calling us",
      "Analytics, so you know what the site is doing",
      "You get the code, on your own GitHub",
    ],
    deliverables: [
      "A live site on your domain",
      "The design file, yours to keep",
      "The repository, transferred to your account",
      "A short handover call, recorded",
    ],
    notFor:
      "If what you need is ten thousand programmatic landing pages for SEO arbitrage, we are the wrong studio — that is a content operation, not a design one.",
    from: "₹35,000",
    timeline: "2–3 weeks",
    related: ["gs-cosmatics", "reaching-dreams"],
  },
  {
    slug: "web-apps",
    name: "Web apps & SaaS",
    short: "Software with users, accounts and money in it.",
    body: "Dashboards, portals, booking systems, internal tools — the kind of product where the hard part is the twentieth screen, not the first. Auth, roles, billing and an admin that your own team can actually run.",
    tone: "sky",
    problem:
      "The business runs on spreadsheets and WhatsApp, and it has stopped scaling. Everyone knows what the software should do; nobody has been able to get it built without it turning into a two-year project.",
    includes: [
      "Accounts, roles and permissions",
      "An admin your staff can use unattended",
      "Payments and subscriptions",
      "Reporting your finance team trusts",
      "Error monitoring from day one",
      "Deployed on infrastructure you own",
    ],
    deliverables: [
      "The product, live, on your infrastructure",
      "Admin accounts for your team",
      "Written handover: architecture, environments, runbook",
      "Two weeks of fixes after launch, included",
    ],
    notFor:
      "We do not take on projects where the scope is 'like Uber but for X' with no first user in mind. There has to be someone who will use version one.",
    from: "₹1,50,000",
    timeline: "6–12 weeks",
    related: ["hanubees-commerce"],
  },
  {
    slug: "ecommerce",
    name: "E-commerce",
    short: "Storefronts that take orders on day one.",
    body: "A store, a catalogue and a real order pipeline — on our own commerce platform, or on Shopify if that is where your business already lives. Either way it ships with the boring parts finished: stock, discounts, invoices, courier handoff.",
    tone: "black",
    problem:
      "You sell already — on Instagram, over the phone, out of a shop — and every order costs you twenty minutes of typing. Or you have a store that takes payments but nothing behind it, so fulfilment is still manual.",
    includes: [
      "Catalogue, variants and stock",
      "Payments and shipping wired up",
      "Discounts and abandoned-cart recovery",
      "Invoices and GST-ready order records",
      "An admin the owner runs, not the developer",
      "Migration from an existing store",
    ],
    deliverables: [
      "A live storefront on your domain",
      "The catalogue loaded, not left empty",
      "Payment and courier accounts connected in your name",
      "Training for whoever packs the orders",
    ],
    notFor:
      "If you need a marketplace with many sellers and split payouts, say so at the first call — that is a web app project, priced differently.",
    from: "₹60,000",
    timeline: "3–5 weeks",
    related: ["hanubees-commerce", "gs-cosmatics", "reaching-dreams"],
  },
  {
    slug: "mobile",
    name: "Mobile apps",
    short: "One build, both stores.",
    body: "Customer apps and field apps built once and shipped to Android and iOS, sharing a backend with your web product so there is one source of truth rather than two that drift apart.",
    tone: "white",
    problem:
      "Your customers or your field staff are on phones all day, and a website is not enough — you need notifications, the camera, or something that keeps working where the signal does not.",
    includes: [
      "Android and iOS from one codebase",
      "Push notifications and offline handling",
      "Camera, location and file uploads",
      "Store submission handled for you",
      "Over-the-air updates for small fixes",
      "Shares its backend with your website",
    ],
    deliverables: [
      "Apps live on Play Store and App Store",
      "Store listings, screenshots and descriptions",
      "The developer accounts, in your company's name",
      "A release process your team can run",
    ],
    notFor:
      "Games, and anything that needs heavy 3D or real-time video. Good work, wrong studio.",
    from: "₹2,00,000",
    timeline: "8–14 weeks",
    related: ["annam"],
  },
  {
    slug: "ai",
    name: "AI & automation",
    short: "The repetitive half of the job, done by software.",
    body: "Assistants that answer from your own documents, extraction pipelines that read invoices and forms, and automations that move work between the tools you already pay for. Scoped to a task with a measurable before and after.",
    tone: "yellow",
    problem:
      "Somebody on your team spends half their week copying information between systems, answering the same twenty questions, or reading documents to pull four fields out of each one.",
    includes: [
      "Assistants grounded in your own data",
      "Document and image understanding",
      "Workflow automation across your tools",
      "Human review where being wrong is expensive",
      "Cost per request measured, not guessed",
      "A fallback for when the model is unavailable",
    ],
    deliverables: [
      "The automation, running on a schedule or on demand",
      "An evaluation set, so you can prove it still works",
      "A cost model per thousand requests",
      "A written statement of what it must never do alone",
    ],
    notFor:
      "We will not build something that makes a final decision about a person — hiring, credit, medical — without a human in the loop. Ask us and we will tell you the same.",
    from: "₹75,000",
    timeline: "3–6 weeks",
    related: ["annam"],
  },
  {
    slug: "care",
    name: "Care & support",
    short: "Someone who answers after launch.",
    body: "Most studios disappear at handover. A care plan keeps the same people on your product: updates, monitoring, security patches and a monthly block of hours for the changes every live business needs.",
    tone: "sky",
    problem:
      "Something is live and nobody owns it. Dependencies rot, certificates expire, a page breaks on a Sunday, and the person who built it stopped replying months ago.",
    includes: [
      "Uptime and error monitoring",
      "Dependency and security updates",
      "A block of change hours each month",
      "Backups, tested rather than assumed",
      "A named channel, answered on working days",
      "The same people who built it",
    ],
    deliverables: [
      "A monthly written report: uptime, errors, what changed",
      "An agreed response time, in writing",
      "Hours that carry over one month",
    ],
    notFor:
      "We take on other people's codebases only after a paid audit. Sometimes the honest answer is that maintaining it costs more than replacing it.",
    from: "₹8,000",
    timeline: "monthly",
    related: ["hanubees-commerce"],
  },
];

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);

/* ---------------------------------------------------------------------- work */

export type Project = {
  slug: string;
  name: string;
  kind: string;
  year: string;
  summary: string;
  body: string;
  /** The situation before the work started. */
  context: string;
  /** What we actually did, in order. */
  did: string[];
  /** Where it ended up. Qualitative on purpose — no invented metrics. */
  result: string;
  role: string;
  duration: string;
  stack: string[];
  services: string[];
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
    context:
      "Small Indian sellers were paying monthly for hosted commerce and still could not get a storefront that looked like their brand, or an admin their staff could run without a developer on call.",
    did: [
      "Designed the merchant admin first — orders, inventory, customers, discounts, analytics — because that is the screen a shop lives in all day",
      "Made every storefront multi-tenant from one codebase, with the tenant resolved at the edge from the hostname",
      "Built the storefront theme system so two stores on the same platform look nothing alike",
      "Kept every product image as generated artwork, so no stock photo can ship by accident",
    ],
    result:
      "The platform runs several live storefronts on their own subdomains, and is the base we build client stores on rather than starting each one from nothing.",
    role: "Product design, platform engineering, ongoing",
    duration: "Ongoing since 2026",
    stack: ["Next.js", "React", "Tailwind", "Postgres", "Vercel"],
    services: ["web-apps", "ecommerce"],
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
    context:
      "Every calorie app on the market is trained on Western plates. Photograph a South Indian thali and it returns nothing useful, so anyone eating normal Indian food gives up in a week.",
    did: [
      "Wrote the vision prompt around Indian portion language — katori, ladle, spoon of ghee — rather than grams nobody weighs",
      "Built the whole path in one screen: camera, upload, per-item macros, correction",
      "Normalised model output defensively, so a bad response degrades instead of crashing the page",
      "Kept a second provider behind the first, because a single vision API is a single point of failure",
    ],
    result:
      "Built and running on preview. It is waiting on a production vision key before it goes public — the honest status, rather than a launch date we have not hit.",
    role: "Product, design, engineering",
    duration: "3 weeks",
    stack: ["Next.js", "Vision models", "Vercel"],
    services: ["ai", "mobile"],
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
    context:
      "A men's apparel label starting from nothing: no store, no catalogue, and a print partner whose orders would otherwise have been entered by hand, one at a time.",
    did: [
      "Set up the storefront and theme, and structured the catalogue around how the brand actually drops products",
      "Connected the print-on-demand partner so a paid order becomes a print job with no manual step",
      "Built the marketing site alongside the store, so campaigns have somewhere to land",
      "Flagged every stock photo in the theme for replacement before the first real sale",
    ],
    result:
      "The store takes orders and passes them to the printer without the founder in the middle. Product photography is the remaining gate before it is pushed publicly.",
    role: "Store build, brand setup, fulfilment integration",
    duration: "4 weeks",
    stack: ["Shopify", "Liquid", "Fulfilment API"],
    services: ["ecommerce", "websites"],
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
    context:
      "An established cosmetics label with a strong visual identity — gold on dark — and no online presence beyond social posts that could not take an order.",
    did: [
      "Kept the gold accent as the brand's identity and built the storefront around it rather than over it",
      "Brought the label onto Hanubees Commerce as a tenant, so it inherits every platform improvement",
      "Redesigned the home page around campaigns instead of a static product grid",
      "Handed over the admin with the catalogue already loaded",
    ],
    result:
      "The storefront is live on the platform and the owner runs the catalogue. Remaining pages are being redesigned in the same pass.",
    role: "Design, store build, handover",
    duration: "2 weeks",
    stack: ["Hanubees Commerce", "Next.js"],
    services: ["ecommerce", "websites"],
    swatch: "linear-gradient(135deg, #fbfaf7 0%, #f0d9a8 50%, #a06912 100%)",
  },
];

export const projectBySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug);

/* ------------------------------------------------------------------- process */

export const PROCESS = [
  {
    title: "Talk",
    body: "A call, an hour, free. We work out what the software has to do, what it must not do, and whether we are the right people to build it.",
    detail:
      "You describe the business and the problem; we ask the questions that change the price — who uses it, what it has to connect to, what happens today when it goes wrong. If the honest answer is that you need a spreadsheet, a plugin, or a different studio, you get that answer on this call rather than after an invoice.",
    yours: ["An hour", "Whoever can make the decision"],
    ours: ["Questions", "An honest read on fit"],
  },
  {
    title: "Scope",
    body: "A written plan with screens, milestones, a fixed price and a date. Nothing starts until you have read it and agreed to it.",
    detail:
      "We write the project down: every screen, what is in version one, what is deliberately not, the milestones, the fixed price and the launch date. It is short enough to read in one sitting. Larger projects start with a paid discovery week if the shape is not clear yet — you keep the document either way.",
    yours: ["A read-through", "Corrections where we misheard you"],
    ours: ["The scope document", "A fixed price and a date"],
  },
  {
    title: "Build",
    body: "You get a live link from week one and it updates as we go. Weekly demos, no black box, no month of silence ending in a surprise.",
    detail:
      "Design and build run together. From the first week there is a link you can open on your phone, and it changes as the work lands. Every week: a demo, a written update, and the current state of the plan. Changes are welcome — we tell you at the time what each one costs in days, before it is made.",
    yours: ["An hour a week", "Content, logins, decisions"],
    ours: ["A live link from week one", "A weekly demo and written update"],
  },
  {
    title: "Ship & keep",
    body: "We launch, hand over the code and the accounts, and stay on a care plan if you want the same people maintaining it.",
    detail:
      "Launch day is a checklist we have run before: domains, certificates, analytics, monitoring, backups. Then the handover — repository, hosting, third-party accounts, all in your name — and two weeks of fixes included. After that a care plan is optional, never a lock-in.",
    yours: ["A domain and the accounts in your name"],
    ours: ["Launch, handover, two weeks of fixes", "A care plan if you want one"],
  },
];

/* ---------------------------------------------------------------- industries */

export const INDUSTRIES = [
  {
    name: "Retail & D2C",
    body: "Shops and labels that sell online and off, and need both to agree about stock.",
  },
  {
    name: "Clinics & services",
    body: "Booking, records and reminders for businesses whose product is an appointment.",
  },
  {
    name: "Manufacturing & B2B",
    body: "Quotes, orders and dealer portals for businesses that sell to other businesses.",
  },
  {
    name: "Education",
    body: "Institutes and coaching centres: admissions, batches, fees, parent communication.",
  },
  {
    name: "Startups",
    body: "Founders who need a first version in the market this quarter, not next year.",
  },
  {
    name: "Local businesses",
    body: "The site, the listing and the WhatsApp funnel that make you findable at all.",
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
  {
    q: "What happens if we want changes mid-project?",
    a: "You ask, and we tell you what it costs in days before anything moves. Small changes usually absorb into the week; larger ones get a one-line amendment to the scope so the price never drifts quietly.",
  },
  {
    q: "Do you sign an NDA?",
    a: "Yes, before the first call if you prefer. Send yours or use ours.",
  },
];

/* -------------------------------------------------------------- capabilities */

export const CAPABILITIES = [
  "Next.js & React",
  "TypeScript",
  "Postgres",
  "React Native",
  "AI integration",
  "Payments",
  "Cloud & DevOps",
];
