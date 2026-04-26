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

// ─── Curated brand image library ──────────────────────────────────────────
// All images use Unsplash with a consistent w=1600, q=85 baseline. Avatars
// use w=200 q=80. These IDs are widely referenced and proven stable.
const IMG = {
  // Hero / campaign
  heroLipstickGold: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=2400&q=88",
  heroComplexion:   "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=2400&q=88",
  heroBodyRitual:   "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=2400&q=88",
  campaignFilm:     "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=2400&q=90",

  // Categories
  catMakeup:    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=85",
  catSkincare:  "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1400&q=85",
  catHair:      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=85",
  catBody:      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1400&q=85",
  catFragrance: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1400&q=85",

  // Featured collections / blog
  collectionNew:    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1600&q=85",
  collectionBest:   "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1600&q=85",
  blogSoftGlam:     "https://images.unsplash.com/photo-1503236823255-94609f598e71?auto=format&fit=crop&w=1600&q=85",
  blogFragrance:    "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1600&q=85",
  blogFounder:      "https://images.unsplash.com/photo-1562887189-e5d078343de4?auto=format&fit=crop&w=1600&q=85",

  // Avatars (3 distinct portraits)
  avatar1: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=240&q=80",
  avatar2: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
  avatar3: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&q=80",

  // Generic product fallback
  productFallback: "https://images.unsplash.com/photo-1583241475880-083f84372725?auto=format&fit=crop&w=1200&q=85",
};

export const navGroups: NavGroup[] = [
  {
    title: "NEW + BESTSELLERS",
    links: ["New Arrivals", "Best Sellers", "Trending", "Limited Edition", "Bundles", "Minis"],
    promo: {
      eyebrow: "Just dropped",
      heading: "Studio skin with a golden-hour finish",
      body: "Fresh campaign edits, travel kits, and giftable sets for the season.",
      tone: "bg-[#F5E6DA]",
    },
  },
  {
    title: "MAKEUP",
    links: ["Foundation", "Concealer", "Powder", "Blush & Highlighter", "Bronzer & Contour", "Lip Gloss", "Lipstick", "Eye Makeup", "Brushes & Tools", "Shop All Makeup"],
    promo: {
      eyebrow: "Complexion first",
      heading: "Shade systems built for melanin-rich skin",
      body: "Velvet finishes, soft-focus powders, and gloss with editorial shine.",
      tone: "bg-[#F5E6DA]",
    },
  },
  {
    title: "SKINCARE",
    links: ["Cleansers", "Toners", "Serums", "Moisturizers", "Sunscreen (SPF)", "Masks & Treatments", "Lip Care", "Eye Care", "Body Care", "Shop All Skincare"],
    promo: {
      eyebrow: "Barrier rituals",
      heading: "Hydration that reads luminous, never greasy",
      body: "Daily resets and treatment-led essentials for a polished glow.",
      tone: "bg-[#FFFDF9]",
    },
  },
  {
    title: "HAIR",
    links: ["Shampoo", "Conditioner", "Hair Oils", "Hair Growth Products", "Wigs & Braids", "Styling Products", "Tools", "Shop All Hair"],
    promo: {
      eyebrow: "Crown care",
      heading: "Silk press shine and braid-day nourishment",
      body: "Oil-rich rituals, scalp treatments, and styling essentials with salon energy.",
      tone: "bg-[#F5E6DA]",
    },
  },
  {
    title: "BODY",
    links: ["Body Lotion", "Body Scrubs", "Body Oils", "Fragrance Mist", "Bath & Shower", "Shop All Body"],
    promo: {
      eyebrow: "Body veil",
      heading: "Soft sheen textures for the full routine",
      body: "Scrubs, oils, and lotion layers that feel elevated and giftable.",
      tone: "bg-[#FFFDF9]",
    },
  },
  {
    title: "FRAGRANCE",
    links: ["Perfumes", "Body Mists", "Gift Sets", "Shop All Fragrance"],
    promo: {
      eyebrow: "Signature scent",
      heading: "Warm florals cut with amber and spice",
      body: "Statement perfume and layering mists designed to linger beautifully.",
      tone: "bg-[#F5E6DA]",
    },
  },
  {
    title: "DISCOVER",
    links: ["Beauty Tips", "Tutorials", "Blog", "Influencer Picks", "About Brand"],
    promo: {
      eyebrow: "The editorial side",
      heading: "Looks, routines, and founder-led stories",
      body: "A modern beauty journal rooted in confidence, ritual, and African luxury.",
      tone: "bg-[#FFFDF9]",
    },
  },
];

