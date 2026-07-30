import Link from "next/link";
import { notFound } from "next/navigation";
import { StatTile } from "@/components/admin/stat-tile";
import { BarList, TrendChart } from "@/components/charts";
import {
  Badge,
  FULFILLMENT_TONE,
  PAYMENT_TONE,
  label as toLabel,
} from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardHeader, PageHeader } from "@/components/ui/card";
import { Table, TableWrap, Td, Th, Tr } from "@/components/ui/table";
import {
  getMetrics,
  getStore,
  inventoryOf,
  listOrders,
  listProducts,
} from "@/lib/data";
import { money, moneyCompact, number, percent, relative } from "@/lib/format";

export default async function StoreHome({
  params,
}: {
  params: Promise<{ store: string }>;
}) {
  const { store: handle } = await params;
  const store = await getStore(handle);
  if (!store) notFound();

  const [metrics, orders, products] = await Promise.all([
    getMetrics(store.id),
    listOrders(store.id),
    listProducts(store.id),
  ]);

  const recent = orders.slice(0, 6);
  const lowStock = products
    .filter((p) => p.status === "active" && inventoryOf(p) < 25)
    .sort((a, b) => inventoryOf(a) - inventoryOf(b))
    .slice(0, 5);
  const needsFulfilment = orders.filter(
    (o) => o.fulfillmentStatus !== "fulfilled" && o.status !== "cancelled",
  ).length;

  return (
    <>
      <PageHeader
        title={`Good morning, ${store.name}`}
        description="Here's how the last 30 days went."
        actions={
          <>
            <ButtonLink href={`/admin/${store.handle}/products`} variant="secondary">
              Add product
            </ButtonLink>
            <ButtonLink href={`/admin/${store.handle}/orders`} variant="primary">
              {needsFulfilled(needsFulfilment)}
            </ButtonLink>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          label="Revenue"
          value={money(metrics.revenue.value, store.currency)}
          change={metrics.revenue.change}
          series={metrics.revenueSeries}
        />
        <StatTile
          label="Orders"
          value={number(metrics.orders.value)}
          change={metrics.orders.change}
        />
        <StatTile
          label="Sessions"
          value={number(metrics.sessions.value)}
          change={metrics.sessions.change}
        />
        <StatTile
          label="Conversion rate"
          value={percent(metrics.conversionRate.value, 2)}
          change={metrics.conversionRate.change}
        />
      </div>

      <Card>
        <CardHeader
          title="Revenue"
          description="Daily, last 30 days"
          action={
            <Link
              href={`/admin/${store.handle}/analytics`}
              className="text-[13px] text-accent-text hover:underline"
            >
              Full report
            </Link>
          }
        />
        <div className="mt-4">
          <TrendChart
            data={metrics.revenueSeries}
            formatValue={(v) => moneyCompact(v, store.currency)}
          />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card padded={false}>
            <div className="p-5">
              <CardHeader
                title="Recent orders"
                action={
                  <Link
                    href={`/admin/${store.handle}/orders`}
                    className="text-[13px] text-accent-text hover:underline"
                  >
                    All orders
                  </Link>
                }
              />
            </div>
            <div className="overflow-x-auto">
              <Table>
                <thead>
                  <tr>
                    <Th>Order</Th>
                    <Th>Customer</Th>
                    <Th>Payment</Th>
                    <Th>Fulfilment</Th>
                    <Th align="right">Total</Th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((o) => (
                    <Tr key={o.id}>
                      <Td>
                        <Link
                          href={`/admin/${store.handle}/orders/${o.id}`}
                          className="font-medium hover:text-accent-text"
                        >
                          #{o.number}
                        </Link>
                        <span className="ml-2 text-xs text-text-3">
                          {relative(o.placedAt)}
                        </span>
                      </Td>
                      <Td className="text-text-2">{o.customer.name}</Td>
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
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title="Top products" description="By revenue" />
            <div className="mt-4">
              <BarList
                items={metrics.topProducts.map((p) => ({
                  label: p.title,
                  value: p.revenue,
                  display: money(p.revenue, store.currency),
                  meta: `${p.units} u`,
                }))}
              />
            </div>
          </Card>

          <Card>
            <CardHeader title="Running low" description="Under 25 units in stock" />
            <ul className="mt-3 flex flex-col divide-y divide-[var(--border)]">
              {lowStock.length === 0 ? (
                <li className="py-3 text-[13px] text-text-2">
                  Everything is comfortably stocked.
                </li>
              ) : (
                lowStock.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 py-2.5">
                    <span
                      className="size-8 shrink-0 rounded-md border border-line"
                      style={{ background: p.images[0] }}
                      aria-hidden
                    />
                    <Link
                      href={`/admin/${store.handle}/products/${p.slug}`}
                      className="min-w-0 flex-1 truncate text-[13px] hover:text-accent-text"
                    >
                      {p.title}
                    </Link>
                    <span className="nums text-[13px] font-medium text-warning">
                      {inventoryOf(p)}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}

function needsFulfilled(count: number) {
  return count === 0 ? "All caught up" : `Fulfil ${count} orders`;
}
