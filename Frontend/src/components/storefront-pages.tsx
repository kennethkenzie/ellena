"use client";

import Link from "next/link";
import Image from "next/image";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Heart,
  LayoutGrid,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { blogPosts, brandImages, categoryHighlights } from "@/lib/store-data";
import { useStorefrontProducts } from "@/lib/storefront-products";
import { apiGetProduct, apiGetCategories, type ApiProductVariation } from "@/lib/api";
import { cn, formatCurrency } from "@/lib/utils";
import { ProductCard } from "@/components/storefront-shell";
import { useStore } from "@/components/providers/store-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* ──────────────────────────────────────────────────────────────────────────
 * Shop page
 * ──────────────────────────────────────────────────────────────────────── */

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

  useEffect(() => {
    const param = searchParams.get("category");
    if (param) setCategory(param);
  }, [searchParams]);

  useEffect(() => {
    apiGetCategories()
      .then((cats) => setApiCategories(cats.map((c) => c.name)))
      .catch(() => {});
  }, []);

  const categories = useMemo(
    () => [
      "All",
      ...(apiCategories.length > 0
        ? apiCategories
        : ["Makeup", "Skincare", "Hair", "Body", "Fragrance"]),
    ],
    [apiCategories],
  );

  const filtered = useMemo(() => {
    const base =
      category === "All" ? products : products.filter((product) => product.category === category);

    if (sort === "price-asc") return [...base].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...base].sort((a, b) => b.price - a.price);
    if (sort === "rating") return [...base].sort((a, b) => b.rating - a.rating);

    return [...base].sort(
      (a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name),
    );
  }, [category, products, sort]);

  const activeHighlight = useMemo(
    () =>
      categoryHighlights.find((highlight) => highlight.name === category) ?? {
        name: "The Full Collection",
        caption: "Our complete range of ritual-led beauty essentials",
        image: brandImages.campaignFilm,
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
      <section className="relative mb-12 h-[320px] overflow-hidden rounded-[40px] shadow-[0_32px_80px_rgba(17,12,10,0.18)] lg:h-[440px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={category}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={activeHighlight.image}
              alt={activeHighlight.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-[#C9A227]/60" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 flex h-full flex-col justify-center px-8 text-[#2B2B2B] lg:px-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl"
          >
            <Badge
              variant="outline"
              className="border-white/25 bg-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.32em] text-[#2B2B2B] backdrop-blur-md"
            >
              <Sparkles className="mr-2 h-3 w-3 text-[#C9A227]" />
              {category === "All" ? "Ellena Shop" : "Category"}
            </Badge>
            <h1 className="mt-5 font-[var(--font-heading)] text-5xl font-bold leading-tight lg:text-7xl">
              {activeHighlight.name}
            </h1>
            <p className="mt-6 hidden max-w-xl text-lg leading-relaxed text-[#2B2B2B] md:block">
              {activeHighlight.caption}. Every Ellena formula is designed around skin affinity,
              deep tone respect, and professional performance.
            </p>
            <div className="mt-8 flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-3xl font-bold leading-none">
                  {activeHighlight.count?.split(" ")[0]}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A8A8A]">
                  {activeHighlight.count?.split(" ")[1] ?? "Products"}
                </span>
              </div>
              <Separator orientation="vertical" className="h-10 bg-white/25" />
              <div className="flex flex-col">
                <span className="text-3xl font-bold leading-none">4.9</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A8A8A]">
                  Avg Rating
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden space-y-8 lg:block">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#2B2B2B]">
              Categories
            </h3>
            <div className="space-y-1.5">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={cn(
                    "group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all",
                    category === item
                      ? "bg-[#C9A227] font-bold text-[#2B2B2B] shadow-sm"
                      : "font-medium text-stone-500 hover:bg-stone-100 hover:text-[#2B2B2B]",
                  )}
                >
                  <span>{item}</span>
                  {category === item && <Check className="h-3.5 w-3.5 text-[#C9A227]" />}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <Accordion type="multiple" defaultValue={["tone", "concern"]} className="w-full">
            <AccordionItem value="tone" className="border-b-0">
              <AccordionTrigger className="text-xs font-bold uppercase tracking-[0.2em] text-[#2B2B2B] hover:no-underline">
                Skin Tone
              </AccordionTrigger>
              <AccordionContent className="space-y-2 pt-2">
                {["Deep", "Rich", "Warm", "Neutral"].map((tone) => (
                  <label
                    key={tone}
                    className="group flex cursor-pointer items-center gap-3 rounded-md px-2 py-1 transition hover:bg-stone-50"
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded border border-stone-300 transition group-hover:border-[#C9A227]" />
                    <span className="text-sm text-stone-600 transition group-hover:text-[#2B2B2B]">
                      {tone}
                    </span>
                  </label>
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="concern" className="border-b-0">
              <AccordionTrigger className="text-xs font-bold uppercase tracking-[0.2em] text-[#2B2B2B] hover:no-underline">
                Skin Concern
              </AccordionTrigger>
              <AccordionContent className="space-y-2 pt-2">
                {["Hydration", "Brightness", "Texture", "Glow"].map((concern) => (
                  <label
                    key={concern}
                    className="group flex cursor-pointer items-center gap-3 rounded-md px-2 py-1 transition hover:bg-stone-50"
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded border border-stone-300 transition group-hover:border-[#C9A227]" />
                    <span className="text-sm text-stone-600 transition group-hover:text-[#2B2B2B]">
                      {concern}
                    </span>
                  </label>
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="finish" className="border-b-0">
              <AccordionTrigger className="text-xs font-bold uppercase tracking-[0.2em] text-[#2B2B2B] hover:no-underline">
                Finish
              </AccordionTrigger>
              <AccordionContent className="space-y-2 pt-2">
                {["Matte", "Satin", "Dewy", "Luminous"].map((finish) => (
                  <label
                    key={finish}
                    className="group flex cursor-pointer items-center gap-3 rounded-md px-2 py-1 transition hover:bg-stone-50"
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded border border-stone-300 transition group-hover:border-[#C9A227]" />
                    <span className="text-sm text-stone-600 transition group-hover:text-[#2B2B2B]">
                      {finish}
                    </span>
                  </label>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Card className="overflow-hidden border-[#C9A227]/15 bg-[#F5E6DA] shadow-none">
            <CardContent className="space-y-3 p-5">
              <Truck className="h-5 w-5 text-[#C9A227]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A227]">
                Service Focus
              </p>
              <p className="text-xs font-medium leading-relaxed text-[#2B2B2B]/80">
                Free delivery on Kampala orders over {formatCurrency(250000)}
              </p>
            </CardContent>
          </Card>
        </aside>

        {/* Product grid */}
        <div className="space-y-8">
          <div className="sticky top-[108px] z-30 flex flex-col gap-4 rounded-2xl border border-black/[0.04] bg-white/95 px-4 py-4 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh] rounded-t-[32px] p-6">
                  <SheetHeader className="px-0 text-left">
                    <SheetTitle className="font-[var(--font-heading)] text-2xl font-bold text-[#2B2B2B]">
                      Discover Filters
                    </SheetTitle>
                    <SheetDescription>
                      Narrow your edit by category and ritual focus.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6 overflow-y-auto pb-8">
                    <div className="space-y-3">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
                        Category
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((item) => (
                          <Badge
                            key={item}
                            variant={category === item ? "default" : "secondary"}
                            onClick={() => {
                              setCategory(item);
                              setMobileFilterOpen(false);
                            }}
                            className={cn(
                              "cursor-pointer rounded-full px-4 py-2 text-xs font-semibold transition",
                              category === item
                                ? "bg-[#C9A227] text-[#2B2B2B] hover:bg-[#C9A227]/85"
                                : "bg-stone-100 text-stone-700 hover:bg-stone-200",
                            )}
                          >
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Separator orientation="vertical" className="hidden h-6 md:block" />
              <p className="text-sm font-medium text-stone-500">
                Showing{" "}
                <span className="font-bold text-[#2B2B2B]">
                  {Math.min(visible, filtered.length)}
                </span>{" "}
                of <span className="font-bold text-[#2B2B2B]">{filtered.length}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <LayoutGrid className="h-4 w-4 text-stone-500" />
              <Separator orientation="vertical" className="h-6" />
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="h-10 w-[200px] rounded-full border-black/10 px-5 text-sm font-semibold text-[#2B2B2B]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low to high</SelectItem>
                  <SelectItem value="price-desc">Price: High to low</SelectItem>
                  <SelectItem value="rating">Top rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.slice(0, visible).map((product, idx) => (
                <motion.div
                  key={product.slug}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (idx % 4) * 0.08, duration: 0.5 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div ref={loaderRef} className="flex flex-col items-center gap-4 py-16">
            {visible < filtered.length ? (
              <>
                <div className="h-1.5 w-48 overflow-hidden rounded-full bg-stone-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(visible / filtered.length) * 100}%` }}
                    className="h-full bg-[#C9A227]"
                  />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-500">
                  Loading discovery feed...
                </p>
              </>
            ) : (
              <Card className="w-full border-dashed border-stone-200 bg-stone-50/50 shadow-none">
                <CardContent className="p-12 text-center">
                  <p className="mb-2 font-[var(--font-heading)] text-xl font-bold text-[#2B2B2B]">
                    You&apos;ve reached the edge of discovery.
                  </p>
                  <p className="text-sm text-stone-500">
                    Explore our journal for shade rituals and beauty routines.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-6 rounded-full border-black/10 px-8 text-sm font-bold uppercase tracking-widest text-[#2B2B2B] hover:bg-[#C9A227]/85 hover:text-[#2B2B2B]"
                  >
                    <Link href="/blog">Read the Journal</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function ShopPageFallback() {
  return (
    <main className="w-full px-4 py-8 md:px-6 lg:py-12 xl:px-10">
      <Skeleton className="h-[320px] rounded-[40px] lg:h-[440px]" />
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-4">
            <Skeleton className="aspect-[4/5] rounded-[28px]" />
            <Skeleton className="h-5 w-2/3 rounded-full" />
            <Skeleton className="h-4 w-1/3 rounded-full" />
          </div>
        ))}
      </div>
    </main>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Product detail page
 * ──────────────────────────────────────────────────────────────────────── */

const VARIATION_LABELS: Record<ApiProductVariation["type"], string> = {
  size: "Size",
  color: "Color",
  pc: "Piece Count",
  quantity: "Quantity",
};

const VARIATION_UNIT: Record<ApiProductVariation["type"], string> = {
  size: "",
  color: "",
  pc: "pc",
  quantity: "units",
};

export function ProductDetailPage({ slug }: { slug: string }) {
  const { products, ready } = useStorefrontProducts();
  const product = useMemo(
    () => products.find((entry) => entry.slug === slug),
    [products, slug],
  );
  const { addToCart, toggleWishlist, wishlist } = useStore();

  const [shade, setShade] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [variations, setVariations] = useState<ApiProductVariation[]>([]);
  const [selected, setSelected] = useState<
    Partial<Record<ApiProductVariation["type"], ApiProductVariation>>
  >({});

  useEffect(() => {
    apiGetProduct(slug)
      .then((p) => {
        const vars = p.variations ?? [];
        setVariations(vars);
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

  const activePrice = useMemo(() => {
    for (const v of Object.values(selected)) {
      if (v?.price) return v.price;
    }
    return product?.price ?? 0;
  }, [selected, product]);

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
    return (
      <main className="container-shell px-4 py-10 md:px-6 md:py-16 xl:px-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Skeleton className="aspect-[0.92] rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </main>
    );
  }
  if (!product) notFound();

  const related = products
    .filter((item) => item.category === product.category && item.slug !== product.slug)
    .slice(0, 4);

  const selectionSummary = Object.values(selected)
    .filter(Boolean)
    .map((v) => {
      const unit = VARIATION_UNIT[v!.type];
      return unit ? `${v!.value} ${unit}` : v!.value;
    })
    .join(" · ");

  const isSaved = wishlist.includes(product.slug);

  return (
    <main className="container-shell px-4 py-10 md:px-6 md:py-16 xl:px-10">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Image panel */}
        <div className="grid gap-4 md:grid-cols-[0.18fr_0.82fr]">
          <div className="hidden gap-3 md:grid md:grid-rows-3">
            {product.shades.slice(0, 3).map((option) => (
              <Card
                key={option}
                className="overflow-hidden border-black/8 bg-white/80 shadow-none"
              >
                <CardContent className="flex h-full items-center p-4 text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
                  {option}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="group relative aspect-[0.92] overflow-hidden rounded-3xl border border-black/5 shadow-[0_24px_70px_rgba(17,12,10,0.12)]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-6 rounded-2xl border border-white/20 backdrop-blur-[2px]" />
            <div className="relative z-10 flex h-full flex-col justify-between p-6">
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="border-white/25 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[#2B2B2B] backdrop-blur"
                >
                  {product.subcategory}
                </Badge>
                <Badge className="bg-[#C9A227] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[#2B2B2B]">
                  {product.badge ?? "Signature"}
                </Badge>
              </div>
              <div className="rounded-2xl border border-white/25 bg-black/40 p-6 backdrop-blur-md">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2B2B2B]/70">
                  Ellena Cosmetics
                </p>
                <h1 className="mt-3 font-[var(--font-heading)] text-5xl font-bold leading-none text-[#2B2B2B] md:text-6xl">
                  {product.name}
                </h1>
                {selectionSummary && (
                  <p className="mt-2 text-xs font-medium tracking-wide text-[#2B2B2B]/70">
                    {selectionSummary}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info panel */}
        <Card className="rounded-3xl border-black/5 bg-white/95 shadow-[0_24px_70px_rgba(17,12,10,0.08)]">
          <CardHeader className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#C9A227]">
              {product.category}
            </p>
            <h2 className="font-[var(--font-heading)] text-5xl font-bold leading-none text-[#2B2B2B] md:text-6xl">
              {product.name}
            </h2>
            <div className="flex items-center gap-3 text-sm text-stone-600">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.round(product.rating)
                        ? "fill-[#C9A227] text-[#C9A227]"
                        : "fill-stone-200 text-stone-200",
                    )}
                  />
                ))}
              </div>
              <span className="font-semibold text-[#2B2B2B]">{product.rating}</span>
              <span className="text-stone-500">· {product.reviewCount} reviews</span>
            </div>

            <div className="flex items-baseline gap-3 pt-2">
              <p className="font-[var(--font-heading)] text-4xl font-bold text-[#2B2B2B]">
                {formatCurrency(activePrice)}
              </p>
              {activePrice !== product.price && (
                <p className="text-sm text-stone-400 line-through">
                  {formatCurrency(product.price)}
                </p>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="text-sm leading-7 text-stone-600">{product.description}</p>

            {/* Shade selector */}
            {product.shades.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-500">
                  Shade
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.shades.map((option) => (
                    <Button
                      key={option}
                      type="button"
                      onClick={() => setShade(option)}
                      variant={shade === option ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "rounded-full px-4 text-xs font-semibold uppercase tracking-wide",
                        shade === option
                          ? "bg-[#C9A227] text-[#2B2B2B] hover:bg-[#C9A227]/85"
                          : "border-black/10 bg-stone-50 text-stone-700 hover:border-[#C9A227]",
                      )}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Variation selectors */}
            {variationGroups.size > 0 && (
              <div className="space-y-5">
                {Array.from(variationGroups.entries()).map(([type, options]) => {
                  const currentVal = selected[type];
                  return (
                    <div key={type}>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-500">
                          {VARIATION_LABELS[type]}
                        </p>
                        {currentVal && (
                          <Badge
                            variant="secondary"
                            className="bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-600"
                          >
                            {currentVal.value}
                            {VARIATION_UNIT[type] ? ` ${VARIATION_UNIT[type]}` : ""}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {options.map((v) => {
                          const isSelected = selected[type]?.id === v.id;
                          const outOfStock = v.stock === 0;
                          return (
                            <Button
                              key={v.id}
                              type="button"
                              size="sm"
                              variant={isSelected ? "default" : "outline"}
                              disabled={outOfStock}
                              onClick={() =>
                                setSelected((prev) => ({ ...prev, [type]: v }))
                              }
                              title={outOfStock ? "Out of stock" : undefined}
                              className={cn(
                                "relative rounded-full px-4 text-xs font-semibold",
                                isSelected
                                  ? "bg-[#C9A227] text-[#2B2B2B] hover:bg-[#C9A227]/85"
                                  : outOfStock
                                    ? "cursor-not-allowed border-black/6 bg-stone-50 text-stone-300"
                                    : "border-black/10 bg-stone-50 text-stone-700 hover:border-[#C9A227]",
                              )}
                            >
                              {v.value}
                              {VARIATION_UNIT[type] && (
                                <span
                                  className={cn(
                                    "ml-1 text-xs",
                                    isSelected ? "text-[#8A8A8A]" : "text-stone-400",
                                  )}
                                >
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
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quantity stepper */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-500">
                Quantity
              </p>
              <div className="mt-3 inline-flex items-center rounded-full border border-black/10 bg-stone-50 p-1">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-9 w-9 rounded-full hover:bg-white"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="min-w-10 text-center text-sm font-bold text-[#2B2B2B]">
                  {quantity}
                </span>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="h-9 w-9 rounded-full hover:bg-white"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-4">
            <div className="flex w-full flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => {
                  addToCart({ slug: product.slug, quantity, shade });
                  toast.success(`${product.name} added to bag`, {
                    description: `${quantity} × ${shade}`,
                  });
                }}
                className="group flex-1 rounded-full bg-[#C9A227] text-sm font-bold uppercase tracking-[0.16em] text-[#2B2B2B] hover:bg-[#C9A227]/85"
              >
                <ShoppingBag className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                Add to cart · {formatCurrency(activePrice * quantity)}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  toggleWishlist(product.slug);
                  toast(
                    isSaved
                      ? `Removed ${product.name} from wishlist`
                      : `Saved ${product.name}`,
                  );
                }}
                aria-pressed={isSaved}
                className={cn(
                  "rounded-full px-6 text-sm font-bold uppercase tracking-[0.16em]",
                  isSaved
                    ? "border-[#8A8A8A] bg-[#8A8A8A] text-[#2B2B2B] hover:bg-[#8A8A8A] hover:text-[#2B2B2B]"
                    : "border-black/10 text-[#2B2B2B] hover:border-[#8A8A8A] hover:text-[#8A8A8A]",
                )}
              >
                <Heart
                  className={cn("mr-2 h-4 w-4", isSaved && "fill-current")}
                />
                {isSaved ? "Saved" : "Wishlist"}
              </Button>
            </div>

            <Separator />

            <div className="grid w-full grid-cols-3 gap-2">
              {[
                { icon: ShieldCheck, label: "Long-wear" },
                { icon: Sparkles, label: "Cruelty-free" },
                { icon: Truck, label: "Global shipping" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-black/6 bg-stone-50/60 p-3 text-center"
                >
                  <Icon className="h-4 w-4 text-[#C9A227]" />
                  <span className="text-[11px] font-semibold text-stone-700">{label}</span>
                </div>
              ))}
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Tabs: Description / Details / Shipping */}
      <section className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="h-auto bg-stone-100/70 p-1">
            <TabsTrigger
              value="description"
              className="rounded-full px-6 py-2 text-xs font-bold uppercase tracking-[0.2em] data-[state=active]:bg-white data-[state=active]:text-[#2B2B2B] data-[state=active]:shadow"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="rounded-full px-6 py-2 text-xs font-bold uppercase tracking-[0.2em] data-[state=active]:bg-white data-[state=active]:text-[#2B2B2B] data-[state=active]:shadow"
            >
              Details
            </TabsTrigger>
            <TabsTrigger
              value="shipping"
              className="rounded-full px-6 py-2 text-xs font-bold uppercase tracking-[0.2em] data-[state=active]:bg-white data-[state=active]:text-[#2B2B2B] data-[state=active]:shadow"
            >
              Shipping
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <Card className="border-black/5 bg-white/90">
              <CardContent className="p-8 text-sm leading-7 text-stone-600">
                <p>{product.description}</p>
                <p className="mt-4">
                  Ellena&apos;s rituals are designed for melanin-rich skin and built around tone
                  affinity, professional performance, and ingredients sourced with intent.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="details" className="mt-6">
            <Card className="border-black/5 bg-white/90">
              <CardContent className="grid gap-4 p-8 md:grid-cols-2">
                {[
                  { k: "Category", v: product.category },
                  { k: "Subcategory", v: product.subcategory },
                  { k: "Finish", v: product.heroTone },
                  { k: "Shade range", v: `${product.shades.length} options` },
                ].map(({ k, v }) => (
                  <div
                    key={k}
                    className="flex items-center justify-between rounded-xl border border-black/5 bg-stone-50/70 px-4 py-3"
                  >
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
                      {k}
                    </span>
                    <span className="text-sm font-semibold text-[#2B2B2B]">{v}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="shipping" className="mt-6">
            <Card className="border-black/5 bg-white/90">
              <CardContent className="space-y-4 p-8 text-sm leading-7 text-stone-600">
                <div className="flex items-start gap-3">
                  <Truck className="mt-1 h-5 w-5 text-[#C9A227]" />
                  <div>
                    <p className="font-semibold text-[#2B2B2B]">Kampala same-day</p>
                    <p>
                      Orders placed before 12pm are dispatched the same day across Kampala
                      Metro.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 text-[#C9A227]" />
                  <div>
                    <p className="font-semibold text-[#2B2B2B]">Easy returns</p>
                    <p>
                      30-day returns on unopened products. We&apos;ll refund within 5 business
                      days.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Related */}
      <section className="mt-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#C9A227]">
              Pair it with
            </p>
            <h3 className="mt-2 font-[var(--font-heading)] text-4xl font-bold leading-none text-[#2B2B2B] md:text-5xl">
              Related rituals
            </h3>
          </div>
          <Button asChild variant="outline" className="rounded-full border-black/10">
            <Link href="/shop">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
      </section>
    </main>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Cart page
 * ──────────────────────────────────────────────────────────────────────── */

export function CartPage() {
  const { products } = useStorefrontProducts();
  const { cart, removeFromCart, updateQuantity } = useStore();
  const entries = cart
    .map((item) => ({ ...item, product: products.find((product) => product.slug === item.slug) }))
    .filter((item) => item.product);
  const subtotal = entries.reduce(
    (total, item) => total + item.product!.price * item.quantity,
    0,
  );
  const delivery = subtotal > 250000 || subtotal === 0 ? 0 : 25000;

  return (
    <main className="container-shell px-4 py-10 md:px-6 md:py-16 xl:px-10">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-3xl border-black/5 bg-white/95 shadow-[0_24px_70px_rgba(17,12,10,0.06)]">
          <CardHeader>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#C9A227]">
              Your bag
            </p>
            <h1 className="font-[var(--font-heading)] text-5xl font-bold leading-none text-[#2B2B2B] md:text-6xl">
              Cart
            </h1>
            <p className="text-sm leading-7 text-stone-600">
              A streamlined bag experience with large tap targets and clear quantity editing.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {entries.length === 0 ? (
              <Card className="border-dashed border-black/10 bg-stone-50/70 shadow-none">
                <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
                  <ShoppingBag className="h-10 w-10 text-stone-300" />
                  <p className="text-sm font-semibold text-stone-600">Your cart is empty.</p>
                  <Button
                    asChild
                    className="rounded-full bg-[#C9A227] text-xs font-bold uppercase tracking-[0.16em] hover:bg-[#C9A227]/85"
                  >
                    <Link href="/shop">Start with bestsellers</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : null}
            {entries.map((entry) => (
              <Card
                key={`${entry.slug}-${entry.shade}`}
                className="border-black/6 bg-stone-50/70 shadow-none"
              >
                <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-black/5">
                      <Image
                        src={entry.product!.image}
                        alt={entry.product!.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-[#2B2B2B]">
                        {entry.product!.name}
                      </p>
                      <p className="text-xs uppercase tracking-wider text-stone-500">
                        {entry.shade}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center rounded-full border border-black/8 bg-white p-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => updateQuantity(entry.slug, entry.quantity - 1)}
                        className="h-8 w-8 rounded-full"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="min-w-8 text-center text-sm font-bold">
                        {entry.quantity}
                      </span>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => updateQuantity(entry.slug, entry.quantity + 1)}
                        className="h-8 w-8 rounded-full"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="w-28 text-right text-sm font-bold text-[#2B2B2B]">
                      {formatCurrency(entry.product!.price * entry.quantity)}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        removeFromCart(entry.slug);
                        toast(`Removed ${entry.product!.name}`);
                      }}
                      className="rounded-full text-xs font-semibold text-stone-500 hover:text-rose-500"
                    >
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card className="h-fit overflow-hidden rounded-3xl border-0 bg-[#C9A227] text-[#2B2B2B] shadow-[0_24px_70px_rgba(17,12,10,0.18)]">
          <CardHeader>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#C9A227]">
              Summary
            </p>
            <h2 className="font-[var(--font-heading)] text-3xl font-bold leading-none">
              Order total
            </h2>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-[#2B2B2B]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="font-semibold">
                {delivery === 0 ? "Free" : formatCurrency(delivery)}
              </span>
            </div>
            <Separator className="bg-white/15" />
            <div className="flex items-baseline justify-between text-base font-semibold text-[#2B2B2B]">
              <span>Total</span>
              <span className="font-[var(--font-heading)] text-2xl">
                {formatCurrency(subtotal + delivery)}
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              asChild
              size="lg"
              disabled={entries.length === 0}
              className="w-full rounded-full bg-white text-sm font-bold uppercase tracking-[0.18em] text-[#2B2B2B] hover:bg-[#F5E6DA]"
            >
              <Link href="/checkout">
                Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Checkout page
 * ──────────────────────────────────────────────────────────────────────── */

export function CheckoutPage() {
  const { products } = useStorefrontProducts();
  const { cart, clearCart } = useStore();
  const router = useRouter();
  const subtotal = cart.reduce((sum, item) => {
    const p = products.find((x) => x.slug === item.slug);
    return p ? sum + p.price * item.quantity : sum;
  }, 0);

  const fields: { name: string; label: string; type?: string; full?: boolean }[] = [
    { name: "first_name", label: "First name" },
    { name: "last_name", label: "Last name" },
    { name: "email", label: "Email address", type: "email", full: true },
    { name: "phone", label: "Phone number", type: "tel", full: true },
    { name: "address", label: "Delivery address", full: true },
    { name: "city", label: "City" },
    { name: "country", label: "Country" },
  ];

  return (
    <main className="container-shell px-4 py-10 md:px-6 md:py-16 xl:px-10">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-3xl border-black/5 bg-white/95 shadow-[0_24px_70px_rgba(17,12,10,0.06)]">
          <CardHeader>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#C9A227]">
              Secure checkout
            </p>
            <h1 className="font-[var(--font-heading)] text-5xl font-bold leading-none text-[#2B2B2B] md:text-6xl">
              Checkout
            </h1>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((field) => (
                <div
                  key={field.name}
                  className={cn("space-y-2", field.full && "md:col-span-2")}
                >
                  <Label
                    htmlFor={field.name}
                    className="text-xs font-bold uppercase tracking-wider text-stone-500"
                  >
                    {field.label}
                  </Label>
                  <Input
                    id={field.name}
                    type={field.type ?? "text"}
                    placeholder={field.label}
                    className="h-12 rounded-xl border-black/8 bg-stone-50 px-4"
                  />
                </div>
              ))}
            </div>

            <Separator />

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-stone-500">
                Delivery method
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  { name: "Standard", time: "2-4 days", price: 25000 },
                  { name: "Express", time: "Same day", price: 50000 },
                ].map((option, idx) => (
                  <Card
                    key={option.name}
                    className={cn(
                      "cursor-pointer border-2 shadow-none transition hover:border-[#C9A227]",
                      idx === 0 ? "border-[#2B2B2B]" : "border-black/8",
                    )}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="text-sm font-bold text-[#2B2B2B]">{option.name}</p>
                        <p className="text-xs text-stone-500">{option.time}</p>
                      </div>
                      <p className="text-sm font-semibold text-[#2B2B2B]">
                        {formatCurrency(option.price)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              size="lg"
              onClick={() => {
                if (cart.length === 0) {
                  toast.error("Your cart is empty");
                  return;
                }
                clearCart();
                toast.success("Order placed", {
                  description: "We'll email you a confirmation shortly.",
                });
                router.push("/");
              }}
              className="w-full rounded-full bg-[#C9A227] text-sm font-bold uppercase tracking-[0.18em] text-[#2B2B2B] hover:bg-[#C9A227]/85"
            >
              Place order · {formatCurrency(subtotal)}
            </Button>
          </CardFooter>
        </Card>

        <Card className="h-fit rounded-3xl border-0 bg-[#F5E6DA] shadow-[0_24px_70px_rgba(17,12,10,0.08)]">
          <CardHeader>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#C9A227]">
              Order review
            </p>
            <h2 className="font-[var(--font-heading)] text-3xl font-bold leading-none text-[#2B2B2B]">
              {cart.length} item{cart.length === 1 ? "" : "s"}
            </h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {cart.length === 0 ? (
              <p className="text-sm text-stone-500">Your cart is currently empty.</p>
            ) : (
              cart.map((item) => {
                const product = products.find((p) => p.slug === item.slug);
                if (!product) return null;
                return (
                  <Card
                    key={`${item.slug}-${item.shade}`}
                    className="border-black/6 bg-white/80 shadow-none"
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="text-sm font-semibold text-[#2B2B2B]">
                          {product.name}
                        </p>
                        <p className="text-xs text-stone-500">
                          {item.shade} · qty {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-[#2B2B2B]">
                        {formatCurrency(product.price * item.quantity)}
                      </p>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Wishlist page
 * ──────────────────────────────────────────────────────────────────────── */

export function WishlistPage() {
  const { products } = useStorefrontProducts();
  const { wishlist } = useStore();
  const entries = products.filter((product) => wishlist.includes(product.slug));

  return (
    <main className="container-shell px-4 py-10 md:px-6 md:py-16 xl:px-10">
      <Card className="mb-10 rounded-3xl border-black/5 bg-white/95 shadow-[0_24px_70px_rgba(17,12,10,0.06)]">
        <CardHeader>
          <Badge
            variant="outline"
            className="w-fit border-[#8A8A8A]/30 bg-[#8A8A8A]/10 text-[10px] font-bold uppercase tracking-[0.3em] text-[#8A8A8A]"
          >
            <Heart className="mr-2 h-3 w-3" />
            Wishlist
          </Badge>
          <h1 className="font-[var(--font-heading)] text-5xl font-bold leading-none text-[#2B2B2B] md:text-6xl">
            Saved favourites
          </h1>
          <p className="text-sm leading-7 text-stone-600">
            Saved favourites stay one tap away from your cart.
          </p>
        </CardHeader>
      </Card>

      {entries.length === 0 ? (
        <Card className="rounded-3xl border-dashed border-black/10 bg-stone-50/60 shadow-none">
          <CardContent className="flex flex-col items-center gap-4 p-16 text-center">
            <Heart className="h-10 w-10 text-stone-300" />
            <p className="text-base font-semibold text-stone-600">No saved items yet.</p>
            <p className="max-w-sm text-sm text-stone-500">
              Tap the heart on any product to keep it close at hand.
            </p>
            <Button
              asChild
              className="mt-2 rounded-full bg-[#C9A227] text-xs font-bold uppercase tracking-[0.16em] hover:bg-[#C9A227]/85"
            >
              <Link href="/shop">Browse the shop</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {entries.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Account page
 * ──────────────────────────────────────────────────────────────────────── */

export function AccountPage() {
  return (
    <main className="container-shell px-4 py-10 md:px-6 md:py-16 xl:px-10">
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="overflow-hidden rounded-3xl border-0 bg-[#C9A227] text-[#2B2B2B] shadow-[0_24px_70px_rgba(17,12,10,0.18)]">
          <CardHeader>
            <Badge
              variant="outline"
              className="w-fit border-white/20 bg-white/10 text-[10px] font-bold uppercase tracking-[0.3em] text-[#2B2B2B]"
            >
              <Sparkles className="mr-2 h-3 w-3 text-[#C9A227]" />
              Ellena Circle
            </Badge>
            <h1 className="font-[var(--font-heading)] text-5xl font-bold leading-none md:text-6xl">
              Account
            </h1>
            <p className="text-sm leading-7 text-[#2B2B2B]/80">
              Sign in to manage saved shades, reorder rituals, and track delivery status.
            </p>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-[#2B2B2B]">
            {[
              "Track your latest order in real time",
              "Reorder rituals with one tap",
              "Earn beauty rewards on every purchase",
            ].map((perk) => (
              <div key={perk} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-[#C9A227]" />
                <span>{perk}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-black/5 bg-white/95 shadow-[0_24px_70px_rgba(17,12,10,0.06)]">
          <CardHeader>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#C9A227]">
              Welcome back
            </p>
            <h2 className="font-[var(--font-heading)] text-3xl font-bold leading-none text-[#2B2B2B]">
              Sign in
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="account-email" className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Email
                </Label>
                <Input
                  id="account-email"
                  type="email"
                  placeholder="you@example.com"
                  className="h-12 rounded-xl border-black/8 bg-stone-50 px-4"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-password" className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Password
                </Label>
                <Input
                  id="account-password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 rounded-xl border-black/8 bg-stone-50 px-4"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <Button
              asChild
              size="lg"
              className="w-full rounded-full bg-[#C9A227] text-sm font-bold uppercase tracking-[0.18em] text-[#2B2B2B] hover:bg-[#C9A227]/85"
            >
              <Link href="/login">Continue to sign in</Link>
            </Button>
            <p className="text-xs text-stone-500">
              New to Ellena?{" "}
              <Link href="/login" className="font-semibold text-[#C9A227] hover:underline">
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Blog page
 * ──────────────────────────────────────────────────────────────────────── */

export function BlogPage() {
  return (
    <main className="container-shell px-4 py-10 md:px-6 md:py-16 xl:px-10">
      <Card className="mb-10 overflow-hidden rounded-3xl border-black/5 bg-[#F5E6DA] shadow-[0_24px_70px_rgba(17,12,10,0.06)]">
        <CardHeader className="space-y-3 p-8 md:p-12">
          <Badge
            variant="outline"
            className="w-fit border-[#C9A227]/30 bg-white/60 text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A227]"
          >
            Discover
          </Badge>
          <h1 className="font-[var(--font-heading)] text-5xl font-bold leading-none text-[#2B2B2B] md:text-7xl">
            Beauty journal
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-stone-600">
            Editorial-led shade rituals, founder notes, and skin diaries from the Ellena studio.
          </p>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <motion.article
            key={post.slug}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="group h-full overflow-hidden rounded-3xl border-black/5 bg-white pt-0 shadow-[0_18px_50px_rgba(17,12,10,0.07)] transition hover:shadow-[0_28px_70px_rgba(17,12,10,0.14)]">
              <div className="relative aspect-[1.1] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <Badge className="absolute left-4 top-4 bg-white/90 text-[10px] font-bold uppercase tracking-[0.24em] text-[#2B2B2B]">
                  {post.tag}
                </Badge>
              </div>
              <CardContent className="space-y-3 p-6">
                <h2 className="font-[var(--font-heading)] text-2xl font-bold leading-tight text-[#2B2B2B] transition group-hover:text-[#C9A227]">
                  {post.title}
                </h2>
                <p className="text-sm leading-7 text-stone-600">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="px-6 pb-6">
                <Button
                  variant="link"
                  className="px-0 text-sm font-bold uppercase tracking-[0.16em] text-[#C9A227]"
                >
                  Read more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.article>
        ))}
      </div>
    </main>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * About page
 * ──────────────────────────────────────────────────────────────────────── */

export function AboutPage() {
  const pillars = [
    {
      icon: Sparkles,
      title: "Editorial polish",
      body: "Campaign-led textures and tone-driven palettes that feel global without losing identity.",
    },
    {
      icon: ShieldCheck,
      title: "Ingredient discipline",
      body: "Treatment-first formulas tested for melanin-rich skin, sensitive textures, and humid climates.",
    },
    {
      icon: Truck,
      title: "Local-first delivery",
      body: "Same-day Kampala fulfilment with white-glove packaging and full tracking.",
    },
  ];

  return (
    <main className="container-shell px-4 py-10 md:px-6 md:py-16 xl:px-10">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="overflow-hidden rounded-3xl border-0 bg-[#C9A227] text-[#2B2B2B] shadow-[0_24px_70px_rgba(17,12,10,0.18)]">
          <CardHeader className="space-y-4 p-8 md:p-12">
            <Badge
              variant="outline"
              className="w-fit border-white/25 bg-white/10 text-[10px] font-bold uppercase tracking-[0.3em] text-[#2B2B2B]"
            >
              About Ellena Cosmetics
            </Badge>
            <h1 className="font-[var(--font-heading)] text-5xl font-bold leading-none md:text-6xl">
              African luxury with modern beauty discipline.
            </h1>
            <p className="text-sm leading-7 text-[#2B2B2B]">
              A premium cosmetics destination built for ritual, polish, and tone affinity.
            </p>
          </CardHeader>
        </Card>

        <Card className="rounded-3xl border-black/5 bg-white/95 shadow-[0_24px_70px_rgba(17,12,10,0.06)]">
          <CardContent className="space-y-5 p-8 text-sm leading-8 text-stone-600 md:p-12">
            <p>
              Ellena Cosmetics is imagined as a premium cosmetics house for customers who want
              high-performance formulas, richer undertone sensitivity, and a shopping
              experience that feels global without losing regional identity.
            </p>
            <p>
              The visual system leans editorial and luxurious, while the component structure
              stays practical for future catalog, CMS, and checkout integrations.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {pillars.map(({ icon: Icon, title, body }) => (
          <Card
            key={title}
            className="rounded-3xl border-black/5 bg-white/90 shadow-[0_18px_50px_rgba(17,12,10,0.05)] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(17,12,10,0.1)]"
          >
            <CardContent className="space-y-3 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A227]/10 text-[#C9A227]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-[var(--font-heading)] text-xl font-bold text-[#2B2B2B]">
                {title}
              </h3>
              <p className="text-sm leading-7 text-stone-600">{body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
