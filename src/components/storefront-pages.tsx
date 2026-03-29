"use client";

import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Minus, Plus, Star } from "lucide-react";
import { motion } from "framer-motion";
import { blogPosts, getProduct, products } from "@/lib/store-data";
import { cn, formatCurrency } from "@/lib/utils";
import { ProductCard } from "@/components/storefront-shell";
import { useStore } from "@/components/providers/store-provider";

export function ShopPage() {
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [visible, setVisible] = useState(8);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    const base = category === "All" ? products : products.filter((product) => product.category === category);
    if (sort === "price-asc") return [...base].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...base].sort((a, b) => b.price - a.price);
    if (sort === "rating") return [...base].sort((a, b) => b.rating - a.rating);
    return base;
  }, [category, sort]);

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

  return (
    <main className="container-shell px-4 md:px-6 xl:px-10 py-10 md:py-16">
      <div className="border border-black/5 bg-white/85 p-6 shadow-[0_24px_70px_rgba(17,12,10,0.06)] md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.34em] text-stone-500">Shop</p>
        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-[var(--font-heading)] text-6xl leading-none text-stone-950">The Ellena Cosmetics edit</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">A premium catalogue designed around clean filtering, soft luxury spacing, and merchandising blocks that feel editorial rather than crowded.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {['All', 'Makeup', 'Skincare', 'Hair', 'Body', 'Fragrance'].map((item) => (
              <button key={item} type="button" onClick={() => { setCategory(item); setVisible(8); }} className={cn("border px-4 py-2 text-sm font-semibold", category === item ? "border-stone-950 bg-stone-950 text-white" : "border-black/10 bg-white text-stone-700")}>{item}</button>
            ))}
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-stone-700 outline-none">
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to high</option>
              <option value="price-desc">Price: High to low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
        </div>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{filtered.slice(0, visible).map((product) => <ProductCard key={product.slug} slug={product.slug} />)}</div>
      <div ref={loaderRef} className="mt-8 flex justify-center"><div className="border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-stone-500">{visible < filtered.length ? 'Loading more products...' : 'You have reached the full collection.'}</div></div>
    </main>
  );
}

export function ProductDetailPage({ slug }: { slug: string }) {
  const product = getProduct(slug);
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [shade, setShade] = useState(product?.shades[0] ?? "");

  if (!product) notFound();

  const related = products.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 4);

  return (
    <main className="container-shell px-4 md:px-6 xl:px-10 py-10 md:py-16">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-4 md:grid-cols-[0.18fr_0.82fr]">
          <div className="grid gap-3 md:grid-rows-3">{product.shades.map((option) => <button key={option} type="button" className="border border-black/8 bg-white/80 p-4 text-left text-xs font-bold uppercase tracking-[0.2em] text-stone-500">{option}</button>)}</div>
          <div className={cn("group relative aspect-[0.92] overflow-hidden border border-black/5 p-6 shadow-[0_24px_70px_rgba(17,12,10,0.08)]", product.heroTone)}><div className="absolute inset-0 transition duration-500 group-hover:scale-110 group-hover:opacity-90" /><div className="absolute inset-6 border border-white/35 bg-white/20 backdrop-blur-md" /><div className="relative z-10 flex h-full flex-col justify-between"><div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.24em] text-white/75"><span>{product.subcategory}</span><span>{product.badge ?? 'Signature'}</span></div><div className="border border-white/25 bg-white/20 p-6 backdrop-blur"><p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">Ellena Cosmetics</p><h1 className="mt-3 font-[var(--font-heading)] text-6xl leading-none text-white">{product.name}</h1></div></div></div>
        </div>
        <div className="border border-black/5 bg-white/90 p-6 shadow-[0_24px_70px_rgba(17,12,10,0.06)] md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-stone-500">{product.category}</p>
          <h2 className="mt-4 font-[var(--font-heading)] text-6xl leading-none text-stone-950">{product.name}</h2>
          <div className="mt-5 flex items-center gap-3 text-sm text-stone-600"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {product.rating} rating · {product.reviewCount} reviews</div>
          <p className="mt-5 text-3xl font-semibold text-stone-950">{formatCurrency(product.price)}</p>
          <p className="mt-5 text-sm leading-7 text-stone-600">{product.description}</p>
          <div className="mt-7"><p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-500">Choose shade / size</p><div className="mt-3 flex flex-wrap gap-3">{product.shades.map((option) => <button key={option} type="button" onClick={() => setShade(option)} className={cn("border px-4 py-2 text-sm font-semibold", shade === option ? "border-stone-950 bg-stone-950 text-white" : "border-black/10 bg-stone-50 text-stone-700")}>{option}</button>)}</div></div>
          <div className="mt-8 flex flex-wrap gap-3"><motion.button whileTap={{ scale: 0.96 }} type="button" onClick={() => addToCart({ slug: product.slug, quantity: 1, shade })} className="bg-stone-950 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white">Add to cart</motion.button><button type="button" onClick={() => toggleWishlist(product.slug)} className={cn("border px-6 py-3 text-sm font-bold uppercase tracking-[0.18em]", wishlist.includes(product.slug) ? "border-stone-950 bg-stone-950 text-white" : "border-black/10 text-stone-950")}>{wishlist.includes(product.slug) ? 'Saved' : 'Add to wishlist'}</button></div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">{['Long-wear', 'Cruelty-free', 'Global shipping'].map((point) => <div key={point} className="border border-black/6 bg-stone-50 p-4 text-sm font-semibold text-stone-700">{point}</div>)}</div>
        </div>
      </div>
      <section className="mt-12"><div className="mb-6 flex items-center justify-between"><h3 className="font-[var(--font-heading)] text-5xl leading-none text-stone-950">Related products</h3><Link href="/shop" className="border border-black/10 px-4 py-2 text-sm font-semibold">View all</Link></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{related.map((item) => <ProductCard key={item.slug} slug={item.slug} />)}</div></section>
    </main>
  );
}

