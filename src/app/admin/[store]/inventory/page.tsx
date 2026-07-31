import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/card";
import { StatTile } from "@/components/admin/stat-tile";
import { EmptyState, Table, TableWrap, Td, Th, Tr } from "@/components/ui/table";
import { getStore, listProducts } from "@/lib/data";
import { money, moneyWhole, number } from "@/lib/format";

/**
 * Inventory.
 *
 * Products are listed by product; stock is counted by variant. A merchant
 * reordering stock thinks in variants — "the medium is gone", not "the tee is
 * low" — so this view flattens to one row per variant, which the products page
 * deliberately does not do.
 *
 * Sorted lowest-stock first: the rows that need action are the reason anyone
 * opens this page.
 */
export default async function InventoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ store: string }>;
  searchParams: Promise<{ filter?: string }>;
}) {
  const { store: handle } = await params;
  const { filter = "all" } = await searchParams;
  const store = await getStore(handle);
  if (!store) notFound();

  const products = await listProducts(store.id);

  const rows = products
    .flatMap((p) =>
      p.variants.map((v) => ({
        productTitle: p.title,
        slug: p.slug,
        image: p.images[0],
        status: p.status,
        variant: v.title,
        sku: v.sku,
        inventory: v.inventory,
        price: v.price,
      })),
    )
    .sort((a, b) => a.inventory - b.inventory);

  const out = rows.filter((r) => r.inventory === 0);
  const low = rows.filter((r) => r.inventory > 0 && r.inventory < 25);
  const shown =
    filter === "out" ? out : filter === "low" ? [...out, ...low] : rows;

  const units = rows.reduce((s, r) => s + r.inventory, 0);
  // What the shelf is worth at retail — the number a merchant is asked for.
  const value = rows.reduce((s, r) => s + r.inventory * r.price, 0);

  const TABS = [
    { key: "all", label: `All (${rows.length})` },
    { key: "low", label: `Low or out (${out.length + low.length})` },
    { key: "out", label: `Out of stock (${out.length})` },
  ];

  return (
    <>
      <PageHeader
        title="Inventory"
        description={`${rows.length} variants across ${products.length} products`}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Units on hand" value={number(units)} />
        <StatTile label="Retail value" value={moneyWhole(value, store.currency)} />
        <StatTile label="Low stock" value={number(low.length)} />
        <StatTile label="Out of stock" value={number(out.length)} />
      </div>

      <div className="flex gap-1 rounded-[var(--radius)] border border-line bg-surface p-1 self-start">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/admin/${store.handle}/inventory${t.key === "all" ? "" : `?filter=${t.key}`}`}
            className={`rounded-[calc(var(--radius)-2px)] px-2.5 py-1 text-[13px] font-medium transition-colors ${
              filter === t.key
                ? "bg-accent-soft text-accent-text"
                : "text-text-2 hover:bg-surface-2 hover:text-text"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {shown.length === 0 ? (
        <TableWrap>
          <EmptyState
            title="Nothing to restock"
            description="Every variant in this view has healthy stock."
          />
        </TableWrap>
      ) : (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>Product</Th>
                <Th>Variant</Th>
                <Th>SKU</Th>
                <Th align="right">In stock</Th>
                <Th align="right">Value</Th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r, i) => (
                <Tr key={`${r.slug}-${r.sku}-${i}`}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <span
                        className="size-9 shrink-0 rounded-md border border-line"
                        style={{ background: r.image }}
                        aria-hidden
                      />
                      <Link
                        href={`/admin/${store.handle}/products/${r.slug}`}
                        className="font-medium hover:text-accent-text"
                      >
                        {r.productTitle}
                      </Link>
                    </div>
                  </Td>
                  <Td className="text-text-2">{r.variant}</Td>
                  <Td className="font-mono text-xs text-text-2">{r.sku || "—"}</Td>
                  <Td align="right">
                    {r.inventory === 0 ? (
                      <Badge tone="danger" dot>
                        Out of stock
                      </Badge>
                    ) : (
                      <span
                        className="nums font-medium"
                        style={{ color: r.inventory < 25 ? "var(--warning)" : undefined }}
                      >
                        {r.inventory}
                      </span>
                    )}
                  </Td>
                  <Td align="right" className="nums text-text-2">
                    {money(r.inventory * r.price, store.currency)}
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
