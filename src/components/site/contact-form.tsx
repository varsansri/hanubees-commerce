"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { CONTACT, SERVICES } from "@/lib/site";

/**
 * The enquiry form.
 *
 * There is no inbox on the server yet, so rather than pretend to send, the form
 * composes the email and hands it to the visitor's own mail app. Everything
 * they typed comes along, and nothing is silently dropped — which is what a
 * fake success screen would do. Swap `handoff` for a server action the day
 * there is somewhere to store leads.
 */

const BUDGETS = [
  "Under ₹50,000",
  "₹50,000 – ₹2,00,000",
  "₹2,00,000 – ₹6,00,000",
  "Over ₹6,00,000",
  "Not sure yet",
];

const FIELD =
  "iso-block-sm h-11 w-full bg-bg px-3 text-[15px] text-text placeholder:text-text-3";

export function ContactForm() {
  return (
    <Suspense fallback={null}>
      <Form />
    </Suspense>
  );
}

function Form() {
  // /services links arrive as ?service=web-apps, so the right one is preselected.
  const preset = useSearchParams().get("service") ?? "";
  const [service, setService] = useState(
    SERVICES.some((s) => s.slug === preset) ? preset : "",
  );

  function handoff(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const get = (k: string) => String(form.get(k) ?? "").trim();
    const chosen = SERVICES.find((s) => s.slug === get("service"))?.name ?? "Not sure";

    const body = [
      `Name: ${get("name")}`,
      `Company: ${get("company") || "—"}`,
      `Email: ${get("email")}`,
      `Looking for: ${chosen}`,
      `Budget: ${get("budget") || "—"}`,
      "",
      get("message"),
    ].join("\n");

    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
      `Project enquiry — ${get("name") || "new"}`,
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={handoff} className="iso-block bg-surface p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-[13px] font-semibold tracking-tight">Your name</span>
          <input name="name" required autoComplete="name" className={`mt-1.5 ${FIELD}`} />
        </label>

        <label className="block">
          <span className="text-[13px] font-semibold tracking-tight">Company</span>
          <input
            name="company"
            autoComplete="organization"
            placeholder="Optional"
            className={`mt-1.5 ${FIELD}`}
          />
        </label>

        <label className="block">
          <span className="text-[13px] font-semibold tracking-tight">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className={`mt-1.5 ${FIELD}`}
          />
        </label>

        <label className="block">
          <span className="text-[13px] font-semibold tracking-tight">Budget</span>
          <select name="budget" className={`mt-1.5 ${FIELD}`} defaultValue="">
            <option value="">Choose one</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="mt-6">
        <legend className="text-[13px] font-semibold tracking-tight">
          What do you need?
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <label
              key={s.slug}
              className={`iso-block-sm iso-press cursor-pointer px-3 py-1.5 text-[13px] font-semibold tracking-tight ${
                service === s.slug ? "bg-iso-yellow text-iso-black" : "bg-bg text-text-2"
              }`}
            >
              <input
                type="radio"
                name="service"
                value={s.slug}
                checked={service === s.slug}
                onChange={() => setService(s.slug)}
                className="sr-only"
              />
              {s.name}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-6 block">
        <span className="text-[13px] font-semibold tracking-tight">
          What are you trying to build?
        </span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="The problem, who it is for, and any date you are working towards."
          className="iso-block-sm mt-1.5 w-full bg-bg p-3 text-[15px] leading-relaxed text-text placeholder:text-text-3"
        />
      </label>

      <button
        type="submit"
        className="iso-block-sm iso-press mt-6 inline-flex h-12 items-center bg-iso-yellow px-6 text-[15px] font-semibold text-iso-black"
      >
        Send enquiry
      </button>
      <p className="mt-3 text-[13px] text-text-3">
        Opens in your email app with everything above filled in — so you keep a
        copy of what you sent. We reply within one working day.
      </p>
    </form>
  );
}
