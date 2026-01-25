/**
 * POJK 11/2016 BAB I Seed Script (New Structure with Revisions & Notes)
 *
 * Run with: npx tsx prisma/seed-pojk11-v2.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper to create TipTap JSON content
function createContent(text: string): string {
  return JSON.stringify({
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text }] }],
  });
}

async function main() {
  console.log("🏦 Seeding POJK 11/2016 BAB I (New Structure)...\n");

  // Delete existing if exists
  const existing = await prisma.baselStandard.findUnique({
    where: { code: "POJK11V2" },
  });
  if (existing) {
    console.log("⚠️ POJK11V2 exists. Deleting...");
    await prisma.baselStandard.delete({ where: { code: "POJK11V2" } });
  }

  // Create Standard
  const standard = await prisma.baselStandard.create({
    data: {
      code: "POJK11V2",
      name: "KPMM Bank Umum",
      description:
        "POJK 11/POJK.03/2016 tentang Kewajiban Penyediaan Modal Minimum Bank Umum (Konsolidasi dengan Revisi)",
      order: 10,
    },
  });
  console.log(`✅ Created Standard: ${standard.code}`);

  // BAB I - Ketentuan Umum
  const bab1 = await prisma.baselChapter.create({
    data: {
      code: "01",
      title: "Ketentuan Umum",
      standardId: standard.id,
      effectiveDate: new Date("2016-01-01"),
      lastUpdate: new Date("2022-12-01"),
      status: "current",
      order: 1,
    },
  });
  console.log(`  📖 Created BAB I: ${bab1.title}`);

  // Section: Pasal 1 - Definisi
  const sectionPasal1 = await prisma.baselSection.create({
    data: { title: "Pasal 1 - Definisi", chapterId: bab1.id, order: 1 },
  });

  // Pasal 1 content will be added in next file update
  console.log(`    📝 Created Section: ${sectionPasal1.title}`);

  // Section: Pasal 2 - Modal Minimum
  const sectionPasal2 = await prisma.baselSection.create({
    data: {
      title: "Pasal 2 - Kewajiban Modal Minimum",
      chapterId: bab1.id,
      order: 2,
    },
  });
  console.log(`    📝 Created Section: ${sectionPasal2.title}`);

  // Section: Pasal 3 - Tambahan Modal
  const sectionPasal3 = await prisma.baselSection.create({
    data: {
      title: "Pasal 3 - Tambahan Modal (Buffer)",
      chapterId: bab1.id,
      order: 3,
    },
  });
  console.log(`    📝 Created Section: ${sectionPasal3.title}`);

  // Section: Pasal 4 - Kewajiban Pembentukan Buffer
  const sectionPasal4 = await prisma.baselSection.create({
    data: {
      title: "Pasal 4 - Kewajiban Pembentukan Buffer",
      chapterId: bab1.id,
      order: 4,
    },
  });
  console.log(`    📝 Created Section: ${sectionPasal4.title}`);

  // Section: Pasal 5 - Bank Sistemik
  const sectionPasal5 = await prisma.baselSection.create({
    data: {
      title: "Pasal 5 - Penetapan Bank Sistemik",
      chapterId: bab1.id,
      order: 5,
    },
  });
  console.log(`    📝 Created Section: ${sectionPasal5.title}`);

  // Section: Pasal 6 - Pemberlakuan
  const sectionPasal6 = await prisma.baselSection.create({
    data: {
      title: "Pasal 6 - Pemberlakuan Tambahan Modal",
      chapterId: bab1.id,
      order: 6,
    },
  });
  console.log(`    📝 Created Section: ${sectionPasal6.title}`);

  // Section: Pasal 7 - Konsolidasi
  const sectionPasal7 = await prisma.baselSection.create({
    data: {
      title: "Pasal 7 - Kewajiban Konsolidasi",
      chapterId: bab1.id,
      order: 7,
    },
  });
  console.log(`    📝 Created Section: ${sectionPasal7.title}`);

  // Section: Pasal 8 - Distribusi Laba
  const sectionPasal8 = await prisma.baselSection.create({
    data: {
      title: "Pasal 8 - Pembatasan Distribusi Laba",
      chapterId: bab1.id,
      order: 8,
    },
  });
  console.log(`    📝 Created Section: ${sectionPasal8.title}`);

  console.log(
    "\n✅ BAB I structure created. Run seed-pojk11-v2-content.ts to add content.",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
