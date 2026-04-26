"use client";

import { Footer7 } from "@/components/ui/footer-7";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Box,
  Cpu,
  Eye,
  FileText,
  Globe,
  Heart,
  Palette,
  Rocket,
  Search,
  Shield,
  ShoppingBag,
  Sparkles,
  Star,
  WandSparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { blogPosts, navGroups, testimonials } from "@/lib/store-data";
import { useStorefrontProducts, type StorefrontProduct } from "@/lib/storefront-products";
import { useStore } from "@/components/providers/store-provider";
import { cn, formatCurrency } from "@/lib/utils";
import { HeroCarousel } from "@/components/hero-carousel";
import { useStorefrontCategories } from "@/lib/storefront-categories";
import { useSiteSettings, logoSrc } from "@/lib/use-site-settings";
import { apiGetBanners, type ApiBanner, API_ORIGIN } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import MegaMenu, { type MegaMenuItem } from "@/components/ui/mega-menu";
import { MenuVertical } from "@/components/ui/menu-vertical";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const megaMenuIcons = [
  Sparkles,
  Palette,
  WandSparkles,
  Globe,
  Shield,
  Rocket,
  Box,
  Eye,
  Cpu,
  FileText,
];

// ─── Header ──────────────────────────────────────────────────────────────
export function SiteHeader() {
  const { cart, wishlist, query, setQuery } = useStore();
  const { products } = useStorefrontProducts();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const siteSettings = useSiteSettings();
  const logoUrl = logoSrc(siteSettings?.logo_url);

  const suggestions = useMemo(
    () => products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5),
    [products, query],
  );

  const desktopMenuItems = useMemo<MegaMenuItem[]>(
    () =>
      navGroups.map((group, groupIndex) => {
        const primaryLinks = group.links.slice(0, Math.ceil(group.links.length / 2));
        const secondaryLinks = group.links.slice(Math.ceil(group.links.length / 2));

        return {
          id: groupIndex + 1,
          label: group.title,
          subMenus: [
            {
              title: group.promo.eyebrow,
              items: primaryLinks.map((label, index) => ({
                label,
                description: group.promo.heading,
                icon: megaMenuIcons[(groupIndex + index) % megaMenuIcons.length],
                href: "/shop",
              })),
            },
            {
              title: "Explore",
              items: (secondaryLinks.length > 0 ? secondaryLinks : group.links.slice(0, 3)).map((label, index) => ({
                label,
                description: group.promo.body,
                icon: megaMenuIcons[(groupIndex + index + 4) % megaMenuIcons.length],
                href: "/shop",
              })),
            },
          ],
        };
      }),
    [],
  );

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-[#F5E6DA]/60 bg-white/80 backdrop-blur-xl">
      {/* Announcement bar */}
      <div className="bg-[#F5E6DA] px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-[#2B2B2B]">
        ✦ Complimentary Kampala delivery over {formatCurrency(250000)} ✦
      </div>

      <div className="container-shell relative px-4 md:px-6 xl:px-10">
        <div className="flex min-h-24 items-center gap-3 py-4">
          {/* Mobile menu trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon-lg"
                className="group lg:hidden border-[#F5E6DA] bg-white"
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                <svg
                  className="pointer-events-none"
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto border-[#F5E6DA] bg-[#FFFDF9]/95 backdrop-blur-xl">
              <SheetHeader>
                <SheetTitle className="text-[#2B2B2B]">
                  {logoUrl ? (
                    <Image src={logoUrl} alt="Logo" width={120} height={40} className="h-10 w-auto object-contain" />
                  ) : (
                    <div>
                      <p className="font-[var(--font-heading)] font-bold text-2xl tracking-[0.1em]">ELLENA</p>
                      <p className="-mt-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A227]">Cosmetics</p>
                    </div>
                  )}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 px-0 pb-6">
                <MenuVertical
                  color="#C9A227"
                  skew={-6}
                  menuItems={[
                    { label: "Home", href: "/" },
                    { label: "Shop", href: "/shop" },
                    { label: "About Us", href: "/about" },
                    { label: "Blog", href: "/blog" },
                    { label: "Wishlist", href: "/wishlist" },
                    { label: "Cart", href: "/cart" },
                  ]}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="mr-4 shrink-0">
            {logoUrl ? (
              <Image src={logoUrl} alt="Logo" width={120} height={40} className="h-10 w-auto object-contain" />
            ) : (
              <div>
                <p className="font-[var(--font-heading)] font-bold text-2xl leading-none tracking-[0.1em] text-[#2B2B2B]">ELLENA</p>
                <p className="-mt-1 text-[10px] font-semibold uppercase tracking-[0.45em] text-[#C9A227]">Cosmetics</p>
              </div>
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:block" aria-label="Primary navigation">
            <MegaMenu
              items={desktopMenuItems}
              className="bg-transparent"
            />
          </nav>

          {/* Right cluster */}
          <div className="ml-auto flex items-center gap-2">
            {/* Search */}
            <div className="relative hidden min-w-[18rem] md:block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8A8A]" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search foundation, serum, body oil..."
                className="h-11 border-[#F5E6DA] bg-[#FFFDF9]/70 pl-11 pr-4 text-sm focus-visible:border-[#C9A227] focus-visible:ring-[#C9A227]/30"
              />
              <AnimatePresence>
                {query && suggestions.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute left-0 right-0 top-[calc(100%+0.6rem)] z-50 overflow-hidden rounded-xl border border-[#F5E6DA]/60 bg-white/95 p-2 shadow-[0_24px_60px_rgba(42,33,31,0.12)] backdrop-blur-xl"
                  >
                    {suggestions.map((product) => (
                      <Link
                        key={product.slug}
                        href={`/product/${product.slug}`}
                        onClick={() => setQuery("")}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-[#F5E6DA]/60"
                      >
                        <div className="relative h-12 w-12 overflow-hidden rounded-md border border-[#F5E6DA]/60 bg-[#F5E6DA]">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-stone-900">{product.name}</p>
                          <p className="text-xs text-stone-500">{product.subcategory}</p>
                        </div>
                        <p className="text-xs font-bold text-[#2B2B2B]">{formatCurrency(product.price)}</p>
                      </Link>
                    ))}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Wishlist */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant="outline"
                  size="icon-lg"
                  className={cn(
                    "relative border-[#F5E6DA] bg-white text-[#2B2B2B] transition hover:border-[#C9A227] hover:bg-[#F5E6DA]/60 hover:text-[#C9A227]",
                    wishlist.length > 0 && "border-[#8A8A8A]/40 text-[#8A8A8A]",
                  )}
                  aria-label="Wishlist"
                >
                  <Link href="/wishlist">
                    <Heart
                      className={cn("h-5 w-5", wishlist.length > 0 && "fill-current")}
                    />
                    {wishlist.length > 0 && (
                      <Badge className="absolute -right-1 -top-1 h-5 min-w-[1.25rem] rounded-full bg-[#C9A227] px-1 text-[10px] font-bold text-white hover:bg-[#C9A227]">
                        {wishlist.length}
                      </Badge>
                    )}
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Wishlist ({wishlist.length})</TooltipContent>
            </Tooltip>

            {/* Cart */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant="outline"
                  size="icon-lg"
                  className={cn(
                    "relative border-[#F5E6DA] bg-white text-[#2B2B2B] transition hover:border-[#C9A227] hover:bg-[#F5E6DA]/60 hover:text-[#C9A227]",
                    cart.length > 0 && "border-[#C9A227]/40 text-[#C9A227]",
                  )}
                  aria-label="Cart"
                >
                  <Link href="/cart">
                    <ShoppingBag className="h-5 w-5" />
                    {cart.length > 0 && (
                      <Badge className="absolute -right-1 -top-1 h-5 min-w-[1.25rem] rounded-full bg-[#C9A227] px-1 text-[10px] font-bold text-white hover:bg-[#C9A227]">
                        {cart.length}
                      </Badge>
                    )}
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Cart ({cart.length})</TooltipContent>
            </Tooltip>
          </div>
        </div>

      </div>
    </header>
  );
}

// ─── Star rating component ───────────────────────────────────────────────
function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star
            key={i}
            className={cn(
              "h-3.5 w-3.5",
              i < Math.round(rating)
                ? "fill-[#C9A227] text-[#C9A227]"
                : "fill-stone-200 text-stone-200",
            )}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-stone-500">
        {rating.toFixed(1)}
        {count ? ` (${count})` : ""}
      </span>
    </div>
  );
}

// ─── Product Card ────────────────────────────────────────────────────────
export function ProductCard({ product }: { product: StorefrontProduct }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const wished = wishlist.includes(product.slug);

  const handleAddToCart = () => {
    addToCart({ slug: product.slug, quantity: 1, shade: product.shades[0] });
    toast.success(`Added to cart`, {
      description: product.name,
    });
  };

  const handleWishlist = () => {
    toggleWishlist(product.slug);
    toast.success(wished ? "Removed from wishlist" : "Saved to wishlist", {
      description: product.name,
    });
  };

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
      <Card className="group overflow-hidden rounded-2xl border-[#F5E6DA]/60 bg-white p-0 shadow-[0_18px_50px_rgba(42,33,31,0.06)] transition hover:shadow-[0_28px_70px_rgba(42,33,31,0.10)]">
        <div className="relative">
          <Link href={`/product/${product.slug}`} className="block">
            <div className="relative aspect-[0.92] overflow-hidden bg-[#F5E6DA]/40">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                className="object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 transition group-hover:opacity-100" />
            </div>
          </Link>

          {product.badge && (
            <Badge className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#2B2B2B] shadow-sm hover:bg-white">
              {product.badge}
            </Badge>
          )}

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleWishlist}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            className={cn(
              "absolute right-3 top-3 h-10 w-10 rounded-full border-[#F5E6DA]/80 bg-white/95 backdrop-blur transition",
              wished && "border-[#8A8A8A] bg-[#8A8A8A] text-white hover:bg-[#8A8A8A]",
            )}
          >
            <Heart className={cn("h-4 w-4", wished && "fill-current")} />
          </Button>
        </div>

        <CardContent className="px-4 pb-5 pt-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Link
                href={`/product/${product.slug}`}
                className="line-clamp-1 text-base font-semibold text-[#2B2B2B] transition hover:text-[#C9A227]"
              >
                {product.name}
              </Link>
              <p className="mt-1 line-clamp-2 text-xs text-stone-500">{product.description}</p>
            </div>
            <p className="shrink-0 text-sm font-bold text-[#2B2B2B]">{formatCurrency(product.price)}</p>
          </div>

          <div className="mt-4">
            <StarRating rating={product.rating} count={product.reviewCount} />
          </div>

          <Button
            type="button"
            onClick={handleAddToCart}
            className="mt-4 w-full bg-[#C9A227] text-[#2B2B2B] hover:bg-[#C9A227]/85"
          >
            Add to cart
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Section intro helper ────────────────────────────────────────────────
function SectionIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#C9A227]">{eyebrow}</p>
        <h2 className="mt-3 max-w-2xl font-[var(--font-heading)] font-bold text-4xl leading-tight text-balance text-[#2B2B2B] md:text-5xl">
          {title}
        </h2>
      </div>
      {body && <p className="max-w-xl text-sm leading-7 text-stone-600 md:text-base">{body}</p>}
    </div>
  );
}

