import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Badge,
  FULFILLMENT_TONE,
  PAYMENT_TONE,
  label as toLabel,
} from "@/components/ui/badge";
import { ArrowLeftIcon } from "@/components/icons";
import { Card, CardHeader } from "@/components/ui/card";
import { StatTile } from "@/components/admin/stat-tile";
import { EmptyState, Table, TableWrap, Td, Th, Tr } from "@/components/ui/table";
import { getCustomer, getStore, listOrders } from "@/lib/data";
import { date, dateTime, initials, money, moneyWhole, number } from "@/lib/format";

/**
 * One customer.
 *
 * The orders list is the point of this page — a merchant opening a customer is
 * almost always answering "what did they buy" or "where is their order", so
 * that sits above the contact details rather than below them.
 */
export default async function CustomerDetail({
  params,
}: {
  params: Promise<{ store: string; id: string }>;
}) {
  const { store: handle, id } = await params;
  const store = await getStore(handle);
  if (!store) notFound();

  const customer = await getCustomer(store.id, id);
  if (!customer) notFound();

  const all = await listOrders(store.id);
  const orders = all.filter((o) => o.customer.email === customer.email);
  const avg = orders.length
    ? Math.round(orders.reduce((s, o) => s + o.total, 0) / orders.length)
    : 0;

  return (
    <>
      <div>
        <Link
          href={`/admin/${store.handle}/customers`}
          className="inline-flex items-center gap-1.5 text-[13px] text-text-2 hover:text-text"
        >
          <ArrowLeftIcon className="size-3.5" />
          Customers
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-surface-2 text-sm font-semibold text-text-2">
            {initials(customer.name)}
          </span>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{customer.name}</h1>
            <p className="text-[13px] text-text-2">{customer.email}</p>
          </div>
          {customer.subscribed ? (
            <Badge tone="success" dot>
              Accepts marketing
            </Badge>
          ) : (
            <Badge tone="neutral">Not subscribed</Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Orders" value={number(orders.length)} />
        <StatTile label="Total spent" value={moneyWhole(customer.totalSpent, store.currency)} />
        <StatTile label="Average order" value={moneyWhole(avg, store.currency)} />
        <StatTile
          label="Last order"
          value={customer.lastOrderAt ? date(customer.lastOrderAt) : "Never"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {orders.length === 0 ? (
            <TableWrap>
              <EmptyState
                title="No orders yet"
                description="This customer has an account but has not bought anything."
              />
            </TableWrap>
          ) : (
            <TableWrap>
              <Table>
                <thead>
                  <tr>
                    <Th>Order</Th>
                    <Th>Date</Th>
                    <Th>Payment</Th>
                    <Th>Fulfilment</Th>
                    <Th align="right">Total</Th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <Tr key={o.id}>
                      <Td>
                        <Link
                          href={`/admin/${store.handle}/orders/${o.id}`}
                          className="font-medium hover:text-accent-text"
                        >
                          #{o.number}
                        </Link>
                      </Td>
                      <Td className="whitespace-nowrap text-text-2">
                        {dateTime(o.placedAt)}
                      </Td>
                      <Td>
                        <Badge tone={PAYMENT_TONE[o.paymentStatus]} dot>
                          {toLabel(o.paymentStatus)}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge tone={FULFILLMENT_TONE[o.fulfillmentStatus]} dot>
                          {toLabel(o.fulfillmentStatus)}
                        </Badge>
                      </Td>
                      <Td align="right" className="nums font-medium">
                        {money(o.total, store.currency)}
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </TableWrap>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title="Contact" />
            <dl className="mt-3 flex flex-col gap-2 text-[13px]">
              <Row label="Email" value={customer.email} />
              <Row label="Phone" value={customer.phone ?? "—"} />
              <Row label="Location" value={customer.location || "—"} />
              <Row label="Customer since" value={date(customer.createdAt)} />
            </dl>
          </Card>

          {orders[0] ? (
            <Card>
              <CardHeader title="Last shipping address" />
              <address className="mt-3 text-[13px] not-italic leading-relaxed text-text-2">
                {orders[0].shippingAddress.line1}
                <br />
                {orders[0].shippingAddress.city}, {orders[0].shippingAddress.state}
                <br />
                {orders[0].shippingAddress.postalCode}
                <br />
                {orders[0].shippingAddress.country}
              </address>
            </Card>
          ) : null}
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-text-2">{label}</dt>
      <dd className="truncate text-right">{value}</dd>
    </div>
  );
}
