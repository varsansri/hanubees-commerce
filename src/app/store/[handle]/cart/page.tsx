import Link from "next/link";
import { notFound } from "next/navigation";
import { getStore, listStorefrontProducts } from "@/lib/data";
import { money } from "@/lib/format";

export const metadata = { title: "Cart" };

/**
 * Cart is presentational for now — it renders a representative basket so the
 * checkout layout can be reviewed. Real line items arrive with the cart store.
 */
export default async function CartPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const store = await getStore(handle);
  if (!store) notFound();

  const products = await listStorefrontProducts(store.id);
  const lines = products.slice(0, 2).map((p, i) => ({ product: p, quantity: i + 1 }));

  const subtotal = lines.reduce((s, l) => s + l.product.price * l.quantity, 0);
  const shipping = subtotal > 500000 ? 0 : 9900;
  const tax = Math.round(subtotal * 0.18);

  return (
    <div className="mx-auto max-w-4xl px-4 pt-10">
      <h1 className="text-2xl font-semibold tracking-tight">Your cart</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <ul className="divide-y divide-[var(--border)] border-y border-line">
          {lines.map(({ product, quantity }) => (
            <li key={product.id} className="flex items-center gap-4 py-4">
              <span
                className="size-20 shrink-0 rounded-lg border border-line"
                style={{ background: product.images[0] }}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/store/${store.handle}/products/${product.slug}`}
                  className="text-[15px] font-medium hover:underline"
                >
                  {product.title}
                </Link>
                <p className="mt-0.5 text-[13px] text-text-3">
                  {product.variants[0].title}
                </p>
                <div className="mt-2 inline-flex items-center rounded-full border border-line">
                  <button className="size-7 text-text-2 hover:text-text" aria-label="Decrease">
                    −
                  </button>
                  <span className="nums w-6 text-center text-[13px]">{quantity}</span>
                  <button className="size-7 text-text-2 hover:text-text" aria-label="Increase">
                    +
                  </button>
                </div>
              </div>
              <span className="nums text-[15px] font-medium">
                {money(product.price * quantity, store.currency)}
              </span>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-xl border border-line bg-surface p-5">
          <h2 className="text-sm font-semibold">Order summary</h2>
          <dl className="mt-4 flex flex-col gap-2 text-[13px]">
            <div className="flex justify-between">
              <dt className="text-text-2">Subtotal</dt>
              <dd className="nums">{money(subtotal, store.currency)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-2">Shipping</dt>
              <dd className="nums">
                {shipping === 0 ? "Free" : money(shipping, store.currency)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-2">GST (18%)</dt>
              <dd className="nums">{money(tax, store.currency)}</dd>
            </div>
            <div className="mt-2 flex justify-between border-t border-line pt-3 text-[15px] font-semibold">
              <dt>Total</dt>
              <dd className="nums">{money(subtotal + shipping + tax, store.currency)}</dd>
            </div>
          </dl>

          <button className="mt-5 h-11 w-full rounded-full bg-accent text-sm font-medium text-white transition-opacity hover:opacity-90">
            Checkout
          </button>
          <Link
            href={`/store/${store.handle}`}
            className="mt-2 block text-center text-[13px] text-text-2 hover:text-text"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
