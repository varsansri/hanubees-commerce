import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/card";
import { EmptyState, Table, TableWrap, Td, Th, Tr } from "@/components/ui/table";
import { getStore, listCustomers } from "@/lib/data";
import { date, initials, money, number } from "@/lib/format";

export default async function CustomersPage({
  params,
  searchParams,
}: {
  params: Promise<{ store: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { store: handle } = await params;
  const { q = "" } = await searchParams;
  const store = await getStore(handle);
  if (!store) notFound();

  const customers = await listCustomers(store.id, q);
  const subscribed = customers.filter((c) => c.subscribed).length;

  return (
    <>
      <PageHeader
        title="Customers"
        description={`${number(customers.length)} total · ${number(
          subscribed,
        )} accept marketing`}
      />

      <form className="flex" action={`/admin/${store.handle}/customers`}>
        <input
          name="q"
          defaultValue={q}
          placeholder="Search name or email"
          className="h-9 w-full max-w-sm rounded-[var(--radius)] border border-line bg-surface px-3 text-sm placeholder:text-text-3 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
        />
      </form>

      {customers.length === 0 ? (
        <TableWrap>
          <EmptyState
            title="No customers match"
            description="Clear the search to see everyone who has bought from you."
          />
        </TableWrap>
      ) : (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>Customer</Th>
                <Th>Location</Th>
                <Th>Marketing</Th>
                <Th align="right">Orders</Th>
                <Th align="right">Spent</Th>
                <Th>Last order</Th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <Tr key={c.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-[11px] font-semibold text-text-2">
                        {initials(c.name)}
                      </span>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/${store.handle}/customers/${c.id}`}
                          className="block truncate font-medium hover:text-accent-text"
                        >
                          {c.name}
                        </Link>
                        <span className="block truncate text-xs text-text-3">
                          {c.email}
                        </span>
                      </div>
                    </div>
                  </Td>
                  <Td className="whitespace-nowrap text-text-2">{c.location}</Td>
                  <Td>
                    {c.subscribed ? (
                      <Badge tone="success" dot>
                        Subscribed
                      </Badge>
                    ) : (
                      <Badge tone="neutral">Not subscribed</Badge>
                    )}
                  </Td>
                  <Td align="right" className="nums">
                    {c.ordersCount}
                  </Td>
                  <Td align="right" className="nums font-medium">
                    {money(c.totalSpent, store.currency)}
                  </Td>
                  <Td className="whitespace-nowrap text-text-2">
                    {c.lastOrderAt ? date(c.lastOrderAt) : "—"}
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
