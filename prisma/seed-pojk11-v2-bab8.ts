/**
 * POJK 11/2016 BAB VIII - KETENTUAN PERALIHAN (Pasal 60-62)
 *
 * No revisions
 * Run with: npx tsx prisma/seed-pojk11-v2-bab8.ts
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
  console.log("📅 Seeding BAB VIII - KETENTUAN PERALIHAN...\n");

  const standard = await prisma.baselStandard.findUnique({
    where: { code: "POJK11V2" },
  });

  if (!standard) {
    throw new Error("Standard POJK11V2 not found.");
  }

  // Delete existing BAB VIII
  const existingBab = await prisma.baselChapter.findFirst({
    where: { standardId: standard.id, code: "08" },
  });
  if (existingBab) {
    console.log("⚠️ BAB VIII exists. Deleting...");
    await prisma.baselChapter.delete({ where: { id: existingBab.id } });
  }

  // Create BAB VIII
  const chapter = await prisma.baselChapter.create({
    data: {
      code: "08",
      title: "Ketentuan Peralihan",
      standardId: standard.id,
      effectiveDate: new Date("2016-01-01"),
      lastUpdate: new Date("2016-02-26"),
      status: "current",
      order: 8,
    },
  });
  console.log(`📖 Created BAB VIII: Ketentuan Peralihan\n`);

  const chapterId = chapter.id;

  async function createPasal(
    number: string,
    title: string,
    order: number,
    content: string,
    notes: string,
  ) {
    const section = await prisma.baselSection.create({
      data: {
        title: `Pasal ${number} - ${title}`,
        chapterId: chapterId,
        order,
      },
    });

    await prisma.baselSubsection.create({
      data: {
        number,
        content: createContent(content),
        betterBankingNotes: notes,
        sectionId: section.id,
        order: 1,
      },
    });

    console.log(`  ✅ Pasal ${number} - ${title}`);
  }

  // === PASAL 60 - Instrumen Modal Tanpa Jangka Waktu ===
  await createPasal(
    "60",
    "Instrumen Modal Tanpa Jangka Waktu (Existing)",
    1,
    `Instrumen modal yang tidak memiliki jangka waktu yang telah diakui dalam perhitungan Kewajiban Penyediaan Modal Minimum pada posisi 31 Desember 2013, namun tidak lagi memenuhi kriteria komponen modal sesuai Peraturan Otoritas Jasa Keuangan ini dapat tetap diakui sebagai komponen modal sampai dengan tanggal 31 Desember 2018.`,
    "Instrumen perpetual existing (per 31 Des 2013) yang tidak memenuhi kriteria baru dapat diakui sampai 31 Des 2018.",
  );

  // === PASAL 61 - Instrumen Modal Dengan Jangka Waktu ===
  await createPasal(
    "61",
    "Instrumen Modal Dengan Jangka Waktu (Existing)",
    2,
    `Instrumen modal yang memiliki jangka waktu telah diakui dalam perhitungan Kewajiban Penyediaan Modal Minimum pada posisi 31 Desember 2013, namun tidak lagi memenuhi kriteria komponen modal sesuai Peraturan Otoritas Jasa Keuangan ini dapat tetap diakui sebagai komponen modal sampai dengan jatuh tempo dan tidak dapat diperpanjang jangka waktunya.`,
    "Instrumen modal dated existing (per 31 Des 2013) yang tidak memenuhi kriteria baru dapat diakui sampai jatuh tempo, tidak dapat diperpanjang.",
  );

  // === PASAL 62 - Instrumen Modal Baru ===
  await createPasal(
    "62",
    "Instrumen Modal Baru Sejak 1 Januari 2014",
    3,
    `Instrumen modal yang diterbitkan sejak tanggal 1 Januari 2014 harus sudah memenuhi persyaratan sebagaimana diatur dalam Peraturan Otoritas Jasa Keuangan ini.`,
    "Instrumen modal baru (sejak 1 Jan 2014) wajib memenuhi persyaratan POJK 11/2016.",
  );

  console.log("\n✅ BAB VIII Complete! (3 Pasal: 60-62)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
