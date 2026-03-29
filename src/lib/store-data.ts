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
  { name: "Makeup", caption: "Airbrushed complexion", count: "42 formulas", tone: "from-stone-900 via-stone-700 to-amber-600" },
  { name: "Skincare", caption: "Glow without compromise", count: "18 rituals", tone: "from-emerald-900 via-stone-700 to-yellow-600" },
  { name: "Hair", caption: "Scalp to silk press", count: "26 essentials", tone: "from-amber-900 via-stone-700 to-orange-500" },
  { name: "Body", caption: "Soft sheen layering", count: "14 indulgences", tone: "from-rose-900 via-stone-700 to-amber-500" },
];

export const products: Product[] = [
  {
    slug: "ellena-soft-matte-foundation",
    name: "Ellena Soft Matte Foundation",
    category: "Makeup",
    subcategory: "Foundation",
    price: 189000,
    rating: 4.9,
    reviewCount: 312,
    shades: ["Nile 420", "Kampala 360", "Savanna 300", "Ebony 510"],
    description: "A humidity-ready matte foundation with breathable coverage and a blurred skin finish.",
    badge: "Best seller",
    accent: "from-amber-200 via-orange-200 to-stone-100",
    heroTone: "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.5),_transparent_50%),linear-gradient(135deg,#ad6e48,#d9b38c)]",
  },
  {
    slug: "silk-veil-concealer",
    name: "Silk Veil Concealer",
    category: "Makeup",
    subcategory: "Concealer",
    price: 129000,
    rating: 4.8,
    reviewCount: 204,
    shades: ["Honey 03", "Clove 06", "Espresso 10"],
    description: "Medium-to-full coverage concealer that brightens under-eyes and spot corrects without creasing.",
    accent: "from-rose-200 via-orange-100 to-amber-100",
    heroTone: "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.45),_transparent_50%),linear-gradient(135deg,#c48366,#edd6c1)]",
  },
  {
    slug: "gold-lustre-highlighter-duo",
    name: "Gold Lustre Highlighter Duo",
    category: "Makeup",
    subcategory: "Blush & Highlighter",
    price: 149000,
    rating: 4.7,
    reviewCount: 188,
    shades: ["Champagne Heat", "Copper Aura"],
    description: "Two baked powders that melt into the skin for candlelit glow with no glitter fall-out.",
    badge: "Trending",
    accent: "from-yellow-100 via-amber-100 to-orange-100",
    heroTone: "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.55),_transparent_50%),linear-gradient(135deg,#b98a46,#f1d6a7)]",
  },
  {
    slug: "dew-ritual-vitamin-c-serum",
    name: "Dew Ritual Vitamin C Serum",
    category: "Skincare",
    subcategory: "Serums",
    price: 169000,
    rating: 4.9,
    reviewCount: 274,
    shades: ["30 ml"],
    description: "Brightening vitamin C complex with niacinamide for tone-evening radiance.",
    badge: "New",
    accent: "from-orange-100 via-amber-50 to-lime-50",
    heroTone: "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.5),_transparent_50%),linear-gradient(135deg,#d4a15a,#f6e5bf)]",
  },
  {
    slug: "baobab-barrier-cream",
    name: "Baobab Barrier Cream",
    category: "Skincare",
    subcategory: "Moisturizers",
    price: 154000,
    rating: 4.8,
    reviewCount: 161,
    shades: ["50 ml"],
    description: "Velvet-rich moisturizer powered by baobab, ceramides, and panthenol for comfort that lasts.",
    accent: "from-stone-100 via-orange-50 to-amber-100",
    heroTone: "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.5),_transparent_50%),linear-gradient(135deg,#c59c79,#f2dfc8)]",
  },
  {
    slug: "sun-veil-spf-50",
    name: "Sun Veil SPF 50",
    category: "Skincare",
    subcategory: "Sunscreen (SPF)",
    price: 142000,
    rating: 4.7,
    reviewCount: 133,
    shades: ["50 ml"],
    description: "Invisible broad-spectrum SPF with a non-ashy finish designed for deeper skin tones.",
    accent: "from-yellow-100 via-white to-stone-100",
    heroTone: "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.55),_transparent_50%),linear-gradient(135deg,#e2b873,#fff0c2)]",
  },
  {
    slug: "crown-repair-hair-oil",
    name: "Crown Repair Hair Oil",
    category: "Hair",
    subcategory: "Hair Oils",
    price: 118000,
    rating: 4.8,
    reviewCount: 226,
    shades: ["50 ml"],
    description: "Lightweight scalp and length treatment with castor, moringa, and marula oils.",
    accent: "from-amber-200 via-yellow-100 to-stone-100",
    heroTone: "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4),_transparent_50%),linear-gradient(135deg,#8e5c2e,#cfa063)]",
  },
  {
    slug: "silk-wrap-leave-in",
    name: "Silk Wrap Leave-In",
    category: "Hair",
    subcategory: "Styling Products",
    price: 96000,
    rating: 4.6,
    reviewCount: 97,
    shades: ["150 ml"],
    description: "Hydrating leave-in that softens curls, braids, and heat-styled hair while guarding against breakage.",
    accent: "from-orange-100 via-stone-100 to-yellow-50",
    heroTone: "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.45),_transparent_50%),linear-gradient(135deg,#9a6842,#ddb58f)]",
  },
  {
    slug: "velvet-body-creme",
    name: "Velvet Body Creme",
    category: "Body",
    subcategory: "Body Lotion",
    price: 132000,
    rating: 4.8,
    reviewCount: 148,
    shades: ["200 ml"],
    description: "Whipped shea, squalane, and vanilla orchid for a polished all-over sheen.",
    badge: "Top rated",
    accent: "from-rose-100 via-stone-50 to-orange-100",
    heroTone: "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.5),_transparent_50%),linear-gradient(135deg,#b77974,#f2d5d0)]",
  },
  {
    slug: "amber-bloom-mist",
    name: "Amber Bloom Mist",
    category: "Fragrance",
    subcategory: "Body Mists",
    price: 110000,
    rating: 4.7,
    reviewCount: 119,
    shades: ["100 ml"],
    description: "An airy body mist layered with amber, neroli, and sunlit musk.",
    accent: "from-amber-100 via-rose-50 to-stone-100",
    heroTone: "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4),_transparent_50%),linear-gradient(135deg,#ab6d57,#edc9af)]",
  },
  {
    slug: "midnight-orchid-parfum",
    name: "Midnight Orchid Parfum",
    category: "Fragrance",
    subcategory: "Perfumes",
    price: 245000,
    rating: 4.9,
    reviewCount: 86,
    shades: ["50 ml"],
    description: "A warm floral extrait with orchid petals, spice, and polished woods.",
    badge: "Limited edition",
    accent: "from-stone-900 via-stone-700 to-amber-600",
    heroTone: "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_50%),linear-gradient(135deg,#1d1716,#5f4a34)]",
  },
  {
    slug: "glossed-lip-oil",
    name: "Glossed Lip Oil",
    category: "Makeup",
    subcategory: "Lip Gloss",
    price: 98000,
    rating: 4.8,
    reviewCount: 192,
    shades: ["Rose Nude", "Terracotta Kiss", "Honey Bronze"],
    description: "A cushiony lip oil with mirror shine, soft pigment, and a plush vanilla feel.",
    accent: "from-rose-100 via-orange-100 to-amber-100",
    heroTone: "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.45),_transparent_50%),linear-gradient(135deg,#b46661,#f0c8c0)]",
  }
];

