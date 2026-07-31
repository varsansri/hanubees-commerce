import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProduct,
  getStore,
  listStores,
  listStorefrontProducts,
} from "@/lib/data";
import { money } from "@/lib/format";

export async function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const stores = await listStores();
  const params = await Promise.all(
    stores.map(async (store) => {
      const products = await listStorefrontProducts(store.id);
      return products.map((p) => ({ handle: store.handle, slug: p.slug }));
    }),
  );
  return params.flat();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string; slug: string }>;
}) {
  const { handle, slug } = await params;
  const store = await getStore(handle);
  const product = store ? await getProduct(store.id, slug) : null;
  return { title: product?.title ?? "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string; slug: string }>;
}) {
  const { handle, slug } = await params;
  const store = await getStore(handle);
  if (!store) notFound();

  const product = await getProduct(store.id, slug);
  if (!product || product.status !== "active") notFound();

  const related = (await listStorefrontProducts(store.id))
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const inStock = product.variants.reduce((s, v) => s + v.inventory, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <nav className="text-[13px] text-text-3">
        <Link href={`/store/${store.handle}`} className="hover:text-text">
          Shop
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-text-2">{product.category}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div
            className="iso-block aspect-square w-full"
            style={{ background: product.images[0] }}
            aria-hidden
          />
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((img, i) => (
              <div
                key={i}
                className="rounded-md border-2 border-iso-black"
                style={{ background: img }}
                aria-hidden
              />
            ))}
          </div>
        </div>

        <div className="lg:pt-4">
          <h1 className="iso-display text-[2rem] sm:text-[2.5rem]">
            {product.title}
          </h1>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="nums text-xl font-semibold">
              {money(product.price, store.currency)}
            </span>
            {product.compareAtPrice ? (
              <>
                <span className="nums text-[15px] text-text-3 line-through">
                  {money(product.compareAtPrice, store.currency)}
                </span>
                <span className="iso-block-sm bg-iso-sky px-2 py-0.5 text-[11px] font-bold text-iso-black">
                  Save{" "}
                  {Math.round(
                    ((product.compareAtPrice - product.price) /
                      product.compareAtPrice) *
                      100,
                  )}
                  %
                </span>
              </>
            ) : null}
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-text-2">
            {product.description}
          </p>

          {product.variants.length > 1 ? (
            <fieldset className="mt-7">
              <legend className="text-[13px] font-medium">Size</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <label key={v.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="variant"
                      defaultChecked={i === 0}
                      disabled={v.inventory === 0}
                      className="peer sr-only"
                    />
                    <span className="inline-flex h-10 min-w-12 items-center justify-center rounded-[var(--radius)] border border-line-strong px-3 text-sm transition-colors peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:text-accent-text peer-disabled:opacity-40">
                      {v.title}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}

          <div className="mt-7 flex flex-col gap-2">
            <button className="iso-block iso-press h-12 w-full bg-iso-yellow text-[15px] font-semibold text-iso-black">
              Add to cart
            </button>
            <button className="iso-block iso-press h-12 w-full bg-iso-white text-[15px] font-semibold text-iso-black">
              Buy it now
            </button>
          </div>

          <p className="mt-4 text-[13px] text-text-3">
            {inStock > 0
              ? `In stock · usually ships in 2–4 days`
              : "Currently sold out"}
          </p>

          <dl className="mt-8 divide-y divide-[var(--border)] border-t border-line text-[13px]">
            {[
              ["Materials", "Traceable, small-batch sourcing"],
              ["Shipping", "Free over ₹5,000 · India-wide"],
              ["Returns", "30 days, no questions asked"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 py-3">
                <dt className="font-medium">{k}</dt>
                <dd className="text-right text-text-2">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="pt-20">
          <h2 className="iso-display text-[1.75rem]">You might also like</h2>
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
            {related.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/store/${store.handle}/products/${p.slug}`}
                  className="group"
                >
                  <div
                    className="iso-block aspect-[4/5] w-full transition-transform duration-200 ease-[var(--ease-out)] group-hover:-translate-y-1"
                    style={{ background: p.images[0] }}
                    aria-hidden
                  />
                  <p className="mt-3 text-[13px] font-medium">{p.title}</p>
                  <p className="nums mt-0.5 text-[13px] text-text-2">
                    {money(p.price, store.currency)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