export function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useStore();
  const entries = cart.map((item) => ({ ...item, product: getProduct(item.slug) })).filter((item) => item.product);
  const subtotal = entries.reduce((total, item) => total + item.product!.price * item.quantity, 0);

  return (
    <main className="container-shell px-4 md:px-6 xl:px-10 py-10 md:py-16">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="border border-black/5 bg-white/90 p-6 shadow-[0_24px_70px_rgba(17,12,10,0.06)] md:p-8">
          <h1 className="font-[var(--font-heading)] text-6xl leading-none text-stone-950">Cart</h1>
          <p className="mt-4 text-sm leading-7 text-stone-600">A streamlined bag experience with large tap targets and clear quantity editing.</p>
          <div className="mt-8 space-y-4">{entries.length === 0 ? <div className="border border-dashed border-black/10 bg-stone-50 p-8 text-sm text-stone-500">Your cart is empty. Start with the best sellers.</div> : null}{entries.map((entry) => <div key={`${entry.slug}-${entry.shade}`} className="flex flex-col gap-4 border border-black/6 bg-stone-50 p-5 md:flex-row md:items-center md:justify-between"><div><p className="text-lg font-semibold text-stone-950">{entry.product!.name}</p><p className="text-sm text-stone-500">{entry.shade}</p></div><div className="flex items-center gap-3"><div className="flex items-center border border-black/8 bg-white p-1"><button type="button" onClick={() => updateQuantity(entry.slug, entry.quantity - 1)} className="inline-flex h-9 w-9 items-center justify-center"><Minus className="h-4 w-4" /></button><span className="min-w-8 text-center text-sm font-semibold">{entry.quantity}</span><button type="button" onClick={() => updateQuantity(entry.slug, entry.quantity + 1)} className="inline-flex h-9 w-9 items-center justify-center"><Plus className="h-4 w-4" /></button></div><p className="w-28 text-right text-sm font-bold text-stone-950">{formatCurrency(entry.product!.price * entry.quantity)}</p><button type="button" onClick={() => removeFromCart(entry.slug)} className="border border-black/10 px-4 py-2 text-sm font-semibold">Remove</button></div></div>)}</div>
        </section>
        <aside className="h-fit border border-black/5 bg-stone-950 p-6 text-white shadow-[0_24px_70px_rgba(17,12,10,0.12)] md:p-8"><p className="text-xs font-bold uppercase tracking-[0.32em] text-white/60">Summary</p><div className="mt-6 space-y-4 text-sm text-white/80"><div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div><div className="flex justify-between"><span>Delivery</span><span>{formatCurrency(subtotal > 250000 ? 0 : 25000)}</span></div><div className="flex justify-between border-t border-white/10 pt-4 text-base font-semibold text-white"><span>Total</span><span>{formatCurrency(subtotal + (subtotal > 250000 ? 0 : 25000))}</span></div></div><Link href="/checkout" className="mt-8 inline-flex w-full justify-center bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-stone-950">Checkout</Link></aside>
      </div>
    </main>
  );
}

