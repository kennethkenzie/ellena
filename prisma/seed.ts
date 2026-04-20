import { PrismaClient } from "@prisma/client";
import data from "../data/products.json";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // --- Categories ---
  console.log(`Upserting ${data.categories.length} categories...`);
  for (const category of data.categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: { name: category.name },
      create: { id: category.id, name: category.name },
    });
    console.log(`  ✓ ${category.name}`);
  }

  // --- Products ---
  console.log(`\nUpserting ${data.products.length} products...`);
  for (const product of data.products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        brand: product.brand,
        name: product.name,
        categoryId: product.category,
        price: product.price ?? null,
        currency: product.currency,
        size: product.size ?? null,
        description: product.description,
        image: product.image,
        inStock: product.inStock,
        featured: product.featured,
        needsReview: (product as { needsReview?: boolean }).needsReview ?? false,
      },
      create: {
        id: product.id,
        brand: product.brand,
        name: product.name,
        categoryId: product.category,
        price: product.price ?? null,
        currency: product.currency,
        size: product.size ?? null,
        description: product.description,
        image: product.image,
        inStock: product.inStock,
        featured: product.featured,
        needsReview: (product as { needsReview?: boolean }).needsReview ?? false,
      },
    });
    console.log(`  ✓ ${product.name}${product.size ? ` (${product.size})` : ""}`);
  }

  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
