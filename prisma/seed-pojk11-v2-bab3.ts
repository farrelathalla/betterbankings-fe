/**
 * POJK 11/2016 BAB III - ATMR (Aset Tertimbang Menurut Risiko)
 *
 * Original: Pasal 27-42 (16 Pasal)
 * Rev 2 changes:
 * - Pasal 27 changed
 * - Pasal 30, 31, 34, 35, 36, 42 DELETED
 * - Pasal 33A, 42A, 42B ADDED
 * - BAB IIIA added (CCP & Margin)
 *
 * Run after: seed-pojk11-v2.ts
 * Run with: npx tsx prisma/seed-pojk11-v2-bab3.ts
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
  console.log("📊 Seeding BAB III - ATMR...\n");

  const standard = await prisma.baselStandard.findUnique({
    where: { code: "POJK11V2" },
  });

  if (!standard) {
    throw new Error(
      "Standard POJK11V2 not found. Run seed-pojk11-v2.ts first.",
    );
  }

  // Delete existing BAB III
  const existingBab3 = await prisma.baselChapter.findFirst({
    where: { standardId: standard.id, code: "03" },
  });
  if (existingBab3) {
    console.log("⚠️ BAB III exists. Deleting...");
    await prisma.baselChapter.delete({ where: { id: existingBab3.id } });
  }

  // Create BAB III
  const bab3 = await prisma.baselChapter.create({
    data: {
      code: "03",
      title: "Aset Tertimbang Menurut Risiko (ATMR)",
      standardId: standard.id,
      effectiveDate: new Date("2016-01-01"),
      lastUpdate: new Date("2022-12-01"),
      status: "current",
      order: 3,
    },
  });
  console.log(`📖 Created BAB III: ${bab3.title}\n`);

  const chapterId = bab3.id;

  // Helper
  async function createPasal(
    number: string,
    title: string,
    order: number,
    subsections: Array<{
      number: string;
      content: string;
      notes: string;
      footnote?: string;
      revisions?: Array<{ title: string; content: string; date: string }>;
    }>,
  ) {
    const section = await prisma.baselSection.create({
      data: {
        title: `Pasal ${number} - ${title}`,
        chapterId: chapterId,
        order,
      },
    });

    for (const sub of subsections) {
      const subsection = await prisma.baselSubsection.create({
        data: {
          number: sub.number,
          content: createContent(sub.content),
          betterBankingNotes: sub.notes,
          sectionId: section.id,
          order: parseInt(sub.number.replace(/\D/g, "") || "1"),
        },
      });

      if (sub.footnote) {
        await prisma.baselFootnote.create({
          data: {
            number: 1,
            content: sub.footnote,
            subsectionId: subsection.id,
          },
        });
      }

      if (sub.revisions) {
        for (let i = 0; i < sub.revisions.length; i++) {
          await prisma.baselRevision.create({
            data: {
              title: sub.revisions[i].title,
              content: sub.revisions[i].content,
              revisionDate: new Date(sub.revisions[i].date),
              subsectionId: subsection.id,
              order: i + 1,
            },
          });
        }
      }
    }
    console.log(`  ✅ Pasal ${number} - ${title}`);
  }

  // === PASAL 27 - Komponen ATMR ===
  await createPasal("27", "Komponen ATMR", 1, [
    {
      number: "27",
      content: `(1) Aset tertimbang menurut risiko yang digunakan dalam perhitungan modal minimum sebagaimana dimaksud dalam Pasal 2 ayat (3) dan perhitungan pembentukan tambahan modal sebagai penyangga sebagaimana dimaksud dalam Pasal 3 ayat (3) terdiri atas:
a. aset tertimbang menurut risiko untuk Risiko Kredit;
b. aset tertimbang menurut risiko untuk Risiko Operasional; dan
c. aset tertimbang menurut risiko untuk Risiko Pasar.
(2) Metode perhitungan aset tertimbang menurut risiko sebagaimana dimaksud pada ayat (1) ditetapkan oleh Otoritas Jasa Keuangan.`,
      notes:
        "ATMR = ATMR Kredit + ATMR Operasional + ATMR Pasar. Metode perhitungan ditetapkan OJK. Rev 2: menambah ayat (2) tentang metode penetapan OJK.",
      revisions: [
        {
          title: "Ketentuan Asli (POJK 11/2016)",
          content: `ATMR yang digunakan dalam perhitungan modal minimum... terdiri atas:
a. ATMR untuk Risiko Kredit;
b. ATMR untuk Risiko Operasional; dan
c. ATMR untuk Risiko Pasar.
[Tidak ada ayat (2). Rev 2: menambah ayat (2) tentang metode ditetapkan OJK]`,
          date: "2016-02-26",
        },
      ],
    },
  ]);

  // === PASAL 28 - Kewajiban Perhitungan ATMR ===
  await createPasal("28", "Kewajiban Perhitungan ATMR", 2, [
    {
      number: "28",
      content: `(1) Setiap Bank wajib memperhitungkan ATMR untuk Risiko Kredit dan ATMR untuk Risiko Operasional.
(2) Selain memenuhi kewajiban sebagaimana dimaksud pada ayat (1), Bank yang memenuhi kriteria tertentu wajib memperhitungkan ATMR untuk Risiko Pasar.`,
      notes:
        "Semua Bank wajib hitung ATMR Kredit dan Operasional. Bank tertentu wajib hitung ATMR Pasar (lihat Pasal 29 dan 33A).",
    },
  ]);

  // === PASAL 29 - Kriteria Wajib ATMR Pasar ===
  await createPasal("29", "Kriteria Wajib Perhitungan ATMR Pasar", 3, [
    {
      number: "29",
      content: `Kriteria tertentu sebagaimana dimaksud dalam Pasal 28 ayat (2) adalah:
a. Bank yang secara individu memenuhi salah satu kriteria:
1. Bank dengan total aset sebesar Rp10.000.000.000.000,00 (sepuluh triliun rupiah) atau lebih;
2. Bank yang melakukan kegiatan usaha dalam valuta asing dengan posisi instrumen keuangan berupa surat berharga dan/atau transaksi derivatif dalam Trading Book sebesar Rp20.000.000.000,00 (dua puluh miliar rupiah) atau lebih; atau
3. Bank yang tidak melakukan kegiatan usaha dalam valuta asing dengan posisi instrumen keuangan berupa surat berharga dan/atau transaksi derivatif suku bunga dalam Trading Book sebesar Rp25.000.000.000,00 (dua puluh lima miliar rupiah) atau lebih,
dan/atau
b. Bank yang secara konsolidasi dengan Perusahaan Anak memenuhi salah satu kriteria:
1. Bank yang melakukan kegiatan usaha dalam valuta asing yang secara konsolidasi dengan Perusahaan Anak memiliki posisi instrumen keuangan berupa surat berharga termasuk instrumen keuangan yang terekspos risiko ekuitas dan/atau transaksi derivatif dalam Trading Book dan/atau instrumen keuangan yang terekspos risiko komoditas dalam Trading Book dan Banking Book sebesar Rp20.000.000.000,00 (dua puluh miliar rupiah) atau lebih;
2. Bank yang tidak melakukan kegiatan usaha dalam valuta asing namun secara konsolidasi dengan Perusahaan Anak memiliki posisi instrumen keuangan berupa surat berharga termasuk instrumen keuangan yang terekspos risiko ekuitas dan/atau transaksi derivatif dalam Trading Book dan/atau instrumen keuangan yang terekspos risiko komoditas dalam Trading Book dan Banking Book sebesar Rp25.000.000.000,00 (dua puluh lima miliar rupiah) atau lebih;
c. Bank yang memiliki jaringan kantor dan/atau Perusahaan Anak di negara lain maupun kantor cabang dari bank yang berkedudukan di luar negeri.`,
      notes:
        "Kriteria wajib ATMR Pasar: (a) Individu: aset ≥Rp10T, atau posisi TB valas ≥Rp20M, atau TB non-valas ≥Rp25M. (b) Konsolidasi: posisi ≥Rp20M/25M. (c) Bank dengan kantor/anak di LN. BERLAKU s/d 31 Des 2023 (lihat Pasal 33A).",
    },
  ]);

  // === PASAL 30 - DIHAPUS ===
  await createPasal("30", "[DIHAPUS - Rev 2]", 4, [
    {
      number: "30",
      content: `[PASAL INI DIHAPUS OLEH POJK 23/2022]`,
      notes:
        "DIHAPUS oleh Rev 2 (POJK 23/2022). Sebelumnya mengatur pengecualian aset keuangan FVTPL dan kredit trading dari cakupan Trading Book.",
      revisions: [
        {
          title: "Ketentuan Asli (POJK 11/2016) - DIHAPUS",
          content: `Aset keuangan yang pada saat pengakuan awal ditetapkan sebagai aset keuangan yang diukur pada nilai wajar melalui laporan laba rugi dan kredit yang diklasifikasikan dalam kelompok diperdagangkan dikecualikan dari cakupan Trading Book.`,
          date: "2016-02-26",
        },
      ],
    },
  ]);

  // === PASAL 31 - DIHAPUS ===
  await createPasal("31", "[DIHAPUS - Rev 2]", 5, [
    {
      number: "31",
      content: `[PASAL INI DIHAPUS OLEH POJK 23/2022]`,
      notes:
        "DIHAPUS oleh Rev 2 (POJK 23/2022). Sebelumnya mengatur surat berharga dalam Trading Book hanya mencakup kelompok diperdagangkan.",
      revisions: [
        {
          title: "Ketentuan Asli (POJK 11/2016) - DIHAPUS",
          content: `Surat berharga dalam Trading Book hanya mencakup surat berharga yang diklasifikasikan dalam kelompok diperdagangkan.`,
          date: "2016-02-26",
        },
      ],
    },
  ]);

  // === PASAL 32 - Merger/Konsolidasi/Akuisisi ===
  await createPasal("32", "Risiko Pasar Pasca Merger/Konsolidasi/Akuisisi", 6, [
    {
      number: "32",
      content: `Bank yang setelah melakukan merger, konsolidasi atau akuisisi memenuhi kriteria tertentu sebagaimana dimaksud dalam Pasal 29 paling sedikit pada 3 (tiga) periode pelaporan bulanan dalam 6 (enam) bulan pertama setelah merger, konsolidasi atau akuisisi dinyatakan efektif, wajib memperhitungkan Risiko Pasar dalam perhitungan rasio KPMM sejak bulan ke-7 (tujuh) setelah merger, konsolidasi atau akuisisi dinyatakan efektif.`,
      notes:
        "Bank hasil M&A yang memenuhi kriteria Pasal 29 minimal 3 bulan dalam 6 bulan pertama, wajib hitung Risiko Pasar sejak bulan ke-7.",
      footnote: `Contoh: Sebelum merger Bank A dan B tidak wajib hitung Risiko Pasar. Setelah merger, pada bulan 1, 3, dan 4 memenuhi kriteria. Maka wajib hitung Risiko Pasar sejak bulan ke-7.`,
    },
  ]);

  // === PASAL 33 - Kelanjutan Kewajiban ATMR Pasar ===
  await createPasal("33", "Kelanjutan Kewajiban Perhitungan ATMR Pasar", 7, [
    {
      number: "33",
      content: `Bank yang telah memenuhi kriteria tertentu sebagaimana dimaksud dalam Pasal 29 dan Bank yang setelah melakukan merger, konsolidasi atau akuisisi memenuhi kriteria tertentu sebagaimana dimaksud dalam Pasal 32 wajib tetap memperhitungkan Risiko Pasar dalam kewajiban penyediaan modal minimum walaupun selanjutnya Bank tidak lagi memenuhi kriteria tertentu.`,
      notes:
        "Once in, always in: Bank yang sudah wajib hitung Risiko Pasar tetap wajib meskipun tidak lagi memenuhi kriteria.",
    },
  ]);

  // === PASAL 33A - Kewajiban Universal ATMR Pasar (NEW) ===
  await createPasal("33A", "Kewajiban Universal ATMR Pasar [BARU]", 8, [
    {
      number: "33A",
      content: `(1) Pemenuhan kriteria tertentu sebagai dasar kewajiban perhitungan aset tertimbang menurut risiko untuk Risiko Pasar sebagaimana dimaksud dalam Pasal 28 ayat (2), Pasal 29, Pasal 32, dan Pasal 33 berlaku sampai dengan tanggal 31 Desember 2023.
(2) Mulai tanggal 1 Januari 2024, seluruh Bank wajib memperhitungkan aset tertimbang menurut risiko untuk Risiko Pasar.`,
      notes:
        "[BARU - Rev 2] Sejak 1 Jan 2024, SELURUH Bank wajib hitung ATMR Pasar (tidak lagi berdasarkan kriteria tertentu).",
    },
  ]);

  console.log(
    "\n✅ Pasal 27-33A created. Run seed-pojk11-v2-bab3-part2.ts for Pasal 34-42B.",
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
