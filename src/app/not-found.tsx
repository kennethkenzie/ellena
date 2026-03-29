import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-shell px-4 md:px-6 xl:px-10 py-24">
      <div className="border border-black/5 bg-white/90 p-10 text-center shadow-[0_24px_70px_rgba(17,12,10,0.06)]">
        <p className="text-xs font-bold uppercase tracking-[0.34em] text-stone-500">404</p>
        <h1 className="mt-4 font-[var(--font-heading)] text-6xl leading-none text-stone-950">The product page could not be found.</h1>
        <Link href="/shop" className="mt-8 inline-flex bg-stone-950 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white">
          Back to shop
        </Link>
      </div>
    </main>
  );
}
