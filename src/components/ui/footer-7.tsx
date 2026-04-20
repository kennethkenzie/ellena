import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

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
      { name: "Makeup", href: "/shop" },
      { name: "Skincare", href: "/shop" },
      { name: "Hair", href: "/shop" },
      { name: "Fragrance", href: "/shop" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Journal", href: "/blog" },
      { name: "Account", href: "/account" },
      { name: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Visit",
    links: [
      { name: "Plot 12, Nakasero Lane", href: "#" },
      { name: "Kampala, Uganda", href: "#" },
      { name: "Mon – Sat, 9AM–8PM", href: "#" },
      { name: "Contact Us", href: "#" },
    ],
  },
];

const defaultSocialLinks = [
  { icon: <FaInstagram className="size-5" />, href: "#", label: "Instagram" },
  { icon: <FaFacebook className="size-5" />, href: "#", label: "Facebook" },
  { icon: <FaTwitter className="size-5" />, href: "#", label: "Twitter" },
  { icon: <FaLinkedin className="size-5" />, href: "#", label: "LinkedIn" },
];

const defaultLegalLinks = [
  { name: "Terms and Conditions", href: "#" },
  { name: "Privacy Policy", href: "#" },
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
    <section className="py-16 text-white" style={{ backgroundColor: '#db4c77' }}>
      <div className="container mx-auto px-4 md:px-6 xl:px-10">
        <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
          <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
            {/* Logo */}
            <div className="flex items-center gap-2 lg:justify-start">
              <a href={logo.url}>
                {logo.src ? (
                  <img src={logo.src} alt={logo.alt ?? logo.title} title={logo.title} className="h-8" />
                ) : (
                  <div>
                    <p className="font-bold text-2xl leading-none tracking-[0.1em] text-white">{logo.title}</p>
                    {logo.subtitle && (
                      <p className="-mt-1 text-[10px] font-semibold uppercase tracking-[0.45em] text-white/70">{logo.subtitle}</p>
                    )}
                  </div>
                )}
              </a>
            </div>
            <p className="max-w-[70%] text-sm text-white/80">
              {description}
            </p>
            <ul className="flex items-center space-x-6 text-white/80">
              {socialLinks.map((social, idx) => (
                <li key={idx} className="font-medium hover:text-white">
                  <a href={social.href} aria-label={social.label}>
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid w-full gap-6 md:grid-cols-3 lg:gap-20">
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold text-white">{section.title}</h3>
                <ul className="space-y-3 text-sm text-white/80">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx} className="font-medium hover:text-white">
                      <a href={link.href}>{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-white/20 py-8 text-xs font-medium text-white/70 md:flex-row md:items-center md:text-left">
          <p className="order-2 lg:order-1">{copyright}</p>
          <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row">
            {legalLinks.map((link, idx) => (
              <li key={idx} className="hover:text-white">
                <a href={link.href}>{link.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
