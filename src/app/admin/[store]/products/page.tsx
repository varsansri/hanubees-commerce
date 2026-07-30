import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, PRODUCT_TONE, label as toLabel } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/card";
import { EmptyState, Table, TableWrap, Td, Th, Tr } from "@/components/ui/table";
import { getStore, inventoryOf, listProducts } from "@/lib/data";
import type { Product } from "@/lib/types";
import { money } from "@/lib/format";

const TABS: { key: Product["status"] | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "draft", label: "Drafts" },
  { key: "archived", label: "Archived" },
];

export default async function ProductsPage({
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

  const products = await listProducts(store.id, {
    status: status as Product["status"] | "all",
    search: q,
  });

  return (
    <>
      <PageHeader
        title="Products"
        description={`${products.length} in this view`}
        actions={<Button variant="primary">Add product</Button>}
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1 rounded-[var(--radius)] border border-line bg-surface p-1">
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={`/admin/${store.handle}/products${
                t.key === "all" ? "" : `?status=${t.key}`
              }`}
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

        <form className="ml-auto" action={`/admin/${store.handle}/products`}>
          {status !== "all" ? <input type="hidden" name="status" value={status} /> : null}
          <input
            name="q"
            defaultValue={q}
            placeholder="Search title or SKU"
            className="h-9 w-56 rounded-[var(--radius)] border border-line bg-surface px-3 text-sm placeholder:text-text-3 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
          />
        </form>
      </div>

      {products.length === 0 ? (
        <TableWrap>
          <EmptyState
            title="No products here yet"
            description="Add your first product, or switch to another status filter."
            action={<Button variant="primary">Add product</Button>}
          />
        </TableWrap>
      ) : (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>Product</Th>
                <Th>Status</Th>
                <Th>Category</Th>
                <Th align="right">Stock</Th>
                <Th align="right">Price</Th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const stock = inventoryOf(p);
                return (
                  <Tr key={p.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <span
                          className="size-9 shrink-0 rounded-md border border-line"
                          style={{ background: p.images[0] }}
                          aria-hidden
                        />
                        <div className="min-w-0">
                          <Link
                            href={`/admin/${store.handle}/products/${p.slug}`}
                            className="block truncate font-medium hover:text-accent-text"
                          >
                            {p.title}
                          </Link>
                          <span className="block text-xs text-text-3">
                            {p.variants.length}{" "}
                            {p.variants.length === 1 ? "variant" : "variants"}
                          </span>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <Badge tone={PRODUCT_TONE[p.status]} dot>
                        {toLabel(p.status)}
                      </Badge>
                    </Td>
                    <Td className="text-text-2">{p.category}</Td>
                    <Td align="right">
                      <span
                        className="nums font-medium"
                        style={{ color: stock < 25 ? "var(--warning)" : undefined }}
                      >
                        {stock}
                      </span>
                    </Td>
                    <Td align="right" className="nums font-medium">
                      {money(p.price, store.currency)}
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        </TableWrap>
      )}
    </>
  );
}
