import { ProductDetailPage } from "@/components/storefront-pages";
import { products } from "@/lib/store-data";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductDetailPage slug={slug} />;
}

