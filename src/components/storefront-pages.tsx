"use client";

import Link from "next/link";
import Image from "next/image";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, Minus, Plus, SlidersHorizontal, Star, X } from "lucide-react";
import { blogPosts, categoryHighlights } from "@/lib/store-data";
import { useStorefrontProducts } from "@/lib/storefront-products";
import { apiGetProduct, apiGetCategories, type ApiProductVariation } from "@/lib/api";
import { cn, formatCurrency } from "@/lib/utils";
import { ProductCard } from "@/components/storefront-shell";
import { useStore } from "@/components/providers/store-provider";

export function ShopPage() {
  return (
    <Suspense fallback={<ShopPageFallback />}>
      <ShopPageContent />
    </Suspense>
  );
}

function ShopPageContent() {
  const searchParams = useSearchParams();
  const { products } = useStorefrontProducts();
  const [category, setCategory] = useState(() => searchParams.get("category") ?? "All");
  const [sort, setSort] = useState("featured");
  const [visible, setVisible] = useState(8);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [apiCategories, setApiCategories] = useState<string[]>([]);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Sync category from URL param on mount
  useEffect(() => {
    const param = searchParams.get("category");
    if (param) setCategory(param);
  }, [searchParams]);

  // Fetch real categories from API
  useEffect(() => {
    apiGetCategories()
      .then((cats) => setApiCategories(cats.map((c) => c.name)))
      .catch(() => {});
  }, []);

  const categories = useMemo(
    () => ["All", ...(apiCategories.length > 0 ? apiCategories : ["Makeup", "Skincare", "Hair", "Body", "Fragrance"])],
    [apiCategories],
  );

  const filtered = useMemo(() => {
    const base = category === "All" ? products : products.filter((product) => product.category === category);

    if (sort === "price-asc") return [...base].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...base].sort((a, b) => b.price - a.price);
    if (sort === "rating") return [...base].sort((a, b) => b.rating - a.rating);

    return [...base].sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name));
  }, [category, products, sort]);

  const activeHighlight = useMemo(
    () =>
      categoryHighlights.find((highlight) => highlight.name === category) ?? {
        name: "The Full Collection",
        caption: "Our complete range of ritual-led beauty essentials",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1600&q=85",
        count: `${products.length} formulas`,
      },
    [category, products.length],
  );

  useEffect(() => {
    const node = loaderRef.current;
    if (!node) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        setVisible((current) => Math.min(current + 4, filtered.length));
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [filtered.length]);

  useEffect(() => {
    setVisible(8);
  }, [category, sort, products.length]);

  return (
    <main className="w-full px-4 md:px-6 xl:px-10 py-8 lg:py-12">
      <section className="relative mb-12 h-[320px] overflow-hidden rounded-[40px] shadow-[0_32px_80px_rgba(17,12,10,0.12)] lg:h-[440px]">
        <AnimatePresence mode="wait">
          <motion.div key={category} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.8, ease: "easeOut" }} className="absolute inset-0">
            <Image src={activeHighlight.image} alt={activeHighlight.name} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 flex h-full flex-col justify-center px-8 text-white lg:px-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="max-w-2xl">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.4em] text-white/60">{category === "All" ? "Ellena Shop" : "Category"}</p>
            <h1 className="font-[var(--font-heading)] text-5xl font-bold leading-tight lg:text-7xl">{activeHighlight.name}</h1>
            <p className="mt-6 hidden max-w-xl text-lg leading-relaxed text-white/80 md:block">{activeHighlight.caption}. Every Ellena formula is designed around skin affinity, deep tone respect, and professional performance.</p>
            <div className="mt-8 flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-3xl font-bold leading-none">{activeHighlight.count?.split(" ")[0]}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">{activeHighlight.count?.split(" ")[1] ?? "Products"}</span>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div className="flex flex-col">
                <span className="text-3xl font-bold leading-none">4.9</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Avg Rating</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden space-y-10 lg:block">
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-stone-950">Categories</h3>
            <div className="space-y-2">
              {categories.map((item) => (
                <button key={item} onClick={() => setCategory(item)} className={cn("group flex w-full items-center justify-between py-2 text-sm transition-all", category === item ? "translate-x-2 font-bold text-stone-950" : "font-medium text-stone-500 hover:translate-x-1 hover:text-stone-800")}>
                  <span>{item}</span>
                  {category === item && <div className="h-1.5 w-1.5 rounded-full bg-stone-950" />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 border-t border-black/5 pt-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-stone-950">Filter Ritual</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Skin Tone</p>
                {["Deep", "Rich", "Warm", "Neutral"].map((tone) => (
                  <label key={tone} className="group flex cursor-pointer items-center gap-3">
                    <div className="h-4 w-4 rounded border border-stone-200 transition group-hover:border-stone-400" />
                    <span className="text-sm text-stone-600 transition group-hover:text-stone-900">{tone}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/[0.03] bg-stone-50 p-6">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Service Focus</p>
            <p className="text-xs font-medium leading-relaxed text-stone-600">Free delivery on Kampala orders over {formatCurrency(250000)}</p>
          </div>
        </aside>

        <div className="space-y-8">
          <div className="sticky top-[108px] z-30 flex flex-col gap-4 rounded-2xl border border-black/[0.03] bg-white/90 px-2 py-4 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileFilterOpen(true)} className="flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-stone-700 lg:hidden">
                <SlidersHorizontal className="h-4 w-4" />
                Filter
              </button>
              <div className="hidden h-8 w-px bg-black/10 md:block" />
              <p className="text-sm font-medium text-stone-500">Showing <span className="font-bold text-stone-950">{Math.min(visible, filtered.length)}</span> of <span className="font-bold text-stone-950">{filtered.length}</span></p>
            </div>

            <div className="flex items-center gap-2">
              <LayoutGrid className="mr-2 h-4 w-4 text-stone-950" />
              <div className="mr-4 h-8 w-px bg-black/10" />
              <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-10 rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-stone-700 outline-none transition focus:ring-4 focus:ring-stone-100">
                <option value="featured">Sort by: Featured</option>
                <option value="price-asc">Price: Low to high</option>
                <option value="price-desc">Price: High to low</option>
                <option value="rating">Top rated</option>
              </select>
            </div>
          </div>

          <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.slice(0, visible).map((product, idx) => (
                <motion.div key={product.slug} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (idx % 4) * 0.1, duration: 0.5 }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div ref={loaderRef} className="flex flex-col items-center gap-4 py-16">
            {visible < filtered.length ? (
              <>
                <div className="h-1.5 w-48 overflow-hidden rounded-full bg-stone-100">
                  <motion.div initial={{ x: "-100%" }} animate={{ x: "0%" }} className="h-full bg-stone-950" style={{ width: `${(visible / filtered.length) * 100}%` }} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-500">Loading discovery feed...</p>
              </>
            ) : (
              <div className="w-full rounded-3xl border border-dashed border-stone-200 p-12 text-center">
                <p className="mb-2 font-[var(--font-heading)] text-xl font-bold text-stone-950">You&apos;ve reached the edge of discovery.</p>
                <p className="text-sm text-stone-500">Explore our journal for shade rituals and beauty routines.</p>
                <Link href="/blog" className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/10 px-8 py-3 text-sm font-bold uppercase tracking-widest text-stone-950 transition-all hover:bg-stone-950 hover:text-white">Read the Journal</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileFilterOpen(false)} className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-x-0 bottom-0 z-[70] h-[80vh] rounded-t-[40px] bg-white p-8 shadow-[-20px_0_60px_rgba(0,0,0,0.1)] lg:hidden">
              <div className="mb-10 flex items-center justify-between">
                <h3 className="text-xl font-bold tracking-tight">Discover Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100"><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-10">
                <div className="space-y-6">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((item) => (
                      <button key={item} onClick={() => { setCategory(item); setMobileFilterOpen(false); }} className={cn("rounded-full px-5 py-2.5 text-sm font-semibold transition-all", category === item ? "bg-stone-950 text-white shadow-lg" : "bg-stone-50 text-stone-600 hover:bg-stone-100")}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

function ShopPageFallback() {
  return (
    <main className="w-full px-4 py-8 md:px-6 lg:py-12 xl:px-10">
      <div className="h-[320px] animate-pulse rounded-[40px] bg-stone-100 lg:h-[440px]" />
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-4">
            <div className="aspect-[4/5] animate-pulse rounded-[28px] bg-stone-100" />
            <div className="h-5 w-2/3 animate-pulse rounded-full bg-stone-100" />
            <div className="h-4 w-1/3 animate-pulse rounded-full bg-stone-100" />
          </div>
        ))}
      </div>
    </main>
  );
}

const VARIATION_LABELS: Record<ApiProductVariation["type"], string> = {
  size:     "Size",
  color:    "Color",
  pc:       "Piece Count",
  quantity: "Quantity",
};

const VARIATION_UNIT: Record<ApiProductVariation["type"], string> = {
  size:     "",       // value already contains unit e.g. "30ml"
  color:    "",       // no unit for colour
  pc:       "pc",
  quantity: "units",
};

export function ProductDetailPage({ slug }: { slug: string }) {
  const { products, ready } = useStorefrontProducts();
  const product = useMemo(() => products.find((entry) => entry.slug === slug), [products, slug]);
  const { addToCart, toggleWishlist, wishlist } = useStore();

  const [shade, setShade] = useState("");
  const [variations, setVariations] = useState<ApiProductVariation[]>([]);
  const [selected, setSelected] = useState<Partial<Record<ApiProductVariation["type"], ApiProductVariation>>>({});

  // Fetch the individual product to get full variation data
  useEffect(() => {
    apiGetProduct(slug)
      .then((p) => {
        const vars = p.variations ?? [];
        setVariations(vars);
        // Auto-select first option per type
        const defaults: typeof selected = {};
        for (const v of vars) {
          if (!defaults[v.type]) defaults[v.type] = v;
        }
        setSelected(defaults);
      })
      .catch(() => {});
  }, [slug]);

  useEffect(() => {
    if (product) setShade(product.shades[0] ?? "Standard");
  }, [product]);

  // Derive display price — use selected variation's price override if set
  const activePrice = useMemo(() => {
    for (const v of Object.values(selected)) {
      if (v?.price) return v.price;
    }
    return product?.price ?? 0;
  }, [selected, product]);

  // Group variations by type preserving insertion order
  const variationGroups = useMemo(() => {
    const groups = new Map<ApiProductVariation["type"], ApiProductVariation[]>();
    for (const v of variations) {
      const arr = groups.get(v.type) ?? [];
      arr.push(v);
      groups.set(v.type, arr);
    }
    return groups;
  }, [variations]);

  if (!product && !ready) {
    return <main className="container-shell px-4 py-10 text-sm text-stone-500 md:px-6 md:py-16 xl:px-10">Loading product…</main>;
  }
  if (!product) notFound();

  const related = products
    .filter((item) => item.category === product.category && item.slug !== product.slug)
    .slice(0, 4);

  // Summary of what's currently selected (e.g. "30ml · Red · 2 pc")
  const selectionSummary = Object.values(selected)
    .filter(Boolean)
    .map((v) => {
      const unit = VARIATION_UNIT[v!.type];
      return unit ? `${v!.value} ${unit}` : v!.value;
    })
    .join(" · ");

  return (
    <main className="container-shell px-4 py-10 md:px-6 md:py-16 xl:px-10">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">

        {/* Image panel */}
        <div className="grid gap-4 md:grid-cols-[0.18fr_0.82fr]">
          <div className="grid gap-3 md:grid-rows-3">
            {product.shades.map((option) => (
              <button key={option} type="button"
                className="rounded-md border border-black/8 bg-white/80 p-4 text-left text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
                {option}
              </button>
            ))}
          </div>
          <div className="group relative aspect-[0.92] overflow-hidden rounded-xl border border-black/5 shadow-[0_24px_70px_rgba(17,12,10,0.08)]">
            <Image src={product.image} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover transition duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-6 rounded-md border border-white/20 backdrop-blur-[2px]" />
            <div className="relative z-10 flex h-full flex-col justify-between p-6">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.24em] text-white/80">
                <span>{product.subcategory}</span>
                <span className="rounded bg-white/15 px-2 py-0.5 backdrop-blur">{product.badge ?? "Signature"}</span>
              </div>
              <div className="rounded-md border border-white/25 bg-black/35 p-6 backdrop-blur-md">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">Ellena Cosmetics</p>
                <h1 className="mt-3 font-[var(--font-heading)] text-6xl font-bold leading-none text-white">{product.name}</h1>
                {selectionSummary && (
                  <p className="mt-2 text-xs font-medium tracking-wide text-white/60">{selectionSummary}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className="rounded-xl border border-black/5 bg-white/90 p-6 shadow-[0_24px_70px_rgba(17,12,10,0.06)] md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-stone-500">{product.category}</p>
          <h2 className="mt-4 font-[var(--font-heading)] text-6xl font-bold leading-none text-stone-950">{product.name}</h2>
          <div className="mt-5 flex items-center gap-3 text-sm text-stone-600">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {product.rating} rating · {product.reviewCount} reviews
          </div>

          {/* Price — updates when a priced variation is selected */}
          <div className="mt-5 flex items-baseline gap-3">
            <p className="text-3xl font-semibold text-stone-950">{formatCurrency(activePrice)}</p>
            {activePrice !== product.price && (
              <p className="text-sm text-stone-400 line-through">{formatCurrency(product.price)}</p>
            )}
          </div>

          <p className="mt-5 text-sm leading-7 text-stone-600">{product.description}</p>

          {/* Shade selector (from shades table) */}
          {product.shades.length > 0 && (
            <div className="mt-7">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-500">Shade</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.shades.map((option) => (
                  <button key={option} type="button" onClick={() => setShade(option)}
                    className={cn("rounded-md border px-4 py-2 text-sm font-semibold transition",
                      shade === option
                        ? "border-stone-950 bg-stone-950 text-white"
                        : "border-black/10 bg-stone-50 text-stone-700 hover:border-stone-400")}>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Variation selectors — one section per type */}
          {variationGroups.size > 0 && (
            <div className="mt-7 space-y-5">
              {Array.from(variationGroups.entries()).map(([type, options]) => {
                const currentVal = selected[type];
                return (
                  <div key={type}>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-500">
                        {VARIATION_LABELS[type]}
                      </p>
                      {currentVal && (
                        <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-600">
                          {currentVal.value}
                          {VARIATION_UNIT[type] ? ` ${VARIATION_UNIT[type]}` : ""}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {options.map((v) => {
                        const isSelected = selected[type]?.id === v.id;
                        const outOfStock = v.stock === 0;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            disabled={outOfStock}
                            onClick={() => setSelected((prev) => ({ ...prev, [type]: v }))}
                            title={outOfStock ? "Out of stock" : undefined}
                            className={cn(
                              "relative rounded-md border px-4 py-2 text-sm font-semibold transition",
                              isSelected
                                ? "border-stone-950 bg-stone-950 text-white"
                                : outOfStock
                                  ? "cursor-not-allowed border-black/6 bg-stone-50 text-stone-300"
                                  : "border-black/10 bg-stone-50 text-stone-700 hover:border-stone-400",
                            )}>
                            {v.value}
                            {VARIATION_UNIT[type] && (
                              <span className={cn("ml-1 text-xs", isSelected ? "text-white/60" : "text-stone-400")}>
                                {VARIATION_UNIT[type]}
                              </span>
                            )}
                            {v.price && !isSelected && (
                              <span className="ml-1.5 text-xs font-medium text-stone-400">
                                {formatCurrency(v.price)}
                              </span>
                            )}
                            {outOfStock && (
                              <span className="absolute -right-1 -top-1 rounded-full bg-rose-100 px-1 py-px text-[9px] font-bold text-rose-500">
                                Out
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA */}
          <div className="mt-8 flex flex-wrap gap-3">
            <motion.button whileTap={{ scale: 0.96 }} type="button"
              onClick={() => addToCart({ slug: product.slug, quantity: 1, shade })}
              className="rounded-md bg-stone-950 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white">
              Add to cart
            </motion.button>
            <button type="button" onClick={() => toggleWishlist(product.slug)}
              className={cn("rounded-md border px-6 py-3 text-sm font-bold uppercase tracking-[0.18em]",
                wishlist.includes(product.slug)
                  ? "border-stone-950 bg-stone-950 text-white"
                  : "border-black/10 text-stone-950")}>
              {wishlist.includes(product.slug) ? "Saved" : "Add to wishlist"}
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {["Long-wear", "Cruelty-free", "Global shipping"].map((point) => (
              <div key={point} className="rounded-md border border-black/6 bg-stone-50 p-4 text-sm font-semibold text-stone-700">
                {point}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      <section className="mt-12">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-[var(--font-heading)] text-5xl font-bold leading-none text-stone-950">Related products</h3>
          <Link href="/shop" className="rounded-md border border-black/10 px-4 py-2 text-sm font-semibold">View all</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {related.map((item) => <ProductCard key={item.slug} product={item} />)}
        </div>
      </section>
    </main>
  );
}

export function CartPage() {
  const { products } = useStorefrontProducts();
  const { cart, removeFromCart, updateQuantity } = useStore();
  const entries = cart.map((item) => ({ ...item, product: products.find((product) => product.slug === item.slug) })).filter((item) => item.product);
  const subtotal = entries.reduce((total, item) => total + item.product!.price * item.quantity, 0);

  return (
    <main className="container-shell px-4 py-10 md:px-6 md:py-16 xl:px-10">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-xl border border-black/5 bg-white/90 p-6 shadow-[0_24px_70px_rgba(17,12,10,0.06)] md:p-8">
          <h1 className="font-[var(--font-heading)] text-6xl font-bold leading-none text-stone-950">Cart</h1>
          <p className="mt-4 text-sm leading-7 text-stone-600">A streamlined bag experience with large tap targets and clear quantity editing.</p>
          <div className="mt-8 space-y-4">{entries.length === 0 ? <div className="rounded-md border border-dashed border-black/10 bg-stone-50 p-8 text-sm text-stone-500">Your cart is empty. Start with the best sellers.</div> : null}{entries.map((entry) => <div key={`${entry.slug}-${entry.shade}`} className="flex flex-col gap-4 rounded-lg border border-black/6 bg-stone-50 p-5 md:flex-row md:items-center md:justify-between"><div><p className="text-lg font-semibold text-stone-950">{entry.product!.name}</p><p className="text-sm text-stone-500">{entry.shade}</p></div><div className="flex items-center gap-3"><div className="flex items-center rounded-md border border-black/8 bg-white p-1"><button type="button" onClick={() => updateQuantity(entry.slug, entry.quantity - 1)} className="inline-flex h-9 w-9 items-center justify-center"><Minus className="h-4 w-4" /></button><span className="min-w-8 text-center text-sm font-semibold">{entry.quantity}</span><button type="button" onClick={() => updateQuantity(entry.slug, entry.quantity + 1)} className="inline-flex h-9 w-9 items-center justify-center"><Plus className="h-4 w-4" /></button></div><p className="w-28 text-right text-sm font-bold text-stone-950">{formatCurrency(entry.product!.price * entry.quantity)}</p><button type="button" onClick={() => removeFromCart(entry.slug)} className="rounded-md border border-black/10 px-4 py-2 text-sm font-semibold">Remove</button></div></div>)}</div>
        </section>
        <aside className="h-fit rounded-xl border border-black/5 bg-stone-950 p-6 text-white shadow-[0_24px_70px_rgba(17,12,10,0.12)] md:p-8"><p className="text-xs font-bold uppercase tracking-[0.32em] text-white/60">Summary</p><div className="mt-6 space-y-4 text-sm text-white/80"><div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div><div className="flex justify-between"><span>Delivery</span><span>{formatCurrency(subtotal > 250000 ? 0 : 25000)}</span></div><div className="flex justify-between border-t border-white/10 pt-4 text-base font-semibold text-white"><span>Total</span><span>{formatCurrency(subtotal + (subtotal > 250000 ? 0 : 25000))}</span></div></div><Link href="/checkout" className="mt-8 inline-flex w-full justify-center rounded-md bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-stone-950">Checkout</Link></aside>
      </div>
    </main>
  );
}

export function CheckoutPage() {
  const { products } = useStorefrontProducts();
  const { cart, clearCart } = useStore();
  const router = useRouter();
  return <main className="container-shell px-4 py-10 md:px-6 md:py-16 xl:px-10"><div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"><section className="rounded-xl border border-black/5 bg-white/90 p-6 shadow-[0_24px_70px_rgba(17,12,10,0.06)] md:p-8"><h1 className="font-[var(--font-heading)] text-6xl font-bold leading-none text-stone-950">Checkout</h1><div className="mt-8 grid gap-4 md:grid-cols-2">{["First name", "Last name", "Email address", "Phone number", "Address", "City"].map((field) => <input key={field} placeholder={field} className="h-14 rounded-md border border-black/8 bg-stone-50 px-4 outline-none" />)}</div><button type="button" onClick={() => { clearCart(); router.push("/"); }} className="mt-8 rounded-md bg-stone-950 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white">Place order</button></section><aside className="rounded-xl border border-black/5 bg-[linear-gradient(135deg,#fbf7f1_0%,#f1e3cf_100%)] p-6 shadow-[0_24px_70px_rgba(17,12,10,0.08)] md:p-8"><p className="text-xs font-bold uppercase tracking-[0.32em] text-stone-500">Order review</p><div className="mt-6 space-y-4">{cart.length === 0 ? <p className="text-sm text-stone-500">Your cart is currently empty.</p> : cart.map((item) => <div key={`${item.slug}-${item.shade}`} className="rounded-md border border-black/6 bg-white/70 p-4 text-sm font-semibold text-stone-700">{products.find((product) => product.slug === item.slug)?.name} x {item.quantity}</div>)}</div></aside></div></main>;
}

export function WishlistPage() {
  const { products } = useStorefrontProducts();
  const { wishlist } = useStore();
  const entries = products.filter((product) => wishlist.includes(product.slug));
  return <main className="container-shell px-4 py-10 md:px-6 md:py-16 xl:px-10"><div className="mb-8 rounded-xl border border-black/5 bg-white/90 p-6 shadow-[0_24px_70px_rgba(17,12,10,0.06)] md:p-8"><h1 className="font-[var(--font-heading)] text-6xl font-bold leading-none text-stone-950">Wishlist</h1><p className="mt-4 text-sm leading-7 text-stone-600">Saved favourites stay one tap away from your cart.</p></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{entries.length === 0 ? <div className="rounded-md border border-dashed border-black/10 bg-white/80 p-8 text-sm text-stone-500">No saved items yet.</div> : entries.map((product) => <ProductCard key={product.slug} product={product} />)}</div></main>;
}

export function AccountPage() {
  return <main className="container-shell px-4 py-10 md:px-6 md:py-16 xl:px-10"><div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]"><section className="rounded-xl border border-black/5 bg-stone-950 p-8 text-white shadow-[0_24px_70px_rgba(17,12,10,0.12)]"><p className="text-xs font-bold uppercase tracking-[0.32em] text-white/60">Ellena Circle</p><h1 className="mt-4 font-[var(--font-heading)] text-6xl font-bold leading-none">Account</h1><p className="mt-5 text-sm leading-7 text-white/75">Sign in to manage saved shades, reorder rituals, and track delivery status.</p></section><section className="rounded-xl border border-black/5 bg-white/90 p-8 shadow-[0_24px_70px_rgba(17,12,10,0.06)]"><div className="grid gap-4 md:grid-cols-2"><input placeholder="Email address" className="h-14 rounded-md border border-black/8 bg-stone-50 px-4 outline-none" /><input placeholder="Password" type="password" className="h-14 rounded-md border border-black/8 bg-stone-50 px-4 outline-none" /></div><button type="button" className="mt-6 rounded-md bg-stone-950 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white">Sign in</button></section></div></main>;
}

export function BlogPage() {
  return <main className="container-shell px-4 py-10 md:px-6 md:py-16 xl:px-10"><div className="mb-8 rounded-xl border border-black/5 bg-white/90 p-6 shadow-[0_24px_70px_rgba(17,12,10,0.06)] md:p-8"><p className="text-xs font-bold uppercase tracking-[0.34em] text-stone-500">Discover</p><h1 className="mt-4 font-[var(--font-heading)] text-6xl font-bold leading-none text-stone-950">Beauty journal</h1></div><div className="grid gap-5 lg:grid-cols-3">{blogPosts.map((post) => <article key={post.slug} className="overflow-hidden rounded-xl border border-black/5 bg-white shadow-[0_18px_50px_rgba(17,12,10,0.07)]"><div className="relative aspect-[1.1] overflow-hidden"><Image src={post.image} alt={post.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition duration-500 hover:scale-105" /></div><div className="p-6"><p className="text-xs font-bold uppercase tracking-[0.28em] text-stone-500">{post.tag}</p><h2 className="mt-3 font-[var(--font-heading)] text-3xl font-bold leading-none text-stone-950">{post.title}</h2><p className="mt-4 text-sm leading-7 text-stone-600">{post.excerpt}</p></div></article>)}</div></main>;
}

export function AboutPage() {
  return <main className="container-shell px-4 py-10 md:px-6 md:py-16 xl:px-10"><div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]"><section className="rounded-xl border border-black/5 bg-[linear-gradient(135deg,#211816_0%,#7c5b45_45%,#d2a97e_100%)] p-8 text-white shadow-[0_24px_70px_rgba(17,12,10,0.12)]"><p className="text-xs font-bold uppercase tracking-[0.34em] text-white/65">About Ellena Cosmetics</p><h1 className="mt-4 font-[var(--font-heading)] text-6xl font-bold leading-none">African luxury with modern beauty discipline.</h1></section><section className="rounded-xl border border-black/5 bg-white/90 p-8 shadow-[0_24px_70px_rgba(17,12,10,0.06)]"><p className="text-sm leading-8 text-stone-600">Ellena Cosmetics is imagined as a premium cosmetics house for customers who want high-performance formulas, richer undertone sensitivity, and a shopping experience that feels global without losing regional identity. The visual system leans editorial and luxurious, while the component structure stays practical for future catalog, CMS, and checkout integrations.</p></section></div></main>;
}


