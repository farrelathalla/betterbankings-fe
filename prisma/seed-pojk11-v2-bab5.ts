/**
 * POJK 11/2016 BAB V - PELAPORAN (Pasal 47-52)
 *
 * Rev 2 changes: Pasal 47 and 52 changed (online reporting)
 * Run with: npx tsx prisma/seed-pojk11-v2-bab5.ts
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
  console.log("📝 Seeding BAB V - PELAPORAN...\n");

  const standard = await prisma.baselStandard.findUnique({
    where: { code: "POJK11V2" },
  });

  if (!standard) {
    throw new Error("Standard POJK11V2 not found.");
  }

  // Delete existing BAB V
  const existingBab = await prisma.baselChapter.findFirst({
    where: { standardId: standard.id, code: "05" },
  });
  if (existingBab) {
    console.log("⚠️ BAB V exists. Deleting...");
    await prisma.baselChapter.delete({ where: { id: existingBab.id } });
  }

  // Create BAB V
  const chapter = await prisma.baselChapter.create({
    data: {
      code: "05",
      title: "Pelaporan",
      standardId: standard.id,
      effectiveDate: new Date("2016-01-01"),
      lastUpdate: new Date("2022-12-01"),
      status: "current",
      order: 5,
    },
  });
  console.log(`📖 Created BAB V: Pelaporan\n`);

  const chapterId = chapter.id;

  async function createPasal(
    number: string,
    title: string,
    order: number,
    content: string,
    notes: string,
    footnote?: string,
    revisions?: Array<{ title: string; content: string; date: string }>,
  ) {
    const section = await prisma.baselSection.create({
      data: {
        title: `Pasal ${number} - ${title}`,
        chapterId: chapterId,
        order,
      },
    });

    const subsection = await prisma.baselSubsection.create({
      data: {
        number,
        content: createContent(content),
        betterBankingNotes: notes,
        sectionId: section.id,
        order: 1,
      },
    });

    if (footnote) {
      await prisma.baselFootnote.create({
        data: { number: 1, content: footnote, subsectionId: subsection.id },
      });
    }

    if (revisions) {
      for (let i = 0; i < revisions.length; i++) {
        await prisma.baselRevision.create({
          data: {
            title: revisions[i].title,
            content: revisions[i].content,
            revisionDate: new Date(revisions[i].date),
            subsectionId: subsection.id,
            order: i + 1,
          },
        });
      }
    }

    console.log(`  ✅ Pasal ${number} - ${title}`);
  }

  // === PASAL 47 - Laporan KPMM ===
  await createPasal(
    "47",
    "Laporan Perhitungan KPMM",
    1,
    `(1) Bank wajib menyampaikan laporan perhitungan KPMM secara individu.
(2) Bank yang memenuhi kewajiban untuk melakukan perhitungan KPMM secara konsolidasi sebagaimana dimaksud dalam Pasal 7 juga wajib menyampaikan laporan perhitungan KPMM secara konsolidasi.
(3) Laporan sebagaimana dimaksud pada ayat (1) dan ayat (2) disampaikan secara daring melalui sistem pelaporan Otoritas Jasa Keuangan.
(4) Format dan tata cara penyampaian laporan sebagaimana dimaksud pada ayat (3) sesuai dengan peraturan Otoritas Jasa Keuangan mengenai pelaporan bank umum melalui sistem pelaporan Otoritas Jasa Keuangan.`,
    "Bank wajib lapor KPMM individu dan konsolidasi (jika wajib). Rev 2: laporan via sistem online OJK.",
    undefined,
    [
      {
        title: "Ketentuan Asli (POJK 11/2016)",
        content: `(1) Bank yang memenuhi kewajiban perhitungan KPMM secara konsolidasi wajib menyampaikan laporan KPMM konsolidasi.
(2) Bank yang memenuhi kriteria Pasal 29 wajib menyampaikan laporan KPMM dengan Risiko Pasar.
(3) Mengacu ketentuan laporan berkala bank umum.
[Rev 2: diubah menjadi laporan online via sistem OJK]`,
        date: "2016-02-26",
      },
    ],
  );

  // === PASAL 48 - Laporan KPMM Sesuai Profil Risiko ===
  await createPasal(
    "48",
    "Laporan KPMM Sesuai Profil Risiko",
    2,
    `(1) Bank wajib menyampaikan laporan perhitungan KPMM sesuai profil risiko kepada Otoritas Jasa Keuangan.
(2) Laporan sebagaimana dimaksud pada ayat (1) disampaikan bersamaan dengan penyampaian hasil self-assessment tingkat kesehatan bank.`,
    "Laporan KPMM sesuai profil risiko disampaikan bersamaan dengan self-assessment tingkat kesehatan Bank.",
    `Laporan KPMM sesuai profil risiko mencakup: (a) strategi pengelolaan modal; (b) identifikasi dan pengukuran risiko material; (c) penilaian kecukupan modal.`,
  );

  // === PASAL 49 - Laporan CEMA ===
  await createPasal(
    "49",
    "Laporan Pemenuhan CEMA",
    3,
    `(1) Kantor cabang dari bank yang berkedudukan di luar negeri wajib menyampaikan laporan pemenuhan CEMA.
(2) Laporan pemenuhan CEMA sebagaimana dimaksud pada ayat (1) paling sedikit memuat informasi mengenai:
a. rata-rata total kewajiban secara mingguan sebagaimana dimaksud dalam Pasal 24 ayat (2);
b. jumlah alokasi dana usaha dalam bentuk CEMA;
c. jenis aset dan pemenuhan kriteria aset keuangan CEMA;
d. nilai tercatat masing-masing aset keuangan CEMA; dan
e. maturity date aset keuangan CEMA.`,
    "Kantor cabang bank asing wajib lapor CEMA: rata-rata kewajiban mingguan, alokasi dana usaha, jenis dan nilai aset, maturity date.",
  );

  // === PASAL 50 - Batas Waktu Laporan CEMA ===
  await createPasal(
    "50",
    "Batas Waktu Penyampaian Laporan CEMA",
    4,
    `(1) Laporan sebagaimana dimaksud dalam Pasal 49 ayat (1) disusun setiap bulan dan wajib disampaikan kepada Otoritas Jasa Keuangan paling lambat tanggal 8 pada bulan berikutnya.
(2) Apabila batas akhir penyampaian laporan sebagaimana dimaksud pada ayat (1) jatuh pada hari Sabtu, hari Minggu, dan/atau hari libur, laporan pemenuhan CEMA disampaikan pada hari kerja berikutnya.`,
    "Laporan CEMA bulanan, deadline tanggal 8 bulan berikutnya. Jika jatuh di hari libur, disampaikan hari kerja berikutnya.",
  );

  // === PASAL 51 - Keterlambatan dan Tidak Menyampaikan ===
  await createPasal(
    "51",
    "Keterlambatan dan Tidak Menyampaikan Laporan",
    5,
    `(1) Bank dinyatakan terlambat menyampaikan laporan sebagaimana dimaksud dalam Pasal 48 ayat (1) dan Pasal 49 ayat (1) apabila laporan diterima oleh Otoritas Jasa Keuangan setelah batas waktu penyampaian laporan sampai dengan paling lambat 5 (lima) hari setelah batas waktu penyampaian laporan.
(2) Bank dinyatakan tidak menyampaikan laporan sebagaimana dimaksud dalam Pasal 48 ayat (1) dan Pasal 49 ayat (1) apabila laporan belum diterima oleh Otoritas Jasa Keuangan sampai dengan batas waktu keterlambatan sebagaimana dimaksud pada ayat (1).
(3) Bank yang dinyatakan tidak menyampaikan laporan sebagaimana dimaksud pada ayat (2) tetap wajib menyampaikan laporan sebagaimana dimaksud dalam Pasal 48 ayat (1) dan Pasal 49 ayat (1).`,
    "Terlambat: diterima s/d 5 hari setelah deadline. Tidak menyampaikan: belum diterima setelah 5 hari. Tetap wajib menyampaikan meski dinyatakan tidak menyampaikan.",
  );

  // === PASAL 52 - Tata Cara Penyampaian ===
  await createPasal(
    "52",
    "Tata Cara Penyampaian Laporan",
    6,
    `Tata cara penyampaian laporan sebagaimana dimaksud dalam Pasal 48 ayat (1) dan Pasal 49 ayat (1) dilaksanakan sesuai dengan Peraturan Otoritas Jasa Keuangan mengenai pelaporan bank umum melalui sistem pelaporan Otoritas Jasa Keuangan.`,
    "Rev 2: Tata cara laporan sesuai POJK pelaporan bank via sistem online OJK.",
    undefined,
    [
      {
        title: "Ketentuan Asli (POJK 11/2016)",
        content: `Laporan disampaikan kepada: (a) Dept Pengawasan Bank / Kantor Regional 1 Jabodetabek untuk Bank di wilayah Jabodetabek dan Banten; (b) Kantor Regional/Kantor OJK setempat untuk Bank di luar Jabodetabek.
[Rev 2: diubah menjadi via sistem online OJK]`,
        date: "2016-02-26",
      },
    ],
  );

  console.log("\n✅ BAB V Complete! (6 Pasal: 47-52)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