export const categoryHighlights = [
  {
    name: "Makeup",
    caption: "Airbrushed complexion",
    count: "42 formulas",
    tone: "bg-[#2B2B2B]",
    image: IMG.catMakeup,
  },
  {
    name: "Skincare",
    caption: "Glow without compromise",
    count: "18 rituals",
    tone: "bg-[#2B2B2B]",
    image: IMG.catSkincare,
  },
  {
    name: "Hair",
    caption: "Scalp to silk press",
    count: "26 essentials",
    tone: "bg-[#2B2B2B]",
    image: IMG.catHair,
  },
  {
    name: "Body",
    caption: "Soft sheen layering",
    count: "14 indulgences",
    tone: "bg-[#2B2B2B]",
    image: IMG.catBody,
  },
];

export const products: Product[] = [];

export const featuredCollections = [
  {
    title: "New Arrivals",
    body: "Editorial launches with fresh textures, lighter layers, and modern bronze tones.",
    tone: "bg-[#2B2B2B]",
    image: IMG.collectionNew,
  },
  {
    title: "Best Sellers",
    body: "The complexion, body, and fragrance staples our community restocks first.",
    tone: "bg-[#2B2B2B]",
    image: IMG.collectionBest,
  },
];

export const campaignBlocks = [
  {
    eyebrow: "Campaign spotlight",
    title: "Luxury skin, tailored to deeper tones",
    body: "A high-polish complexion system that respects undertone nuance, Kampala humidity, and all-day wear.",
    tone: "bg-[#2B2B2B]",
    image: IMG.heroComplexion,
  },
  {
    eyebrow: "Body ritual",
    title: "Layer scent, oil, and cream for a signature finish",
    body: "Build a premium routine with glow-first textures and warm florals inspired by East African sunsets.",
    tone: "bg-[#F5E6DA]",
    image: IMG.heroBodyRitual,
  },
];

export const testimonials = [
  {
    quote: "The complexion shades feel considered, and the body products smell expensive without overwhelming the room.",
    author: "Achen M.",
    role: "Kampala",
    avatar: IMG.avatar1,
  },
  {
    quote: "It has the clean premium feel I expect from global beauty brands, but the shades and textures finally feel local.",
    author: "Tendo N.",
    role: "Nairobi",
    avatar: IMG.avatar3,
  },
  {
    quote: "The shopping flow is fast, the product storytelling is strong, and the wishlist-to-cart experience is seamless.",
    author: "Naomi K.",
    role: "London",
    avatar: IMG.avatar2,
  },
];

export const blogPosts = [
  {
    slug: "the-perfect-soft-glam-base",
    title: "The Perfect Soft-Glam Base for Warm Weather",
    excerpt: "How to layer primer, matte base, and glow products for breathable wear in East African heat.",
    tag: "Tutorial",
    image: IMG.blogSoftGlam,
  },
  {
    slug: "fragrance-layering-guide",
    title: "A Fragrance Layering Guide for Day to Night",
    excerpt: "Pair mists, oils, and parfum without muddying your notes.",
    tag: "Beauty Tips",
    image: IMG.blogFragrance,
  },
  {
    slug: "founder-vision",
    title: "Inside the Ellena Cosmetics Vision",
    excerpt: "Building a luxury African cosmetics brand with premium craft and global polish.",
    tag: "About Brand",
    image: IMG.blogFounder,
  },
];

export const heroStats = [
  { label: "Shade-first complexion", value: "50+" },
  { label: "Luxury rituals", value: "120" },
  { label: "Global shipping destinations", value: "36" },
];

// Image library export for components that need direct access
export const brandImages = IMG;

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
