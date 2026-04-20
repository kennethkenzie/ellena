"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { campaignBlocks, featuredCollections, heroStats } from "@/lib/store-data";
import { apiGetBanners, type ApiBanner, API_ORIGIN } from "@/lib/api";

const heroSlides = [
  {
    eyebrow: "Luxury African Cosmetics",
    title: "Beauty rituals with global polish and Kampala confidence.",
    body:
      "A premium cosmetics destination inspired by campaign-led beauty commerce: shade-driven makeup, glow-first skincare, crown care, and body rituals built for modern luxury.",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=2200&q=85",
    primaryLabel: "Shop now",
    primaryHref: "/shop",
    secondaryLabel: "Discover the brand",
    secondaryHref: "/about",
    metaLabel: featuredCollections[1].title,
    metaBody: featuredCollections[1].body,
  },
  {
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
    eyebrow: campaignBlocks[1].eyebrow,
    title: campaignBlocks[1].title,
    body: campaignBlocks[1].body,
    image: campaignBlocks[1].image,
    primaryLabel: "Shop body",
    primaryHref: "/product/velvet-body-creme",
    secondaryLabel: "Layer fragrance",
    secondaryHref: "/product/amber-bloom-mist",
    metaLabel: "Ritual layering",
    metaBody: "Build a fuller routine with fragrance, body, and glow textures that feel editorial, not generic.",
  },
];

function bannerToSlide(b: ApiBanner) {
  const src = b.image_url.startsWith('http') ? b.image_url : API_ORIGIN + b.image_url;
  return {
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

  useEffect(() => {
    apiGetBanners('home_top')
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
      <div className="relative min-h-[76vh] w-full overflow-hidden bg-stone-950 shadow-[0_30px_90px_rgba(31,17,9,0.18)] md:min-h-[82vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.title}
            initial={{ opacity: 0.2, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.2, scale: 0.985 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image src={slide.image} alt={slide.title} fill sizes="100vw" className="object-cover object-center" priority />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,11,9,0.82)_0%,rgba(16,11,9,0.56)_42%,rgba(16,11,9,0.18)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_30%)]" />
          </motion.div>
        </AnimatePresence>

        <div className="relative mx-auto grid min-h-[76vh] w-full max-w-[1600px] gap-10 px-4 py-10 text-white md:min-h-[82vh] md:px-8 md:py-14 xl:grid-cols-[minmax(0,1fr)_320px] xl:px-12">
          <div className="flex items-end">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#f4c78c]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80">{slide.eyebrow}</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${slide.title}-copy`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="mt-6"
                >
                  <h1 className="max-w-3xl font-[var(--font-heading)] font-bold text-[2.7rem] leading-[0.9] text-balance md:text-[4.7rem] xl:text-[5.1rem]">
                    {slide.title}
                  </h1>
                  <p className="mt-5 max-w-xl text-sm leading-7 text-white/80 md:text-base">{slide.body}</p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={slide.primaryHref} className="rounded-md bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-stone-950 transition hover:bg-stone-100">
                  {slide.primaryLabel}
                </Link>
                <Link href={slide.secondaryHref} className="rounded-md border border-white/25 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white/10">
                  {slide.secondaryLabel}
                </Link>
              </div>

              <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/15 bg-white/8 px-4 py-4 backdrop-blur-md">
                    <p className="font-[var(--font-heading)] font-bold text-4xl leading-none">{stat.value}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/70">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-end xl:justify-end">
            <div className="w-full max-w-sm space-y-4">
              <div className="rounded-[28px] border border-white/15 bg-black/20 p-5 backdrop-blur-xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">Now showing</p>
                <p className="mt-3 font-[var(--font-heading)] font-bold text-3xl leading-none">{slide.metaLabel}</p>
                <p className="mt-3 text-sm leading-6 text-white/72">{slide.metaBody}</p>
              </div>
              <div className="rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">Up next</p>
                    <p className="mt-2 font-[var(--font-heading)] font-bold text-2xl leading-none">{upcoming.metaLabel}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 transition hover:bg-white/20"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/68">{upcoming.metaBody}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 z-10 flex w-[calc(100%-2rem)] -translate-x-1/2 items-center justify-between gap-4 md:bottom-8 md:w-[calc(100%-4rem)] xl:w-[calc(100%-6rem)]">
          <div className="flex items-center gap-2">
            {slides.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={index === activeSlide ? "h-2.5 w-10 rounded-full bg-white transition-all duration-300" : "h-2.5 w-2.5 rounded-full bg-white/45 transition-all duration-300 hover:bg-white/70"}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/20 backdrop-blur-md transition hover:bg-white/10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <button
              type="button"
              onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/20 backdrop-blur-md transition hover:bg-white/10"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