export function CheckoutPage() {
  const { cart, clearCart } = useStore();
  const router = useRouter();
  return <main className="container-shell px-4 md:px-6 xl:px-10 py-10 md:py-16"><div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"><section className="border border-black/5 bg-white/90 p-6 shadow-[0_24px_70px_rgba(17,12,10,0.06)] md:p-8"><h1 className="font-[var(--font-heading)] text-6xl leading-none text-stone-950">Checkout</h1><div className="mt-8 grid gap-4 md:grid-cols-2">{['First name', 'Last name', 'Email address', 'Phone number', 'Address', 'City'].map((field) => <input key={field} placeholder={field} className="h-14 border border-black/8 bg-stone-50 px-4 outline-none" />)}</div><button type="button" onClick={() => { clearCart(); router.push('/'); }} className="mt-8 bg-stone-950 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white">Place order</button></section><aside className="border border-black/5 bg-[linear-gradient(135deg,#fbf7f1_0%,#f1e3cf_100%)] p-6 shadow-[0_24px_70px_rgba(17,12,10,0.08)] md:p-8"><p className="text-xs font-bold uppercase tracking-[0.32em] text-stone-500">Order review</p><div className="mt-6 space-y-4">{cart.length === 0 ? <p className="text-sm text-stone-500">Your cart is currently empty.</p> : cart.map((item) => <div key={`${item.slug}-${item.shade}`} className="border border-black/6 bg-white/70 p-4 text-sm font-semibold text-stone-700">{getProduct(item.slug)?.name} &times; {item.quantity}</div>)}</div></aside></div></main>;
}

export function WishlistPage() {
  const { wishlist } = useStore();
  const entries = products.filter((product) => wishlist.includes(product.slug));
  return <main className="container-shell px-4 md:px-6 xl:px-10 py-10 md:py-16"><div className="mb-8 border border-black/5 bg-white/90 p-6 shadow-[0_24px_70px_rgba(17,12,10,0.06)] md:p-8"><h1 className="font-[var(--font-heading)] text-6xl leading-none text-stone-950">Wishlist</h1><p className="mt-4 text-sm leading-7 text-stone-600">Saved favourites stay one tap away from your cart.</p></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{entries.length === 0 ? <div className="border border-dashed border-black/10 bg-white/80 p-8 text-sm text-stone-500">No saved items yet.</div> : entries.map((product) => <ProductCard key={product.slug} slug={product.slug} />)}</div></main>;
}

export function AccountPage() {
  return <main className="container-shell px-4 md:px-6 xl:px-10 py-10 md:py-16"><div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]"><section className="border border-black/5 bg-stone-950 p-8 text-white shadow-[0_24px_70px_rgba(17,12,10,0.12)]"><p className="text-xs font-bold uppercase tracking-[0.32em] text-white/60">Ellena Circle</p><h1 className="mt-4 font-[var(--font-heading)] text-6xl leading-none">Account</h1><p className="mt-5 text-sm leading-7 text-white/75">Sign in to manage saved shades, reorder rituals, and track delivery status.</p></section><section className="border border-black/5 bg-white/90 p-8 shadow-[0_24px_70px_rgba(17,12,10,0.06)]"><div className="grid gap-4 md:grid-cols-2"><input placeholder="Email address" className="h-14 border border-black/8 bg-stone-50 px-4 outline-none" /><input placeholder="Password" type="password" className="h-14 border border-black/8 bg-stone-50 px-4 outline-none" /></div><button type="button" className="mt-6 bg-stone-950 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white">Sign in</button></section></div></main>;
}

export function BlogPage() {
  return <main className="container-shell px-4 md:px-6 xl:px-10 py-10 md:py-16"><div className="mb-8 border border-black/5 bg-white/90 p-6 shadow-[0_24px_70px_rgba(17,12,10,0.06)] md:p-8"><p className="text-xs font-bold uppercase tracking-[0.34em] text-stone-500">Discover</p><h1 className="mt-4 font-[var(--font-heading)] text-6xl leading-none text-stone-950">Beauty journal</h1></div><div className="grid gap-5 lg:grid-cols-3">{blogPosts.map((post, index) => <article key={post.slug} className="overflow-hidden border border-black/5 bg-white shadow-[0_18px_50px_rgba(17,12,10,0.07)]"><div className={cn("aspect-[1.1] bg-gradient-to-br", index === 1 ? "from-stone-950 via-stone-800 to-amber-700" : "from-amber-100 via-rose-50 to-stone-50")} /><div className="p-6"><p className="text-xs font-bold uppercase tracking-[0.28em] text-stone-500">{post.tag}</p><h2 className="mt-3 text-3xl font-[var(--font-heading)] leading-none text-stone-950">{post.title}</h2><p className="mt-4 text-sm leading-7 text-stone-600">{post.excerpt}</p></div></article>)}</div></main>;
}

export function AboutPage() {
  return <main className="container-shell px-4 md:px-6 xl:px-10 py-10 md:py-16"><div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]"><section className="border border-black/5 bg-[linear-gradient(135deg,#211816_0%,#7c5b45_45%,#d2a97e_100%)] p-8 text-white shadow-[0_24px_70px_rgba(17,12,10,0.12)]"><p className="text-xs font-bold uppercase tracking-[0.34em] text-white/65">About Ellena Cosmetics</p><h1 className="mt-4 font-[var(--font-heading)] text-6xl leading-none">African luxury with modern beauty discipline.</h1></section><section className="border border-black/5 bg-white/90 p-8 shadow-[0_24px_70px_rgba(17,12,10,0.06)]"><p className="text-sm leading-8 text-stone-600">Ellena Cosmetics is imagined as a premium cosmetics house for customers who want high-performance formulas, richer undertone sensitivity, and a shopping experience that feels global without losing regional identity. The visual system leans editorial and luxurious, while the component structure stays practical for future catalog, CMS, and checkout integrations.</p></section></div></main>;
}
