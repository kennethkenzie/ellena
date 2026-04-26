"use client";

import { usePathname } from "next/navigation";
import { SiteFooter, SiteHeader } from "./storefront-shell";
import { DashboardFooter, DashboardNavbar } from "./dashboard";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const isAuthPage = pathname === "/login";

  if (isDashboard) {
    return (
      <div className="min-h-screen bg-transparent p-2 md:p-3 xl:p-4">
        <div className="relative min-h-[calc(100vh-1rem)] overflow-x-clip rounded-[28px] border border-black/5 bg-white/70 shadow-[0_30px_80px_rgba(17,12,10,0.08)] backdrop-blur-sm md:min-h-[calc(100vh-1.5rem)] md:rounded-[36px] xl:min-h-[calc(100vh-2rem)]">
          <DashboardNavbar />
          {children}
          <DashboardFooter />
        </div>
      </div>
    );
  }

  if (isAuthPage) {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-white">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
