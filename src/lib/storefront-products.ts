"use client";

import { useEffect, useState } from "react";
import { API_ORIGIN, apiGetProducts, type ApiProduct, type ApiProductVariation } from "@/lib/api";
import { products, type Product } from "@/lib/store-data";

export type StorefrontProduct = Product & {
  featured?: boolean;
  created_at?: string;
  variations?: ApiProductVariation[];
  size?: string | null;
};

function toStorefrontProduct(p: ApiProduct): StorefrontProduct {
  let primaryImage =
    p.images.find((i) => i.is_primary)?.url ??
    p.images[0]?.url ??
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80";

  if (primaryImage.startsWith('/')) {
    primaryImage = new URL(primaryImage, API_ORIGIN).toString();
  }

  return {
    slug: p.slug,
    name: p.name,
    category: (p.category?.name as Product["category"]) ?? "Makeup",
    subcategory: p.subcategory ?? p.category?.name ?? "",
    price: p.price,
    rating: p.rating,
    reviewCount: p.review_count,
    shades: p.shades.map((s) => s.name),
    description: p.description,
    badge: p.badge ?? undefined,
    accent: p.accent ?? "from-stone-100 via-amber-50 to-stone-50",
    heroTone: p.hero_tone ?? "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.45),_transparent_50%),linear-gradient(135deg,#b98d67,#ead7c2)]",
    image: primaryImage,
    featured: p.featured,
    created_at: p.created_at,
    variations: p.variations ?? [],
    size: p.size,
  };
}

export function useStorefrontProducts(params: {
  category?: string;
  search?: string;
  sort?: string;
} = {}) {
  const [catalog, setCatalog] = useState<StorefrontProduct[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    apiGetProducts({ ...params, featured: undefined })
      .then((res) => {
        if (!cancelled) {
          setCatalog(res.data.map(toStorefrontProduct));
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCatalog([]);
          setReady(true);
          setError(true);
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.category, params.search, params.sort]);

  return { products: catalog, ready, error };
}
