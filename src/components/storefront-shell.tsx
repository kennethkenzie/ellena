"use client";

import { Footer7 } from "@/components/ui/footer-7";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { blogPosts, navGroups, testimonials } from "@/lib/store-data";
import { useStorefrontProducts, type StorefrontProduct } from "@/lib/storefront-products";
import { useStore } from "@/components/providers/store-provider";
import { cn, formatCurrency } from "@/lib/utils";
import { HeroCarousel } from "@/components/hero-carousel";
import { useStorefrontCategories } from "@/lib/storefront-categories";
import { useSiteSettings, logoSrc } from "@/lib/use-site-settings";
import { apiGetBanners, type ApiBanner, API_ORIGIN } from "@/lib/api";

function NavFlyout({ index }: { index: number }) {
  const group = navGroups[index];
  const columns = Array.from({ length: Math.ceil(group.links.length / 3) }, (_, columnIndex) =>
    group.links.slice(columnIndex * 3, columnIndex * 3 + 3),
  );

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.22 }} className="absolute inset-x-0 top-full z-40 hidden border-b border-black/5 bg-white/95 shadow-[0_30px_60px_rgba(17,12,10,0.09)] backdrop-blur lg:block">
      <div className="container-shell grid grid-cols-[1.7fr_0.95fr] gap-8 px-4 py-8 md:px-6 xl:px-10">
        <div className="grid gap-6 md:grid-cols-3">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="space-y-3">
              {column.map((link) => (
                <Link key={link} href="/shop" className="block text-sm font-medium text-stone-700 transition hover:text-black">{link}</Link>
              ))}
            </div>
          ))}
        </div>
        <div className={cn("overflow-hidden rounded-lg border border-black/5 bg-gradient-to-br p-6 text-stone-900", group.promo.tone)}>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-600">{group.promo.eyebrow}</p>
          <h3 className="mt-4 font-[var(--font-heading)] font-bold text-2xl leading-none text-balance">{group.promo.heading}</h3>
          <p className="mt-4 max-w-sm text-sm leading-6 text-stone-700">{group.promo.body}</p>
          <Link href="/shop" className="mt-6 inline-flex rounded-md border border-black/10 bg-white/80 px-5 py-2 text-sm font-semibold">Shop the edit</Link>
        </div>
      </div>
    </motion.div>
  );
}

