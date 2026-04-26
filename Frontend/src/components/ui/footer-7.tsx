import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface Footer7Props {
  logo?: {
    url: string;
    src?: string;
    alt?: string;
    title: string;
    subtitle?: string;
  };
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
  description?: string;
  socialLinks?: Array<{
    icon: React.ReactElement;
    href: string;
    label: string;
  }>;
  copyright?: string;
  legalLinks?: Array<{
    name: string;
    href: string;
  }>;
}

const defaultSections = [
  {
    title: "Shop",
    links: [
      { name: "Makeup", href: "/shop?category=Makeup" },
      { name: "Skincare", href: "/shop?category=Skincare" },
      { name: "Hair", href: "/shop?category=Hair" },
      { name: "Body", href: "/shop?category=Body" },
      { name: "Fragrance", href: "/shop?category=Fragrance" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Journal", href: "/blog" },
      { name: "Account", href: "/account" },
      { name: "Wishlist", href: "/wishlist" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Contact us", href: "#" },
      { name: "Shipping & returns", href: "#" },
      { name: "Loyalty programme", href: "#" },
      { name: "FAQ", href: "#" },
    ],
  },
];

const defaultSocialLinks = [
  { icon: <FaInstagram className="size-4" />, href: "#", label: "Instagram" },
  { icon: <FaFacebook className="size-4" />, href: "#", label: "Facebook" },
  { icon: <FaTwitter className="size-4" />, href: "#", label: "Twitter" },
  { icon: <FaLinkedin className="size-4" />, href: "#", label: "LinkedIn" },
];

const defaultLegalLinks = [
  { name: "Terms and Conditions", href: "#" },
  { name: "Privacy Policy", href: "#" },
  { name: "Cookies", href: "#" },
];

export const Footer7 = ({
  logo = {
    url: "/",
    title: "ELLENA",
    subtitle: "Cosmetics",
  },
  sections = defaultSections,
  description = "Luxury cosmetics and skincare crafted with an African point of view and a global design standard.",
  socialLinks = defaultSocialLinks,
  copyright = `© ${new Date().getFullYear()} Ellena Cosmetics. All rights reserved.`,
  legalLinks = defaultLegalLinks,
}: Footer7Props) => {
  return (
    <footer className="relative overflow-hidden border-t border-[#F5E6DA] bg-[#FFFDF9] text-[#2B2B2B]">
      <div className="relative">
        {/* Newsletter band */}
        <div className="border-b border-[#F5E6DA] bg-[#F5E6DA]">
          <div className="container mx-auto grid gap-6 px-4 py-10 md:grid-cols-[1.1fr_0.9fr] md:px-6 md:py-12 xl:px-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/30 bg-[#FFFDF9] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A227]">
                <Sparkles className="h-3 w-3" />
                Inner Circle
              </div>
              <h2 className="font-[var(--font-heading)] text-3xl font-bold leading-tight md:text-4xl">
                Be first for new launches & shade rituals.
              </h2>
              <p className="max-w-md text-sm text-[#8A8A8A]">
                Editorial-led drops, founder notes, and 10% off your first order.
              </p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col items-stretch gap-3 self-center sm:flex-row"
            >
              <Input
                type="email"
                placeholder="you@example.com"
                aria-label="Email address"
                className="h-12 rounded-full border-[#C9A227]/30 bg-[#FFFDF9] px-5 text-sm text-[#2B2B2B] placeholder:text-[#8A8A8A] focus-visible:border-[#C9A227] focus-visible:ring-[#C9A227]/30"
              />
              <Button
                type="submit"
                size="lg"
                className="h-12 rounded-full bg-[#C9A227] px-8 text-xs font-bold uppercase tracking-[0.18em] text-[#2B2B2B] shadow-[0_12px_30px_rgba(201,162,39,0.22)] hover:bg-[#C9A227]/85"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <section className="container mx-auto px-4 py-14 md:px-6 md:py-16 xl:px-10">
          <div className="flex w-full flex-col justify-between gap-12 lg:flex-row lg:items-start lg:text-left">
            <div className="flex w-full flex-col gap-6 lg:max-w-md">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <a href={logo.url}>
                  {logo.src ? (
                    <img
                      src={logo.src}
                      alt={logo.alt ?? logo.title}
                      title={logo.title}
                      className="h-8"
                    />
                  ) : (
                    <div>
                      <p className="font-[var(--font-heading)] text-3xl font-bold leading-none tracking-[0.1em] text-[#2B2B2B]">
                        {logo.title}
                      </p>
                      {logo.subtitle && (
                        <p className="-mt-1 text-[10px] font-semibold uppercase tracking-[0.45em] text-[#C9A227]">
                          {logo.subtitle}
                        </p>
                      )}
                    </div>
                  )}
                </a>
              </div>
              <p className="max-w-md text-sm leading-7 text-[#8A8A8A]">{description}</p>

              {/* Contact bits */}
              <ul className="space-y-2 text-sm text-[#8A8A8A]">
                <li className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-[#C9A227]" />
                  <span>Plot 12, Nakasero Lane · Kampala, Uganda</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-[#C9A227]" />
                  <span>+256 700 000 000</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-[#C9A227]" />
                  <span>hello@ellena-cosmetics.com</span>
                </li>
              </ul>

              <ul className="flex items-center gap-3 pt-2">
                {socialLinks.map((social, idx) => (
                  <li key={idx}>
                    <a
                      href={social.href}
                      aria-label={social.label}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#F5E6DA] bg-[#F5E6DA] text-[#2B2B2B] transition hover:border-[#C9A227] hover:bg-[#C9A227]/15 hover:text-[#C9A227]"
                    >
                      {social.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid w-full gap-10 sm:grid-cols-3 lg:max-w-2xl lg:gap-16">
              {sections.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#C9A227]">
                    {section.title}
                  </h3>
                  <ul className="space-y-3 text-sm text-[#8A8A8A]">
                    {section.links.map((link, linkIdx) => (
                      <li key={linkIdx}>
                        <a
                          href={link.href}
                          className="font-medium transition hover:text-[#2B2B2B]"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <Separator className="mt-12 bg-[#F5E6DA]" />

          <div className="mt-6 flex flex-col justify-between gap-4 text-xs font-medium text-[#8A8A8A] md:flex-row md:items-center">
            <p className="order-2 md:order-1">{copyright}</p>
            <ul className="order-1 flex flex-wrap gap-x-5 gap-y-2 md:order-2">
              {legalLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="transition hover:text-[#2B2B2B]"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </footer>
  );
};
