import { CONTACT, FAQS, SITE } from "@/lib/site";

/**
 * Structured data.
 *
 * Search engines and AI assistants read this rather than guessing from the
 * markup: who the company is, where it is, what each service costs and what the
 * answers to the common questions are. It describes what the page already says
 * — never anything the visitor cannot also read.
 */

function Script({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // The payload is our own content, built above, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const ORGANISATION = {
  "@type": "Organization",
  "@id": `${SITE.url}/#organisation`,
  name: SITE.name,
  alternateName: SITE.short,
  url: SITE.url,
  logo: `${SITE.url}/bee.png`,
  email: CONTACT.email,
  foundingDate: SITE.founded,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Coimbatore",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  areaServed: "Worldwide",
  knowsAbout: [
    "Web development",
    "Software development",
    "E-commerce",
    "Mobile app development",
    "Artificial intelligence",
  ],
};

export function OrganisationJsonLd() {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@graph": [
          ORGANISATION,
          {
            "@type": "WebSite",
            "@id": `${SITE.url}/#website`,
            url: SITE.url,
            name: SITE.name,
            publisher: { "@id": `${SITE.url}/#organisation` },
          },
          {
            "@type": "FAQPage",
            "@id": `${SITE.url}/#faq`,
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ],
      }}
    />
  );
}

export function ServiceJsonLd({
  name,
  description,
  slug,
  price,
}: {
  name: string;
  description: string;
  slug: string;
  price: string;
}) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name,
        description,
        serviceType: name,
        url: `${SITE.url}/services/${slug}`,
        provider: ORGANISATION,
        areaServed: "Worldwide",
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          // The site says "from" everywhere; the offer says the same thing.
          price: price.replace(/[^\d]/g, ""),
          priceSpecification: {
            "@type": "PriceSpecification",
            minPrice: price.replace(/[^\d]/g, ""),
            priceCurrency: "INR",
          },
        },
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  trail,
}: {
  trail: { name: string; href: string }[];
}) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: t.name,
          item: `${SITE.url}${t.href}`,
        })),
      }}
    />
  );
}
