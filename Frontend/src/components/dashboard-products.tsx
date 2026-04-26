"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  Edit2,
  EyeOff,
  FolderOpen,
  Globe,
  Image as ImageIcon,
  Package,
  Plus,
  Search,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Upload,
  User,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAdminStore, type AdminProduct } from "@/lib/admin-store";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

// â”€â”€â”€ Shared helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function PageShell({ title, subtitle, children, fullWidth }: { title: string; subtitle?: string; children: React.ReactNode; fullWidth?: boolean }) {
  return (
    <div className={fullWidth ? "w-full px-6 py-8" : "mx-auto max-w-5xl px-6 py-8"}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
      <AlertCircle className="mb-3 h-8 w-8 text-slate-300" strokeWidth={1.5} />
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  );
}

function Badge({ status }: { status: "published" | "draft" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        status === "published"
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {status === "published" ? "Published" : "Draft"}
    </span>
  );
}

// â”€â”€â”€ Add New Product â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type FormState = {
  name: string;
  category: string;
  price: string;
  comparePrice: string;
  description: string;
  stock: string;
  status: "published" | "draft";
};

const EMPTY_FORM: FormState = {
  name: "",
  category: "",
  price: "",
  comparePrice: "",
  description: "",
  stock: "",
  status: "draft",
};

