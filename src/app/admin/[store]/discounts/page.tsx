import { notFound } from "next/navigation";
import { Badge, DISCOUNT_TONE, label as toLabel } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/card";
import { Table, TableWrap, Td, Th, Tr } from "@/components/ui/table";
import { getStore, listDiscounts } from "@/lib/data";
import type { Discount } from "@/lib/types";
import { date, money } from "@/lib/format";

function describe(d: Discount, currency: Parameters<typeof money>[1]) {
  if (d.type === "percentage") return `${d.value}% off`;
  if (d.type === "fixed") return `${money(d.value, currency)} off`;
  return "Free shipping";
}

export default async function DiscountsPage({
  params,
}: {
  params: Promise<{ store: string }>;
}) {
  const { store: handle } = await params;
  const store = await getStore(handle);
  if (!store) notFound();

  const discounts = await listDiscounts(store.id);

  return (
    <>
      <PageHeader
        title="Discounts"
        description="Codes shoppers can apply at checkout"
        actions={<Button variant="primary">Create discount</Button>}
      />

      <TableWrap>
        <Table>
          <thead>
            <tr>
              <Th>Code</Th>
              <Th>Value</Th>
              <Th>Status</Th>
              <Th align="right">Used</Th>
              <Th>Starts</Th>
              <Th>Ends</Th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => (
              <Tr key={d.id}>
                <Td>
                  <span className="font-mono text-[13px] font-medium">{d.code}</span>
                </Td>
                <Td className="text-text-2">{describe(d, store.currency)}</Td>
                <Td>
                  <Badge tone={DISCOUNT_TONE[d.status]} dot>
                    {toLabel(d.status)}
                  </Badge>
                </Td>
                <Td align="right" className="nums">
                  {d.limit ? `${d.used} / ${d.limit}` : d.used}
                </Td>
                <Td className="whitespace-nowrap text-text-2">{date(d.startsAt)}</Td>
                <Td className="whitespace-nowrap text-text-2">
                  {d.endsAt ? date(d.endsAt) : "No end date"}
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </>
  );
}
