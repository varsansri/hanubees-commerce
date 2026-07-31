import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Badge,
  FULFILLMENT_TONE,
  PAYMENT_TONE,
  label as toLabel,
} from "@/components/ui/badge";
import { ArrowLeftIcon } from "@/components/icons";
import { OrderActions } from "@/components/admin/order-actions";
import { Card, CardHeader } from "@/components/ui/card";
import { getOrder, getStore } from "@/lib/data";
import { dateTime, money } from "@/lib/format";

export default async function OrderDetail({
  params,
}: {
  params: Promise<{ store: string; id: string }>;
}) {
  const { store: handle, id } = await params;
  const store = await getStore(handle);
  if (!store) notFound();

  const order = await getOrder(store.id, id);
  if (!order) notFound();

  const c = store.currency;

  return (
    <>
      <div>
        <Link
          href={`/admin/${store.handle}/orders`}
          className="inline-flex items-center gap-1.5 text-[13px] text-text-2 hover:text-text"
        >
          <ArrowLeftIcon className="size-3.5" />
          Orders
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight">#{order.number}</h1>
          <Badge tone={PAYMENT_TONE[order.paymentStatus]} dot>
            {toLabel(order.paymentStatus)}
          </Badge>
          <Badge tone={FULFILLMENT_TONE[order.fulfillmentStatus]} dot>
            {toLabel(order.fulfillmentStatus)}
          </Badge>
          <span className="text-[13px] text-text-3">{dateTime(order.placedAt)}</span>
          <div className="ml-auto">
            <OrderActions handle={store.handle} order={order} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card padded={false}>
            <div className="p-5">
              <CardHeader
                title="Items"
                description={`${order.items.length} line ${
                  order.items.length === 1 ? "item" : "items"
                } · via ${order.channel}`}
              />
            </div>
            <ul className="divide-y divide-[var(--border)]">
              {order.items.map((it, i) => (
                <li key={i} className="flex items-center gap-3 px-5 py-3">
                  <span
                    className="size-11 shrink-0 rounded-md border border-line"
                    style={{ background: it.image }}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium">
                      {it.title}
                    </span>
                    <span className="block text-xs text-text-3">{it.variantTitle}</span>
                  </span>
                  <span className="nums text-[13px] text-text-2">
                    {money(it.price, c)} × {it.quantity}
                  </span>
                  <span className="nums w-24 text-right text-[13px] font-medium">
                    {money(it.price * it.quantity, c)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="flex flex-col gap-1.5 border-t border-line px-5 py-4 text-[13px]">
              <Row label="Subtotal" value={money(order.subtotal, c)} />
              <Row
                label="Shipping"
                value={order.shipping === 0 ? "Free" : money(order.shipping, c)}
              />
              <Row label="Tax (GST 18%)" value={money(order.tax, c)} />
              <div className="mt-1 flex justify-between border-t border-line pt-2 text-sm font-semibold">
                <dt>Total</dt>
                <dd className="nums">{money(order.total, c)}</dd>
              </div>
            </dl>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title="Customer" />
            <div className="mt-3 text-[13px]">
              <Link
                href={`/admin/${store.handle}/customers`}
                className="font-medium hover:text-accent-text"
              >
                {order.customer.name}
              </Link>
              <p className="mt-0.5 text-text-2">{order.customer.email}</p>
            </div>
          </Card>

          <Card>
            <CardHeader title="Shipping address" />
            <address className="mt-3 text-[13px] not-italic leading-relaxed text-text-2">
              {order.shippingAddress.line1}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state}
              <br />
              {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
            </address>
          </Card>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-text-2">{label}</dt>
      <dd className="nums">{value}</dd>
    </div>
  );
}