export function AddProductPage() {
  const { addProduct, categories } = useAdminStore();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [images, setImages] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleImages = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImages((prev) => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }, []);

  const removeImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  function validate() {
    const errs: typeof errors = {};
    if (!form.name.trim()) errs.name = "Product name is required";
    if (!form.category) errs.category = "Please select a category";
    if (!form.price || Number.isNaN(Number(form.price)) || Number(form.price) <= 0)
      errs.price = "Enter a valid price";
    if (form.stock !== "" && (Number.isNaN(Number(form.stock)) || Number(form.stock) < 0))
      errs.stock = "Enter a valid stock quantity";
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    addProduct({
      name: form.name.trim(),
      slug: form.name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      category: form.category,
      price: Number(form.price),
      comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
      description: form.description.trim(),
      stock: form.stock ? Number(form.stock) : 0,
      status: form.status,
      images,
    });
    setForm(EMPTY_FORM);
    setImages([]);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <PageShell title="Add New Product" subtitle="Fill in the details below to add a product to your store.">
      {saved && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-5 w-5 shrink-0" strokeWidth={1.8} />
          Product saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Basic info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Product Name *</label>
                <input
                  value={form.name}
                  onChange={set("name")}
                  placeholder="e.g. Glow Serum 30ml"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#5b4cf0] focus:bg-white focus:ring-2 focus:ring-[#5b4cf0]/10"
                />
                {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={set("description")}
                  rows={4}
                  placeholder="Describe the product â€” ingredients, benefits, how to use..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#5b4cf0] focus:bg-white focus:ring-2 focus:ring-[#5b4cf0]/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Category *</label>
                <select
                  value={form.category}
                  onChange={set("category")}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#5b4cf0] focus:bg-white focus:ring-2 focus:ring-[#5b4cf0]/10"
                >
                  <option value="">Select categoryâ€¦</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-xs text-rose-500">{errors.category}</p>}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Pricing</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Price (UGX) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">UGX</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.price}
                    onChange={set("price")}
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-12 pr-4 text-sm outline-none transition focus:border-[#5b4cf0] focus:bg-white focus:ring-2 focus:ring-[#5b4cf0]/10"
                  />
                </div>
                {errors.price && <p className="mt-1 text-xs text-rose-500">{errors.price}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Compare-at Price</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">UGX</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.comparePrice}
                    onChange={set("comparePrice")}
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-12 pr-4 text-sm outline-none transition focus:border-[#5b4cf0] focus:bg-white focus:ring-2 focus:ring-[#5b4cf0]/10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Inventory</h2>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={set("stock")}
                placeholder="0"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#5b4cf0] focus:bg-white focus:ring-2 focus:ring-[#5b4cf0]/10"
              />
              {errors.stock && <p className="mt-1 text-xs text-rose-500">{errors.stock}</p>}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Status */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Status</h2>
            <div className="space-y-2">
              {(["published", "draft"] as const).map((s) => (
                <label key={s} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-100 px-4 py-3 transition hover:bg-slate-50">
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={form.status === s}
                    onChange={() => setForm((f) => ({ ...f, status: s }))}
                    className="accent-[#5b4cf0]"
                  />
                  <div>
                    <p className="text-sm font-medium capitalize text-slate-700">{s}</p>
                    <p className="text-xs text-slate-400">
                      {s === "published" ? "Visible in storefront" : "Hidden from storefront"}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Product Images</h2>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImages}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-6 text-sm text-slate-400 transition hover:border-[#5b4cf0]/40 hover:bg-[#f5f4ff] hover:text-[#5b4cf0]"
            >
              <Upload className="h-6 w-6" strokeWidth={1.5} />
              <span>Click to upload images</span>
              <span className="text-xs">PNG, JPG, WEBP up to 10MB</span>
            </button>

            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {images.map((src, i) => (
                  <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-slate-600 opacity-0 shadow transition group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-500"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5b4cf0] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(91,76,240,0.22)] transition hover:bg-[#4c3de0] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Save Product
          </button>
        </div>
      </form>
    </PageShell>
  );
}

// â”€â”€â”€ Edit Drawer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function EditDrawer({
  product,
  onClose,
}: {
  product: AdminProduct;
  onClose: () => void;
}) {
  const { updateProduct, categories } = useAdminStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: product.name,
    category: product.category,
    price: String(product.price),
    comparePrice: product.comparePrice ? String(product.comparePrice) : "",
    description: product.description,
    stock: String(product.stock),
    status: product.status as "published" | "draft",
    featured: product.featured ?? false,
  });
  const [images, setImages] = useState<string[]>(product.images);
  const [saved, setSaved] = useState(false);

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    Array.from(e.target.files ?? []).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setImages((prev) => [...prev, ev.target!.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    updateProduct(product.id, {
      name: form.name.trim(),
      slug: form.name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      category: form.category,
      price: Number(form.price),
      comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
      description: form.description.trim(),
      stock: Number(form.stock),
      status: form.status,
      featured: form.featured,
      images,
    });
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Edit Product</h2>
            <p className="text-xs text-slate-400">/{product.slug}</p>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="h-5 w-5" strokeWidth={1.8} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex-1 space-y-5 p-6">
            {saved && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={1.8} /> Saved successfully!
              </div>
            )}

            {/* Name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Product Name</label>
              <input value={form.name} onChange={set("name")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-[#5b4cf0] focus:bg-white focus:ring-2 focus:ring-[#5b4cf0]/10" />
            </div>

            {/* Category */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
              <select value={form.category} onChange={set("category")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-[#5b4cf0] focus:bg-white">
                {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Price (UGX)</label>
                <input type="number" min="0" step="1" value={form.price} onChange={set("price")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-[#5b4cf0] focus:bg-white" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Compare-at</label>
                <input type="number" min="0" step="1" value={form.comparePrice} onChange={set("comparePrice")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-[#5b4cf0] focus:bg-white" />
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Stock Quantity</label>
              <input type="number" min="0" value={form.stock} onChange={set("stock")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-[#5b4cf0] focus:bg-white" />
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
              <textarea rows={3} value={form.description} onChange={set("description")} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-[#5b4cf0] focus:bg-white" />
            </div>

            {/* Status + Featured */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, status: f.status === "published" ? "draft" : "published" }))}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition",
                  form.status === "published"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100",
                )}
              >
                {form.status === "published" ? <Globe className="h-4 w-4" strokeWidth={1.8} /> : <EyeOff className="h-4 w-4" strokeWidth={1.8} />}
                {form.status === "published" ? "Published" : "Draft"}
              </button>

              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition",
                  form.featured
                    ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                    : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100",
                )}
              >
                <Star className={cn("h-4 w-4", form.featured ? "fill-amber-500 text-amber-500" : "")} strokeWidth={1.8} />
                {form.featured ? "Featured" : "Not Featured"}
              </button>
            </div>

            {/* Images */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Images</label>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
              {images.length > 0 && (
                <div className="mb-2 grid grid-cols-4 gap-2">
                  {images.map((src, i) => (
                    <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-slate-600 opacity-0 shadow transition group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-500">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button type="button" onClick={() => fileRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-3 text-sm text-slate-400 transition hover:border-[#5b4cf0]/40 hover:bg-[#f5f4ff] hover:text-[#5b4cf0]">
                <Upload className="h-4 w-4" strokeWidth={1.5} /> Add images
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 p-6">
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5b4cf0] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(91,76,240,0.22)] transition hover:bg-[#4c3de0]">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

// â”€â”€â”€ All Products â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function AllProductsPage() {
  const { products, deleteProduct, updateProduct, categories } = useAdminStore();
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === "All" || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, color: "text-[#5b4cf0]" },
    { label: "Published", value: products.filter(p => p.status === "published").length, icon: CheckCircle2, color: "text-emerald-500" },
    { label: "Out of Stock", value: products.filter(p => p.stock === 0).length, icon: AlertCircle, color: "text-rose-500" },
  ];

  return (
    <>
    <PageShell title="Product Inventory" subtitle="Manage your catalog, stock levels, and multi-channel publication status." fullWidth>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
                  <p className="mt-2 text-3xl font-black text-slate-900">{stat.value}</p>
                </div>
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50", stat.color)}>
                  <stat.icon className="h-6 w-6" strokeWidth={2} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Catalog Table */}
        <div className="rounded-[32px] border border-slate-200 bg-white shadow-[0_2px_15px_rgba(15,23,42,0.03)]">
          {/* Table Header / Filters */}
          <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search catalog..."
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm outline-none transition focus:border-[#5b4cf0] focus:bg-white focus:ring-4 focus:ring-[#5b4cf0]/5"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 outline-none transition focus:border-[#5b4cf0]"
              >
                <option value="All">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
              <Link href="/dashboard/products/add" className="flex h-11 items-center gap-2 rounded-2xl bg-black px-6 text-sm font-bold text-white transition hover:bg-slate-800">
                <Plus className="h-4 w-4" strokeWidth={2.5} /> Add New
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4 font-bold">Product Details</th>
                  <th className="px-6 py-4 font-bold">Category</th>
                  <th className="px-6 py-4 font-bold">Pricing</th>
                  <th className="px-6 py-4 font-bold">In Stock</th>
                  <th className="px-6 py-4 font-bold">Visibility</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence mode="popLayout">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center">
                        <p className="text-sm font-medium text-slate-400">No products match your filters.</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((p) => (
                      <motion.tr
                        layout
                        key={p.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group transition-colors hover:bg-slate-50/50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-14 w-14 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 lg:h-16 lg:w-16">
                              {p.images[0] ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={p.images[0]} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-slate-300">
                                  <ImageIcon className="h-6 w-6" strokeWidth={1.5} />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-[15px] font-bold text-slate-900">{p.name}</p>
                              <div className="mt-1 flex items-center gap-2">
                                <span className="text-[10px] font-mono text-slate-400 tracking-tight leading-none uppercase">ID: {p.id.substring(0, 8)}</span>
                                <span className="h-1 w-1 rounded-full bg-slate-300" />
                                <span className="text-[11px] text-slate-400">/{p.slug}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-tighter">
                            {p.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-[15px] font-black text-slate-900">{formatCurrency(p.price)}</p>
                          {p.comparePrice && (
                            <p className="text-[11px] font-medium text-slate-400 line-through">{formatCurrency(p.comparePrice)}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className={cn("text-[15px] font-bold", p.stock < 5 ? "text-rose-500" : "text-slate-700")}>
                              {p.stock}
                            </span>
                            <div className="h-1.5 w-16 rounded-full bg-slate-100 overflow-hidden">
                               <div 
                                className={cn("h-full rounded-full transition-all", p.stock > 10 ? "bg-emerald-400" : p.stock > 0 ? "bg-amber-400" : "bg-rose-400")} 
                                style={{ width: `${Math.min(100, (p.stock / 20) * 100)}%` }} 
                               />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5">
                            <div className={cn(
                              "inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider",
                              p.status === "published" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                            )}>
                              <div className={cn("h-1.5 w-1.5 rounded-full", p.status === "published" ? "bg-emerald-500" : "bg-slate-400")} />
                              {p.status}
                            </div>
                            {p.featured && (
                              <div className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-600">
                                <Star className="h-3 w-3 fill-amber-500 text-amber-500" strokeWidth={0} />
                                Featured
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1.5 opacity-0 transition duration-300 group-hover:opacity-100">
                            <button
                              title="Edit"
                              onClick={() => setEditingProduct(p)}
                              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition hover:bg-slate-900 hover:text-white"
                            >
                              <Edit2 className="h-4 w-4" strokeWidth={2} />
                            </button>
                            <button
                              title={p.status === "published" ? "Unpublish" : "Publish"}
                              onClick={() => updateProduct(p.id, { status: p.status === "published" ? "draft" : "published" })}
                              className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm transition",
                                p.status === "published"
                                  ? "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                  : "text-slate-400 hover:bg-emerald-500 hover:text-white",
                              )}
                            >
                              {p.status === "published" ? <EyeOff className="h-4 w-4" strokeWidth={2} /> : <Globe className="h-4 w-4" strokeWidth={2} />}
                            </button>
                            <button
                              title={p.featured ? "Unfeature" : "Feature"}
                              onClick={() => updateProduct(p.id, { featured: !p.featured })}
                              className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm transition",
                                p.featured ? "text-amber-400 hover:bg-amber-50" : "text-slate-400 hover:bg-amber-50 hover:text-amber-500",
                              )}
                            >
                              <Star className={cn("h-4 w-4", p.featured ? "fill-amber-400 text-amber-400" : "")} strokeWidth={p.featured ? 0 : 2} />
                            </button>
                            <button
                              title="Delete"
                              onClick={() => deleteProduct(p.id)}
                              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition hover:bg-rose-500 hover:text-white"
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={2} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 p-6">
             <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Page 1 of 1</p>
             <div className="flex gap-2">
                <button disabled className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-300">Previous</button>
                <button disabled className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-300">Next</button>
             </div>
          </div>
        </div>
      </div>
    </PageShell>

    {editingProduct && (
      <EditDrawer product={editingProduct} onClose={() => setEditingProduct(null)} />
    )}
    </>
  );
}

// â”€â”€â”€ Bulk Import â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function BulkImportPage() {
  const { addProduct, categories } = useAdminStore();
  const [dragging, setDragging] = useState(false);
  const [imported, setImported] = useState<number | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function parseCSV(text: string): Omit<AdminProduct, "id" | "createdAt">[] {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/[^a-z]/g, ""));
    return lines.slice(1).map((line) => {
      const vals = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
      const row: Record<string, string> = {};
      headers.forEach((h, i) => { row[h] = vals[i] ?? ""; });
      return {
        name: row.name ?? "Unnamed",
        slug: (row.name ?? "unnamed").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        category: row.category ?? categories[0]?.slug ?? "",
        price: Number(row.price) || 0,
        comparePrice: row.compareprice ? Number(row.compareprice) : undefined,
        description: row.description ?? "",
        stock: Number(row.stock) || 0,
        status: (row.status as "published" | "draft") ?? "draft",
        images: [],
      };
    });
  }

  function handleFile(file: File) {
    if (!file.name.endsWith(".csv")) { setError("Please upload a CSV file."); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = parseCSV(text);
        rows.forEach((r) => addProduct(r));
        setImported(rows.length);
        setError("");
      } catch (err) {
        setError("Error parsing CSV. Please check the format.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <PageShell title="Bulk Import" subtitle="Quickly populate your store by uploading a CSV catalog.">
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Main Upload Area */}
        <div className="space-y-6">
          <motion.div
            layout
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); const file = e.dataTransfer.files[0]; if (file) handleFile(file); }}
            className={cn(
              "relative flex min-h-[400px] flex-col items-center justify-center rounded-[40px] border-2 border-dashed transition-all duration-500",
              dragging ? "border-[#5b4cf0] bg-[#5b4cf0]/5 scale-[0.99]" : "border-slate-200 bg-white hover:border-slate-300",
              imported ? "border-emerald-200 bg-emerald-50/30" : ""
            )}
          >
            <input type="file" ref={fileRef} className="hidden" accept=".csv" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file); }} />

            <AnimatePresence mode="wait">
              {imported ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_12px_40px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="h-10 w-10" strokeWidth={2.5} />
                  </div>
                  <h3 className="mt-8 text-2xl font-black text-slate-900">Import Complete</h3>
                  <p className="mt-2 text-slate-500">Successfully added <span className="font-bold text-slate-900">{imported}</span> products to your catalogue.</p>
                  <div className="mt-8 flex gap-3">
                    <Link href="/dashboard/products" className="rounded-2xl bg-black px-8 py-3 text-sm font-bold text-white transition hover:bg-slate-800">View Products</Link>
                    <button onClick={() => setImported(null)} className="rounded-2xl border border-slate-200 bg-white px-8 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50">Upload Another</button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center p-8">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f4f3ff] text-[#5b4cf0]">
                    <Upload className="h-9 w-9" />
                  </div>
                  <h3 className="mt-8 text-2xl font-bold tracking-tight text-slate-900">Drop your catalog here</h3>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-slate-500">Upload a CSV file containing your product information. We'll handle the rest.</p>
                  <button 
                    onClick={() => fileRef.current?.click()}
                    className="mt-8 flex items-center gap-2 rounded-2xl bg-black px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(0,0,0,0.15)] transition hover:bg-slate-800"
                  >
                    Select CSV File
                  </button>
                  {error && (
                    <div className="mt-6 flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2 text-sm font-bold text-rose-500">
                      <AlertCircle className="h-4 w-4" /> {error}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-8">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">How it works</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { step: "01", title: "Format", body: "Ensure your CSV has Name, Category, Price, and Stock headers." },
                  { step: "02", title: "Upload", body: "Drag your file into the Dropzone or use the file picker." },
                  { step: "03", title: "Review", body: "Products are added as drafts. Review them in the inventory." },
                ].map(s => (
                  <div key={s.step} className="space-y-3">
                    <span className="text-[10px] font-black tracking-widest text-[#5b4cf0]/40">{s.step}</span>
                    <p className="text-sm font-bold text-slate-900">{s.title}</p>
                    <p className="text-xs leading-5 text-slate-500">{s.body}</p>
                  </div>
                ))}
              </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <aside className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900">Template</h3>
            <p className="mt-1 text-xs text-slate-500 text-balance leading-relaxed">Download our pre-formatted CSV template to ensure a smooth import process.</p>
            <button className="mt-6 flex w-full items-center justify-between rounded-2xl bg-[#eef0ff] p-4 text-left transition hover:bg-[#e4e7ff]">
               <div className="flex items-center gap-3">
                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#5b4cf0] shadow-sm">
                   <Download className="h-5 w-5" />
                 </div>
                 <span className="text-sm font-bold text-[#5b4cf0]">Download Template</span>
               </div>
               <ChevronRight className="h-4 w-4 text-[#5b4cf0]/40" />
            </button>
          </div>

          <div className="rounded-3xl bg-slate-900 p-8 text-white">
            <Sparkles className="h-6 w-6 text-amber-300" />
            <h4 className="mt-4 font-bold">Automation Cloud</h4>
            <p className="mt-2 text-xs leading-relaxed text-white/60">
              Our cloud engine automatically validates each row. Large catalogs (1000+) may take a few seconds to process.
            </p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

// â”€â”€â”€ Bulk Export â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function BulkExportPage() {
  const { products } = useAdminStore();

  function exportCSV() {
    const header = "name,category,price,compare_price,description,stock,status";
    const rows = products.map((p) =>
      [p.name, p.category, p.price, p.comparePrice ?? "", `"${p.description.replace(/"/g, '""')}"`, p.stock, p.status].join(","),
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ellena-products.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <PageShell title="Bulk Export" subtitle="Download all your products as a CSV file.">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eef0ff] text-[#5b4cf0]">
            <Download className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Export Products</h2>
            <p className="mt-1 text-sm text-slate-500">
              {products.length} product{products.length !== 1 ? "s" : ""} will be exported as a CSV file you can import into a spreadsheet or another system.
            </p>
          </div>
          <button
            onClick={exportCSV}
            disabled={products.length === 0}
            className="flex items-center gap-2 rounded-2xl bg-[#5b4cf0] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(91,76,240,0.22)] transition hover:bg-[#4c3de0] disabled:opacity-40"
          >
            <Download className="h-4 w-4" strokeWidth={2} />
            Download CSV
          </button>
          {products.length === 0 && <p className="text-xs text-slate-400">Add products first before exporting.</p>}
        </div>
      </div>
    </PageShell>
  );
}

// â”€â”€â”€ Category â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type AddTarget = { parentId?: string; depth: number; parentLabel?: string };

function CategoryAddForm({
  target,
  onCancel,
  onAdd,
}: {
  target: AddTarget;
  onCancel: () => void;
  onAdd: (name: string, desc: string, parentId?: string) => void;
}) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), desc.trim(), target.parentId);
    setName("");
    setDesc("");
  }

  const levelLabel = target.depth === 0 ? "Root Category" : target.depth === 1 ? "Sub-Category" : "Sub-Sub-Category";

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="mt-3 overflow-hidden rounded-2xl border border-[#C9A227]/15 bg-[#FFFDF9] p-5 shadow-[0_12px_32px_rgba(91,76,240,0.06)]"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5b4cf0]">Creating New Entry</p>
          <h4 className="text-sm font-bold text-slate-900">
            {levelLabel}{target.parentLabel ? ` under ${target.parentLabel}` : ""}
          </h4>
        </div>
        <button type="button" onClick={onCancel} className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition hover:text-slate-600">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Name *</label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Cleansers"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#5b4cf0] focus:ring-4 focus:ring-[#5b4cf0]/5"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Description</label>
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Short overview..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#5b4cf0] focus:ring-4 focus:ring-[#5b4cf0]/5"
          />
        </div>
        <div className="flex gap-2 pt-2">
          <button type="submit" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#5b4cf0] py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(91,76,240,0.2)] transition hover:bg-[#4c3de0] active:scale-95">
            <Plus className="h-4 w-4" strokeWidth={2.5} /> Confirm Add
          </button>
          <button type="button" onClick={onCancel} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-50">
            Cancel
          </button>
        </div>
      </div>
    </motion.form>
  );
}

function CategoryTreeNode({
  cat,
  depth,
  categories,
  onAdd,
  onDelete,
}: {
  cat: import("@/lib/admin-store").AdminCategory;
  depth: number;
  categories: import("@/lib/admin-store").AdminCategory[];
  onAdd: (target: AddTarget) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const { products } = useAdminStore();
  
  const children = categories.filter((c) => c.parentId === cat.id);
  const productCount = products.filter((p) => p.category === cat.slug).length;
  const canAddChild = depth < 2;

  const accentColor = depth === 0 ? "bg-[#5b4cf0]" : depth === 1 ? "bg-[#a78bfa]" : "bg-[#c4b5fd]";
  const borderTone = depth === 0 ? "border-[#5b4cf0]/10" : "border-slate-100";

  return (
    <div className="relative">
      {/* Hierarchy Line */}
      {depth > 0 && (
        <div 
          className="absolute left-4 top-0 h-full w-px bg-slate-200" 
          style={{ left: `${depth * 28 + 10}px` }}
        />
      )}

      <motion.div
        layout
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn(
          "group relative flex items-center gap-3 rounded-2xl border bg-white py-3.5 pl-3 pr-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_12px_40px_rgba(15,23,42,0.08)]",
          depth === 0 ? "mb-3 shadow-sm border-slate-200" : "mb-2 border-slate-100",
          depth === 0 ? "" : depth === 1 ? "ml-8" : "ml-16"
        )}
      >
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700",
            children.length === 0 && "opacity-0 pointer-events-none"
          )}
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", !expanded && "-rotate-90")} strokeWidth={2.5} />
        </button>

        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-white shadow-inner", accentColor)}>
          {cat.name.charAt(0)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={cn("font-bold tracking-tight text-slate-900", depth === 0 ? "text-base" : "text-[15px]")}>
              {cat.name}
            </span>
            {productCount > 0 && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                {productCount} items
              </span>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            {cat.description && <span className="truncate text-xs text-slate-500">{cat.description}</span>}
            <span className="text-[10px] font-mono text-slate-300">/{cat.slug}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 opacity-0 transition-all duration-300 group-hover:opacity-100">
          {canAddChild && (
            <button
              type="button"
              onClick={() => onAdd({ parentId: cat.id, depth: depth + 1, parentLabel: cat.name })}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef0ff] text-[#5b4cf0] transition hover:bg-[#5b4cf0] hover:text-white"
              title={`Add sub-${depth === 0 ? "category" : "sub-category"}`}
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(cat.id)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-500 transition hover:bg-rose-500 hover:text-white"
            title="Delete category"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {expanded && children.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {children.map((child) => (
              <CategoryTreeNode
                key={child.id}
                cat={child}
                depth={depth + 1}
                categories={categories}
                onAdd={onAdd}
                onDelete={onDelete}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CategoryPage() {
  const { categories, addCategory, updateCategory, deleteCategory, products } = useAdminStore();
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("none");
  const [bannerUrl, setBannerUrl] = useState("");
  const [fullBannerUrl, setFullBannerUrl] = useState("");
  const [circleUrl, setCircleUrl] = useState("");
  const [circleColor, setCircleColor] = useState("#4f43a5");
  const [backgroundColor, setBackgroundColor] = useState("#e9e9e9");
  const [bannerLayout, setBannerLayout] = useState<"full" | "split">("full");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const bannerFileRef = useRef<HTMLInputElement>(null);
  const fullBannerFileRef = useRef<HTMLInputElement>(null);
  const circleFileRef = useRef<HTMLInputElement>(null);

  function resetForm() {
    setEditingCategoryId(null);
    setName("");
    setDescription("");
    setParentId("none");
    setBannerUrl("");
    setFullBannerUrl("");
    setCircleUrl("");
    setCircleColor("#4f43a5");
    setBackgroundColor("#e9e9e9");
    setBannerLayout("full");
    setIsFeatured(false);
  }

  function showSavedState() {
    setIsSaved(true);
    window.setTimeout(() => setIsSaved(false), 3000);
  }

  function createSlug(value: string) {
    return `/${value.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`;
  }

  function normalizeCategoryValue(value: string) {
    return value.replace(/^\//, "");
  }

  function loadCategory(category: import("@/lib/admin-store").AdminCategory) {
    setEditingCategoryId(category.id);
    setName(category.name);
    setDescription(category.description ?? "");
    setParentId(category.parentId ?? "none");
    setBannerUrl(category.bannerUrl ?? "");
    setFullBannerUrl(category.fullBannerUrl ?? "");
    setCircleUrl(category.circleUrl ?? "");
    setCircleColor(category.circleColor ?? "#4f43a5");
    setBackgroundColor(category.backgroundColor ?? "#e9e9e9");
    setBannerLayout(category.bannerLayout ?? "full");
    setIsFeatured(category.isFeatured ?? false);
  }

  function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>,
    apply: (value: string) => void,
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      if (typeof loadEvent.target?.result === "string") {
        apply(loadEvent.target.result);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      slug: createSlug(name),
      description: description.trim(),
      parentId: parentId === "none" ? undefined : parentId,
      bannerUrl: bannerUrl.trim(),
      fullBannerUrl: fullBannerUrl.trim(),
      circleUrl: circleUrl.trim(),
      circleColor,
      backgroundColor,
      bannerLayout,
      isFeatured,
    };

    if (editingCategoryId) {
      updateCategory(editingCategoryId, payload);
    } else {
      addCategory(payload);
    }

    resetForm();
    showSavedState();
  }

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-[#111111]">
      <main className="px-6 py-10 lg:px-10">
        <div className="mb-8">
          <h1 className="text-[24px] font-extrabold tracking-[-0.02em] text-black">
            Product Categories
          </h1>
          <p className="mt-2 text-[15px] text-[#6d6d74]">
            Organize your products into logical groups.{" "}
            <span className="font-semibold text-black">({categories.length} total)</span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="overflow-hidden rounded-[22px] border border-[#e7e7ea] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between border-b border-[#ececef] bg-[#fafafa]/50 px-6 py-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#7b7b84]">Category List</h2>
              <button
                onClick={() => {
                  resetForm();
                  setIsDrawerOpen(true);
                }}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-black px-4 text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Create Category
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-[#ececef] bg-[#fafafa]/50 text-[11px] uppercase tracking-[0.05em] text-[#7b7b84]">
                    <th className="px-6 py-5 font-bold">Category</th>
                    <th className="px-4 py-5 font-bold">Level</th>
                    <th className="px-4 py-5 font-bold">Products</th>
                    <th className="px-4 py-5 font-bold">Media</th>
                    <th className="px-4 py-5 font-bold">Featured</th>
                    <th className="px-6 py-5 font-bold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#f0f0f2]">
                  {categories.map((item) => {
                    const productCount = products.filter((product) => normalizeCategoryValue(product.category) === normalizeCategoryValue(item.slug)).length;
                    const isRoot = !item.parentId;
                    const mediaCount = [item.bannerUrl, item.fullBannerUrl, item.circleUrl].filter(Boolean).length;

                    return (
                      <tr key={item.id} className="transition-colors hover:bg-[#fcfcfc]">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f4f4f6] text-[#8f8f98]">
                              <Tag className="h-4.5 w-4.5" strokeWidth={2} />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-[15px] font-bold leading-none text-black">
                                {item.name}
                              </p>
                              <p className="mt-1.5 truncate text-[12px] font-medium text-[#9a9aa2]">
                                {item.slug}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-5 font-medium">
                          <div className={cn(
                            "inline-flex h-11 w-11 items-center justify-center rounded-full text-center text-[10px] font-bold leading-[0.95rem]",
                            isRoot ? "bg-black text-white" : "border border-[#e7e7ea] bg-white text-black"
                          )}>
                            <span>
                              {isRoot ? "TOP" : "SUB"}
                              <br />
                              LVL
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-5">
                          <span className="text-[17px] font-bold text-slate-800">{productCount}</span>
                          <span className="ml-1.5 text-[12px] font-medium text-[#9a9aa2]">items</span>
                        </td>

                        <td className="px-4 py-5">
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            {mediaCount}/3 linked
                          </span>
                        </td>

                        <td className="px-4 py-5">
                          <button
                            type="button"
                            onClick={() => updateCategory(item.id, { isFeatured: !(item.isFeatured ?? false) })}
                            className={cn(
                              "inline-flex rounded-full px-3 py-1 text-xs font-semibold transition",
                              item.isFeatured ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            )}
                          >
                            {item.isFeatured ? "Featured" : "Not featured"}
                          </button>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                loadCategory(item);
                                setIsDrawerOpen(true);
                              }}
                              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e4e4e7] bg-white px-4 text-sm font-bold text-[#222] transition hover:bg-[#fafafa]"
                            >
                              <ImageIcon className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteCategory(item.id)}
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-white text-red-400 opacity-60 transition hover:bg-red-50 hover:text-red-500 hover:opacity-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {categories.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-sm font-medium text-slate-400">No categories found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Drawer */}
        <AnimatePresence>
          {isDrawerOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDrawerOpen(false)}
                className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
              />

              {/* Drawer */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-xl flex-col bg-[#f7f7f8] shadow-2xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#e7e7ea] bg-white px-8 py-6">
                  <div>
                    <h2 className="text-[20px] font-extrabold tracking-tight text-black">
                      {editingCategoryId ? "Update Category" : "Create Category"}
                    </h2>
                    <p className="mt-1 text-sm text-[#6d6d74]">
                      {editingCategoryId ? `Editing /${normalizeCategoryValue(categories.find(c => c.id === editingCategoryId)?.slug || "")}` : "Add a new group for your products"}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  >
                    <X className="h-5 w-5" strokeWidth={2.5} />
                  </button>
                </div>

                {/* Form Body */}
                <form
                  id="category-form"
                  onSubmit={(e) => {
                    handleSubmit(e);
                    setIsDrawerOpen(false);
                  }}
                  className="flex-1 overflow-y-auto p-8"
                >
                  <div className="space-y-8 rounded-[28px] border border-[#e7e7ea] bg-white p-8 shadow-sm">
                    {/* Basic Info */}
                    <div className="space-y-6">
                      <div>
                        <label className="mb-2 block text-[13px] font-bold uppercase tracking-wider text-[#222]">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          type="text"
                          autoFocus
                          placeholder="e.g. Skincare"
                          className="h-12 w-full rounded-2xl border border-[#ededf0] bg-[#f8f8f9] px-4 text-sm font-medium outline-none transition focus:bg-white focus:ring-4 focus:ring-black/5"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-[13px] font-bold uppercase tracking-wider text-[#222]">
                          Description
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={3}
                          placeholder="Short copy for the featured category card and banner text."
                          className="w-full rounded-2xl border border-[#ededf0] bg-[#f8f8f9] px-4 py-3 text-sm font-medium outline-none transition focus:bg-white focus:ring-4 focus:ring-black/5"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-[13px] font-bold uppercase tracking-wider text-[#222]">
                          Parent Category
                        </label>
                        <div className="relative">
                          <select
                            value={parentId}
                            onChange={(e) => setParentId(e.target.value)}
                            className="h-12 w-full appearance-none rounded-2xl border border-[#ededf0] bg-[#f8f8f9] px-4 pr-10 text-sm font-medium outline-none transition focus:bg-white focus:ring-4 focus:ring-black/5"
                          >
                            <option value="none">None (Top-level)</option>
                            {categories
                              .filter((category) => !category.parentId && category.id !== editingCategoryId)
                              .map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666]" />
                        </div>
                      </div>
                    </div>

                    {/* Media */}
                    <div className="space-y-6 border-t border-slate-100 pt-8">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Media Assets</h3>
                      <input ref={bannerFileRef} type="file" accept="image/*" className="hidden" onChange={(event) => handleImageUpload(event, setBannerUrl)} />
                      <input ref={fullBannerFileRef} type="file" accept="image/*" className="hidden" onChange={(event) => handleImageUpload(event, setFullBannerUrl)} />
                      <input ref={circleFileRef} type="file" accept="image/*" className="hidden" onChange={(event) => handleImageUpload(event, setCircleUrl)} />

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-[12px] font-bold text-[#222]">Banner Image (Featured Card)</label>
                          <div className="flex gap-2">
                            <input
                              value={bannerUrl}
                              onChange={(e) => setBannerUrl(e.target.value)}
                              placeholder="URL..."
                              className="h-11 flex-1 rounded-xl border border-[#ededf0] bg-[#f8f8f9] px-4 text-xs outline-none focus:bg-white"
                            />
                            <button type="button" onClick={() => bannerFileRef.current?.click()} className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#d9d9df] bg-white px-4 text-[12px] font-bold text-black transition hover:bg-slate-50">
                              <Upload className="h-4 w-4" /> Upload
                            </button>
                          </div>
                          {bannerUrl && <img src={bannerUrl} alt="" className="h-16 w-full rounded-xl object-cover" />}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-[12px] font-bold text-[#222]">Full Banner (Section Header)</label>
                          <div className="flex gap-2">
                            <input
                              value={fullBannerUrl}
                              onChange={(e) => setFullBannerUrl(e.target.value)}
                              placeholder="URL..."
                              className="h-11 flex-1 rounded-xl border border-[#ededf0] bg-[#f8f8f9] px-4 text-xs outline-none focus:bg-white"
                            />
                            <button type="button" onClick={() => fullBannerFileRef.current?.click()} className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#d9d9df] bg-white px-4 text-[12px] font-bold text-black transition hover:bg-slate-50">
                              <Upload className="h-4 w-4" /> Upload
                            </button>
                          </div>
                          {fullBannerUrl && <img src={fullBannerUrl} alt="" className="h-16 w-full rounded-xl object-cover" />}
                        </div>
                      </div>
                    </div>

                    {/* Settings */}
                    <div className="space-y-4 border-t border-slate-100 pt-8">
                      <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#f8f8f9] p-4">
                        <div className="flex-1">
                          <p className="text-[13px] font-bold text-[#222]">Featured on Homepage</p>
                          <p className="mt-0.5 text-[11px] text-[#6d6d74]">Show this category in top sections</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsFeatured(!isFeatured)}
                          className={cn(
                            "h-10 rounded-xl px-4 text-xs font-bold transition",
                            isFeatured ? "bg-black text-white" : "bg-white text-slate-500 border border-slate-200"
                          )}
                        >
                          {isFeatured ? "Featured" : "No"}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Accent Color</label>
                          <div className="flex h-11 items-center gap-2 rounded-xl border border-[#ededf0] bg-[#f8f8f9] px-2.5">
                            <input type="color" value={circleColor} onChange={(e) => setCircleColor(e.target.value)} className="h-6 w-6 cursor-pointer rounded-lg border-0" />
                            <span className="font-mono text-[11px] text-slate-500">{circleColor}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Background</label>
                          <div className="flex h-11 items-center gap-2 rounded-xl border border-[#ededf0] bg-[#f8f8f9] px-2.5">
                            <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="h-6 w-6 cursor-pointer rounded-lg border-0" />
                            <span className="font-mono text-[11px] text-slate-500">{backgroundColor}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>

                {/* Footer Buttons */}
                <div className="border-t border-[#e7e7ea] bg-white p-8">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex-1 rounded-2xl border border-slate-200 py-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      form="category-form"
                      className="flex-[2] rounded-2xl bg-black py-4 text-sm font-bold text-white shadow-[0_12px_24px_rgba(0,0,0,0.15)] transition hover:opacity-90 active:scale-[0.98]"
                    >
                      {editingCategoryId ? "Update Category" : "Save Category"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
// â”€â”€â”€ Category Based Discount â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function CategoryDiscountPage() {
  const { categories } = useAdminStore();
  const [discounts, setDiscounts] = useState<Record<string, string>>({});

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // In a real app this would persist; here it shows a success state
    alert("Discounts saved!");
  }

  return (
    <PageShell title="Category Based Discount" subtitle="Set percentage discounts per product category.">
      <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="divide-y divide-slate-100">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
              <div className="flex-1">
                <p className="font-medium text-slate-900">{c.name}</p>
                <p className="text-xs text-slate-400">{c.description}</p>
              </div>
              <div className="relative w-32">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discounts[c.id] ?? ""}
                  onChange={(e) => setDiscounts((d) => ({ ...d, [c.id]: e.target.value }))}
                  placeholder="0"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-4 pr-8 text-sm outline-none transition focus:border-[#5b4cf0] focus:bg-white"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">%</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <button type="submit" className="flex items-center gap-2 rounded-2xl bg-[#5b4cf0] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4c3de0]">
            Save Discounts
          </button>
        </div>
      </form>
    </PageShell>
  );
}

// â”€â”€â”€ Attribute â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function AttributePage() {
  const { attributes, addAttribute, deleteAttribute } = useAdminStore();
  const [name, setName] = useState("");
  const [values, setValues] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addAttribute({
      name: name.trim(),
      values: values.split(",").map((v) => v.trim()).filter(Boolean),
    });
    setName("");
    setValues("");
  }

  return (
    <PageShell title="Attributes" subtitle="Define product attributes like Size, Material, or Finish.">
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {attributes.length === 0 ? (
          <EmptyState message="No attributes yet." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-500">Attribute</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-500">Values</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attributes.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{a.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {a.values.map((v) => (
                          <span key={v} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{v}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteAttribute(a.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-500">
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <form onSubmit={handleAdd} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Add Attribute</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Finish" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#5b4cf0] focus:bg-white focus:ring-2 focus:ring-[#5b4cf0]/10" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Values (comma-separated)</label>
              <input value={values} onChange={(e) => setValues(e.target.value)} placeholder="Matte, Glossy, Satin" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#5b4cf0] focus:bg-white focus:ring-2 focus:ring-[#5b4cf0]/10" />
            </div>
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5b4cf0] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4c3de0]">
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Add Attribute
            </button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}

// â”€â”€â”€ Colors â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function ColorsPage() {
  const { colors, addColor, deleteColor } = useAdminStore();
  const [name, setName] = useState("");
  const [hex, setHex] = useState("#000000");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addColor({ name: name.trim(), hex });
    setName("");
    setHex("#000000");
  }

  return (
    <PageShell title="Colors" subtitle="Manage the color swatches available for products.">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {colors.length === 0 ? (
            <div className="p-8"><EmptyState message="No colors yet." /></div>
          ) : (
            <div className="divide-y divide-slate-100">
              {colors.map((c) => (
                <div key={c.id} className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50">
                  <div className="h-8 w-8 rounded-full border border-slate-200 shadow-sm" style={{ background: c.hex }} />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{c.name}</p>
                    <p className="text-xs uppercase text-slate-400">{c.hex}</p>
                  </div>
                  <button onClick={() => deleteColor(c.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-500">
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleAdd} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Add Color</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Color Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Nude" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#5b4cf0] focus:bg-white focus:ring-2 focus:ring-[#5b4cf0]/10" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Hex Color</label>
              <div className="flex gap-3">
                <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="h-10 w-10 cursor-pointer rounded-xl border border-slate-200" />
                <input value={hex} onChange={(e) => setHex(e.target.value)} placeholder="#000000" className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#5b4cf0] focus:bg-white" />
              </div>
            </div>
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5b4cf0] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4c3de0]">
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Add Color
            </button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}

// â”€â”€â”€ Units â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function UnitsPage() {
  const { units, addUnit, deleteUnit } = useAdminStore();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !symbol.trim()) return;
    addUnit({ name: name.trim(), symbol: symbol.trim() });
    setName("");
    setSymbol("");
  }

  return (
    <PageShell title="Units" subtitle="Define measurement units used across products.">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {units.length === 0 ? (
            <div className="p-8"><EmptyState message="No units yet." /></div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-500">Unit Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-500">Symbol</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {units.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{u.name}</td>
                    <td className="px-4 py-3 text-slate-500">{u.symbol}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteUnit(u.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-500">
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <form onSubmit={handleAdd} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Add Unit</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Unit Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Milliliter" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#5b4cf0] focus:bg-white focus:ring-2 focus:ring-[#5b4cf0]/10" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Symbol *</label>
              <input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="e.g. ml" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#5b4cf0] focus:bg-white focus:ring-2 focus:ring-[#5b4cf0]/10" />
            </div>
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5b4cf0] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4c3de0]">
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Add Unit
            </button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}

// â”€â”€â”€ Size Guide â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const DEFAULT_ROWS = [
  { label: "Travel Size", value: "5â€“15 ml / g" },
  { label: "Mini", value: "15â€“30 ml / g" },
  { label: "Standard", value: "30â€“75 ml / g" },
  { label: "Full Size", value: "75â€“150 ml / g" },
  { label: "Value Size", value: "150 ml / g +" },
];

export function SizeGuidePage() {
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim() || !value.trim()) return;
    setRows((r) => [...r, { label: label.trim(), value: value.trim() }]);
    setLabel("");
    setValue("");
  }

  return (
    <PageShell title="Size Guide" subtitle="Define packaging sizes shown to customers on product pages.">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-left font-semibold text-slate-500">Size Label</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-500">Typical Volume / Weight</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{r.label}</td>
                  <td className="px-4 py-3 text-slate-600">{r.value}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setRows((prev) => prev.filter((_, idx) => idx !== i))} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-500">
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form onSubmit={handleAdd} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Add Size</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Size Label *</label>
              <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Full Size" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#5b4cf0] focus:bg-white focus:ring-2 focus:ring-[#5b4cf0]/10" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Volume / Weight *</label>
              <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 75â€“150 ml / g" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#5b4cf0] focus:bg-white focus:ring-2 focus:ring-[#5b4cf0]/10" />
            </div>
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5b4cf0] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4c3de0]">
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Add Size
            </button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}





