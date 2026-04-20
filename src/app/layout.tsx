import type { Metadata } from "next";
import localFont from "next/font/local";
import { AppChrome } from "@/components/app-chrome";
import { StoreProvider } from "@/components/providers/store-provider";
import "./globals.css";

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
    <html lang="en" className={jost.variable}>
      <body>
        <StoreProvider>
          <AppChrome>{children}</AppChrome>
        </StoreProvider>
      </body>
    </html>
  );
}
