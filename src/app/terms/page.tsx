import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal";
import { CONTACT, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "The terms this website is offered under, and the default terms we work to on client projects.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms"
      updated="31 July 2026"
      intro={`These cover two things: using this website, and the default shape of a project with ${SITE.name}. A signed proposal always wins over anything written here.`}
      sections={[
        {
          heading: "Using this website",
          paragraphs: [
            "Everything here is offered as information. Prices shown are starting points for typical work, not offers capable of acceptance — the binding number is the one in your scope document.",
            "The text, design and artwork on this site are ours. The code we write for you is a different matter, covered below.",
          ],
        },
        {
          heading: "How a project starts",
          paragraphs: [
            "We write a scope document: what is being built, what is excluded, the milestones, the fixed price and the date. Work begins when you accept it in writing and the first instalment is paid.",
            "Anything outside that document is a change. We price changes in days before making them, and record them as a short amendment so the total never moves quietly.",
          ],
        },
        {
          heading: "Payment",
          paragraphs: [
            "Fixed-price projects are usually billed in three parts: on acceptance, at the agreed midpoint, and on launch. Monthly engagements are billed at the start of each month.",
            "Invoices are payable within fourteen days. Taxes are added as applicable in India.",
          ],
        },
        {
          heading: "Who owns what",
          paragraphs: [
            "On final payment, everything built specifically for you — code, design files, content we wrote — is yours outright, including the right to change it or have someone else change it.",
            "We keep ownership of our own general-purpose tools and libraries that existed before your project. Where any of those are used inside your product, you get a perpetual, irrevocable licence to keep using them as part of it, at no further cost.",
            "Third-party components keep their own licences. We tell you which ones are in your product and what those licences require.",
          ],
        },
        {
          heading: "What you provide",
          paragraphs: [
            "One person who can make decisions, content and access we ask for, and responses within a few working days. If a project stalls on our side we absorb it; if it stalls on yours for more than thirty days, we may pause it and re-book the team.",
            "You confirm you have the right to use anything you give us — logos, photographs, text, data.",
          ],
        },
        {
          heading: "After launch",
          paragraphs: [
            "Two weeks of fixes are included after launch: anything that does not do what the scope said it would. New ideas that arrive in those two weeks are welcome, and are quoted as changes.",
            "Care plans run month to month. Either side can end one with thirty days' notice, and ending it never affects your ownership of anything.",
          ],
        },
        {
          heading: "Limits",
          paragraphs: [
            "We build carefully, test what we ship and monitor what is live, but no software is warranted to be free of defects. Except where the law does not allow it to be limited, our liability for any project is capped at the fees you have paid us for that project.",
            "We are not liable for outages at third parties — hosting, payment gateways, model providers — though we will help you get through them.",
          ],
        },
        {
          heading: "Confidentiality",
          paragraphs: [
            "Anything you tell us about your business stays between us, for as long as it stays confidential on your side. We are happy to sign your NDA before the first call.",
          ],
        },
        {
          heading: "Showing the work",
          paragraphs: [
            "We would like to show your project in our portfolio once it is public. Tell us not to, at any point, and we will not — and we will remove it if it is already there.",
          ],
        },
        {
          heading: "Law",
          paragraphs: [
            `These terms are governed by the laws of India, and the courts at Coimbatore, Tamil Nadu have jurisdiction. Before anyone involves a court, we agree to spend an hour on a call trying to sort it out.`,
          ],
        },
        {
          heading: "Contact",
          paragraphs: [
            `${SITE.name}, ${CONTACT.city}, ${CONTACT.country}. Questions go to ${CONTACT.email}.`,
          ],
        },
      ]}
    />
  );
}
