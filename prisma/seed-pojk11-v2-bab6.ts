/**
 * POJK 11/2016 BAB VI - KETENTUAN LAIN-LAIN (Pasal 53-54)
 *
 * Rev 2: Pasal 53 DELETED
 * Run with: npx tsx prisma/seed-pojk11-v2-bab6.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function createContent(text: string): string {
  return JSON.stringify({
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text }] }],
  });
}

async function main() {
  console.log("📜 Seeding BAB VI - KETENTUAN LAIN-LAIN...\n");

  const standard = await prisma.baselStandard.findUnique({
    where: { code: "POJK11V2" },
  });

  if (!standard) {
    throw new Error("Standard POJK11V2 not found.");
  }

  // Delete existing BAB VI
  const existingBab = await prisma.baselChapter.findFirst({
    where: { standardId: standard.id, code: "06" },
  });
  if (existingBab) {
    console.log("⚠️ BAB VI exists. Deleting...");
    await prisma.baselChapter.delete({ where: { id: existingBab.id } });
  }

  // Create BAB VI
  const chapter = await prisma.baselChapter.create({
    data: {
      code: "06",
      title: "Ketentuan Lain-Lain",
      standardId: standard.id,
      effectiveDate: new Date("2016-01-01"),
      lastUpdate: new Date("2022-12-01"),
      status: "current",
      order: 6,
    },
  });
  console.log(`📖 Created BAB VI: Ketentuan Lain-Lain\n`);

  const chapterId = chapter.id;

  // === PASAL 53 - DIHAPUS ===
  const section53 = await prisma.baselSection.create({
    data: {
      title: "Pasal 53 - [DIHAPUS - Rev 2]",
      chapterId: chapterId,
      order: 1,
    },
  });

  const subsection53 = await prisma.baselSubsection.create({
    data: {
      number: "53",
      content: createContent("[PASAL INI DIHAPUS OLEH POJK 23/2022]"),
      betterBankingNotes:
        "DIHAPUS oleh Rev 2. Sebelumnya melarang perdagangan aset AFS dengan pola menyerupai trading dalam jumlah signifikan atau frekuensi tinggi.",
      sectionId: section53.id,
      order: 1,
    },
  });

  await prisma.baselRevision.create({
    data: {
      title: "Ketentuan Asli (POJK 11/2016) - DIHAPUS",
      content: `Bank dilarang melakukan perdagangan atas aset keuangan dalam kategori tersedia untuk dijual, yang dilakukan dengan pola menyerupai perdagangan atas aset keuangan dalam kategori diperdagangkan:
a. dalam jumlah yang signifikan; dan/atau
b. dalam frekuensi yang tinggi.
[Catatan: Yang dimaksud "jumlah signifikan" adalah signifikan terhadap total aset keuangan AFS]`,
      revisionDate: new Date("2016-02-26"),
      subsectionId: subsection53.id,
      order: 1,
    },
  });

  console.log("  ✅ Pasal 53 - [DIHAPUS - Rev 2]");

  // === PASAL 54 - Kewenangan OJK ===
  const section54 = await prisma.baselSection.create({
    data: {
      title: "Pasal 54 - Kewenangan OJK Menetapkan Bobot Risiko dan Buffer",
      chapterId: chapterId,
      order: 2,
    },
  });

  await prisma.baselSubsection.create({
    data: {
      number: "54",
      content:
        createContent(`Otoritas Jasa Keuangan berdasarkan pertimbangan kondisi perekonomian dan stabilitas sistem keuangan, dengan tetap memperhatikan prinsip kehati-hatian, berwenang menetapkan:
a. bobot risiko atas ATMR yang berbeda dengan bobot risiko yang diatur dalam peraturan pelaksanaan dari Peraturan Otoritas Jasa Keuangan ini; dan
b. besaran tambahan modal sebagai penyangga (buffer) yang berbeda dengan besaran tambahan modal yang diatur dalam Peraturan Otoritas Jasa Keuangan ini.`),
      betterBankingNotes:
        "OJK berwenang menetapkan bobot risiko ATMR dan besaran buffer yang berbeda dari ketentuan, berdasarkan pertimbangan ekonomi dan stabilitas keuangan.",
      sectionId: section54.id,
      order: 1,
    },
  });

  console.log(
    "  ✅ Pasal 54 - Kewenangan OJK Menetapkan Bobot Risiko dan Buffer",
  );

  console.log("\n✅ BAB VI Complete! (2 Pasal: 53-54)");
  console.log("   Note: Pasal 53 DELETED by Rev 2");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
