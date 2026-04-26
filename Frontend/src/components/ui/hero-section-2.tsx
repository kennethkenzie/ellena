"use client";

import React from "react";
import { cn } from "../../lib/utils";
import { motion, type Variants, type Easing } from "framer-motion";
import { Globe, Phone, MapPin } from "lucide-react";

// ─── Icon helpers ─────────────────────────────────────────────────────────
const InfoIcon = ({ type }: { type: "website" | "phone" | "address" }) => {
  const Icon = { website: Globe, phone: Phone, address: MapPin }[type];
  return (
    <div className="mr-2 flex-shrink-0">
      <Icon className="h-4 w-4 text-[#C9A227]" />
    </div>
  );
};

// ─── Types ────────────────────────────────────────────────────────────────
// Omit 'title' from HTMLAttributes so we can type it as ReactNode
export interface HeroSection2Props
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  logo?: {
    url: string;
    alt: string;
    text?: string;
  };
  slogan?: string;
  title: React.ReactNode;
  subtitle: string;
  callToAction: {
    text: string;
    href: string;
  };
  backgroundImage: string;
  contactInfo?: {
    website?: string;
    phone?: string;
    address?: string;
  };
}

const EASE_OUT: Easing = "easeOut";
const EASE_CIRC: Easing = "circOut";

// ─── Component ───────────────────────────────────────────────────────────
const HeroSection2 = React.forwardRef<HTMLDivElement, HeroSection2Props>(
  (
    {
      className,
      logo,
      slogan,
      title,
      subtitle,
      callToAction,
      backgroundImage,
      contactInfo,
      ...props
    },
    ref,
  ) => {
    const containerVariants: Variants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 } as object,
      },
    };

    const itemVariants: Variants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.55, ease: EASE_OUT } as object,
      },
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full flex-col overflow-hidden bg-[#FFFDF9] text-[#2B2B2B] md:flex-row",
          className,
        )}
        {...props}
      >
        {/* ── Left: Content panel ── */}
        <motion.div
          className="flex w-full flex-col justify-between p-8 md:w-1/2 md:p-12 lg:w-3/5 lg:p-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Logo / brand */}
          <motion.header className="mb-10" variants={itemVariants}>
            {logo ? (
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.url}
                  alt={logo.alt}
                  className="h-10 w-auto object-contain"
                />
                {logo.text && (
                  <div>
                    <p className="font-[var(--font-heading)] font-bold text-xl leading-none tracking-[0.1em] text-[#2B2B2B]">
                      {logo.text}
                    </p>
                    {slogan && (
                      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A227]">
                        {slogan}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="font-[var(--font-heading)] font-bold text-2xl tracking-[0.1em] text-[#2B2B2B]">
                  ELLENA
                </p>
                {slogan && (
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A227]">
                    {slogan}
                  </p>
                )}
              </div>
            )}
          </motion.header>

          {/* Main copy */}
          <motion.div
            className="flex-1"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1
              className="font-[var(--font-heading)] font-bold text-4xl leading-tight text-[#2B2B2B] md:text-5xl"
              variants={itemVariants}
            >
              {title}
            </motion.h1>

            <motion.div
              className="my-6 h-1 w-20 bg-[#C9A227]"
              variants={itemVariants}
            />

            <motion.p
              className="mb-8 max-w-md text-base leading-7 text-stone-600"
              variants={itemVariants}
            >
              {subtitle}
            </motion.p>

            <motion.a
              href={callToAction.href}
              className="inline-block text-sm font-bold uppercase tracking-[0.28em] text-[#C9A227] transition-colors hover:text-[#2B2B2B]"
              variants={itemVariants}
            >
              {callToAction.text} →
            </motion.a>
          </motion.div>

          {/* Footer contact info */}
          {contactInfo && (
            <motion.footer
              className="mt-12 w-full"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.div
                className="grid grid-cols-1 gap-4 text-xs text-stone-500 sm:grid-cols-3"
                variants={itemVariants}
              >
                {contactInfo.website && (
                  <div className="flex items-center">
                    <InfoIcon type="website" />
                    <span>{contactInfo.website}</span>
                  </div>
                )}
                {contactInfo.phone && (
                  <div className="flex items-center">
                    <InfoIcon type="phone" />
                    <span>{contactInfo.phone}</span>
                  </div>
                )}
                {contactInfo.address && (
                  <div className="flex items-center">
                    <InfoIcon type="address" />
                    <span>{contactInfo.address}</span>
                  </div>
                )}
              </motion.div>
            </motion.footer>
          )}
        </motion.div>

        {/* ── Right: Clipped image panel ── */}
        <motion.div
          className="w-full min-h-[340px] bg-cover bg-center md:w-1/2 md:min-h-full lg:w-2/5"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          initial={{ clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" }}
          animate={{ clipPath: "polygon(22% 0, 100% 0, 100% 100%, 0% 100%)" }}
          transition={{ duration: 1.3, ease: EASE_CIRC }}
        />
      </div>
    );
  },
);

HeroSection2.displayName = "HeroSection2";

export { HeroSection2 };
