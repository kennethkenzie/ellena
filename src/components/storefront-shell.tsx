"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { blogPosts, categoryHighlights, campaignBlocks, featuredCollections, heroStats, navGroups, products, testimonials } from "@/lib/store-data";
import { useStore } from "@/components/providers/store-provider";
import { cn, formatCurrency } from "@/lib/utils";

function NavFlyout({ index }: { index: number }) {
  const group = navGroups[index];
  const columns = Array.from({ length: Math.ceil(group.links.length / 3) }, (_, columnIndex) =>
    group.links.slice(columnIndex * 3, columnIndex * 3 + 3),
  );

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.22 }} className="absolute inset-x-0 top-full z-40 hidden border-b border-black/5 bg-white/95 shadow-[0_30px_60px_rgba(17,12,10,0.09)] backdrop-blur xl:block">
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
        <div className={cn("overflow-hidden border border-black/5 bg-gradient-to-br p-6 text-stone-900", group.promo.tone)}>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-600">{group.promo.eyebrow}</p>
          <h3 className="mt-4 font-[var(--font-heading)] text-4xl leading-none text-balance">{group.promo.heading}</h3>
          <p className="mt-4 max-w-sm text-sm leading-6 text-stone-700">{group.promo.body}</p>
          <Link href="/shop" className="mt-6 inline-flex border border-black/10 bg-white/80 px-5 py-2 text-sm font-semibold">Shop the edit</Link>
        </div>
      </div>
    </motion.div>
  );
}

