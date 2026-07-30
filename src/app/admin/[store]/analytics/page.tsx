import { notFound } from "next/navigation";
import { StatTile } from "@/components/admin/stat-tile";
import { BarList, TrendChart } from "@/components/charts";
import { Card, CardHeader, PageHeader } from "@/components/ui/card";
import { Table, TableWrap, Td, Th, Tr } from "@/components/ui/table";
import { getMetrics, getStore } from "@/lib/data";
import { money, number, percent } from "@/lib/format";

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ store: string }>;
}) {
  const { store: handle } = await params;
  const store = await getStore(handle);
  if (!store) notFound();

  const m = await getMetrics(store.id);
  const totalSessions = m.trafficSources.reduce((s, t) => s + t.sessions, 0);
  const aov = m.orders.value > 0 ? m.revenue.value / m.orders.value : 0;

  return (
    <>
      <PageHeader title="Analytics" description="Last 30 days" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          label="Revenue"
          value={money(m.revenue.value, store.currency)}
          change={m.revenue.change}
          series={m.revenueSeries}
        />
        <StatTile
          label="Average order value"
          value={money(Math.round(aov), store.currency)}
          change={0.081}
        />
        <StatTile
          label="Sessions"
          value={number(m.sessions.value)}
          change={m.sessions.change}
        />
        <StatTile
          label="Conversion rate"
          value={percent(m.conversionRate.value, 2)}
          change={m.conversionRate.change}
        />
      </div>

      <Card>
        <CardHeader title="Revenue over time" description="Daily totals" />
        <div className="mt-4">
          <TrendChart
            data={m.revenueSeries}
            currency={store.currency}
            height={300}
          />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Top products" description="By revenue" />
          <div className="mt-4">
            <BarList
              items={m.topProducts.map((p) => ({
                label: p.title,
                value: p.revenue,
                display: money(p.revenue, store.currency),
                meta: `${p.units} u`,
              }))}
            />
          </div>
        </Card>

        <Card>
          <CardHeader title="Traffic sources" description="Sessions by referrer" />
          <div className="mt-4">
            <BarList
              items={m.trafficSources.map((t) => ({
                label: t.source,
                value: t.sessions,
                display: number(t.sessions),
                meta: percent(t.sessions / totalSessions, 0),
              }))}
            />
          </div>
        </Card>
      </div>

      {/* The same numbers as a table — the accessible reading of every chart above */}
      <div>
        <h2 className="mb-2 text-sm font-semibold tracking-tight">
          Top products, in full
        </h2>
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>Product</Th>
                <Th align="right">Units</Th>
                <Th align="right">Revenue</Th>
                <Th align="right">Share</Th>
              </tr>
            </thead>
            <tbody>
              {m.topProducts.map((p) => (
                <Tr key={p.title}>
                  <Td className="font-medium">{p.title}</Td>
                  <Td align="right" className="nums">
                    {p.units}
                  </Td>
                  <Td align="right" className="nums">
                    {money(p.revenue, store.currency)}
                  </Td>
                  <Td align="right" className="nums text-text-2">
                    {percent(p.revenue / m.revenue.value, 1)}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      </div>
    </>
  );
}
