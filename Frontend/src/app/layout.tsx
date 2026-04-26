import type { Metadata } from "next";
import localFont from "next/font/local";
import { AppChrome } from "@/components/app-chrome";
import { StoreProvider } from "@/components/providers/store-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import "./globals.css";
import { Geist, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jost = localFont({
  src: [
    { path: "../../public/fonts/Jost-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Jost-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/Jost-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/Jost-Bold.ttf", weight: "700", style: "normal" },
    { path: "../../public/fonts/Jost-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ellena Cosmetics",
  description: "Luxury African cosmetics storefront inspired by premium modern commerce experiences.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable, jost.variable, playfair.variable)}>
      <body>
        <StoreProvider>
          <TooltipProvider delayDuration={250}>
            <AppChrome>{children}</AppChrome>
            <Toaster richColors position="top-center" />
          </TooltipProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
