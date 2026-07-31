import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { ArrowLeftIcon } from "@/components/icons";
import { getProduct, getStore } from "@/lib/data";

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
      <Link
        href={`/admin/${store.handle}/products`}
        className="inline-flex items-center gap-1.5 text-[13px] text-text-2 hover:text-text"
      >
        <ArrowLeftIcon className="size-3.5" />
        Products
      </Link>
      <ProductForm store={store} product={product} />
    </>
  );
}
