"use client";

import { useEffect, useState } from "react";
import { API_ORIGIN, apiGetProducts, type ApiProduct, type ApiProductVariation } from "./api";
import { brandImages, products, type Product } from "./store-data";

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
    brandImages.productFallback;

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
    accent: p.accent ?? "bg-[#F5E6DA]",
    heroTone: p.hero_tone ?? "bg-[#F5E6DA]",
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
