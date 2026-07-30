import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getStore, listStorefrontProducts } from "@/lib/data";
import { money } from "@/lib/format";

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
            className="aspect-square w-full rounded-2xl border border-line"
            style={{ background: product.images[0] }}
            aria-hidden
          />
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((img, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg border border-line"
                style={{ background: img }}
                aria-hidden
              />
            ))}
          </div>
        </div>

        <div className="lg:pt-4">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
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
                <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent-text">
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
            <button className="h-12 w-full rounded-full bg-accent text-sm font-medium text-white transition-opacity hover:opacity-90">
              Add to cart
            </button>
            <button className="h-12 w-full rounded-full border border-line-strong text-sm font-medium transition-colors hover:bg-surface-2">
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
          <h2 className="text-lg font-semibold tracking-tight">You might also like</h2>
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
            {related.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/store/${store.handle}/products/${p.slug}`}
                  className="group"
                >
                  <div
                    className="aspect-[4/5] w-full rounded-xl border border-line transition-transform duration-300 group-hover:-translate-y-1"
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
