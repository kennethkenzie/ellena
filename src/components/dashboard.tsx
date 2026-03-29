"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Box,
  CreditCard,
  Eye,
  Home,
  LayoutGrid,
  Lock,
  Menu,
  Package,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Star,
  Store,
  Tag,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import { products } from "@/lib/store-data";
import { cn, formatCurrency } from "@/lib/utils";

const sidebarSections = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", icon: Home, active: true },
      { label: "Analytics", icon: TrendingUp },
      { label: "Customers", icon: Users },
    ],
  },
  {
    title: "Commerce",
    items: [
      { label: "Orders", icon: ShoppingBag },
      { label: "Products", icon: Package },
      { label: "Inventory", icon: Box },
      { label: "Discounts", icon: Tag },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Storefront", icon: Store },
      { label: "Settings", icon: Settings },
    ],
  },
];

const overviewCards = [
  { label: "Net revenue", value: formatCurrency(18450000), change: "+12.5%", note: "vs last month", icon: TrendingUp, accent: "from-amber-100 via-orange-50 to-white" },
  { label: "Orders today", value: "38", change: "+8.2%", note: "12 awaiting dispatch", icon: ShoppingBag, accent: "from-rose-100 via-stone-50 to-white" },
  { label: "Active customers", value: "3,642", change: "+18.7%", note: "repeat rate 34.2%", icon: Users, accent: "from-stone-100 via-amber-50 to-white" },
  { label: "Avg basket", value: formatCurrency(143700), change: "+4.9%", note: "bundle-led growth", icon: CreditCard, accent: "from-orange-50 via-white to-rose-50" },
];

const orderRows = [
  { id: "EC-10284", customer: "Achen Mukwaya", channel: "Online", city: "Kampala", total: 462000, status: "Delivered" },
  { id: "EC-10283", customer: "Tendo Nalubega", channel: "Instagram", city: "Entebbe", total: 189000, status: "Shipped" },
  { id: "EC-10282", customer: "Naomi Kato", channel: "Online", city: "Nairobi", total: 287000, status: "Processing" },
  { id: "EC-10281", customer: "Amara Ssemwogerere", channel: "TikTok Shop", city: "Kampala", total: 612000, status: "Delivered" },
  { id: "EC-10280", customer: "Grace Achieng", channel: "Online", city: "Jinja", total: 245000, status: "Shipped" },
  { id: "EC-10279", customer: "Faith Nakamya", channel: "WhatsApp", city: "Mbarara", total: 321000, status: "Processing" },
];

const trafficChannels = [
  { name: "Direct", value: "34%", detail: "High intent returning buyers" },
  { name: "Instagram", value: "27%", detail: "Influencer + UGC traffic" },
  { name: "TikTok", value: "21%", detail: "Strong lip oil and fragrance discovery" },
  { name: "Search", value: "18%", detail: "Brand and shade-match queries" },
];

const lowStock = [
  { name: "Ellena Soft Matte Foundation", detail: "Nile 420", stock: 4 },
  { name: "Glossed Lip Oil", detail: "Rose Nude", stock: 8 },
  { name: "Midnight Orchid Parfum", detail: "50 ml", stock: 3 },
];

const fulfillment = [
  { label: "Packed", value: 12, icon: Package },
  { label: "Out for delivery", value: 8, icon: Truck },
  { label: "Returns pending", value: 3, icon: Box },
];

const tasks = [
  { title: "Approve SPF campaign creative", owner: "Marketing", priority: "Today" },
  { title: "Recount fragrance inventory", owner: "Ops", priority: "High" },
  { title: "Review Kampala return reasons", owner: "CX", priority: "Today" },
];

const monthlySales = [42, 48, 62, 51, 58, 67, 72];

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em]",
        status === "Delivered" && "border-emerald-200 bg-emerald-50 text-emerald-700",
        status === "Shipped" && "border-amber-200 bg-amber-50 text-amber-700",
        status === "Processing" && "border-stone-200 bg-stone-100 text-stone-600",
      )}
    >
      {status}
    </span>
  );
}

