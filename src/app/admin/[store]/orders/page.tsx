import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Badge,
  FULFILLMENT_TONE,
  PAYMENT_TONE,
  label as toLabel,
} from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/card";
import { EmptyState, Table, TableWrap, Td, Th, Tr } from "@/components/ui/table";
import { getStore, listOrders } from "@/lib/data";
import type { Order } from "@/lib/types";
import { dateTime, money } from "@/lib/format";

const TABS: { key: Order["status"] | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "closed", label: "Closed" },
  { key: "cancelled", label: "Cancelled" },
];

export default async function OrdersPage({
  params,
  searchParams,
}: {
  params: Promise<{ store: string }>;
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { store: handle } = await params;
  const { status = "all", q = "" } = await searchParams;
  const store = await getStore(handle);
  if (!store) notFound();

  const orders = await listOrders(store.id, {
    status: status as Order["status"] | "all",
    search: q,
  });

  return (
    <>
      <PageHeader
        title="Orders"
        description={`${orders.length} ${orders.length === 1 ? "order" : "orders"}`}
      />

      {/* Filters sit in one row directly above the table they act on */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1 rounded-[var(--radius)] border border-line bg-surface p-1">
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={`/admin/${store.handle}/orders${t.key === "all" ? "" : `?status=${t.key}`}`}
              className={`rounded-[calc(var(--radius)-2px)] px-2.5 py-1 text-[13px] font-medium transition-colors ${
                status === t.key
                  ? "bg-accent-soft text-accent-text"
                  : "text-text-2 hover:bg-surface-2 hover:text-text"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        <form className="ml-auto" action={`/admin/${store.handle}/orders`}>
          {status !== "all" ? <input type="hidden" name="status" value={status} /> : null}
          <input
            name="q"
            defaultValue={q}
            placeholder="Search order or customer"
            className="h-9 w-56 rounded-[var(--radius)] border border-line bg-surface px-3 text-sm placeholder:text-text-3 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
          />
        </form>
      </div>

      {orders.length === 0 ? (
        <TableWrap>
          <EmptyState
            title="No orders match"
            description="Try a different status filter, or clear the search."
          />
        </TableWrap>
      ) : (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>Order</Th>
                <Th>Date</Th>
                <Th>Customer</Th>
                <Th>Channel</Th>
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
                  <Td className="whitespace-nowrap text-text-2">{dateTime(o.placedAt)}</Td>
                  <Td>
                    <span className="block">{o.customer.name}</span>
                    <span className="block text-xs text-text-3">{o.customer.email}</span>
                  </Td>
                  <Td className="capitalize text-text-2">{o.channel}</Td>
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
    </>
  );
}
