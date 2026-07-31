import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/card";
import { EmptyState, Table, TableWrap, Td, Th, Tr } from "@/components/ui/table";
import { getStore, inventoryOf, listProducts } from "@/lib/data";
import { moneyWhole, number } from "@/lib/format";

/**
 * Collections.
 *
 * Derived from the category each product already carries rather than stored
 * separately — a merchant who has categorised their catalogue has already made
 * their collections, and asking them to do it twice is the kind of busywork
 * that makes an admin feel heavy.
 *
 * Manual collections (hand-picked groupings, seasonal edits) come later; they
 * need their own table.
 */
export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ store: string }>;
}) {
  const { store: handle } = await params;
  const store = await getStore(handle);
  if (!store) notFound();

  const products = await listProducts(store.id);

  const byCategory = new Map<
    string,
    { count: number; active: number; units: number; value: number }
  >();
  for (const p of products) {
    const key = p.category || "Uncategorised";
    const cur = byCategory.get(key) ?? { count: 0, active: 0, units: 0, value: 0 };
    cur.count += 1;
    if (p.status === "active") cur.active += 1;
    const stock = inventoryOf(p);
    cur.units += stock;
    cur.value += stock * p.price;
    byCategory.set(key, cur);
  }

  const collections = [...byCategory.entries()]
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.count - a.count);

  return (
    <>
      <PageHeader
        title="Collections"
        description={`${collections.length} from your product categories`}
      />

      {collections.length === 0 ? (
        <TableWrap>
          <EmptyState
            title="No collections yet"
            description="Give your products a category and they will group themselves here."
          />
        </TableWrap>
      ) : (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>Collection</Th>
                <Th align="right">Products</Th>
                <Th align="right">Live</Th>
                <Th align="right">Units</Th>
                <Th align="right">Retail value</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {collections.map((c) => (
                <Tr key={c.name}>
                  <Td className="font-medium">{c.name}</Td>
                  <Td align="right" className="nums">
                    {number(c.count)}
                  </Td>
                  <Td align="right">
                    {c.active === c.count ? (
                      <Badge tone="success" dot>
                        All live
                      </Badge>
                    ) : (
                      <span className="nums text-text-2">
                        {c.active} of {c.count}
                      </span>
                    )}
                  </Td>
                  <Td align="right" className="nums text-text-2">
                    {number(c.units)}
                  </Td>
                  <Td align="right" className="nums font-medium">
                    {moneyWhole(c.value, store.currency)}
                  </Td>
                  <Td align="right">
                    <Link
                      href={`/admin/${store.handle}/products?q=${encodeURIComponent(c.name)}`}
                      className="text-[13px] text-accent-text hover:underline"
                    >
                      View
                    </Link>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      )}

      <p className="text-[13px] text-text-3">
        These follow your product categories. Hand-picked collections — seasonal
        edits, bundles — are not built yet.
      </p>
    </>
  );
}
