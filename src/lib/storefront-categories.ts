"use client";

import { useEffect, useMemo, useState } from "react";
import { API_ORIGIN, apiGetCategories, apiGetFeaturedCategories } from "@/lib/api";
import { campaignBlocks, categoryHighlights } from "@/lib/store-data";

export type StorefrontCategoryHighlight = {
  id: string;
  name: string;
  slug: string;
  caption: string;
  count: string;
  image: string;
  tone?: string;
};

export type StorefrontCategoryCampaign = {
  id: string;
  name: string;
  slug: string;
  image: string;
  layout: "full" | "split";
};

type StorefrontCategoryCatalog = {
  featured: StorefrontCategoryHighlight[];
  campaigns: StorefrontCategoryCampaign[];
  campaignLayout: "full" | "split";
};

function normalizeKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function resolveImage(bannerImage: string | null, categoryName: string, index: number): string {
  if (bannerImage) {
    if (bannerImage.startsWith("/")) {
      return `${API_ORIGIN}${bannerImage}`;
    }
    return bannerImage;
  }
  const key = normalizeKey(categoryName);
  const match = categoryHighlights.find((h) => normalizeKey(h.name) === key);
  return match?.image ?? categoryHighlights[index % categoryHighlights.length]?.image ?? "";
}

function getFallbackCatalog(): StorefrontCategoryCatalog {
  return {
    featured: categoryHighlights.map((item, index) => ({
      id: `fallback-${index}`,
      ...item,
      slug: `/shop?category=${encodeURIComponent(item.name)}`,
    })),
    campaigns: campaignBlocks.slice(0, 2).map((item, index) => ({
      id: `fallback-campaign-${index}`,
      name: item.title,
      slug: "/shop",
      image: item.image,
      layout: index === 0 ? "full" : "split",
    })),
    campaignLayout: "full",
  };
}

export function useStorefrontCategories() {
  const [catalog, setCatalog] = useState<StorefrontCategoryCatalog>(getFallbackCatalog);

  useEffect(() => {
    async function load() {
      try {
        // Try featured first; fall back to all active categories
        let cats = await apiGetFeaturedCategories();
        if (!cats || cats.length === 0) {
          cats = await apiGetCategories();
        }

        if (!cats || cats.length === 0) {
          return;
        }

        const featured: StorefrontCategoryHighlight[] = cats.slice(0, 4).map((cat, i) => ({
          id: String(cat.id),
          name: cat.name,
          slug: `/shop?category=${encodeURIComponent(cat.name)}`,
          caption: cat.description ?? `Explore our ${cat.name.toLowerCase()} collection.`,
          count: `${cat.products_count ?? 0} ${cat.products_count === 1 ? "product" : "products"}`,
          image: resolveImage(cat.banner_image, cat.name, i),
        }));

        const campaigns: StorefrontCategoryCampaign[] = cats.slice(0, 2).map((cat, i) => ({
          id: `${cat.id}-campaign`,
          name: cat.name,
          slug: `/shop?category=${encodeURIComponent(cat.name)}`,
          image: resolveImage(cat.banner_image, cat.name, i),
          layout: i === 0 ? "full" : "split",
        }));

        setCatalog({
          featured,
          campaigns,
          campaignLayout: cats.length >= 2 ? "split" : "full",
        });
      } catch {
        // Keep fallback
      }
    }

    load();
  }, []);

  return useMemo(() => catalog, [catalog]);
}