export function SiteHeader() {
  const { cart, wishlist, query, setQuery } = useStore();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const suggestions = useMemo(() => products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5), [query]);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/75 backdrop-blur-xl">
      <div className="bg-[#d895b6] px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-white">Complimentary Kampala delivery over {formatCurrency(250000)}</div>
      <div className="container-shell relative px-4 md:px-6 xl:px-10">
        <div className="flex items-center gap-3 py-5">
          <button type="button" onClick={() => setMobileOpen(true)} className="inline-flex h-11 w-11 items-center justify-center border border-black/10 xl:hidden" aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <Link href="/" className="mr-4 shrink-0">
            <p className="font-[var(--font-heading)] text-3xl leading-none tracking-[0.1em] text-stone-950">ELLENA</p>
            <p className="-mt-1 text-[10px] font-semibold uppercase tracking-[0.45em] text-stone-500">Cosmetics</p>
          </Link>
          <nav className="hidden items-center gap-6 xl:flex" onMouseLeave={() => setActiveIndex(null)}>
            {navGroups.map((group, index) => (
              <button key={group.title} type="button" onMouseEnter={() => setActiveIndex(index)} className={cn("relative py-3 text-[12px] font-bold uppercase tracking-[0.24em] text-stone-700 transition hover:text-black", activeIndex === index && "text-black")}>{group.title}</button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden min-w-[18rem] md:block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search foundation, serum, body oil..." className="h-11 w-full border border-black/8 bg-stone-100/70 pl-11 pr-4 text-sm outline-none transition focus:border-amber-500/40 focus:bg-white" />
              <AnimatePresence>
                {query && suggestions.length > 0 ? (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute left-0 right-0 top-[calc(100%+0.75rem)] overflow-hidden border border-black/5 bg-white p-3 shadow-[0_24px_60px_rgba(17,12,10,0.12)]">
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
            <Link href="/wishlist" className="relative inline-flex h-11 w-11 items-center justify-center border border-black/10">
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 ? <span className="absolute -right-1 -top-1 bg-stone-950 px-1.5 py-0.5 text-[10px] font-bold text-white">{wishlist.length}</span> : null}
            </Link>
            <Link href="/cart" className="relative inline-flex h-11 w-11 items-center justify-center border border-black/10 bg-stone-950 text-white">
              <ShoppingBag className="h-5 w-5" />
              {cart.length > 0 ? <span className="absolute -right-1 -top-1 bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold text-stone-950">{cart.length}</span> : null}
            </Link>
          </div>
        </div>
        <AnimatePresence>{activeIndex !== null ? <NavFlyout index={activeIndex} /> : null}</AnimatePresence>
      </div>
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="xl:hidden">
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} className="glass-panel fixed inset-y-0 left-0 z-50 w-[88vw] max-w-sm overflow-y-auto border-r border-black/5 bg-white/92 p-5 shadow-[0_30px_80px_rgba(17,12,10,0.12)]">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="font-[var(--font-heading)] text-3xl">ELLENA</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-stone-500">Cosmetics</p>
                </div>
                <button type="button" onClick={() => setMobileOpen(false)} className="inline-flex h-11 w-11 items-center justify-center border border-black/10"><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-5">
                {navGroups.map((group) => (
                  <div key={group.title} className="border border-black/5 bg-white/75 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-500">{group.title}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-stone-700">
                      {group.links.slice(0, 6).map((link) => (
                        <Link key={link} href="/shop" onClick={() => setMobileOpen(false)} className="bg-stone-100 px-3 py-2">{link}</Link>
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

export function ProductCard({ slug }: { slug: string }) {
  const product = products.find((entry) => entry.slug === slug)!;
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const wished = wishlist.includes(product.slug);

  return (
    <motion.article whileHover={{ y: -6 }} className="group overflow-hidden border border-black/5 bg-white shadow-[0_24px_70px_rgba(17,12,10,0.08)]">
      <div className="relative p-4">
        <div className={cn("relative flex aspect-[0.9] items-end overflow-hidden bg-gradient-to-br p-5", product.accent)}>
          <div className={cn("absolute inset-x-6 top-6 h-24 blur-3xl", product.heroTone)} />
          <div className="relative z-10 w-full">
            <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-600"><span>{product.subcategory}</span>{product.badge ? <span>{product.badge}</span> : null}</div>
            <div className="border border-white/40 bg-white/65 px-4 py-5 shadow-lg backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-500">Ellena Cosmetics</p>
              <p className="mt-2 font-[var(--font-heading)] text-3xl leading-none text-stone-950">{product.name}</p>
            </div>
          </div>
        </div>
        <button type="button" onClick={() => toggleWishlist(product.slug)} className={cn("absolute right-8 top-8 inline-flex h-11 w-11 items-center justify-center border border-black/5 bg-white/90 text-stone-700 shadow-sm transition", wished && "bg-stone-950 text-white")}><Heart className="h-4 w-4" /></button>
      </div>
      <div className="px-5 pb-5 pt-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href={`/product/${product.slug}`} className="text-lg font-semibold text-stone-950">{product.name}</Link>
            <p className="mt-1 text-sm text-stone-500">{product.description}</p>
          </div>
          <p className="text-sm font-bold text-stone-950">{formatCurrency(product.price)}</p>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">{product.rating} / 5 rated</div>
          <motion.button whileTap={{ scale: 0.96 }} type="button" onClick={() => addToCart({ slug: product.slug, quantity: 1, shade: product.shades[0] })} className="bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800">Add to cart</motion.button>
        </div>
      </div>
    </motion.article>
  );
}

function SectionIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-500">{eyebrow}</p><h2 className="mt-3 max-w-2xl font-[var(--font-heading)] text-5xl leading-none text-balance text-stone-950 md:text-6xl">{title}</h2></div><p className="max-w-xl text-sm leading-7 text-stone-600 md:text-base">{body}</p></div>;
}

export function HomePage() {
  return (
    <main>
      <section className="container-shell px-4 md:px-6 xl:px-10 pb-8 pt-6 md:pb-16 md:pt-10">
        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="relative overflow-hidden bg-[linear-gradient(135deg,#201816_0%,#6f4f3c_40%,#c39a73_100%)] px-6 py-8 text-white shadow-[0_30px_90px_rgba(31,17,9,0.18)] md:px-10 md:py-12">
            <div className="absolute inset-y-0 right-0 hidden w-[46%] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0))] md:block" />
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/70">Luxury African Cosmetics</p>
            <h1 className="mt-4 max-w-3xl font-[var(--font-heading)] text-[3.2rem] leading-[0.88] text-balance md:text-[5.5rem]">Beauty rituals with global polish and Kampala confidence.</h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/80 md:text-base">A premium cosmetics destination inspired by campaign-led beauty commerce: shade-driven makeup, glow-first skincare, crown care, and body rituals built for modern luxury.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/shop" className="bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-stone-950">Shop now</Link><Link href="/about" className="border border-white/25 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white">Discover the brand</Link></div>
            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">{heroStats.map((stat) => <div key={stat.label} className="border border-white/15 bg-white/8 px-4 py-4 backdrop-blur"><p className="font-[var(--font-heading)] text-4xl leading-none">{stat.value}</p><p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/70">{stat.label}</p></div>)}</div>
          </motion.div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-1">{featuredCollections.map((item) => <div key={item.title} className={cn("overflow-hidden bg-gradient-to-br p-6 shadow-[0_20px_60px_rgba(17,12,10,0.08)]", item.tone)}><div className="h-full border border-white/15 bg-white/14 p-6 backdrop-blur"><p className="text-xs font-bold uppercase tracking-[0.3em] text-white/75">Collection</p><h3 className="mt-4 font-[var(--font-heading)] text-4xl leading-none text-white">{item.title}</h3><p className="mt-4 max-w-xs text-sm leading-6 text-white/80">{item.body}</p><Link href="/shop" className="mt-6 inline-flex bg-white px-5 py-2.5 text-sm font-semibold text-stone-950">Explore</Link></div></div>)}</div>
        </div>
      </section>
      <section className="container-shell px-4 md:px-6 xl:px-10 py-8 md:py-16"><SectionIntro eyebrow="Shop by ritual" title="Build a routine across makeup, skin, hair, and body." body="This category strip mirrors premium beauty merchandising: visual, quick to scan, and mobile-first with strong storytelling cues." /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{categoryHighlights.map((category) => <Link key={category.name} href="/shop" className={cn("group relative overflow-hidden bg-gradient-to-br p-6 text-white shadow-[0_18px_50px_rgba(17,12,10,0.08)]", category.tone)}><div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.22),_transparent_40%)]" /><div className="relative flex h-full min-h-52 flex-col justify-between"><div className="inline-flex h-16 w-16 items-center justify-center border border-white/20 bg-white/10 text-sm font-bold uppercase tracking-[0.22em] backdrop-blur">{category.name.slice(0, 2)}</div><div><p className="text-3xl font-[var(--font-heading)] leading-none">{category.name}</p><p className="mt-2 text-sm text-white/80">{category.caption}</p><p className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-white/70">{category.count}</p></div></div></Link>)}</div></section>
      <section className="container-shell px-4 md:px-6 xl:px-10 py-8 md:py-16"><SectionIntro eyebrow="Best of Ellena Cosmetics" title="Featured formulas and hero products with premium spacing." body="The product modules are designed to feel editorial rather than purely functional, with luxe gradients, shadow depth, and direct add-to-cart actions." /><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{products.slice(0, 8).map((product) => <ProductCard key={product.slug} slug={product.slug} />)}</div></section>
      <section className="container-shell grid gap-5 px-4 py-8 md:grid-cols-2 md:py-16"><div className={cn("overflow-hidden bg-gradient-to-br p-8 text-white shadow-[0_24px_60px_rgba(17,12,10,0.12)]", campaignBlocks[0].tone)}><p className="text-xs font-bold uppercase tracking-[0.32em] text-white/70">{campaignBlocks[0].eyebrow}</p><h3 className="mt-5 max-w-lg font-[var(--font-heading)] text-5xl leading-none text-balance">{campaignBlocks[0].title}</h3><p className="mt-5 max-w-md text-sm leading-7 text-white/82">{campaignBlocks[0].body}</p><Link href="/shop" className="mt-8 inline-flex bg-white px-5 py-3 text-sm font-semibold text-stone-950">Shop complexion</Link></div><div className={cn("overflow-hidden border border-black/5 bg-gradient-to-br p-8 shadow-[0_24px_60px_rgba(17,12,10,0.08)]", campaignBlocks[1].tone)}><p className="text-xs font-bold uppercase tracking-[0.32em] text-stone-500">{campaignBlocks[1].eyebrow}</p><h3 className="mt-5 max-w-lg font-[var(--font-heading)] text-5xl leading-none text-balance text-stone-950">{campaignBlocks[1].title}</h3><p className="mt-5 max-w-md text-sm leading-7 text-stone-600">{campaignBlocks[1].body}</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/product/velvet-body-creme" className="bg-stone-950 px-5 py-3 text-sm font-semibold text-white">Shop body</Link><Link href="/product/amber-bloom-mist" className="border border-black/10 px-5 py-3 text-sm font-semibold text-stone-950">Layer fragrance</Link></div></div></section>
      <section className="container-shell px-4 md:px-6 xl:px-10 py-8 md:py-16"><div className="overflow-hidden border border-black/5 bg-stone-950 px-6 py-7 text-white md:px-10 md:py-10"><div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.32em] text-white/60">Beauty film</p><h3 className="mt-4 font-[var(--font-heading)] text-5xl leading-none text-balance">Watch the campaign styling story.</h3><p className="mt-5 max-w-md text-sm leading-7 text-white/75">A cinematic promo section adds the editorial atmosphere of premium beauty brands without needing backend video infrastructure on day one.</p></div><div className="relative aspect-video overflow-hidden border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_35%),linear-gradient(135deg,#44302b,#9b7353,#d3ad88)] p-6"><div className="absolute inset-6 border border-white/15 bg-black/15 backdrop-blur-sm" /><div className="relative z-10 flex h-full flex-col justify-between"><div className="inline-flex w-fit items-center gap-2 bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/80"><Sparkles className="h-3.5 w-3.5" />Glow screen test</div><div><p className="font-[var(--font-heading)] text-4xl leading-none text-white">Ellena Cosmetics Film 01</p><p className="mt-2 text-sm text-white/70">Mood, shade, texture, and movement captured in a hero-ready frame.</p></div></div></div></div></div></section>
      <section className="container-shell px-4 md:px-6 xl:px-10 py-8 md:py-16"><SectionIntro eyebrow="Community proof" title="What customers say after the first routine." body="A premium commerce homepage still needs trust-building modules. These testimonials are placed as social proof between merchandising and content blocks." /><div className="grid gap-4 lg:grid-cols-3">{testimonials.map((item) => <div key={item.author} className="border border-black/5 bg-white/90 p-7 shadow-[0_18px_45px_rgba(17,12,10,0.06)]"><p className="font-[var(--font-heading)] text-3xl leading-none text-stone-950">&ldquo;</p><p className="mt-4 text-sm leading-7 text-stone-700">{item.quote}</p><p className="mt-6 text-sm font-semibold text-stone-950">{item.author}</p><p className="text-xs uppercase tracking-[0.24em] text-stone-500">{item.role}</p></div>)}</div></section>
      <section className="container-shell px-4 md:px-6 xl:px-10 py-8 md:py-16"><SectionIntro eyebrow="From the journal" title="Editorial content that keeps discovery and education inside the store." body="Tutorials, beauty tips, and founder stories live as a discover tab extension instead of an afterthought." /><div className="grid gap-4 lg:grid-cols-3">{blogPosts.map((post, index) => <article key={post.slug} className="overflow-hidden border border-black/5 bg-white shadow-[0_18px_50px_rgba(17,12,10,0.07)]"><div className={cn("aspect-[1.25] bg-gradient-to-br", index % 2 === 0 ? "from-amber-100 via-stone-50 to-orange-100" : "from-stone-900 via-stone-700 to-rose-700")} /><div className="p-6"><p className="text-xs font-bold uppercase tracking-[0.28em] text-stone-500">{post.tag}</p><h3 className="mt-3 text-2xl font-[var(--font-heading)] leading-none text-stone-950">{post.title}</h3><p className="mt-4 text-sm leading-7 text-stone-600">{post.excerpt}</p><Link href="/blog" className="mt-6 inline-flex border border-black/10 px-4 py-2 text-sm font-semibold">Read more</Link></div></article>)}</div></section>
      <section className="container-shell px-4 md:px-6 xl:px-10 pb-16 pt-8 md:pb-24 md:pt-16"><div className="overflow-hidden border border-black/5 bg-[linear-gradient(135deg,#fbf7f1_0%,#f2e6d6_100%)] px-6 py-8 shadow-[0_24px_60px_rgba(17,12,10,0.08)] md:px-10 md:py-12"><div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.34em] text-stone-500">Newsletter</p><h3 className="mt-4 font-[var(--font-heading)] text-5xl leading-none text-balance text-stone-950">Stay close to drops, shade launches, and founder edits.</h3></div><form className="grid gap-3 md:grid-cols-[1fr_auto]"><input className="h-14 border border-black/10 bg-white px-5 outline-none" placeholder="Email address" /><button type="submit" className="h-14 bg-stone-950 px-7 text-sm font-bold uppercase tracking-[0.18em] text-white">Join now</button></form></div></div></section>
    </main>
  );
}

export function SiteFooter() {
  return <footer className="border-t border-black/5 bg-white/80"><div className="container-shell grid gap-10 px-4 py-12 md:grid-cols-4"><div><p className="font-[var(--font-heading)] text-4xl leading-none text-stone-950">ELLENA</p><p className="mt-2 text-xs font-bold uppercase tracking-[0.34em] text-stone-500">Cosmetics</p><p className="mt-4 text-sm leading-7 text-stone-600">Luxury cosmetics and skincare crafted with an African point of view and a global design standard.</p></div><div><p className="text-sm font-bold uppercase tracking-[0.24em] text-stone-500">Shop</p><div className="mt-4 space-y-3 text-sm text-stone-700"><Link href="/shop">Makeup</Link><Link href="/shop">Skincare</Link><Link href="/shop">Hair</Link><Link href="/shop">Fragrance</Link></div></div><div><p className="text-sm font-bold uppercase tracking-[0.24em] text-stone-500">Company</p><div className="mt-4 space-y-3 text-sm text-stone-700"><Link href="/about">About</Link><Link href="/blog">Journal</Link><Link href="/account">Account</Link><Link href="/dashboard">Dashboard</Link></div></div><div><p className="text-sm font-bold uppercase tracking-[0.24em] text-stone-500">Visit</p><p className="mt-4 text-sm leading-7 text-stone-600">Plot 12, Nakasero Lane, Kampala<br />Mon - Sat, 9AM to 8PM</p></div></div></footer>;
}

