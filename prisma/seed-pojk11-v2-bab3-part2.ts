/**
 * POJK 11/2016 BAB III - ATMR Part 2 (Pasal 34-42B)
 *
 * Includes:
 * - Pasal 34, 35, 36, 42 DELETED by Rev 2
 * - Pasal 37-41 (Valuasi)
 * - Pasal 42A, 42B NEW by Rev 2
 *
 * Run after: seed-pojk11-v2-bab3.ts
 * Run with: npx tsx prisma/seed-pojk11-v2-bab3-part2.ts
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
  console.log("📝 Seeding BAB III - Pasal 34-42B...\n");

  const chapter = await prisma.baselChapter.findFirst({
    where: {
      code: "03",
      standard: { code: "POJK11V2" },
    },
  });

  if (!chapter) {
    throw new Error("BAB III not found. Run seed-pojk11-v2-bab3.ts first.");
  }

  const chapterId = chapter.id;

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

  // === PASAL 34 - DIHAPUS ===
  await createPasal("34", "[DIHAPUS - Rev 2]", 9, [
    {
      number: "34",
      content: `[PASAL INI DIHAPUS OLEH POJK 23/2022]`,
      notes:
        "DIHAPUS oleh Rev 2. Sebelumnya mengatur pendekatan ATMR Risiko Kredit (Standardized vs IRB). Lihat ketentuan tersendiri OJK.",
      revisions: [
        {
          title: "Ketentuan Asli (POJK 11/2016) - DIHAPUS",
          content: `(1) Dalam perhitungan ATMR untuk Risiko Kredit, terdapat 2 pendekatan: (a) Pendekatan Standar; (b) Pendekatan IRB.
(2) Tahap awal wajib menggunakan Pendekatan Standar.
(3) IRB memerlukan persetujuan OJK.`,
          date: "2016-02-26",
        },
      ],
    },
  ]);

  // === PASAL 35 - DIHAPUS ===
  await createPasal("35", "[DIHAPUS - Rev 2]", 10, [
    {
      number: "35",
      content: `[PASAL INI DIHAPUS OLEH POJK 23/2022]`,
      notes:
        "DIHAPUS oleh Rev 2. Sebelumnya mengatur pendekatan ATMR Risiko Operasional (BIA, SA, AMA). Lihat ketentuan tersendiri OJK.",
      revisions: [
        {
          title: "Ketentuan Asli (POJK 11/2016) - DIHAPUS",
          content: `(1) Dalam perhitungan ATMR untuk Risiko Operasional, terdapat 3 pendekatan: (a) Basic Indicator Approach; (b) Standardized Approach; (c) Advanced Measurement Approach.
(2) Tahap awal wajib menggunakan BIA.
(3) SA dan AMA memerlukan persetujuan OJK.`,
          date: "2016-02-26",
        },
      ],
    },
  ]);

  // === PASAL 36 - DIHAPUS ===
  await createPasal("36", "[DIHAPUS - Rev 2]", 11, [
    {
      number: "36",
      content: `[PASAL INI DIHAPUS OLEH POJK 23/2022]`,
      notes:
        "DIHAPUS oleh Rev 2. Sebelumnya mengatur jenis Risiko Pasar (suku bunga, nilai tukar, ekuitas, komoditas). Lihat ketentuan tersendiri OJK.",
      revisions: [
        {
          title: "Ketentuan Asli (POJK 11/2016) - DIHAPUS",
          content: `(1) Risiko Pasar wajib diperhitungkan secara individu dan konsolidasi: (a) risiko suku bunga; (b) risiko nilai tukar.
(2) Secara konsolidasi wajib hitung risiko ekuitas dan/atau komoditas jika memiliki Perusahaan Anak yang terekspos dan memenuhi kriteria Pasal 29 huruf b.`,
          date: "2016-02-26",
        },
      ],
    },
  ]);

  // === PASAL 37 - Valuasi Trading Book ===
  await createPasal("37", "Valuasi Trading Book", 12, [
    {
      number: "37",
      content: `(1) Bank wajib melakukan valuasi secara harian terhadap posisi yang diukur dengan nilai wajar dalam Trading Book dan Banking Book secara akurat.
(2) Dalam melakukan valuasi sebagaimana dimaksud pada ayat (1), Bank wajib memiliki kebijakan dan prosedur valuasi, termasuk memiliki sistem informasi manajemen dan pengendalian proses valuasi yang memadai dan terintegrasi dengan sistem manajemen risiko.
(3) Kebijakan dan prosedur valuasi sebagaimana dimaksud pada ayat (2) wajib berlandaskan pada prinsip kehati-hatian.`,
      notes:
        "Valuasi harian wajib untuk Trading Book dan Banking Book (fair value). Wajib ada kebijakan, prosedur, SIM, dan pengendalian yang terintegrasi dengan MR.",
      footnote: `Kebijakan valuasi meliputi: penetapan tanggung jawab, sumber informasi pasar, prosedur kaji ulang, pedoman jika data tidak tersedia, frekuensi valuasi harian, waktu closing price, prosedur verifikasi.`,
    },
  ]);

  // === PASAL 38 - Metode Valuasi ===
  await createPasal("38", "Metode Valuasi", 13, [
    {
      number: "38",
      content: `(1) Proses valuasi wajib dilakukan berdasarkan nilai wajar.
(2) Terhadap instrumen keuangan yang diperdagangkan secara aktif, proses valuasi sebagaimana dimaksud pada ayat (1) dilakukan dengan menggunakan harga transaksi yang terjadi (close-out prices) atau kuotasi harga pasar dari sumber yang independen.
(3) Valuasi terhadap instrumen keuangan sebagaimana dimaksud pada ayat (2) menggunakan:
a. bid price untuk aset yang dimiliki atau kewajiban yang akan diterbitkan; dan/atau
b. ask price untuk aset yang akan diperoleh atau kewajiban yang dimiliki.
(4) Dalam hal harga pasar sebagaimana dimaksud pada ayat (2) tidak tersedia, Bank dapat menetapkan nilai wajar dengan menggunakan suatu model atau teknik penilaian berlandaskan prinsip kehati-hatian.`,
      notes:
        "Valuasi berdasarkan nilai wajar. Aktif: gunakan close-out prices atau kuotasi independen. Bid price untuk aset/kewajiban diterbitkan, ask price untuk aset diperoleh/kewajiban dimiliki. Jika tidak tersedia: gunakan model dengan prinsip kehati-hatian.",
      footnote: `Model/teknik penilaian: harga transaksi 10 hari terakhir, harga instrumen serupa, discounted cash flow, option pricing models, atau teknik yang umum digunakan pasar.`,
    },
  ]);

  // === PASAL 39 - Verifikasi Valuasi ===
  await createPasal("39", "Verifikasi Valuasi", 14, [
    {
      number: "39",
      content: `(1) Bank wajib melakukan verifikasi terhadap proses dan hasil valuasi.
(2) Verifikasi sebagaimana dimaksud pada ayat (1) wajib dilakukan paling sedikit 1 (satu) kali dalam 1 (satu) bulan oleh pihak yang tidak ikut dalam pelaksanaan valuasi.
(3) Bank wajib menyesuaikan hasil valuasi berdasarkan hasil verifikasi sebagaimana dimaksud pada ayat (1).`,
      notes:
        "Verifikasi valuasi wajib min 1x/bulan oleh pihak independen (tidak ikut valuasi). Hasil digunakan untuk menyesuaikan valuasi.",
      footnote: `Verifikasi untuk memastikan keakuratan laporan laba rugi. Dilakukan terhadap kewajaran harga pasar dan input dalam model.`,
    },
  ]);

  // === PASAL 40 - Peyesuaian Valuasi ===
  await createPasal("40", "Penyesuaian Valuasi", 15, [
    {
      number: "40",
      content: `Bank wajib segera melakukan penyesuaian terhadap hasil valuasi yang belum mencerminkan nilai wajar dalam hal:
a. terjadi perubahan kondisi ekonomi yang signifikan;
b. harga instrumen keuangan yang dijadikan acuan adalah harga yang terjadi dari transaksi yang dipaksakan, likuidasi yang dipaksakan atau penjualan akibat kesulitan keuangan;
c. instrumen keuangan sudah mendekati jatuh tempo; dan/atau
d. harga yang dijadikan acuan tidak wajar karena kondisi lainnya.`,
      notes:
        "Penyesuaian valuasi wajib jika: perubahan ekonomi signifikan, harga dari transaksi dipaksakan, mendekati jatuh tempo, atau kondisi tidak wajar lainnya.",
      footnote: `Kondisi lainnya: unearned credit spreads, early termination costs, investing/funding cost mismatch, ketidakpastian model valuasi.`,
    },
  ]);

  // === PASAL 41 - Penyesuaian Posisi Kurang Likuid ===
  await createPasal("41", "Penyesuaian Posisi Kurang Likuid", 16, [
    {
      number: "41",
      content: `(1) Selain penyesuaian sebagaimana dimaksud dalam Pasal 40, Bank wajib melakukan penyesuaian terhadap valuasi atas posisi yang kurang likuid dengan mempertimbangkan faktor-faktor tertentu.
(2) Dalam hal dilakukan penyesuaian sebagaimana dimaksud pada ayat (1), Bank wajib memperhitungkan dampak penyesuaian sebagai faktor pengurang modal inti utama dalam perhitungan rasio KPMM.`,
      notes:
        "Penyesuaian valuasi untuk posisi kurang likuid wajib diperhitungkan sebagai pengurang CET1. Rev 1: penjelasan diubah.",
      footnote: `Faktor-faktor: rata-rata dan volatilitas volume perdagangan, volatilitas bid-ask spreads, ketersediaan kuotasi pasar. Penyesuaian tidak mengurangi nilai instrumen di neraca.`,
      revisions: [
        {
          title: "Penjelasan Diubah (Rev 1)",
          content: `Rev 1 (POJK 34/2016) mengubah penjelasan Pasal 41 ayat (1) - detail faktor-faktor yang dipertimbangkan.`,
          date: "2016-09-01",
        },
      ],
    },
  ]);

  // === PASAL 42 - DIHAPUS ===
  await createPasal("42", "[DIHAPUS - Rev 2]", 17, [
    {
      number: "42",
      content: `[PASAL INI DIHAPUS OLEH POJK 23/2022]`,
      notes:
        "DIHAPUS oleh Rev 2. Sebelumnya mengatur pendekatan ATMR Risiko Pasar (Standard Method vs Internal Model). Lihat ketentuan tersendiri OJK.",
      revisions: [
        {
          title: "Ketentuan Asli (POJK 11/2016) - DIHAPUS",
          content: `(1) Dalam perhitungan ATMR untuk Risiko Pasar, terdapat 2 pendekatan: (a) Metode Standar; (b) Model Internal.
(2) Tahap awal wajib menggunakan Metode Standar.
(3) Model Internal memerlukan persetujuan OJK.`,
          date: "2016-02-26",
        },
      ],
    },
  ]);

  // === PASAL 42A - Eksposur CCP (NEW) ===
  await createPasal("42A", "Eksposur Central Counterparty [BARU]", 18, [
    {
      number: "42A",
      content: `(1) Bank wajib memperhitungkan eksposur terhadap lembaga central counterparty dalam perhitungan permodalan.
(2) Metode perhitungan permodalan untuk eksposur Bank terhadap lembaga central counterparty sebagaimana dimaksud pada ayat (1) ditetapkan oleh Otoritas Jasa Keuangan.`,
      notes:
        "[BARU - Rev 2] Bank wajib hitung eksposur ke CCP dalam modal. Metode ditetapkan OJK. Ini bagian dari BAB IIIA yang baru.",
    },
  ]);

  // === PASAL 42B - Persyaratan Margin (NEW) ===
  await createPasal("42B", "Persyaratan Margin Derivatif Non-CCP [BARU]", 19, [
    {
      number: "42B",
      content: `(1) Bank wajib memenuhi persyaratan margin untuk transaksi derivatif yang tidak dikliringkan melalui lembaga central counterparty.
(2) Metode perhitungan persyaratan margin sebagaimana dimaksud pada ayat (1) ditetapkan oleh Otoritas Jasa Keuangan.`,
      notes:
        "[BARU - Rev 2] Bank wajib memenuhi persyaratan margin untuk derivatif non-cleared (OTC). Metode ditetapkan OJK. Ini bagian dari BAB IIIA yang baru.",
    },
  ]);

  console.log("\n✅ BAB III Complete! (Pasal 27-42B)");
  console.log("   Note: Pasal 30, 31, 34, 35, 36, 42 DELETED by Rev 2");
  console.log("   Note: Pasal 33A, 42A, 42B NEW from Rev 2");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
