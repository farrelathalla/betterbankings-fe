/**
 * POJK 11/2016 BAB IX - KETENTUAN PENUTUP (Pasal 63-67)
 *
 * No revisions
 * Run with: npx tsx prisma/seed-pojk11-v2-bab9.ts
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
  console.log("🏁 Seeding BAB IX - KETENTUAN PENUTUP...\n");

  const standard = await prisma.baselStandard.findUnique({
    where: { code: "POJK11V2" },
  });

  if (!standard) {
    throw new Error("Standard POJK11V2 not found.");
  }

  // Delete existing BAB IX
  const existingBab = await prisma.baselChapter.findFirst({
    where: { standardId: standard.id, code: "09" },
  });
  if (existingBab) {
    console.log("⚠️ BAB IX exists. Deleting...");
    await prisma.baselChapter.delete({ where: { id: existingBab.id } });
  }

  // Create BAB IX
  const chapter = await prisma.baselChapter.create({
    data: {
      code: "09",
      title: "Ketentuan Penutup",
      standardId: standard.id,
      effectiveDate: new Date("2016-01-01"),
      lastUpdate: new Date("2016-02-26"),
      status: "current",
      order: 9,
    },
  });
  console.log(`📖 Created BAB IX: Ketentuan Penutup\n`);

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

  // === PASAL 63 - Ketentuan Lebih Lanjut ===
  await createPasal(
    "63",
    "Ketentuan Lebih Lanjut dalam SEOJK",
    1,
    `Ketentuan lebih lanjut dari Peraturan Otoritas Jasa Keuangan ini diatur dalam Surat Edaran Otoritas Jasa Keuangan.`,
    "Ketentuan detail diatur dalam SEOJK (Surat Edaran OJK).",
  );

  // === PASAL 64 - Pencabutan PBI dan SE BI ===
  await createPasal(
    "64",
    "Pencabutan PBI dan SE BI",
    2,
    `Pada saat Peraturan Otoritas Jasa Keuangan ini mulai berlaku:
a. Peraturan Bank Indonesia Nomor 15/12/PBI/2013 tanggal 12 Desember 2013 tentang Kewajiban Penyediaan Modal Minimum Bank Umum (Lembaran Negara Republik Indonesia Tahun 2013 Nomor 223, Tambahan Lembaran Negara Republik Indonesia Nomor 5469); dan
b. Surat Edaran Bank Indonesia Nomor 9/31/DPNP tanggal 12 Desember 2007 perihal Pedoman Penggunaan Model Internal dalam Perhitungan Kewajiban Penyediaan Modal Minimum Bank Umum dengan Memperhitungkan Risiko Pasar;
dicabut dan dinyatakan tidak berlaku.`,
    "Mencabut: (a) PBI 15/12/PBI/2013 tentang KPMM, (b) SE BI 9/31/DPNP tentang Model Internal Risiko Pasar.",
  );

  // === PASAL 65 - SE BI yang Tetap Berlaku ===
  await createPasal(
    "65",
    "SE BI yang Tetap Berlaku",
    3,
    `Pada saat Peraturan Otoritas Jasa Keuangan ini mulai berlaku:
a. Surat Edaran Bank Indonesia Nomor 9/33/DPNP tanggal 18 Desember 2007 perihal Pedoman Penggunaan Metode Standar dalam Perhitungan Kewajiban Penyediaan Modal Minimum Bank Umum dengan Memperhitungkan Risiko Pasar;
b. Surat Edaran Bank Indonesia Nomor 11/3/DPNP tanggal 27 Januari 2009 perihal Perhitungan Aset Tertimbang Menurut Risiko (ATMR) untuk Risiko Operasional dengan Menggunakan Pendekatan Indikator Dasar (PID);
c. Surat Edaran Bank Indonesia Nomor 13/6/DPNP tanggal 18 Februari 2011 perihal Pedoman Perhitungan Aset Tertimbang Menurut Risiko untuk Risiko Kredit dengan Menggunakan Pendekatan Standar;
d. Surat Edaran Bank Indonesia Nomor 14/21/DPNP tanggal 18 Juli 2012 perihal Perubahan atas Surat Edaran Bank Indonesia Nomor 9/33/DPNP tanggal 18 Desember 2007 perihal Pedoman Penggunaan Metode Standar dalam Perhitungan Kewajiban Penyediaan Modal Minimum Bank Umum dengan Memperhitungkan Risiko Pasar; dan
e. Surat Edaran Bank Indonesia Nomor 14/37/DPNP tanggal 27 Desember 2012 perihal Kewajiban Penyediaan Modal Minimum sesuai Profil Risiko dan Pemenuhan Capital Equivalency Maintained Assets (CEMA),
masih tetap berlaku sepanjang tidak bertentangan dengan ketentuan dalam Peraturan Otoritas Jasa Keuangan ini.`,
    "SE BI tetap berlaku: (a) SE 9/33 Metode Standar Risiko Pasar, (b) SE 11/3 PID Risiko Operasional, (c) SE 13/6 Pendekatan Standar Risiko Kredit, (d) SE 14/21 Perubahan Metode Standar Risiko Pasar, (e) SE 14/37 KPMM Profil Risiko dan CEMA.",
  );

  // === PASAL 66 - Peraturan Pelaksanaan PBI ===
  await createPasal(
    "66",
    "Peraturan Pelaksanaan PBI Tetap Berlaku",
    4,
    `Pada saat Peraturan Otoritas Jasa Keuangan ini mulai berlaku, peraturan pelaksanaan dari:
a. Peraturan Bank Indonesia Nomor 14/18/PBI/2012 tanggal 28 November 2012 tentang Kewajiban Penyediaan Modal Minimum Bank Umum (Lembaran Negara Republik Indonesia Tahun 2012 Nomor 261, Tambahan Lembaran Negara Republik Indonesia Nomor 5369); dan
b. Peraturan Bank Indonesia Nomor 15/12/PBI/2013 tanggal 12 Desember 2013 tentang Kewajiban Penyediaan Modal Minimum Bank Umum (Lembaran Negara Republik Indonesia Tahun 2013 Nomor 223, Tambahan Lembaran Negara Republik Indonesia Nomor 5469),
selain yang disebutkan dalam Pasal 65, dinyatakan tetap berlaku sepanjang tidak bertentangan dengan ketentuan dalam Peraturan Otoritas Jasa Keuangan ini.`,
    "Peraturan pelaksanaan dari PBI 14/18/2012 dan PBI 15/12/2013 (selain yang sudah disebut di Pasal 65) tetap berlaku sepanjang tidak bertentangan.",
  );

  // === PASAL 67 - Berlakunya POJK ===
  await createPasal(
    "67",
    "Berlakunya Peraturan",
    5,
    `Peraturan Otoritas Jasa Keuangan ini mulai berlaku pada tanggal diundangkan.`,
    "POJK 11/2016 berlaku sejak tanggal diundangkan (25 Februari 2016).",
  );

  console.log("\n✅ BAB IX Complete! (5 Pasal: 63-67)");
  console.log("\n🎉 POJK 11/2016 SEEDING COMPLETE!");
  console.log("   Total: 9 BAB, 67 Pasal");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