function MiniSalesChart() {
  return (
    <div className="flex h-56 items-end gap-3">
      {monthlySales.map((value, index) => (
        <div key={index} className="flex flex-1 flex-col items-center gap-3">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${value}%` }}
            transition={{ duration: 0.55, delay: index * 0.04 }}
            className="w-full bg-[linear-gradient(180deg,#ddc4a6_0%,#5b4337_100%)]"
          />
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-stone-500">{"SONDJFM"[index]}</span>
        </div>
      ))}
    </div>
  );
}

function DashboardSidebar() {
  return (
    <aside className="border border-black/6 bg-[#f7efe4] p-5 shadow-[0_20px_60px_rgba(17,12,10,0.06)] xl:sticky xl:top-28 xl:h-[calc(100vh-9rem)] xl:overflow-y-auto">
      <div className="border-b border-black/8 pb-5">
        <p className="font-[var(--font-heading)] text-4xl leading-none text-stone-950">ELLENA</p>
        <p className="text-[10px] font-bold uppercase tracking-[0.42em] text-stone-500">Admin Suite</p>
      </div>
      <div className="mt-6 space-y-6">
        {sidebarSections.map((section) => (
          <div key={section.title}>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-stone-500">{section.title}</p>
            <div className="mt-3 space-y-2">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold",
                    item.active ? "bg-stone-950 text-white" : "border border-black/8 bg-white text-stone-700",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  {item.active ? <ArrowRight className="h-4 w-4" /> : null}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 border border-black/8 bg-white p-4">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-500">Today</p>
        <p className="mt-3 font-[var(--font-heading)] text-4xl leading-none text-stone-950">38 orders</p>
        <p className="mt-2 text-sm leading-6 text-stone-600">12 awaiting dispatch, 3 low-stock alerts, and 1 campaign pending approval.</p>
      </div>
    </aside>
  );
}

export function DashboardNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/6 bg-[#f7f1e8]/90 backdrop-blur-xl">
      <div className="w-full px-4 py-4 md:px-6 xl:px-10">
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/dashboard" className="mr-2 shrink-0">
            <p className="font-[var(--font-heading)] text-3xl leading-none tracking-[0.08em] text-stone-950">ELLENA</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.42em] text-stone-500">Admin Suite</p>
          </Link>
          <div className="ml-auto flex items-center gap-2 md:gap-3">
            <div className="hidden min-w-[16rem] items-center border border-black/8 bg-white px-4 py-3 md:flex">
              <Search className="mr-3 h-4 w-4 text-stone-400" />
              <input className="w-full bg-transparent text-sm outline-none" placeholder="Search order, SKU, customer..." />
            </div>
            <button type="button" className="inline-flex h-11 w-11 items-center justify-center border border-black/10 bg-white text-stone-700"><Bell className="h-4 w-4" /></button>
            <Link href="/dashboard/login" className="hidden bg-stone-950 px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white md:inline-flex">Admin login</Link>
            <button type="button" className="inline-flex h-11 w-11 items-center justify-center border border-black/10 bg-white xl:hidden"><Menu className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </header>
  );
}

export function DashboardPage() {
  const topProducts = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);

  return (
    <main className="w-full px-4 py-6 md:px-6 md:py-8 xl:px-10 xl:py-10">
      <div className="grid gap-5 xl:grid-cols-[18rem_minmax(0,1fr)] 2xl:grid-cols-[19rem_minmax(0,1fr)]">
        <DashboardSidebar />

        <div className="min-w-0 space-y-5">
          <section className="grid gap-5 2xl:grid-cols-[1.4fr_0.6fr]">
            <div className="overflow-hidden border border-black/6 bg-[linear-gradient(135deg,#1f1715_0%,#73523f_44%,#d0a27b_100%)] text-white shadow-[0_30px_90px_rgba(31,17,9,0.14)]">
              <div className="grid gap-8 px-6 py-8 md:px-8 md:py-10 xl:grid-cols-[1.25fr_0.75fr] xl:items-end">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.34em] text-white/60">eCommerce command center</p>
                  <h1 className="mt-4 max-w-4xl font-[var(--font-heading)] text-[3rem] leading-[0.9] text-balance md:text-[4.75rem]">Full-width operations built for products, orders, campaigns, and customer retention.</h1>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-white/78">This dashboard is structured more like a real commerce back office: top-line KPIs, active fulfillment, merch alerts, traffic attribution, and quick actions without the storefront width constraints.</p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link href="/shop" className="bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-stone-950">Open storefront</Link>
                    <Link href="/dashboard/login" className="border border-white/20 px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white">Login settings</Link>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                  {fulfillment.map((item) => (
                    <div key={item.label} className="border border-white/12 bg-white/8 p-4 backdrop-blur">
                      <item.icon className="h-5 w-5 text-amber-300" />
                      <p className="mt-4 font-[var(--font-heading)] text-4xl leading-none">{item.value}</p>
                      <p className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-white/60">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="grid gap-5">
              <div className="border border-black/6 bg-white/90 p-6 shadow-[0_18px_50px_rgba(17,12,10,0.06)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.32em] text-stone-500">Store health</p>
                    <h2 className="mt-2 font-[var(--font-heading)] text-4xl leading-none text-stone-950">Today</h2>
                  </div>
                  <ShieldCheck className="h-7 w-7 text-emerald-600" />
                </div>
                <div className="mt-5 space-y-4 text-sm text-stone-700">
                  <div className="flex items-center justify-between border-b border-black/6 pb-3"><span>Live conversion</span><span className="font-bold text-stone-950">3.24%</span></div>
                  <div className="flex items-center justify-between border-b border-black/6 pb-3"><span>Mobile share</span><span className="font-bold text-stone-950">71%</span></div>
                  <div className="flex items-center justify-between"><span>Cart recovery</span><span className="font-bold text-stone-950">18.6%</span></div>
                </div>
              </div>
              <div className="border border-black/6 bg-stone-950 p-6 text-white shadow-[0_18px_50px_rgba(17,12,10,0.12)]">
                <p className="text-xs font-bold uppercase tracking-[0.32em] text-white/55">Quick actions</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 2xl:grid-cols-1">
                  {["Create discount code", "Restock top seller", "Review failed payments", "Launch homepage banner"].map((item) => (
                    <button key={item} type="button" className="flex items-center justify-between border border-white/10 bg-white/6 px-4 py-3 text-left text-sm font-semibold text-white">
                      <span>{item}</span>
                      <ArrowRight className="h-4 w-4 text-amber-300" />
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </section>

          <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            {overviewCards.map((card, index) => (
              <motion.article key={card.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: index * 0.05 }} className={cn("border border-black/6 bg-gradient-to-br p-6 shadow-[0_18px_50px_rgba(17,12,10,0.06)]", card.accent)}>
                <div className="flex items-start justify-between">
                  <div className="inline-flex h-12 w-12 items-center justify-center border border-black/8 bg-white/80"><card.icon className="h-5 w-5 text-stone-700" /></div>
                  <div className="flex items-center gap-1 text-sm font-bold text-emerald-600"><ArrowUpRight className="h-4 w-4" />{card.change}</div>
                </div>
                <p className="mt-5 font-[var(--font-heading)] text-4xl leading-none text-stone-950">{card.value}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-stone-500">{card.label}</p>
                <p className="mt-3 text-sm text-stone-600">{card.note}</p>
              </motion.article>
            ))}
          </section>

          <section className="grid gap-5 2xl:grid-cols-[1.15fr_0.85fr]">
            <div className="grid gap-5">
              <div className="border border-black/6 bg-white/92 p-6 shadow-[0_18px_50px_rgba(17,12,10,0.06)] md:p-8">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.32em] text-stone-500">Sales</p>
                    <h3 className="mt-2 font-[var(--font-heading)] text-4xl leading-none text-stone-950">Revenue trend</h3>
                  </div>
                  <div className="flex gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-stone-500">
                    <span className="border border-stone-950 bg-stone-950 px-3 py-2 text-white">7M</span>
                    <span className="border border-black/10 bg-white px-3 py-2">YTD</span>
                    <span className="border border-black/10 bg-white px-3 py-2">Market</span>
                  </div>
                </div>
                <MiniSalesChart />
                <div className="mt-6 grid gap-4 border-t border-black/6 pt-6 md:grid-cols-3">
                  <div><p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-500">Repeat customers</p><p className="mt-2 font-[var(--font-heading)] text-3xl leading-none text-stone-950">34.2%</p></div>
                  <div><p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-500">Refund rate</p><p className="mt-2 font-[var(--font-heading)] text-3xl leading-none text-stone-950">1.8%</p></div>
                  <div><p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-500">Dispatch time</p><p className="mt-2 font-[var(--font-heading)] text-3xl leading-none text-stone-950">6.4h</p></div>
                </div>
              </div>

              <div className="border border-black/6 bg-white/92 p-6 shadow-[0_18px_50px_rgba(17,12,10,0.06)] md:p-8">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.32em] text-stone-500">Order stream</p>
                    <h3 className="mt-2 font-[var(--font-heading)] text-4xl leading-none text-stone-950">Recent orders</h3>
                  </div>
                  <button type="button" className="w-fit border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-stone-700">View all orders</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-black/8 text-[11px] font-bold uppercase tracking-[0.24em] text-stone-500">
                        <th className="pb-3 pr-6">Order</th>
                        <th className="pb-3 pr-6">Customer</th>
                        <th className="pb-3 pr-6">Channel</th>
                        <th className="pb-3 pr-6">City</th>
                        <th className="pb-3 pr-6">Total</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderRows.map((order) => (
                        <tr key={order.id} className="border-b border-black/4 text-stone-700 transition hover:bg-stone-50/70">
                          <td className="py-4 pr-6 font-semibold text-stone-950">{order.id}</td>
                          <td className="py-4 pr-6">{order.customer}</td>
                          <td className="py-4 pr-6 text-stone-500">{order.channel}</td>
                          <td className="py-4 pr-6 text-stone-500">{order.city}</td>
                          <td className="py-4 pr-6 font-semibold text-stone-950">{formatCurrency(order.total)}</td>
                          <td className="py-4"><StatusPill status={order.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-1">
              <div className="border border-black/6 bg-white/92 p-6 shadow-[0_18px_50px_rgba(17,12,10,0.06)]">
                <div className="flex items-center gap-2"><Package className="h-4 w-4 text-rose-600" /><p className="text-xs font-bold uppercase tracking-[0.32em] text-stone-500">Inventory alerts</p></div>
                <div className="mt-5 space-y-3">{lowStock.map((item) => <div key={`${item.name}-${item.detail}`} className="border border-black/6 bg-stone-50 p-4"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-stone-900">{item.name}</p><p className="text-xs text-stone-500">{item.detail}</p></div><div className="text-right"><p className="text-sm font-bold text-rose-600">{item.stock} left</p><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Restock soon</p></div></div></div>)}</div>
              </div>
              <div className="border border-black/6 bg-white/92 p-6 shadow-[0_18px_50px_rgba(17,12,10,0.06)]">
                <div className="flex items-center gap-2"><Star className="h-4 w-4 text-amber-500" /><p className="text-xs font-bold uppercase tracking-[0.32em] text-stone-500">Top products</p></div>
                <div className="mt-5 space-y-4">{topProducts.map((product, index) => <div key={product.slug} className="flex items-center gap-4"><span className="inline-flex h-8 w-8 items-center justify-center bg-stone-100 text-xs font-bold text-stone-600">{index + 1}</span><div className={cn("h-11 w-11 bg-gradient-to-br", product.accent)} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-stone-900">{product.name}</p><p className="text-xs text-stone-500">{product.reviewCount} reviews</p></div><p className="text-sm font-bold text-stone-900">{formatCurrency(product.price)}</p></div>)}</div>
              </div>
              <div className="border border-black/6 bg-white/92 p-6 shadow-[0_18px_50px_rgba(17,12,10,0.06)]">
                <div className="flex items-center gap-2"><Eye className="h-4 w-4 text-stone-700" /><p className="text-xs font-bold uppercase tracking-[0.32em] text-stone-500">Traffic mix</p></div>
                <div className="mt-5 space-y-4">{trafficChannels.map((channel) => <div key={channel.name} className="border border-black/6 bg-stone-50 p-4"><div className="flex items-center justify-between gap-4"><p className="text-sm font-semibold text-stone-900">{channel.name}</p><p className="text-sm font-bold text-stone-950">{channel.value}</p></div><p className="mt-2 text-xs leading-6 text-stone-500">{channel.detail}</p></div>)}</div>
              </div>
              <div className="border border-black/6 bg-stone-950 p-6 text-white shadow-[0_18px_50px_rgba(17,12,10,0.12)]">
                <div className="flex items-center gap-2"><Bell className="h-4 w-4 text-amber-300" /><p className="text-xs font-bold uppercase tracking-[0.32em] text-white/55">Team queue</p></div>
                <div className="mt-5 space-y-4">{tasks.map((task) => <div key={task.title} className="border border-white/10 bg-white/6 p-4"><p className="text-sm font-semibold text-white">{task.title}</p><div className="mt-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.24em] text-white/55"><span>{task.owner}</span><span>{task.priority}</span></div></div>)}</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export function DashboardFooter() {
  return (
    <footer className="border-t border-black/6 bg-[#f1e6d8]">
      <div className="w-full px-4 py-8 md:px-6 xl:px-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="font-[var(--font-heading)] text-4xl leading-none text-stone-950">ELLENA</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.42em] text-stone-500">Admin Suite</p>
            <p className="mt-3 max-w-md text-sm leading-7 text-stone-600">Operations dashboard for Ellena Cosmetics storefront performance, merchandising, stock control, and customer support.</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-stone-500">Admin links</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-stone-700"><Link href="/dashboard">Dashboard</Link><Link href="/dashboard/login">Login</Link><Link href="/shop">Storefront</Link></div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-stone-500">Support</p>
            <p className="mt-4 text-sm leading-7 text-stone-600">ops@ellenacosmetics.com<br />Mon - Sat, 8AM to 8PM EAT</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function DashboardLoginPage() {
  return (
    <main className="w-full px-4 py-6 md:px-6 md:py-8 xl:px-10 xl:py-10">
      <div className="grid min-h-[78vh] overflow-hidden border border-black/6 bg-white shadow-[0_24px_70px_rgba(17,12,10,0.08)] lg:grid-cols-[0.95fr_1.05fr]">
        <section className="bg-[linear-gradient(135deg,#211816_0%,#6f4f3c_44%,#cfa27b_100%)] p-8 text-white md:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.34em] text-white/60">Admin access</p>
          <h1 className="mt-5 max-w-xl font-[var(--font-heading)] text-6xl leading-none text-balance">Secure sign-in for the Ellena Cosmetics operations team.</h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-white/80">Use this portal to manage merchandising, inventory alerts, customer care tasks, and order fulfillment. The layout matches the premium brand language while keeping admin access focused and legible.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">{[{ icon: ShieldCheck, label: "2-step ready", text: "Prepared for role-based access and OTP verification." }, { icon: Store, label: "Store controls", text: "Orders, products, and campaign approvals in one place." }, { icon: Box, label: "Inventory focus", text: "Critical stock and restock tasks stay visible." }, { icon: Eye, label: "Performance view", text: "Fast access to sales and customer trends." }].map((item) => <div key={item.label} className="border border-white/10 bg-white/8 p-4 backdrop-blur"><item.icon className="h-5 w-5 text-amber-300" /><p className="mt-4 text-sm font-bold uppercase tracking-[0.24em] text-white/70">{item.label}</p><p className="mt-2 text-sm leading-6 text-white/75">{item.text}</p></div>)}</div>
        </section>
        <section className="bg-[linear-gradient(180deg,#fffdf9_0%,#f5ece1_100%)] p-8 md:p-12">
          <div className="mx-auto max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.34em] text-stone-500">Dashboard login</p>
            <h2 className="mt-4 font-[var(--font-heading)] text-5xl leading-none text-stone-950">Welcome back.</h2>
            <p className="mt-4 text-sm leading-7 text-stone-600">Sign in to open the admin workspace. This is a frontend login surface only for now, ready to connect to real auth later.</p>
            <form className="mt-8 space-y-4">
              <div><label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-stone-500">Work email</label><input className="h-14 w-full border border-black/8 bg-white px-4 outline-none" placeholder="admin@ellenacosmetics.com" /></div>
              <div><label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-stone-500">Password</label><div className="flex h-14 items-center border border-black/8 bg-white px-4"><Lock className="mr-3 h-4 w-4 text-stone-400" /><input type="password" className="h-full w-full bg-transparent outline-none" placeholder="Enter password" /></div></div>
              <div><label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-stone-500">Store code</label><input className="h-14 w-full border border-black/8 bg-white px-4 outline-none" placeholder="EC-KLA-01" /></div>
              <div className="flex flex-col gap-3 text-sm text-stone-600 md:flex-row md:items-center md:justify-between"><label className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4" />Keep me signed in</label><button type="button" className="w-fit font-semibold text-stone-900">Forgot password?</button></div>
              <button type="submit" className="flex h-14 w-full items-center justify-center gap-2 bg-stone-950 text-sm font-bold uppercase tracking-[0.18em] text-white">Sign in to dashboard <ArrowRight className="h-4 w-4" /></button>
            </form>
            <div className="mt-8 grid gap-4 border-t border-black/8 pt-6 md:grid-cols-2"><div className="border border-black/8 bg-white/75 p-4"><p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-500">Demo credentials</p><p className="mt-3 text-sm text-stone-700">admin@ellenacosmetics.com</p><p className="text-sm text-stone-700">Password: ellena-admin</p></div><div className="border border-black/8 bg-white/75 p-4"><p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-500">Next step</p><p className="mt-3 text-sm leading-6 text-stone-700">Connect this form to NextAuth, Clerk, or your own auth API when you are ready.</p></div></div>
            <div className="mt-6 flex flex-wrap gap-3"><Link href="/dashboard" className="text-sm font-semibold text-stone-900">Back to dashboard</Link><Link href="/" className="text-sm font-semibold text-stone-500">Back to storefront</Link></div>
          </div>
        </section>
      </div>
    </main>
  );
}