export const featuredCollections = [
  {
    title: "New Arrivals",
    body: "Editorial launches with fresh textures, lighter layers, and modern bronze tones.",
    tone: "from-stone-900 via-stone-700 to-amber-500",
  },
  {
    title: "Best Sellers",
    body: "The complexion, body, and fragrance staples our community restocks first.",
    tone: "from-rose-900 via-stone-700 to-orange-500",
  },
];

export const campaignBlocks = [
  {
    eyebrow: "Campaign spotlight",
    title: "Luxury skin, tailored to deeper tones",
    body: "A high-polish complexion system that respects undertone nuance, Kampala humidity, and all-day wear.",
    tone: "from-zinc-900 via-stone-800 to-amber-700",
  },
  {
    eyebrow: "Body ritual",
    title: "Layer scent, oil, and cream for a signature finish",
    body: "Build a premium routine with glow-first textures and warm florals inspired by East African sunsets.",
    tone: "from-amber-100 via-rose-50 to-stone-50",
  },
];

export const testimonials = [
  {
    quote: "The complexion shades feel considered, and the body products smell expensive without overwhelming the room.",
    author: "Achen M.",
    role: "Kampala",
  },
  {
    quote: "It has the clean premium feel I expect from global beauty brands, but the shades and textures finally feel local.",
    author: "Tendo N.",
    role: "Nairobi",
  },
  {
    quote: "The shopping flow is fast, the product storytelling is strong, and the wishlist-to-cart experience is seamless.",
    author: "Naomi K.",
    role: "London",
  },
];

export const blogPosts = [
  {
    slug: "the-perfect-soft-glam-base",
    title: "The Perfect Soft-Glam Base for Warm Weather",
    excerpt: "How to layer primer, matte base, and glow products for breathable wear in East African heat.",
    tag: "Tutorial",
  },
  {
    slug: "fragrance-layering-guide",
    title: "A Fragrance Layering Guide for Day to Night",
    excerpt: "Pair mists, oils, and parfum without muddying your notes.",
    tag: "Beauty Tips",
  },
  {
    slug: "founder-vision",
    title: "Inside the Ellena Cosmetics Vision",
    excerpt: "Building a luxury African cosmetics brand with premium craft and global polish.",
    tag: "About Brand",
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

