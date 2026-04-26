"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  apiGetProducts,
  apiCreateProduct,
  apiUpdateProduct,
  apiDeleteProduct,
  apiGetCategories,
  apiCreateCategory,
  apiUpdateCategory,
  apiDeleteCategory,
  type ApiProduct,
  type ApiCategory,
} from "./api";

// ─── Legacy local types (kept for compatibility with existing dashboard UI) ──

export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  comparePrice?: number;
  description: string;
  stock: number;
  status: "published" | "draft";
  featured?: boolean;
  images: string[];
  createdAt: string;
};

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId?: string;
  bannerUrl?: string;
  fullBannerUrl?: string;
  circleUrl?: string;
  circleColor?: string;
  backgroundColor?: string;
  bannerLayout?: "full" | "split";
  isFeatured?: boolean;
};

export type AdminAttribute = { id: string; name: string; values: string[] };
export type AdminColor     = { id: string; name: string; hex: string };
export type AdminUnit      = { id: string; name: string; symbol: string };

// Keep legacy keys so existing localStorage data is not lost during migration
export const PRODUCTS_KEY   = "ellena-admin-products";
export const CATEGORIES_KEY = "ellena-admin-categories";

// ─── Context ────────────────────────────────────────────────────────────────

type AdminContextValue = {
  products: AdminProduct[];
  categories: AdminCategory[];
  attributes: AdminAttribute[];
  colors: AdminColor[];
  units: AdminUnit[];
  loading: boolean;
  addProduct: (p: Omit<AdminProduct, "id" | "createdAt">) => Promise<void>;
  updateProduct: (id: string, p: Partial<AdminProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (c: Omit<AdminCategory, "id">) => Promise<void>;
  updateCategory: (id: string, c: Partial<AdminCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addAttribute: (a: Omit<AdminAttribute, "id">) => void;
  deleteAttribute: (id: string) => void;
  addColor: (c: Omit<AdminColor, "id">) => void;
  deleteColor: (id: string) => void;
  addUnit: (u: Omit<AdminUnit, "id">) => void;
  deleteUnit: (id: string) => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

// ─── Adapters ───────────────────────────────────────────────────────────────

function apiProductToAdmin(p: ApiProduct): AdminProduct {
  return {
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    category: p.category?.name ?? "",
    price: p.price,
    description: p.description,
    stock: p.in_stock ? 1 : 0,
    status: p.status,
    featured: p.featured,
    images: p.images.map((i) => i.url),
    createdAt: p.created_at,
  };
}

function apiCategoryToAdmin(c: ApiCategory): AdminCategory {
  return {
    id: String(c.id),
    name: c.name,
    slug: c.slug,
    description: c.description ?? "",
    parentId: c.parent_id ? String(c.parent_id) : undefined,
    bannerUrl: c.banner_image ?? undefined,
    isFeatured: c.featured,
  };
}

// ─── Defaults (used when API is unavailable) ────────────────────────────────

const DEFAULT_COLORS: AdminColor[] = [
  { id: "col1", name: "Nude",  hex: "#C8A882" },
  { id: "col2", name: "Rose",  hex: "#E8A0A0" },
  { id: "col3", name: "Berry", hex: "#7B3F5E" },
  { id: "col4", name: "Coral", hex: "#E8735A" },
  { id: "col5", name: "Ivory", hex: "#F5F0E8" },
];

const DEFAULT_UNITS: AdminUnit[] = [
  { id: "u1", name: "Milliliter", symbol: "ml" },
  { id: "u2", name: "Gram",       symbol: "g"  },
  { id: "u3", name: "Ounce",      symbol: "oz" },
  { id: "u4", name: "Piece",      symbol: "pc" },
];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function AdminStoreProvider({ children }: { children: React.ReactNode }) {
  const [products,   setProducts]   = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [attributes, setAttributes] = useState<AdminAttribute[]>([]);
  const [colors,     setColors]     = useState<AdminColor[]>(DEFAULT_COLORS);
  const [units,      setUnits]      = useState<AdminUnit[]>(DEFAULT_UNITS);
  const [loading,    setLoading]    = useState(true);

  // Fetch from Laravel API on mount
  useEffect(() => {
    Promise.all([
      apiGetProducts({ sort: "featured" }).catch(() => null),
      apiGetCategories().catch(() => null),
    ]).then(([productsRes, categoriesRes]) => {
      if (productsRes) {
        setProducts(productsRes.data.map(apiProductToAdmin));
      }
      if (categoriesRes) {
        setCategories(categoriesRes.map(apiCategoryToAdmin));
      }
      setLoading(false);
    });
  }, []);

  // ── Product CRUD ────────────────────────────────────────────────────────

  const addProduct = useCallback(async (p: Omit<AdminProduct, "id" | "createdAt">) => {
    const created = await apiCreateProduct({
      name: p.name,
      description: p.description,
      price: p.price,
      status: p.status,
      featured: p.featured,
      in_stock: p.stock > 0,
      images: p.images,
    });
    setProducts((prev) => [apiProductToAdmin(created), ...prev]);
  }, []);

  const updateProduct = useCallback(async (id: string, p: Partial<AdminProduct>) => {
    const existing = products.find((x) => x.id === id);
    if (!existing) return;
    const updated = await apiUpdateProduct(existing.slug, {
      name: p.name,
      description: p.description,
      price: p.price,
      status: p.status,
      featured: p.featured,
      in_stock: p.stock !== undefined ? p.stock > 0 : undefined,
      images: p.images,
    });
    setProducts((prev) =>
      prev.map((x) => (x.id === id ? apiProductToAdmin(updated) : x))
    );
  }, [products]);

  const deleteProduct = useCallback(async (id: string) => {
    const existing = products.find((x) => x.id === id);
    if (!existing) return;
    await apiDeleteProduct(existing.slug);
    setProducts((prev) => prev.filter((x) => x.id !== id));
  }, [products]);

  // ── Category CRUD ───────────────────────────────────────────────────────

  const addCategory = useCallback(async (c: Omit<AdminCategory, "id">) => {
    const created = await apiCreateCategory({
      name: c.name,
      description: c.description,
      banner_image: c.bannerUrl,
      parent_id: c.parentId ? Number(c.parentId) : undefined,
      featured: c.isFeatured,
    });
    setCategories((prev) => [...prev, apiCategoryToAdmin(created)]);
  }, []);

  const updateCategory = useCallback(async (id: string, c: Partial<AdminCategory>) => {
    const existing = categories.find((x) => x.id === id);
    if (!existing) return;
    const updated = await apiUpdateCategory(existing.slug, {
      name: c.name,
      description: c.description,
      banner_image: c.bannerUrl,
      featured: c.isFeatured,
    });
    setCategories((prev) =>
      prev.map((x) => (x.id === id ? apiCategoryToAdmin(updated) : x))
    );
  }, [categories]);

  const deleteCategory = useCallback(async (id: string) => {
    const existing = categories.find((x) => x.id === id);
    if (!existing) return;
    await apiDeleteCategory(existing.slug);
    setCategories((prev) => prev.filter((x) => x.id !== id));
  }, [categories]);

  // ── Attribute / Color / Unit (local only for now) ───────────────────────

  const addAttribute  = useCallback((a: Omit<AdminAttribute, "id">) =>
    setAttributes((prev) => [...prev, { ...a, id: uid() }]), []);
  const deleteAttribute = useCallback((id: string) =>
    setAttributes((prev) => prev.filter((a) => a.id !== id)), []);

  const addColor    = useCallback((c: Omit<AdminColor, "id">) =>
    setColors((prev) => [...prev, { ...c, id: uid() }]), []);
  const deleteColor = useCallback((id: string) =>
    setColors((prev) => prev.filter((c) => c.id !== id)), []);

  const addUnit    = useCallback((u: Omit<AdminUnit, "id">) =>
    setUnits((prev) => [...prev, { ...u, id: uid() }]), []);
  const deleteUnit = useCallback((id: string) =>
    setUnits((prev) => prev.filter((u) => u.id !== id)), []);

  const value = useMemo<AdminContextValue>(
    () => ({
      products, categories, attributes, colors, units, loading,
      addProduct, updateProduct, deleteProduct,
      addCategory, updateCategory, deleteCategory,
      addAttribute, deleteAttribute,
      addColor, deleteColor,
      addUnit, deleteUnit,
    }),
    [
      products, categories, attributes, colors, units, loading,
      addProduct, updateProduct, deleteProduct,
      addCategory, updateCategory, deleteCategory,
      addAttribute, deleteAttribute,
      addColor, deleteColor,
      addUnit, deleteUnit,
    ],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdminStore() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdminStore must be used within AdminStoreProvider");
  return ctx;
}
