import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal";
import { CONTACT, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What Hanubees Technologies collects, why, how long it is kept, and how to have it removed.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy"
      updated="31 July 2026"
      intro={`This explains what ${SITE.name} does with information about you — on this website, and in the products we run. It is written to be read, not to be survived.`}
      sections={[
        {
          heading: "The short version",
          paragraphs: [
            "We collect as little as we can get away with. We do not sell anything about you, and we do not share it with advertisers.",
            "Browsing this site does not require an account and does not require you to identify yourself.",
          ],
        },
        {
          heading: "What we collect",
          paragraphs: ["Three things, in three different situations:"],
          list: [
            "When you send an enquiry: your name, email, company and whatever you write in the message. The form opens your own email application, so this reaches us as an ordinary email and nothing is stored on this website.",
            "When you create an account in one of our products: your email, the details you enter, and the records the product exists to keep — orders, products, customers. That data belongs to you.",
            "When you simply visit: standard server and analytics records — page requested, approximate region, browser type, referring page. We use these to see which pages work, not to identify you.",
          ],
        },
        {
          heading: "Why we collect it",
          paragraphs: [
            "To reply to you, to run the product you signed up for, to keep it secure, and to understand which parts of this site are useful. Nothing is collected for advertising, and we run no advertising trackers on this site.",
          ],
        },
        {
          heading: "Who else sees it",
          paragraphs: [
            "Only the services we need to operate: our hosting provider, our database provider, our email provider, and analytics. Each sees only what its job requires, and each is bound by its own agreement with us.",
            "For client projects, anything you share with us during the work — content, credentials, business data — stays with the people working on your project and is returned or destroyed when it ends. We sign your NDA if you have one.",
          ],
        },
        {
          heading: "How long we keep it",
          paragraphs: [
            "Enquiries: as long as the conversation is live, and for our records afterwards unless you ask us to delete them.",
            "Product accounts: while the account exists. Delete the account and the data goes with it, apart from records we are required to keep for tax or legal reasons.",
            "Analytics: in aggregate, indefinitely; nothing in it identifies you.",
          ],
        },
        {
          heading: "Your choices",
          paragraphs: [
            `Write to ${CONTACT.email} and you can ask for a copy of what we hold about you, ask us to correct it, or ask us to delete it. We will do it, and we will not make you explain why.`,
          ],
        },
        {
          heading: "Cookies",
          paragraphs: [
            "This site sets a cookie to remember whether you chose the light or dark theme, and a session cookie if you sign in to a product. There are no advertising or cross-site tracking cookies.",
          ],
        },
        {
          heading: "Changes",
          paragraphs: [
            "If this policy changes in a way that matters, the date at the top changes and — if you have an account — we tell you.",
          ],
        },
        {
          heading: "Contact",
          paragraphs: [
            `${SITE.name}, ${CONTACT.city}, ${CONTACT.country}. Questions about any of this go to ${CONTACT.email}.`,
          ],
        },
      ]}
    />
  );
}
