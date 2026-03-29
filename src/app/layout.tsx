import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { AppChrome } from "@/components/app-chrome";
import { StoreProvider } from "@/components/providers/store-provider";
import "./globals.css";

const heading = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Ellena Cosmetics",
  description: "Luxury African cosmetics storefront inspired by premium modern commerce experiences.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body>
        <StoreProvider>
          <AppChrome>{children}</AppChrome>
        </StoreProvider>
      </body>
    </html>
  );
}
