/**
 * POJK 11/2016 BAB IV - ICAAP & SREP (Pasal 43-46)
 *
 * No revisions
 * Run with: npx tsx prisma/seed-pojk11-v2-bab4.ts
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
  console.log("📋 Seeding BAB IV - ICAAP & SREP...\n");

  const standard = await prisma.baselStandard.findUnique({
    where: { code: "POJK11V2" },
  });

  if (!standard) {
    throw new Error("Standard POJK11V2 not found.");
  }

  // Delete existing BAB IV
  const existingBab = await prisma.baselChapter.findFirst({
    where: { standardId: standard.id, code: "04" },
  });
  if (existingBab) {
    console.log("⚠️ BAB IV exists. Deleting...");
    await prisma.baselChapter.delete({ where: { id: existingBab.id } });
  }

  // Create BAB IV
  const chapter = await prisma.baselChapter.create({
    data: {
      code: "04",
      title:
        "Internal Capital Adequacy Assessment Process (ICAAP) dan Supervisory Review and Evaluation Process (SREP)",
      standardId: standard.id,
      effectiveDate: new Date("2016-01-01"),
      lastUpdate: new Date("2016-02-26"),
      status: "current",
      order: 4,
    },
  });
  console.log(`📖 Created BAB IV: ICAAP & SREP\n`);

  const chapterId = chapter.id;

  async function createPasal(
    number: string,
    title: string,
    order: number,
    content: string,
    notes: string,
    footnote?: string,
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

    console.log(`  ✅ Pasal ${number} - ${title}`);
  }

  // === PASAL 43 - ICAAP ===
  await createPasal(
    "43",
    "Internal Capital Adequacy Assessment Process (ICAAP)",
    1,
    `(1) Dalam memenuhi kewajiban penyediaan modal minimum sesuai profil risiko sebagaimana dimaksud dalam Pasal 2 baik secara individu maupun konsolidasi dengan Perusahaan Anak, Bank wajib memiliki ICAAP yang disesuaikan dengan ukuran, karakteristik, dan kompleksitas usaha Bank.
(2) ICAAP sebagaimana ayat (1) mencakup paling sedikit:
a. pengawasan aktif Direksi dan Dewan Komisaris;
b. penilaian kecukupan modal;
c. pemantauan dan pelaporan; dan
d. pengendalian internal.
(3) Bank wajib mendokumentasikan ICAAP.`,
    "Bank wajib memiliki ICAAP sesuai ukuran dan kompleksitas. ICAAP mencakup: (a) pengawasan Direksi/Dekom, (b) penilaian kecukupan modal, (c) pemantauan & pelaporan, (d) pengendalian internal.",
    `Pengawasan aktif Direksi dan Dewan Komisaris meliputi: memahami risiko, menilai kualitas MR, dan mengaitkan risiko dengan kecukupan modal. Penilaian kecukupan modal: proses mengaitkan risiko dengan modal mempertimbangkan strategi dan rencana bisnis. Pengendalian internal: kecukupan kontrol dan kaji ulang oleh pihak independen.`,
  );

  // === PASAL 44 - SREP ===
  await createPasal(
    "44",
    "Supervisory Review and Evaluation Process (SREP)",
    2,
    `(1) Otoritas Jasa Keuangan melakukan SREP.
(2) Berdasarkan hasil SREP, Otoritas Jasa Keuangan dapat meminta Bank untuk memperbaiki ICAAP.`,
    "OJK melakukan SREP dan dapat meminta Bank memperbaiki ICAAP berdasarkan hasil SREP.",
  );

  // === PASAL 45 - Hasil SREP ===
  await createPasal(
    "45",
    "Tindak Lanjut Hasil SREP",
    3,
    `(1) Dalam hal terdapat perbedaan hasil perhitungan modal sesuai profil risiko antara hasil self-assessment Bank dengan hasil SREP, perhitungan modal yang berlaku adalah hasil SREP.
(2) Dalam hal Otoritas Jasa Keuangan menilai modal yang dimiliki Bank tidak memenuhi modal minimum sesuai profil risiko sebagaimana dimaksud dalam Pasal 2 baik secara individu maupun konsolidasi dengan Perusahaan Anak, Otoritas Jasa Keuangan dapat meminta Bank untuk:
a. menambah modal agar memenuhi KPMM sesuai profil risiko;
b. memperbaiki kualitas proses manajemen risiko; dan/atau
c. menurunkan eksposur risiko.`,
    "Hasil SREP menang atas self-assessment Bank. Jika modal tidak memenuhi, OJK dapat minta: tambah modal, perbaiki MR, dan/atau turunkan eksposur risiko.",
  );

  // === PASAL 46 - Tindakan Pencegahan ===
  await createPasal(
    "46",
    "Tindakan Pencegahan Penurunan Modal",
    4,
    `Dalam hal Otoritas Jasa Keuangan menilai terdapat kecenderungan penurunan modal Bank yang berpotensi menyebabkan modal Bank berada di bawah KPMM sesuai profil risiko, Otoritas Jasa Keuangan dapat meminta Bank untuk melakukan antara lain:
a. pembatasan kegiatan usaha tertentu;
b. pembatasan pembukaan jaringan kantor; dan/atau
c. pembatasan distribusi modal.`,
    "Jika OJK menilai modal Bank berpotensi turun di bawah minimum, OJK dapat minta: batasi kegiatan usaha, batasi pembukaan kantor, dan/atau batasi distribusi modal (bonus/dividen).",
    `Yang dimaksud dengan pembatasan distribusi modal antara lain berupa pembatasan atau penundaan pembayaran bonus dan/atau dividen.`,
  );

  console.log("\n✅ BAB IV Complete! (4 Pasal: 43-46)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
