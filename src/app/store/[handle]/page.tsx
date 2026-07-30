import Link from "next/link";
import { notFound } from "next/navigation";
import { getStore, listStores, listStorefrontProducts } from "@/lib/data";
import { money } from "@/lib/format";

/** Storefronts are prerendered — shoppers should never wait on a cold render. */
export async function generateStaticParams() {
  const stores = await listStores();
  return stores.map((s) => ({ handle: s.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const store = await getStore(handle);
  return { title: store ? `${store.name} — ${store.tagline}` : "Store" };
}

export default async function StorefrontHome({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const store = await getStore(handle);
  if (!store) notFound();

  const products = await listStorefrontProducts(store.id);
  const featured = products.slice(0, 3);
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-10">
        <div
          className="iso-block relative overflow-hidden px-6 py-16 sm:px-12 sm:py-24"
          style={{ background: store.theme.heroImage }}
        >
          <div className="max-w-lg">
            <h1 className="iso-display text-3xl text-iso-black sm:text-5xl">
              {store.tagline}
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-black/70">
              Small batches, honest materials, and no rush. Everything here is made
              to be used every day.
            </p>
            <Link
              href="#shop"
              className="iso-block iso-press mt-7 inline-flex h-12 items-center bg-iso-yellow px-6 text-[15px] font-semibold text-iso-black"
            >
              Shop the collection
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <span
              key={c}
              className="iso-block-sm bg-iso-white px-3 py-1.5 text-[13px] font-semibold text-iso-black"
            >
              {c}
            </span>
          ))}
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-6xl px-4 pt-12">
        <div className="flex items-end justify-between">
          <h2 className="iso-display text-[1.75rem]">Shop all</h2>
          <span className="text-[13px] text-text-3">{products.length} items</span>
        </div>

        <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          {products.map((p) => (
            <li key={p.id}>
              <Link href={`/store/${store.handle}/products/${p.slug}`} className="group">
                <div
                  className="iso-block aspect-[4/5] w-full overflow-hidden [transition:transform_200ms_var(--ease-out)] group-hover:-translate-y-1"
                  style={{ background: p.images[0] }}
                  aria-hidden
                />
                <div className="mt-3">
                  <p className="text-[13px] font-medium leading-snug">{p.title}</p>
                  <p className="mt-1 flex items-baseline gap-2 text-[13px]">
                    <span className="nums font-medium">
                      {money(p.price, store.currency)}
                    </span>
                    {p.compareAtPrice ? (
                      <span className="nums text-text-3 line-through">
                        {money(p.compareAtPrice, store.currency)}
                      </span>
                    ) : null}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="new" className="mx-auto max-w-6xl px-4 pt-16">
        <h2 className="iso-display text-[1.75rem]">Just landed</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-3">
          {featured.map((p) => (
            <li key={p.id}>
              <Link
                href={`/store/${store.handle}/products/${p.slug}`}
                className="iso-block iso-press flex items-center gap-3 bg-surface p-3"
              >
                <span
                  className="size-14 shrink-0 rounded-md border-2 border-iso-black"
                  style={{ background: p.images[1] ?? p.images[0] }}
                  aria-hidden
                />
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-medium">
                    {p.title}
                  </span>
                  <span className="nums block text-[13px] text-text-2">
                    {money(p.price, store.currency)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="about" className="mx-auto max-w-3xl px-4 pt-20 text-center">
        <h2 className="iso-display text-[1.75rem]">About {store.name}</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-text-2">
          We started because the things we wanted to own did not exist at a price
          that made sense. Everything is made in small runs, by people we know, with
          materials we can trace. If something goes wrong, we fix it.
        </p>
      </section>
    </>
  );
}