export function SiteHeader() {
  const { cart, wishlist, query, setQuery } = useStore();
  const { products } = useStorefrontProducts();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const siteSettings = useSiteSettings();
  const logoUrl = logoSrc(siteSettings?.logo_url);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestions = useMemo(
    () => products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5),
    [products, query],
  );
  useEffect(() => () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
  }, []);

  function openFlyout(index: number) {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveIndex(index);
  }

  function scheduleFlyoutClose() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setActiveIndex(null);
      closeTimerRef.current = null;
    }, 180);
  }
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/75 backdrop-blur-xl">
      <div className="bg-[#d895b6] px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-white">Complimentary Kampala delivery over {formatCurrency(250000)}</div>
      <div className="container-shell relative px-4 md:px-6 xl:px-10" onMouseLeave={scheduleFlyoutClose}>
        <div className="flex items-center gap-3 py-5">
          <button type="button" onClick={() => setMobileOpen(true)} className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-black/10 lg:hidden" aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <Link href="/" className="mr-4 shrink-0">
            {logoUrl ? (
              <Image src={logoUrl} alt="Logo" width={120} height={40} className="h-10 w-auto object-contain" />
            ) : (
              <>
                <p className="font-[var(--font-heading)] font-bold text-2xl leading-none tracking-[0.1em] text-stone-950">ELLENA</p>
                <p className="-mt-1 text-[10px] font-semibold uppercase tracking-[0.45em] text-stone-500">Cosmetics</p>
              </>
            )}
          </Link>
          <nav className="hidden items-center gap-6 lg:flex" onMouseEnter={() => { if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null; } }}>
            {navGroups.map((group, index) => (
              <button key={group.title} type="button" onMouseEnter={() => openFlyout(index)} className={cn("relative py-3 text-[12px] font-bold uppercase tracking-[0.24em] text-stone-700 transition hover:text-black", activeIndex === index && "text-black")}>{group.title}</button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden min-w-[18rem] md:block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search foundation, serum, body oil..." className="h-11 w-full rounded-md border border-black/8 bg-stone-100/70 pl-11 pr-4 text-sm outline-none transition focus:border-amber-500/40 focus:bg-white" />
              <AnimatePresence>
                {query && suggestions.length > 0 ? (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute left-0 right-0 top-[calc(100%+0.75rem)] overflow-hidden rounded-lg border border-black/5 bg-white p-3 shadow-[0_24px_60px_rgba(17,12,10,0.12)]">
                    {suggestions.map((product) => (
                      <Link key={product.slug} href={`/product/${product.slug}`} onClick={() => setQuery("")} className="flex items-center gap-3 px-3 py-3 transition hover:bg-stone-50">
                        <div className={cn("h-12 w-12 bg-gradient-to-br", product.accent)} />
                        <div>
                          <p className="text-sm font-semibold text-stone-900">{product.name}</p>
                          <p className="text-xs text-stone-500">{product.subcategory}</p>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            <Link href="/wishlist" className="relative inline-flex h-11 w-11 items-center justify-center rounded-lg border border-black/10">
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 ? <span className="absolute -right-1 -top-1 bg-stone-950 px-1.5 py-0.5 text-[10px] font-bold text-white">{wishlist.length}</span> : null}
            </Link>
            <Link href="/cart" className="relative inline-flex h-11 w-11 items-center justify-center rounded-lg border border-black/10 bg-white text-stone-900 shadow-sm transition hover:bg-stone-50">
              <ShoppingBag className="h-5 w-5" />
              {cart.length > 0 ? <span className="absolute -right-1 -top-1 rounded-full bg-stone-950 px-1.5 py-0.5 text-[10px] font-bold text-white">{cart.length}</span> : null}
            </Link>
          </div>
        </div>
        <AnimatePresence>{activeIndex !== null ? <NavFlyout index={activeIndex} /> : null}</AnimatePresence>
      </div>
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden">
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} className="glass-panel fixed inset-y-0 left-0 z-50 w-[88vw] max-w-sm overflow-y-auto border-r border-black/5 bg-white/92 p-5 shadow-[0_30px_80px_rgba(17,12,10,0.12)]">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  {logoUrl ? (
                    <Image src={logoUrl} alt="Logo" width={120} height={40} className="h-10 w-auto object-contain" />
                  ) : (
                    <>
                      <p className="font-[var(--font-heading)] font-bold text-3xl">ELLENA</p>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-stone-500">Cosmetics</p>
                    </>
                  )}
                </div>
                <button type="button" onClick={() => setMobileOpen(false)} className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-black/10"><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-5">
                {navGroups.map((group) => (
                  <div key={group.title} className="rounded-lg border border-black/5 bg-white/75 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-500">{group.title}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-stone-700">
                      {group.links.slice(0, 6).map((link) => (
                        <Link key={link} href="/shop" onClick={() => setMobileOpen(false)} className="rounded bg-stone-100 px-3 py-2">{link}</Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <button type="button" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-stone-950/30" aria-label="Close menu" />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

export function ProductCard({ product }: { product: StorefrontProduct }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const wished = wishlist.includes(product.slug);
  return (
    <motion.article whileHover={{ y: -6 }} className="group overflow-hidden rounded-xl border border-black/5 bg-white shadow-[0_24px_70px_rgba(17,12,10,0.08)]">
      <div className="relative">
        <div className="relative aspect-[0.9] overflow-hidden rounded-xl">
          <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
          {product.badge && (
            <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-stone-950 shadow-sm">
              {product.badge}
            </span>
          )}
        </div>
        <button type="button" onClick={() => toggleWishlist(product.slug)} className={cn("absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/5 bg-white text-stone-700 shadow-sm transition", wished && "bg-stone-950 text-white")}><Heart className="h-4 w-4" /></button>
      </div>
      <div className="px-4 pb-5 pt-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href={`/product/${product.slug}`} className="text-lg font-semibold text-stone-950">{product.name}</Link>
            <p className="mt-1 line-clamp-2 text-sm text-stone-500">{product.description}</p>
          </div>
          <p className="text-sm font-bold text-stone-950">{formatCurrency(product.price)}</p>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">{product.rating} / 5 rated</div>
          <motion.button whileTap={{ scale: 0.96 }} type="button" onClick={() => addToCart({ slug: product.slug, quantity: 1, shade: product.shades[0] })} className="rounded-md bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800">Add to cart</motion.button>
        </div>
      </div>
    </motion.article>
  );
}

function SectionIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-500">{eyebrow}</p><h2 className="mt-3 max-w-2xl font-[var(--font-heading)] font-bold text-4xl leading-none text-balance text-stone-950 md:text-5xl">{title}</h2></div><p className="max-w-xl text-sm leading-7 text-stone-600 md:text-base">{body}</p></div>;
}

function bannerImgSrc(b: ApiBanner) {
  return b.image_url.startsWith('http') ? b.image_url : API_ORIGIN + b.image_url;
}

export function HomePage() {
  const { products } = useStorefrontProducts();
  const { featured: featuredCategories, campaigns: categoryCampaigns, campaignLayout } = useStorefrontCategories();
  const [categoryBanners, setCategoryBanners] = useState<ApiBanner[]>([]);
  const [middleBanners, setMiddleBanners] = useState<ApiBanner[]>([]);
  const [bottomBanners, setBottomBanners] = useState<ApiBanner[]>([]);

  useEffect(() => {
    apiGetBanners('category_top').then(setCategoryBanners).catch(() => {});
    apiGetBanners('home_middle').then(setMiddleBanners).catch(() => {});
    apiGetBanners('home_bottom').then(setBottomBanners).catch(() => {});
  }, []);

  const featuredProducts = useMemo(() => {
    const featured = products.filter((product) => product.featured);
    return (featured.length > 0 ? featured : products).slice(0, 8);
  }, [products]);
  const latestProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    }).slice(0, 8);
  }, [products]);

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

  const middleSection = middleBanners.length > 0
    ? (
      <section className="w-full pb-16 pt-8 md:pb-24 md:pt-16">
        {middleBanners.length >= 2
          ? <div className="grid gap-5 px-4 md:grid-cols-2 md:px-6 xl:px-10">{middleBanners.slice(0, 2).map((b) => <a key={b.id} href={b.link_url ?? '#'} className="relative block h-[320px] overflow-hidden bg-stone-100 shadow-[0_24px_60px_rgba(17,12,10,0.12)] md:h-[420px]"><img src={bannerImgSrc(b)} alt={b.title ?? ''} className="absolute inset-0 h-full w-full object-cover object-center" /></a>)}</div>
          : <a href={middleBanners[0].link_url ?? '#'} className="relative block h-[320px] overflow-hidden bg-stone-100 shadow-[0_24px_60px_rgba(17,12,10,0.12)] md:h-[420px] lg:h-[520px]"><img src={bannerImgSrc(middleBanners[0])} alt={middleBanners[0].title ?? ''} className="absolute inset-0 h-full w-full object-cover object-center" /></a>
        }
      </section>
    )
    : (
      <section className="w-full pb-16 pt-8 md:pb-24 md:pt-16">{campaignLayout === "split" ? <div className="grid gap-5 px-4 md:grid-cols-2 md:px-6 xl:px-10">{categoryCampaigns.slice(0, 2).map((category) => <div key={category.id} className="relative h-[320px] overflow-hidden bg-white shadow-[0_24px_60px_rgba(17,12,10,0.12)] md:h-[420px]"><img src={category.image} alt={category.name} className="absolute inset-0 h-full w-full object-cover object-center" /></div>)}</div> : categoryCampaigns[0] ? <div className="relative h-[320px] overflow-hidden bg-white shadow-[0_24px_60px_rgba(17,12,10,0.12)] md:h-[420px] lg:h-[520px]"><img src={categoryCampaigns[0].image} alt={categoryCampaigns[0].name} className="absolute inset-0 h-full w-full object-cover object-center" /></div> : null}</section>
    );

  return (
    <main>
      <HeroCarousel />
      <section className="container-shell px-4 md:px-6 xl:px-10 py-8 md:py-16"><SectionIntro eyebrow="Shop by ritual" title="Shop by categories" body="" /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{featuredCategories.map((category) => <Link key={category.id} href={category.slug} className="group relative overflow-hidden rounded-xl shadow-[0_18px_50px_rgba(17,12,10,0.08)]"><img src={category.image} alt={category.name} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" /><div className="relative flex h-full min-h-52 flex-col justify-end p-5 text-white"><p className="font-[var(--font-heading)] font-bold text-2xl leading-none">{category.name}</p><p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-white/60">{category.count}</p></div></Link>)}</div></section>
      <section className="container-shell px-4 md:px-6 xl:px-10 py-8 md:py-16"><SectionIntro eyebrow="Best of Ellena Cosmetics" title="Featured Products" body="" /><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{featuredProducts.map((product) => <ProductCard key={product.slug} product={product} />)}</div></section>
      <section className="container-shell px-4 md:px-6 xl:px-10 py-8 md:py-16"><SectionIntro eyebrow="New Arrivals" title="Latest Products" body="" /><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{latestProducts.map((product) => <ProductCard key={`latest-${product.slug}`} product={product} />)}</div></section>
      {categoryProductGroups.map((group) => {
        const banner = categoryBanners.find((b) => b.category_id === Number(group.id));
        return (
          <section key={group.id} className="container-shell px-4 md:px-6 xl:px-10 py-8 md:py-16">
            <SectionIntro eyebrow="Shop by category" title={group.name} body="" />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {group.items.map((product) => <ProductCard key={product.slug} product={product} />)}
            </div>
            <div className="mt-6">
              <Link href={group.slug} className="inline-flex rounded-md border border-black/10 px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50">View all {group.name}</Link>
            </div>
            {banner && (
              <a href={banner.link_url ?? '#'} className="relative mt-8 block -mx-4 md:-mx-6 xl:-mx-10">
                <img src={bannerImgSrc(banner)} alt={banner.title ?? group.name} className="w-full h-auto block" />
                {banner.title && (
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/20 to-transparent p-6 md:p-10">
                    <p className="font-[var(--font-heading)] font-bold text-2xl leading-none text-white md:text-4xl">{banner.title}</p>
                  </div>
                )}
              </a>
            )}
          </section>
        );
      })}
      {middleSection}
      <section className="w-full bg-white pt-16 pb-8 md:pt-24 md:pb-16">
        <div className="grid min-h-[640px] grid-cols-1 lg:grid-cols-2">
          <div className="relative min-h-[420px] lg:min-h-[640px]">
            <Image src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1600&q=85" alt="Ellena Cosmetics campaign styling" fill sizes="(max-width: 1024px) 100vw, 50vw" className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div className="flex min-h-[420px] items-center justify-end bg-white px-8 py-16 sm:px-12 md:px-16 lg:min-h-[640px] lg:px-24 xl:px-32">
            <div className="max-w-[420px] lg:mr-8 xl:mr-12">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-stone-500">Beauty film</p>
              <h3 className="mt-4 text-4xl font-black uppercase leading-[1.08] tracking-tight text-black sm:text-5xl">Watch the campaign styling story.</h3>
              <p className="mt-6 text-base font-medium leading-7 text-neutral-700 sm:text-lg">A cinematic promo section that frames mood, shade, texture, and movement in a sharper editorial split-screen layout.</p>
              <Link href="/shop" className="mt-8 inline-flex min-h-[48px] items-center justify-center bg-black px-10 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-neutral-800">Shop Now</Link>
            </div>
          </div>
        </div>
      </section>
      {bottomBanners.length > 0 && (
        <section className="w-full pb-8 pt-0 md:pb-12">
          {bottomBanners.length >= 2
            ? <div className="grid gap-5 px-4 md:grid-cols-2 md:px-6 xl:px-10">{bottomBanners.slice(0, 2).map((b) => <a key={b.id} href={b.link_url ?? '#'} className="relative block h-[240px] overflow-hidden rounded-xl bg-stone-100 shadow-[0_18px_50px_rgba(17,12,10,0.08)] md:h-[320px]"><img src={bannerImgSrc(b)} alt={b.title ?? ''} className="absolute inset-0 h-full w-full object-cover object-center" />{b.title && <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-5 text-white"><p className="font-[var(--font-heading)] font-bold text-2xl leading-none">{b.title}</p></div>}</a>)}</div>
            : <div className="px-4 md:px-6 xl:px-10"><a href={bottomBanners[0].link_url ?? '#'} className="relative block h-[240px] overflow-hidden rounded-xl bg-stone-100 shadow-[0_18px_50px_rgba(17,12,10,0.08)] md:h-[320px]"><img src={bannerImgSrc(bottomBanners[0])} alt={bottomBanners[0].title ?? ''} className="absolute inset-0 h-full w-full object-cover object-center" />{bottomBanners[0].title && <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-5 text-white"><p className="font-[var(--font-heading)] font-bold text-2xl leading-none">{bottomBanners[0].title}</p></div>}</a></div>
          }
        </section>
      )}
      <section className="container-shell px-4 md:px-6 xl:px-10 py-8 md:py-16"><SectionIntro eyebrow="Community proof" title="What customers say after the first routine." body="" /><div className="grid gap-4 lg:grid-cols-3">{testimonials.map((item) => <div key={item.author} className="rounded-xl border border-black/5 bg-white/90 p-7 shadow-[0_18px_45px_rgba(17,12,10,0.06)]"><p className="font-[var(--font-heading)] font-bold text-2xl leading-none text-stone-950">&ldquo;</p><p className="mt-4 text-sm leading-7 text-stone-700">{item.quote}</p><div className="mt-6 flex items-center gap-3"><div className="relative h-10 w-10 overflow-hidden rounded-full border border-black/8"><Image src={item.avatar} alt={item.author} fill sizes="40px" className="object-cover" /></div><div><p className="text-sm font-semibold text-stone-950">{item.author}</p><p className="text-xs uppercase tracking-[0.24em] text-stone-500">{item.role}</p></div></div></div>)}</div></section>
      <section className="container-shell px-4 md:px-6 xl:px-10 py-8 md:py-16"><SectionIntro eyebrow="From the journal" title="Editorial content that keeps discovery and education inside the store." body="Tutorials, beauty tips, and founder stories live as a discover tab extension instead of an afterthought." /><div className="grid gap-4 lg:grid-cols-3">{blogPosts.map((post) => <article key={post.slug} className="overflow-hidden rounded-xl border border-black/5 bg-white shadow-[0_18px_50px_rgba(17,12,10,0.07)]"><div className="relative aspect-[1.25] overflow-hidden"><Image src={post.image} alt={post.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition duration-500 hover:scale-105" /></div><div className="p-6"><p className="text-xs font-bold uppercase tracking-[0.28em] text-stone-500">{post.tag}</p><h3 className="mt-3 text-xl font-[var(--font-heading)] font-bold leading-none text-stone-950">{post.title}</h3><p className="mt-4 text-sm leading-7 text-stone-600">{post.excerpt}</p><Link href="/blog" className="mt-6 inline-flex rounded-md border border-black/10 px-4 py-2 text-sm font-semibold">Read more</Link></div></article>)}</div></section>
      <section className="container-shell px-4 md:px-6 xl:px-10 pb-16 pt-8 md:pb-24 md:pt-16"><div className="overflow-hidden rounded-xl border border-black/5 bg-[#d895b6] px-6 py-8 shadow-[0_24px_60px_rgba(17,12,10,0.08)] md:px-10 md:py-12"><div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.34em] text-white/70">Newsletter</p><h3 className="mt-4 font-[var(--font-heading)] font-bold text-4xl leading-none text-balance text-white">Stay close to drops, shade launches, and founder edits.</h3></div><form className="grid gap-3 md:grid-cols-[1fr_auto]"><input className="h-14 rounded-md border border-black/10 bg-white px-5 outline-none" placeholder="Email address" /><button type="submit" className="h-14 rounded-md bg-stone-950 px-7 text-sm font-bold uppercase tracking-[0.18em] text-white">Join now</button></form></div></div></section>
    </main>
  );
}

export function SiteFooter() {
  const siteSettings = useSiteSettings();
  const footerLogoSrc = logoSrc(siteSettings?.logo_url);
  return (
    <Footer7
      logo={footerLogoSrc ? { url: "/", src: footerLogoSrc, alt: "Logo", title: "ELLENA", subtitle: "Cosmetics" } : undefined}
    />
  );
}

























