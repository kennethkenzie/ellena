"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroSection2 } from "@/components/ui/hero-section-2";
import { brandImages, campaignBlocks, featuredCollections, heroStats } from "@/lib/store-data";
import { apiGetBanners, type ApiBanner, API_ORIGIN } from "@/lib/api";
import { useSiteSettings, logoSrc } from "@/lib/use-site-settings";

const heroSlides = [
  {
    type: "split" as const, // ← uses HeroSection2 layout
    eyebrow: "Luxury African Cosmetics",
    title: (
      <>
        Beauty rituals with{" "}
        <span style={{ color: "#C9A227" }}>global polish</span>
        <br />& Kampala confidence.
      </>
    ),
    subtitle:
      "A premium cosmetics destination inspired by campaign-led beauty commerce: shade-driven makeup, glow-first skincare, crown care, and body rituals built for modern luxury.",
    image: brandImages.heroLipstickGold,
    primaryLabel: "Shop the collection",
    primaryHref: "/shop",
    metaLabel: featuredCollections[1].title,
    metaBody: featuredCollections[1].body,
  },
  {
    type: "fullbleed" as const,
    eyebrow: campaignBlocks[0].eyebrow,
    title: campaignBlocks[0].title,
    body: campaignBlocks[0].body,
    image: campaignBlocks[0].image,
    primaryLabel: "Shop complexion",
    primaryHref: "/shop",
    secondaryLabel: "Explore makeup",
    secondaryHref: "/shop",
    metaLabel: featuredCollections[0].title,
    metaBody: featuredCollections[0].body,
  },
  {
    type: "fullbleed" as const,
    eyebrow: campaignBlocks[1].eyebrow,
    title: campaignBlocks[1].title,
    body: campaignBlocks[1].body,
    image: campaignBlocks[1].image,
    primaryLabel: "Shop body",
    primaryHref: "/product/velvet-body-creme",
    secondaryLabel: "Layer fragrance",
    secondaryHref: "/product/amber-bloom-mist",
    metaLabel: "Ritual layering",
    metaBody:
      "Build a fuller routine with fragrance, body, and glow textures that feel editorial, not generic.",
  },
];

function bannerToSlide(b: ApiBanner) {
  const src = b.image_url.startsWith("http") ? b.image_url : API_ORIGIN + b.image_url;
  return {
    type: "fullbleed" as const,
    eyebrow: "Ellena Cosmetics",
    title: b.title ?? "New Collection",
    body: "",
    image: src,
    primaryLabel: "Shop now",
    primaryHref: b.link_url ?? "/shop",
    secondaryLabel: "Explore",
    secondaryHref: "/shop",
    metaLabel: b.title ?? "New Collection",
    metaBody: "",
  };
}

