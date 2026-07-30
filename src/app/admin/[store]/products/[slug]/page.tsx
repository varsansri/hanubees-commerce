import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, PRODUCT_TONE, label as toLabel } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Table, Td, Th, Tr } from "@/components/ui/table";
import { getProduct, getStore, inventoryOf } from "@/lib/data";
import { money } from "@/lib/format";

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ store: string; slug: string }>;
}) {
  const { store: handle, slug } = await params;
  const store = await getStore(handle);
  if (!store) notFound();

  const product = await getProduct(store.id, slug);
  if (!product) notFound();

  return (
    <>
      <div>
        <Link
          href={`/admin/${store.handle}/products`}
          className="text-[13px] text-text-2 hover:text-text"
        >
          ← Products
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight">{product.title}</h1>
          <Badge tone={PRODUCT_TONE[product.status]} dot>
            {toLabel(product.status)}
          </Badge>
          <div className="ml-auto flex gap-2">
            <Button variant="secondary" size="sm">
              Duplicate
            </Button>
            <Button variant="primary" size="sm">
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader title="Details" />
            <div className="mt-4 flex flex-col gap-4">
              <Field label="Title">
                <Input defaultValue={product.title} />
              </Field>
              <Field
                label="Description"
                hint="Shown on the product page. Plain text for now."
              >
                <Textarea defaultValue={product.description} />
              </Field>
            </div>
          </Card>

          <Card padded={false}>
            <div className="p-5">
              <CardHeader
                title="Variants"
                description={`${inventoryOf(product)} units across ${
                  product.variants.length
                } ${product.variants.length === 1 ? "variant" : "variants"}`}
              />
            </div>
            <div className="overflow-x-auto">
              <Table>
                <thead>
                  <tr>
                    <Th>Variant</Th>
                    <Th>SKU</Th>
                    <Th align="right">Stock</Th>
                    <Th align="right">Price</Th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((v) => (
                    <Tr key={v.id}>
                      <Td className="font-medium">{v.title}</Td>
                      <Td className="font-mono text-xs text-text-2">{v.sku}</Td>
                      <Td align="right">
                        <span
                          className="nums"
                          style={{ color: v.inventory < 10 ? "var(--warning)" : undefined }}
                        >
                          {v.inventory}
                        </span>
                      </Td>
                      <Td align="right" className="nums">
                        {money(v.price, store.currency)}
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
            <CardHeader title="Media" />
            <div className="mt-3 grid grid-cols-2 gap-2">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-md border border-line"
                  style={{ background: img }}
                  aria-hidden
                />
              ))}
            </div>
            <p className="mt-3 text-xs text-text-3">
              Placeholder swatches — real photography replaces these before launch.
            </p>
          </Card>

          <Card>
            <CardHeader title="Organisation" />
            <div className="mt-4 flex flex-col gap-4">
              <Field label="Status">
                <Select defaultValue={product.status}>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </Select>
              </Field>
              <Field label="Category">
                <Input defaultValue={product.category} />
              </Field>
              <Field label="Tags" hint="Comma separated">
                <Input defaultValue={product.tags.join(", ")} />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader title="Pricing" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Field label="Price">
                <Input defaultValue={(product.price / 100).toFixed(2)} />
              </Field>
              <Field label="Compare at">
                <Input
                  defaultValue={
                    product.compareAtPrice
                      ? (product.compareAtPrice / 100).toFixed(2)
                      : ""
                  }
                  placeholder="—"
                />
              </Field>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
