import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, PageHeader } from "@/components/ui/card";
import { Field, Input, Select, Toggle } from "@/components/ui/field";
import { getStore } from "@/lib/data";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ store: string }>;
}) {
  const { store: handle } = await params;
  const store = await getStore(handle);
  if (!store) notFound();

  return (
    <>
      <PageHeader
        title="Settings"
        description="Store details, domain, and checkout"
        actions={<Button variant="primary">Save changes</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader title="Store details" />
            <div className="mt-4 flex flex-col gap-4">
              <Field label="Store name">
                <Input defaultValue={store.name} />
              </Field>
              <Field label="Tagline" hint="Appears under the name on your storefront">
                <Input defaultValue={store.tagline} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Currency">
                  <Select defaultValue={store.currency}>
                    <option value="INR">INR — Indian Rupee</option>
                    <option value="USD">USD — US Dollar</option>
                    <option value="EUR">EUR — Euro</option>
                    <option value="GBP">GBP — Pound Sterling</option>
                  </Select>
                </Field>
                <Field label="Plan">
                  <Select defaultValue={store.plan}>
                    <option value="starter">Starter</option>
                    <option value="growth">Growth</option>
                    <option value="scale">Scale</option>
                  </Select>
                </Field>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Domains"
              description="Where shoppers find this store"
            />
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 rounded-[var(--radius)] border border-line bg-surface-2 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate font-mono text-[13px]">
                    {store.handle}.hanubees.com
                  </p>
                  <p className="text-xs text-text-3">Included with every store</p>
                </div>
                <Badge tone="success" dot>
                  Live
                </Badge>
              </div>

              {store.customDomain ? (
                <div className="flex items-center justify-between gap-3 rounded-[var(--radius)] border border-line px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate font-mono text-[13px]">{store.customDomain}</p>
                    <p className="text-xs text-text-3">Primary domain</p>
                  </div>
                  <Badge tone="success" dot>
                    Verified
                  </Badge>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3 rounded-[var(--radius)] border border-dashed border-line px-3 py-2.5">
                  <p className="text-[13px] text-text-2">No custom domain connected</p>
                  <Button size="sm">Connect domain</Button>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Checkout" />
            <div className="mt-1 divide-y divide-[var(--border)]">
              <Toggle
                label="Guest checkout"
                description="Let shoppers buy without creating an account"
                defaultChecked
              />
              <Toggle
                label="Cash on delivery"
                description="Common expectation for first-time Indian shoppers"
                defaultChecked
              />
              <Toggle
                label="Abandoned cart emails"
                description="Send a reminder two hours after checkout is left"
              />
              <Toggle
                label="Require phone number"
                description="Useful for courier handoff, adds checkout friction"
              />
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title="Storefront theme" />
            <div className="mt-4 flex flex-col gap-4">
              <Field label="Accent colour" hint="Used across your storefront only">
                <div className="flex items-center gap-2">
                  <span
                    className="size-9 shrink-0 rounded-[var(--radius)] border border-line"
                    style={{ background: store.theme.accent }}
                    aria-hidden
                  />
                  <Input defaultValue={store.theme.accent} className="font-mono" />
                </div>
              </Field>
              <Field label="Typography">
                <Select defaultValue={store.theme.typography}>
                  <option value="modern">Modern</option>
                  <option value="editorial">Editorial</option>
                  <option value="playful">Playful</option>
                </Select>
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader title="Danger zone" />
            <p className="mt-3 text-[13px] text-text-2">
              Pausing hides the storefront from shoppers. Orders and data are kept.
            </p>
            <div className="mt-3 flex gap-2">
              <Button size="sm">Pause store</Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
