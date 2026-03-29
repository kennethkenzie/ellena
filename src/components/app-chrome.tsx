"use client";

import { usePathname } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/storefront-shell";
import { DashboardFooter, DashboardNavbar } from "@/components/dashboard";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <div className="relative min-h-screen overflow-x-clip">
      {isDashboard ? <DashboardNavbar /> : <SiteHeader />}
      {children}
      {isDashboard ? <DashboardFooter /> : <SiteFooter />}
    </div>
  );
}
