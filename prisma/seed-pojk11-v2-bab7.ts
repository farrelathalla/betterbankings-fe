/**
 * POJK 11/2016 BAB VII - SANKSI (Pasal 55-59)
 *
 * Rev 2 changes:
 * - Pasal 55 restructured (3 tiers of sanctions)
 * - Pasal 56 changed
 * - Pasal 59 DELETED
 *
 * Run with: npx tsx prisma/seed-pojk11-v2-bab7.ts
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
  console.log("⚖️ Seeding BAB VII - SANKSI...\n");

  const standard = await prisma.baselStandard.findUnique({
    where: { code: "POJK11V2" },
  });

  if (!standard) {
    throw new Error("Standard POJK11V2 not found.");
  }

  // Delete existing BAB VII
  const existingBab = await prisma.baselChapter.findFirst({
    where: { standardId: standard.id, code: "07" },
  });
  if (existingBab) {
    console.log("⚠️ BAB VII exists. Deleting...");
    await prisma.baselChapter.delete({ where: { id: existingBab.id } });
  }

  // Create BAB VII
  const chapter = await prisma.baselChapter.create({
    data: {
      code: "07",
      title: "Sanksi",
      standardId: standard.id,
      effectiveDate: new Date("2016-01-01"),
      lastUpdate: new Date("2022-12-01"),
      status: "current",
      order: 7,
    },
  });
  console.log(`📖 Created BAB VII: Sanksi\n`);

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

  // === PASAL 55 - Sanksi Administratif ===
  await createPasal(
    "55",
    "Sanksi Administratif",
    1,
    `(1) Bank yang melanggar ketentuan sebagaimana dimaksud dalam Pasal 2 ayat (1), Pasal 3 ayat (1), Pasal 4, Pasal 6 ayat (1), ayat (2), ayat (3), ayat (4), Pasal 7, Pasal 8 ayat (1), ayat (3), Pasal 9 ayat (2), Pasal 10 ayat (2), Pasal 11 ayat (2), ayat (3), Pasal 12, Pasal 13, Pasal 15, Pasal 16 ayat (1), Pasal 18, Pasal 19 ayat (1), ayat (2), Pasal 23, Pasal 24 ayat (1), Pasal 25 ayat (1), ayat (4), Pasal 26 ayat (1), ayat (2), Pasal 28, Pasal 32, Pasal 33, Pasal 33A ayat (2), Pasal 37, Pasal 38 ayat (1), Pasal 39, Pasal 40, Pasal 41, Pasal 42A ayat (1), Pasal 42B ayat (1), Pasal 43 ayat (1), ayat (3), Pasal 48 ayat (1), Pasal 49 ayat (1), Pasal 50 ayat (1), dan/atau Pasal 51 ayat (3) dikenai sanksi administratif berupa teguran tertulis.
(2) Dalam hal Bank telah dikenai sanksi administratif sebagaimana dimaksud pada ayat (1) dan tetap melanggar ketentuan tersebut, Bank dapat dikenai sanksi administratif berupa:
1. larangan transfer laba bagi kantor cabang dari bank yang berkedudukan di luar negeri;
2. larangan melakukan ekspansi kegiatan usaha;
3. pembekuan kegiatan usaha tertentu; dan/atau
4. penurunan tingkat kesehatan Bank.
(3) Dalam hal Bank telah dikenai sanksi administratif sebagaimana dimaksud pada ayat (1) dan ayat (2) dan tetap melanggar ketentuan tersebut, pemegang saham pengendali, anggota Direksi, anggota Dewan Komisaris, dan/atau pejabat eksekutif Bank dapat dikenai sanksi administratif berupa larangan sebagai pihak utama sesuai dengan Peraturan Otoritas Jasa Keuangan mengenai penilaian kembali bagi pihak utama lembaga jasa keuangan.`,
    "Rev 2: Sanksi bertingkat: (1) Teguran tertulis, (2) Larangan usaha/ekspansi/penurunan TKB, (3) PSP/Direksi/Dekom/Pejabat dilarang jadi pihak utama. Ditambah referensi ke Pasal 33A, 42A, 42B.",
    undefined,
    [
      {
        title: "Ketentuan Asli (POJK 11/2016)",
        content: `Pelanggaran terhadap pasal-pasal yang ditetapkan dikenakan sanksi administratif berupa: (a) teguran tertulis, (b) larangan transfer laba bagi kantor cabang bank asing, (c) larangan ekspansi, (d) pembekuan usaha tertentu, (e) larangan pembukaan kantor, (f) penurunan TKB, (g) pencantuman pengurus/pemegang saham dalam daftar larangan.
[Rev 2: Diubah menjadi 3 tingkat sanksi bertahap, menambah Pasal 33A, 42A, 42B]`,
        date: "2016-02-26",
      },
    ],
  );

  // === PASAL 56 - Sanksi Pelanggaran Pelaporan ===
  await createPasal(
    "56",
    "Sanksi Pelanggaran Pelaporan",
    2,
    `Bank yang melanggar ketentuan pelaporan sebagaimana dimaksud dalam Pasal 47 ayat (1) dan/atau ayat (2) dikenai sanksi sebagaimana diatur dalam peraturan Otoritas Jasa Keuangan mengenai pelaporan bank umum melalui sistem pelaporan Otoritas Jasa Keuangan.`,
    "Rev 2: Sanksi pelaporan KPMM sesuai POJK pelaporan bank via sistem online OJK.",
    undefined,
    [
      {
        title: "Ketentuan Asli (POJK 11/2016)",
        content: `Bank yang melanggar ketentuan pelaporan Pasal 47 dikenakan sanksi sesuai ketentuan laporan berkala bank umum.
[Rev 2: Diubah mengacu ke POJK pelaporan bank via sistem online OJK]`,
        date: "2016-02-26",
      },
    ],
  );

  // === PASAL 57 - Sanksi Denda Keterlambatan ===
  await createPasal(
    "57",
    "Sanksi Denda Keterlambatan Laporan",
    3,
    `(1) Selain sanksi sebagaimana dimaksud dalam Pasal 55, Bank yang dinyatakan:
a. terlambat menyampaikan laporan sebagaimana dimaksud dalam Pasal 51 ayat (1), dikenakan sanksi administratif berupa denda sebesar Rp1.000.000,00 (satu juta rupiah) per hari kerja keterlambatan;
b. tidak menyampaikan laporan sebagaimana dimaksud dalam Pasal 51 ayat (2), dikenakan sanksi administratif berupa denda sebesar Rp50.000.000,00 (lima puluh juta rupiah).
(2) Dalam hal Bank dikenakan sanksi administratif berupa denda karena dinyatakan tidak menyampaikan laporan, sanksi administratif berupa denda karena terlambat menyampaikan laporan tidak diberlakukan.`,
    "Denda: Terlambat Rp 1 juta/hari kerja. Tidak menyampaikan: Rp 50 juta flat. Jika tidak menyampaikan, denda keterlambatan tidak berlaku.",
  );

  // === PASAL 58 - Tindakan Pengawasan untuk KPMM ===
  await createPasal(
    "58",
    "Tindakan Pengawasan untuk KPMM Tidak Memenuhi",
    4,
    `Selain dikenakan sanksi administratif sebagaimana dimaksud dalam Pasal 55, Bank yang tidak memenuhi KPMM sesuai profil risiko sebagaimana dimaksud dalam Pasal 2 baik secara individu maupun secara konsolidasi dengan Perusahaan Anak diwajibkan melakukan langkah-langkah atau tindakan pengawasan sebagaimana diatur dalam ketentuan mengenai tindak lanjut pengawasan dan penetapan status Bank.`,
    "Bank yang tidak memenuhi KPMM wajib melakukan langkah-langkah sesuai ketentuan tindak lanjut pengawasan dan penetapan status Bank.",
  );

  // === PASAL 59 - DIHAPUS ===
  await createPasal(
    "59",
    "[DIHAPUS - Rev 2]",
    5,
    `[PASAL INI DIHAPUS OLEH POJK 23/2022]`,
    "DIHAPUS oleh Rev 2. Sebelumnya mengatur sanksi untuk pelanggaran Pasal 53 (larangan trading AFS). Karena Pasal 53 dihapus, Pasal 59 juga dihapus.",
    undefined,
    [
      {
        title: "Ketentuan Asli (POJK 11/2016) - DIHAPUS",
        content: `(1) Pelanggaran pertama Pasal 53: dilarang mencatat pembelian AFS selama 6 bulan.
(2) Pelanggaran kedua: dilarang 1 tahun.
(3) Pelanggaran >2 kali: dilarang 2 tahun.
[Pasal 53 dan 59 dihapus oleh Rev 2]`,
        date: "2016-02-26",
      },
    ],
  );

  console.log("\n✅ BAB VII Complete! (5 Pasal: 55-59)");
  console.log("   Note: Pasal 55, 56 changed by Rev 2");
  console.log("   Note: Pasal 59 DELETED by Rev 2");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
