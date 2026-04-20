export type Product = {
  slug: string;
  name: string;
  category: "Makeup" | "Skincare" | "Hair" | "Body" | "Fragrance";
  subcategory: string;
  price: number;
  rating: number;
  reviewCount: number;
  shades: string[];
  description: string;
  badge?: string;
  accent: string;
  heroTone: string;
  image: string;
};

export type NavGroup = {
  title: string;
  links: string[];
  promo: {
    eyebrow: string;
    heading: string;
    body: string;
    tone: string;
  };
};

export const navGroups: NavGroup[] = [
  {
    title: "NEW + BESTSELLERS",
    links: ["New Arrivals", "Best Sellers", "Trending", "Limited Edition", "Bundles", "Minis"],
    promo: {
      eyebrow: "Just dropped",
      heading: "Studio skin with a golden-hour finish",
      body: "Fresh campaign edits, travel kits, and giftable sets for the season.",
      tone: "from-amber-100 via-rose-100 to-stone-100",
    },
  },
  {
    title: "MAKEUP",
    links: ["Foundation", "Concealer", "Powder", "Blush & Highlighter", "Bronzer & Contour", "Lip Gloss", "Lipstick", "Eye Makeup", "Brushes & Tools", "Shop All Makeup"],
    promo: {
      eyebrow: "Complexion first",
      heading: "Shade systems built for melanin-rich skin",
      body: "Velvet finishes, soft-focus powders, and gloss with editorial shine.",
      tone: "from-orange-100 via-amber-50 to-neutral-100",
    },
  },
  {
    title: "SKINCARE",
    links: ["Cleansers", "Toners", "Serums", "Moisturizers", "Sunscreen (SPF)", "Masks & Treatments", "Lip Care", "Eye Care", "Body Care", "Shop All Skincare"],
    promo: {
      eyebrow: "Barrier rituals",
      heading: "Hydration that reads luminous, never greasy",
      body: "Daily resets and treatment-led essentials for a polished glow.",
      tone: "from-stone-100 via-emerald-50 to-orange-50",
    },
  },
  {
    title: "HAIR",
    links: ["Shampoo", "Conditioner", "Hair Oils", "Hair Growth Products", "Wigs & Braids", "Styling Products", "Tools", "Shop All Hair"],
    promo: {
      eyebrow: "Crown care",
      heading: "Silk press shine and braid-day nourishment",
      body: "Oil-rich rituals, scalp treatments, and styling essentials with salon energy.",
      tone: "from-neutral-100 via-yellow-50 to-amber-100",
    },
  },
  {
    title: "BODY",
    links: ["Body Lotion", "Body Scrubs", "Body Oils", "Fragrance Mist", "Bath & Shower", "Shop All Body"],
    promo: {
      eyebrow: "Body veil",
      heading: "Soft sheen textures for the full routine",
      body: "Scrubs, oils, and lotion layers that feel elevated and giftable.",
      tone: "from-rose-100 via-orange-50 to-stone-100",
    },
  },
  {
    title: "FRAGRANCE",
    links: ["Perfumes", "Body Mists", "Gift Sets", "Shop All Fragrance"],
    promo: {
      eyebrow: "Signature scent",
      heading: "Warm florals cut with amber and spice",
      body: "Statement perfume and layering mists designed to linger beautifully.",
      tone: "from-amber-100 via-stone-100 to-rose-100",
    },
  },
  {
    title: "DISCOVER",
    links: ["Beauty Tips", "Tutorials", "Blog", "Influencer Picks", "About Brand"],
    promo: {
      eyebrow: "The editorial side",
      heading: "Looks, routines, and founder-led stories",
      body: "A modern beauty journal rooted in confidence, ritual, and African luxury.",
      tone: "from-stone-100 via-white to-orange-50",
    },
  },
];

export const categoryHighlights = [
  {
    name: "Makeup",
    caption: "Airbrushed complexion",
    count: "42 formulas",
    tone: "from-stone-900 via-stone-700 to-amber-600",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Skincare",
    caption: "Glow without compromise",
    count: "18 rituals",
    tone: "from-emerald-900 via-stone-700 to-yellow-600",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Hair",
    caption: "Scalp to silk press",
    count: "26 essentials",
    tone: "from-amber-900 via-stone-700 to-orange-500",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Body",
    caption: "Soft sheen layering",
    count: "14 indulgences",
    tone: "from-rose-900 via-stone-700 to-amber-500",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80",
  },
];

export const products: Product[] = [];

export const featuredCollections = [
  {
    title: "New Arrivals",
    body: "Editorial launches with fresh textures, lighter layers, and modern bronze tones.",
    tone: "from-stone-900 via-stone-700 to-amber-500",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Best Sellers",
    body: "The complexion, body, and fragrance staples our community restocks first.",
    tone: "from-rose-900 via-stone-700 to-orange-500",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80",
  },
];

export const campaignBlocks = [
  {
    eyebrow: "Campaign spotlight",
    title: "Luxury skin, tailored to deeper tones",
    body: "A high-polish complexion system that respects undertone nuance, Kampala humidity, and all-day wear.",
    tone: "from-zinc-900 via-stone-800 to-amber-700",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
  },
  {
    eyebrow: "Body ritual",
    title: "Layer scent, oil, and cream for a signature finish",
    body: "Build a premium routine with glow-first textures and warm florals inspired by East African sunsets.",
    tone: "from-amber-100 via-rose-50 to-stone-50",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
  },
];

export const testimonials = [
  {
    quote: "The complexion shades feel considered, and the body products smell expensive without overwhelming the room.",
    author: "Achen M.",
    role: "Kampala",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
  },
  {
    quote: "It has the clean premium feel I expect from global beauty brands, but the shades and textures finally feel local.",
    author: "Tendo N.",
    role: "Nairobi",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
  },
  {
    quote: "The shopping flow is fast, the product storytelling is strong, and the wishlist-to-cart experience is seamless.",
    author: "Naomi K.",
    role: "London",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
  },
];

export const blogPosts = [
  {
    slug: "the-perfect-soft-glam-base",
    title: "The Perfect Soft-Glam Base for Warm Weather",
    excerpt: "How to layer primer, matte base, and glow products for breathable wear in East African heat.",
    tag: "Tutorial",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "fragrance-layering-guide",
    title: "A Fragrance Layering Guide for Day to Night",
    excerpt: "Pair mists, oils, and parfum without muddying your notes.",
    tag: "Beauty Tips",
    image: "https://images.unsplash.com/photo-1541698444083-023c97d3f4b6?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "founder-vision",
    title: "Inside the Ellena Cosmetics Vision",
    excerpt: "Building a luxury African cosmetics brand with premium craft and global polish.",
    tag: "About Brand",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
  },
];

export const heroStats = [
  { label: "Shade-first complexion", value: "50+" },
  { label: "Luxury rituals", value: "120" },
  { label: "Global shipping destinations", value: "36" },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