function bannerImgSrc(b: ApiBanner) {
  return b.image_url.startsWith("http") ? b.image_url : API_ORIGIN + b.image_url;
}

// ─── Home page ───────────────────────────────────────────────────────────
export function HomePage() {
  const { products } = useStorefrontProducts();
  const { featured: featuredCategories, campaigns: categoryCampaigns, campaignLayout } = useStorefrontCategories();
  const [categoryBanners, setCategoryBanners] = useState<ApiBanner[]>([]);
  const [middleBanners, setMiddleBanners] = useState<ApiBanner[]>([]);
  const [bottomBanners, setBottomBanners] = useState<ApiBanner[]>([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    apiGetBanners("category_top").then(setCategoryBanners).catch(() => {});
    apiGetBanners("home_middle").then(setMiddleBanners).catch(() => {});
    apiGetBanners("home_bottom").then(setBottomBanners).catch(() => {});
  }, []);

  const featuredProducts = useMemo(() => {
    const featured = products.filter((product) => product.featured);
    return (featured.length > 0 ? featured : products).slice(0, 8);
  }, [products]);

  const latestProducts = useMemo(
    () =>
      [...products]
        .sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 8),
    [products],
  );

  const categoryProductGroups = useMemo(() => {
    return featuredCategories
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        items: products.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase()).slice(0, 4),
      }))
      .filter((g) => g.items.length > 0);
  }, [featuredCategories, products]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Welcome to the list", { description: "Drops, shade launches, and founder edits coming your way." });
    setEmail("");
  };

  const middleSection = middleBanners.length > 0 ? (
    <section className="w-full pb-16 pt-8 md:pb-24 md:pt-16">
      {middleBanners.length >= 2 ? (
        <div className="grid gap-5 px-4 md:grid-cols-2 md:px-6 xl:px-10">
          {middleBanners.slice(0, 2).map((b) => (
            <a
              key={b.id}
              href={b.link_url ?? "#"}
              className="relative block h-[320px] overflow-hidden rounded-2xl bg-stone-100 shadow-[0_24px_60px_rgba(42,33,31,0.12)] md:h-[420px]"
            >
              <img src={bannerImgSrc(b)} alt={b.title ?? ""} className="absolute inset-0 h-full w-full object-cover object-center" />
            </a>
          ))}
        </div>
      ) : (
        <a
          href={middleBanners[0].link_url ?? "#"}
          className="relative block h-[320px] overflow-hidden rounded-2xl bg-stone-100 shadow-[0_24px_60px_rgba(42,33,31,0.12)] md:h-[420px] lg:h-[520px]"
        >
          <img src={bannerImgSrc(middleBanners[0])} alt={middleBanners[0].title ?? ""} className="absolute inset-0 h-full w-full object-cover object-center" />
        </a>
      )}
    </section>
  ) : (
    <section className="w-full pb-16 pt-8 md:pb-24 md:pt-16">
      {campaignLayout === "split" ? (
        <div className="grid gap-5 px-4 md:grid-cols-2 md:px-6 xl:px-10">
          {categoryCampaigns.slice(0, 2).map((category) => (
            <div
              key={category.id}
              className="relative h-[320px] overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(42,33,31,0.12)] md:h-[420px]"
            >
              <img src={category.image} alt={category.name} className="absolute inset-0 h-full w-full object-cover object-center" />
            </div>
          ))}
        </div>
      ) : categoryCampaigns[0] ? (
        <div className="relative h-[320px] overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(42,33,31,0.12)] md:h-[420px] lg:h-[520px]">
          <img
            src={categoryCampaigns[0].image}
            alt={categoryCampaigns[0].name}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>
      ) : null}
    </section>
  );

  return (
    <main>
      <HeroCarousel />

      {/* Categories */}
      <section className="container-shell px-4 md:px-6 xl:px-10 py-8 md:py-16">
        <SectionIntro eyebrow="Shop by ritual" title="Shop by categories" body="" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredCategories.map((category) => (
            <Link
              key={category.id}
              href={category.slug}
              className="group relative block overflow-hidden rounded-2xl shadow-[0_18px_50px_rgba(42,33,31,0.08)]"
            >
              <div className="relative aspect-[0.85] w-full">
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/45" />
                <div className="relative flex h-full flex-col justify-end p-5 text-white">
                  <p className="font-[var(--font-heading)] font-bold text-2xl leading-tight">{category.name}</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-white/70">{category.count}</p>
                  <span className="mt-3 inline-flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C9A227] opacity-0 transition group-hover:opacity-100">
                    Discover →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-shell px-4 md:px-6 xl:px-10 py-8 md:py-16">
        <SectionIntro eyebrow="Best of Ellena Cosmetics" title="Featured Products" body="" />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* Latest Products */}
      <section className="container-shell px-4 md:px-6 xl:px-10 py-8 md:py-16">
        <SectionIntro eyebrow="New Arrivals" title="Latest Products" body="" />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {latestProducts.map((product) => (
            <ProductCard key={`latest-${product.slug}`} product={product} />
          ))}
        </div>
      </section>

      {/* Per-category sections */}
      {categoryProductGroups.map((group) => {
        const banner = categoryBanners.find((b) => b.category_id === Number(group.id));
        return (
          <section key={group.id} className="container-shell px-4 md:px-6 xl:px-10 py-8 md:py-16">
            <SectionIntro eyebrow="Shop by category" title={group.name} body="" />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {group.items.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
            <div className="mt-6">
              <Button asChild variant="outline" size="lg" className="border-[#F5E6DA] hover:bg-[#F5E6DA]/60">
                <Link href={group.slug}>View all {group.name}</Link>
              </Button>
            </div>
            {banner && (
              <a href={banner.link_url ?? "#"} className="relative mt-8 block -mx-4 md:-mx-6 xl:-mx-10">
                <img src={bannerImgSrc(banner)} alt={banner.title ?? group.name} className="block h-auto w-full" />
                {banner.title && (
                  <div className="absolute inset-0 flex items-end bg-black/45 p-6 md:p-10">
                    <p className="font-[var(--font-heading)] font-bold text-2xl leading-tight text-white md:text-4xl">
                      {banner.title}
                    </p>
                  </div>
                )}
              </a>
            )}
          </section>
        );
      })}

      {middleSection}

      {/* Editorial split */}
      <section className="w-full bg-white pt-16 pb-8 md:pt-24 md:pb-16">
        <div className="grid min-h-[640px] grid-cols-1 lg:grid-cols-2">
          <div className="relative min-h-[420px] lg:min-h-[640px]">
            <Image
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=2400&q=90"
              alt="Ellena Cosmetics campaign styling"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#2B2B2B]/20" />
          </div>
          <div className="flex min-h-[420px] items-center justify-end bg-[#FFFDF9] px-8 py-16 sm:px-12 md:px-16 lg:min-h-[640px] lg:px-24 xl:px-32">
            <div className="max-w-[420px] lg:mr-8 xl:mr-12">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#C9A227]">Beauty film</p>
              <h3 className="mt-4 text-4xl font-black uppercase leading-[1.08] tracking-tight text-[#2B2B2B] sm:text-5xl">
                Watch the campaign styling story.
              </h3>
              <p className="mt-6 text-base font-medium leading-7 text-neutral-700 sm:text-lg">
                A cinematic promo section that frames mood, shade, texture, and movement in a sharper editorial split-screen layout.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-8 h-12 bg-[#C9A227] px-10 text-sm font-bold uppercase tracking-wide text-[#2B2B2B] hover:bg-[#C9A227]/85"
              >
                <Link href="/shop">Shop Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom banners */}
      {bottomBanners.length > 0 && (
        <section className="w-full pb-8 pt-0 md:pb-12">
          {bottomBanners.length >= 2 ? (
            <div className="grid gap-5 px-4 md:grid-cols-2 md:px-6 xl:px-10">
              {bottomBanners.slice(0, 2).map((b) => (
                <a
                  key={b.id}
                  href={b.link_url ?? "#"}
                  className="relative block h-[240px] overflow-hidden rounded-2xl bg-stone-100 shadow-[0_18px_50px_rgba(42,33,31,0.08)] md:h-[320px]"
                >
                  <img
                    src={bannerImgSrc(b)}
                    alt={b.title ?? ""}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                  {b.title && (
                    <div className="absolute inset-0 flex items-end bg-black/45 p-5 text-white">
                      <p className="font-[var(--font-heading)] font-bold text-2xl leading-tight">{b.title}</p>
                    </div>
                  )}
                </a>
              ))}
            </div>
          ) : (
            <div className="px-4 md:px-6 xl:px-10">
              <a
                href={bottomBanners[0].link_url ?? "#"}
                className="relative block h-[240px] overflow-hidden rounded-2xl bg-stone-100 shadow-[0_18px_50px_rgba(42,33,31,0.08)] md:h-[320px]"
              >
                <img
                  src={bannerImgSrc(bottomBanners[0])}
                  alt={bottomBanners[0].title ?? ""}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
                {bottomBanners[0].title && (
                  <div className="absolute inset-0 flex items-end bg-black/45 p-5 text-white">
                    <p className="font-[var(--font-heading)] font-bold text-2xl leading-tight">{bottomBanners[0].title}</p>
                  </div>
                )}
              </a>
            </div>
          )}
        </section>
      )}

      {/* Testimonials */}
      <section className="container-shell px-4 md:px-6 xl:px-10 py-8 md:py-16">
        <SectionIntro
          eyebrow="Community proof"
          title="What customers say after the first routine."
          body=""
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {testimonials.map((item) => (
            <Card
              key={item.author}
              className="rounded-2xl border-[#F5E6DA]/60 bg-white/90 p-7 shadow-[0_18px_45px_rgba(42,33,31,0.06)] backdrop-blur-sm"
            >
              <CardContent className="p-0">
                <div className="flex gap-0.5 text-[#C9A227]">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-7 text-stone-700">&ldquo;{item.quote}&rdquo;</p>
                <Separator className="my-5 bg-[#F5E6DA]/60" />
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11 border border-[#F5E6DA]">
                    <AvatarImage src={item.avatar} alt={item.author} />
                    <AvatarFallback className="bg-[#F5E6DA] text-[#2B2B2B]">
                      {item.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-[#2B2B2B]">{item.author}</p>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#C9A227]">{item.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Blog */}
      <section className="container-shell px-4 md:px-6 xl:px-10 py-8 md:py-16">
        <SectionIntro
          eyebrow="From the journal"
          title="Editorial content that keeps discovery and education inside the store."
          body="Tutorials, beauty tips, and founder stories live as a discover tab extension instead of an afterthought."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Card
              key={post.slug}
              className="group overflow-hidden rounded-2xl border-[#F5E6DA]/60 bg-white p-0 shadow-[0_18px_50px_rgba(42,33,31,0.06)] transition hover:shadow-[0_24px_60px_rgba(42,33,31,0.10)]"
            >
              <div className="relative aspect-[1.35] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
                <Badge className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#2B2B2B] hover:bg-white">
                  {post.tag}
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-[var(--font-heading)] font-bold leading-snug text-[#2B2B2B]">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">{post.excerpt}</p>
                <Button
                  asChild
                  variant="link"
                  className="mt-3 h-auto px-0 text-[#C9A227] hover:text-[#2B2B2B]"
                >
                  <Link href="/blog">Read more →</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-shell px-4 md:px-6 xl:px-10 pb-16 pt-8 md:pb-24 md:pt-16">
        <div className="overflow-hidden rounded-3xl border border-[#C9A227]/30 bg-[#F5E6DA] px-6 py-10 shadow-[0_24px_60px_rgba(42,33,31,0.08)] md:px-12 md:py-14">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.34em] text-[#C9A227]">Newsletter</p>
              <h3 className="mt-4 font-[var(--font-heading)] font-bold text-4xl leading-tight text-balance text-[#2B2B2B]">
                Stay close to drops, shade launches, and founder edits.
              </h3>
            </div>
            <form onSubmit={handleSubscribe} className="grid gap-3 md:grid-cols-[1fr_auto]">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="h-14 border-[#C9A227]/30 bg-white text-[#2B2B2B] focus-visible:border-[#C9A227] focus-visible:ring-[#C9A227]/30"
              />
              <Button
                type="submit"
                size="lg"
                className="h-14 bg-[#C9A227] px-8 text-sm font-bold uppercase tracking-[0.18em] text-[#2B2B2B] hover:bg-[#C9A227]/85"
              >
                Join now
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────
export function SiteFooter() {
  const siteSettings = useSiteSettings();
  const footerLogoSrc = logoSrc(siteSettings?.logo_url);
  return (
    <Footer7
      logo={
        footerLogoSrc
          ? { url: "/", src: footerLogoSrc, alt: "Logo", title: "ELLENA", subtitle: "Cosmetics" }
          : undefined
      }
    />
  );
}