export function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [slides, setSlides] = useState(heroSlides);
  const siteSettings = useSiteSettings();
  const logoUrl = logoSrc(siteSettings?.logo_url);

  useEffect(() => {
    apiGetBanners("home_top")
      .then((banners) => {
        if (banners.length > 0) setSlides(banners.map(bannerToSlide));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const slide = slides[activeSlide];
  const upcoming = slides[(activeSlide + 1) % slides.length];

  return (
    <section className="relative w-full pb-8 pt-0 md:pb-16 md:pt-0">
      <div className="relative min-h-[78vh] w-full overflow-hidden shadow-[0_40px_120px_rgba(31,17,9,0.22)] md:min-h-[84vh]">
        <AnimatePresence mode="wait">
          {/* ── Split panel slide (HeroSection2) ───────────────────────── */}
          {slide.type === "split" ? (
            <motion.div
              key={`split-${activeSlide}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="min-h-[78vh] md:min-h-[84vh]"
            >
              <HeroSection2
                className="min-h-[78vh] md:min-h-[84vh]"
                logo={
                  logoUrl
                    ? { url: logoUrl, alt: "Ellena Cosmetics", text: "ELLENA" }
                    : undefined
                }
                slogan="Cosmetics"
                title={slide.title}
                subtitle={slide.subtitle ?? ""}
                callToAction={{
                  text: slide.primaryLabel,
                  href: slide.primaryHref,
                }}
                backgroundImage={slide.image}
                contactInfo={{
                  website: "ellenacosms.com",
                  phone: "+256 700 000 000",
                  address: "Kampala, Uganda",
                }}
              />
            </motion.div>
          ) : (
            /* ── Full-bleed slide (original carousel layout) ─────────── */
            <motion.div
              key={`fullbleed-${activeSlide}-${slide.title}`}
              initial={{ opacity: 0.2, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.2, scale: 0.985 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={slide.image}
                alt={slide.title as string}
                fill
                sizes="100vw"
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-[#2B2B2B]/65" />

              <div className="relative mx-auto grid min-h-[78vh] w-full max-w-[1600px] gap-10 px-4 py-10 text-white md:min-h-[84vh] md:px-8 md:py-14 xl:grid-cols-[minmax(0,1fr)_340px] xl:px-12">
                <div className="flex items-end">
                  <div className="max-w-3xl">
                    <Badge
                      variant="outline"
                      className="border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/90 backdrop-blur-md"
                    >
                      <Sparkles className="mr-2 h-3.5 w-3.5 text-[#C9A227]" />
                      {slide.eyebrow}
                    </Badge>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${slide.title}-copy`}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="mt-6"
                      >
                        <h1 className="max-w-3xl font-[var(--font-heading)] font-bold text-[2.7rem] leading-[0.9] text-balance md:text-[4.7rem] xl:text-[5.1rem]">
                          {slide.title}
                        </h1>
                        {slide.body && (
                          <p className="mt-5 max-w-xl text-sm leading-7 text-white/80 md:text-base">
                            {slide.body}
                          </p>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <Button
                        asChild
                        size="lg"
                        className="group h-12 rounded-full bg-white px-7 text-sm font-bold uppercase tracking-[0.18em] text-[#2B2B2B] shadow-[0_18px_40px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:bg-[#F5E6DA]"
                      >
                        <Link href={slide.primaryHref}>
                          {slide.primaryLabel}
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                      {slide.secondaryLabel && (
                        <Button
                          asChild
                          size="lg"
                          variant="outline"
                          className="h-12 rounded-full border-white/35 bg-white/5 px-7 text-sm font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md transition hover:bg-white/15 hover:text-white"
                        >
                          <Link href={slide.secondaryHref ?? "/shop"}>{slide.secondaryLabel}</Link>
                        </Button>
                      )}
                    </div>

                    <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
                      {heroStats.map((stat) => (
                        <div
                          key={stat.label}
                          className="rounded-2xl border border-white/15 bg-white/8 px-4 py-4 backdrop-blur-md transition hover:border-[#C9A227]/40 hover:bg-white/12"
                        >
                          <p className="font-[var(--font-heading)] font-bold text-4xl leading-none">
                            {stat.value}
                          </p>
                          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/70">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-end xl:justify-end">
                  <div className="w-full max-w-sm space-y-4">
                    <motion.div
                      key={`${slide.metaLabel}-now`}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="rounded-[28px] border border-white/15 bg-black/25 p-5 backdrop-blur-xl"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#C9A227]">
                        Now showing
                      </p>
                      <p className="mt-3 font-[var(--font-heading)] font-bold text-3xl leading-none">
                        {slide.metaLabel}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-white/72">{slide.metaBody}</p>
                    </motion.div>
                    <div className="rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">
                            Up next
                          </p>
                          <p className="mt-2 font-[var(--font-heading)] font-bold text-2xl leading-none">
                            {upcoming.metaLabel}
                          </p>
                        </div>
                        <Button
                          type="button"
                          size="icon-lg"
                          variant="outline"
                          onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}
                          className="rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                          aria-label="Next slide"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-white/68">{upcoming.metaBody}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Slide controls (always visible) ────────────────────────── */}
        <div className="absolute bottom-5 left-1/2 z-10 flex w-[calc(100%-2rem)] -translate-x-1/2 items-center justify-between gap-4 md:bottom-8 md:w-[calc(100%-4rem)] xl:w-[calc(100%-6rem)]">
          <div className="flex items-center gap-2">
            {slides.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={
                  index === activeSlide
                    ? "h-2.5 w-12 rounded-full bg-[#C9A227] shadow-[0_0_12px_rgba(201,162,39,0.45)] transition-all duration-500"
                    : "h-2.5 w-2.5 rounded-full bg-white/40 transition-all duration-300 hover:bg-white/70"
                }
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="icon-lg"
              variant="outline"
              onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)}
              className="rounded-full border-white/20 bg-black/25 text-white backdrop-blur-md hover:bg-white/15 hover:text-white"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              size="icon-lg"
              variant="outline"
              onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}
              className="rounded-full border-white/20 bg-black/25 text-white backdrop-blur-md hover:bg-white/15 hover:text-white"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
