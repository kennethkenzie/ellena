"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSiteSettings, logoSrc } from "@/lib/use-site-settings";
import {
  BarChart2,
  Bell,
  ExternalLink,
  BookOpen,
  ChevronDown,
  ChevronRight,
  CreditCard,
  DollarSign,
  FileText,
  LayoutDashboard,
  Menu,
  Package,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

const sidebarItems: { label: string; icon: LucideIcon }[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Orders", icon: ShoppingCart },
  { label: "Customers", icon: Users },
  { label: "Products", icon: Package },
  { label: "Reviews", icon: BookOpen },
  { label: "Discounts", icon: Zap },
  { label: "Marketing", icon: BarChart2 },
  { label: "Shipping", icon: Truck },
  { label: "Transactions", icon: CreditCard },
  { label: "Analytics", icon: TrendingUp },
  { label: "Reports", icon: FileText },
  { label: "Store Settings", icon: Settings },
];

const statCards: { title: string; icon: LucideIcon }[] = [
  { title: "TOTAL SALES", icon: DollarSign },
  { title: "TOTAL ORDERS", icon: Package },
  { title: "NEW CUSTOMERS", icon: Users },
  { title: "RETURN RATE", icon: RefreshCw },
];

function SidebarIcon({ icon: Icon, active = false }: { icon: LucideIcon; active?: boolean }) {
  return (
    <span
      className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border transition ${
        active
          ? "border-[#d9dcff] bg-white text-[#4f46e5] shadow-[0_10px_24px_rgba(91,76,240,0.12)]"
          : "border-slate-200 bg-slate-50 text-slate-500 group-hover:border-slate-300 group-hover:bg-white group-hover:text-slate-700"
      }`}
    >
      <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
    </span>
  );
}

export function DashboardNavbar() {
  return (
    <header className="sticky top-0 z-20 flex h-[60px] items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
      <div className="flex items-center gap-4">
        <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 xl:hidden">
          <Menu className="h-5 w-5" strokeWidth={1.8} />
        </button>

        <div className="hidden items-center gap-4 md:flex">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef0ff] text-[#5b4cf0]">
              <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm font-semibold">Ellena Cosmetics</p>
              <p className="text-xs text-slate-500">Admin Dashboard</p>
            </div>
          </div>
          <h1 className="font-[var(--font-heading)] text-[24px] font-bold tracking-tight">Dashboard</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden h-10 w-[310px] items-center gap-3 rounded-xl border border-slate-200 bg-[#fbfbfd] px-4 lg:flex">
          <Search className="h-4 w-4 text-slate-400" strokeWidth={1.8} />
          <input
            type="text"
            placeholder="Search orders, products, customers..."
            className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>
        <Link
          href="/"
          className="hidden items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 md:inline-flex"
        >
          <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
          Back to Website
        </Link>
        <button className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 md:inline-flex">
          <Bell className="h-5 w-5" strokeWidth={1.8} />
        </button>
        <button className="inline-flex items-center gap-2 rounded-xl bg-[#5b4cf0] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#4f46e5]">
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add Product
        </button>
      </div>
    </header>
  );
}

export function DashboardFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-4">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-slate-500">(c) {new Date().getFullYear()} Ellena Cosmetics. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm text-slate-500 transition hover:text-slate-900">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-slate-500 transition hover:text-slate-900">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}

const productSubItems: { label: string; href: string }[] = [
  { label: "Add New Product", href: "/dashboard/products/add" },
  { label: "All Products", href: "/dashboard/products" },
  { label: "Bulk Import", href: "/dashboard/products/bulk-import" },
  { label: "Bulk Export", href: "/dashboard/products/bulk-export" },
  { label: "Category", href: "/dashboard/products/category" },
  { label: "Category Based Discount", href: "/dashboard/products/category-discount" },
  { label: "Attribute", href: "/dashboard/products/attribute" },
  { label: "Colors", href: "/dashboard/products/colors" },
  { label: "Units", href: "/dashboard/products/units" },
  { label: "Size Guide", href: "/dashboard/products/size-guide" },
];

function DashboardSidebar() {
  const pathname = usePathname();
  const isProductsPath = pathname.startsWith("/dashboard/products");
  const [productsOpen, setProductsOpen] = useState(isProductsPath);
  const siteSettings = useSiteSettings();
  const sidebarLogo = logoSrc(siteSettings?.logo_url);

  return (
    <aside className="hidden w-[274px] border-r border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f7f8ff_100%)] xl:flex xl:flex-col">
      <div className="flex h-[72px] items-center gap-3 border-b border-slate-200 px-6">
        {sidebarLogo ? (
          <Image src={sidebarLogo} alt="Logo" width={120} height={36} className="h-9 w-auto object-contain" />
        ) : (
          <>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#5b4cf0] text-sm font-semibold text-white shadow-[0_12px_30px_rgba(91,76,240,0.22)]">
              E
            </div>
            <div>
              <span className="font-[var(--font-heading)] text-[24px] font-bold tracking-tight">Ellena</span>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Cosmetics Admin</p>
            </div>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mb-4 px-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Workspace</p>
        </div>
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const isProducts = item.label === "Products";
            const isDashboard = item.label === "Dashboard";
            const isActive = isDashboard ? pathname === "/dashboard" : isProducts ? isProductsPath : false;
            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => { if (isProducts) setProductsOpen((o) => !o); }}
                  className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-[15px] font-medium transition ${
                    isActive
                      ? "bg-[#eef0ff] text-[#4f46e5] shadow-[0_16px_40px_rgba(79,70,229,0.08)]"
                      : isProducts && productsOpen
                        ? "bg-white text-slate-900 shadow-[0_12px_32px_rgba(15,23,42,0.06)]"
                        : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-[0_12px_32px_rgba(15,23,42,0.06)]"
                  }`}
                >
                  <SidebarIcon icon={item.icon} active={isActive} />
                  <span className="flex-1">{item.label}</span>
                  {isProducts ? (
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`}
                      strokeWidth={1.8}
                    />
                  ) : isActive ? (
                    <ChevronRight className="h-4 w-4" strokeWidth={1.8} />
                  ) : null}
                </button>
                {isProducts && productsOpen && (
                  <div className="ml-[52px] mt-1 space-y-0.5 border-l-2 border-slate-100 pl-3">
                    {productSubItems.map((sub) => {
                      const active = pathname === sub.href;
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={`flex w-full items-center rounded-xl px-3 py-2 text-[13px] font-medium transition ${
                            active
                              ? "bg-[#eef0ff] text-[#4f46e5]"
                              : "text-slate-500 hover:bg-white hover:text-slate-900"
                          }`}
                        >
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-200 px-4 py-4">
        <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">Admin Store</p>
            <p className="truncate text-xs text-slate-500">Super Admin</p>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400" strokeWidth={1.8} />
        </div>
      </div>
    </aside>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f7fb] font-[var(--font-body)] text-slate-900">
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 overflow-x-hidden">{children}</div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  return (
    <main className="p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="font-[var(--font-heading)] text-[20px] font-bold tracking-tight md:text-[26px]">Welcome back, Store Admin</h2>
          <p className="mt-1 text-sm text-slate-500 md:text-base">
            Here&apos;s what&apos;s happening in your ecommerce business today.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start">
          <button className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
            Filter
          </button>
          <button className="rounded-xl bg-[#5b4cf0] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#4f46e5]">
            Export Sales
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="mb-5 flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                <stat.icon className="h-5 w-5" strokeWidth={1.8} />
              </div>
            </div>
            <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-slate-400">{stat.title}</p>
            <p className="text-[28px] font-bold tracking-tight text-slate-300">—</p>
          </div>
        ))}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1.55fr_0.5fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-[var(--font-heading)] text-[16px] font-bold tracking-tight">Sales vs Orders</h3>
              <p className="text-sm text-slate-500">Monthly ecommerce performance for the last 6 months</p>
            </div>
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
              Last 6 Months
            </button>
          </div>
          <div className="flex h-[280px] items-center justify-center rounded-2xl bg-slate-50">
            <p className="text-sm text-slate-400">No sales data available yet</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <h3 className="font-[var(--font-heading)] text-[16px] font-bold tracking-tight">Sales Channels</h3>
          <div className="mt-8 flex h-[200px] items-center justify-center">
            <p className="text-sm text-slate-400">No channel data available yet</p>
          </div>
          <div className="border-t border-slate-100 pt-6">
            <button className="flex w-full items-center justify-between text-sm font-semibold text-[#5b4cf0]">
              <span>View channel analytics</span>
              <ChevronRight className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="font-[var(--font-heading)] text-[16px] font-bold tracking-tight">Top Products</h3>
              <p className="text-sm text-slate-500">Best performing products this month</p>
            </div>
            <button className="text-sm font-semibold text-[#5b4cf0]">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-[0.16em] text-slate-400">
                  <th className="pb-4 font-semibold">Product</th>
                  <th className="pb-4 font-semibold">SKU</th>
                  <th className="pb-4 font-semibold">Sales</th>
                  <th className="pb-4 font-semibold">Stock</th>
                  <th className="pb-4 font-semibold">Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-slate-400">
                    No products to display yet
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="font-[var(--font-heading)] text-[16px] font-bold tracking-tight">Recent Orders</h3>
              <p className="text-sm text-slate-500">Latest purchases from your customers</p>
            </div>
            <button className="text-sm font-semibold text-[#5b4cf0]">Manage Orders</button>
          </div>
          <div className="flex h-[200px] items-center justify-center rounded-2xl bg-slate-50">
            <p className="text-sm text-slate-400">No orders yet</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export function DashboardLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#eef0ff_0%,#f8f9fc_42%,#ffffff_100%)] px-4">
      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5b4cf0] text-base font-semibold text-white">
            E
          </div>
          <div>
            <p className="font-[var(--font-heading)] text-lg font-bold tracking-tight text-slate-900">Ellena Cosmetics Admin</p>
            <p className="text-sm text-slate-500">Sign in to manage your store dashboard</p>
          </div>
        </div>

        <form className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Email address</span>
            <input
              type="email"
              placeholder="admin@shopflow.com"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#cfd4ff] focus:ring-2 focus:ring-[#e7e9ff]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#cfd4ff] focus:ring-2 focus:ring-[#e7e9ff]"
            />
          </label>

          <button className="inline-flex w-full items-center justify-center rounded-2xl bg-[#5b4cf0] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4f46e5]">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}



