/**
 * POJK 11/2016 Basel Seeder Script (with Revisions)
 *
 * This script seeds the Basel Center database with content from:
 * - POJK 11/POJK.03/2016 - Kewajiban Penyediaan Modal Minimum Bank Umum (Original)
 * - POJK 34/POJK.03/2016 - Perubahan Pertama (Revision 1)
 * - POJK 27/2022 - Perubahan Kedua (Revision 2)
 *
 * The seeder creates cross-references between revisions, showing which
 * articles have been amended or deactivated by subsequent regulations.
 *
 * Run with: npx tsx prisma/seed-pojk11.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper function to create TipTap JSON content with tooltips and references
function createRichContent(
  content: string,
  marks?: Array<{
    type: "tooltip" | "reference";
    text: string;
    attrs: Record<string, string | null>;
  }>
): string {
  if (!marks || marks.length === 0) {
    return JSON.stringify({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: content }],
        },
      ],
    });
  }

  let remainingContent = content;
  const textNodes: Array<{
    type: string;
    text: string;
    marks?: Array<{ type: string; attrs?: Record<string, string | null> }>;
  }> = [];

  for (const mark of marks) {
    const markedTextIndex = remainingContent.indexOf(mark.text);
    if (markedTextIndex === -1) continue;

    if (markedTextIndex > 0) {
      textNodes.push({
        type: "text",
        text: remainingContent.substring(0, markedTextIndex),
      });
    }

    textNodes.push({
      type: "text",
      text: mark.text,
      marks: [{ type: mark.type, attrs: mark.attrs }],
    });

    remainingContent = remainingContent.substring(
      markedTextIndex + mark.text.length
    );
  }

  if (remainingContent) {
    textNodes.push({ type: "text", text: remainingContent });
  }

  return JSON.stringify({
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: textNodes,
      },
    ],
  });
}

// Helper to create revision notice content
function createRevisionNotice(
  originalContent: string,
  revisionInfo: {
    revisedBy: string;
    revisionCode: string;
    revisionChapter: string;
    revisionSubsection: string;
    type: "amended" | "deleted";
  },
  tooltips?: Array<{
    type: "tooltip";
    text: string;
    attrs: Record<string, string | null>;
  }>
): string {
  const noticeText =
    revisionInfo.type === "amended"
      ? `⚠️ PERHATIAN: Ketentuan ini telah DIUBAH melalui ${revisionInfo.revisedBy}. Lihat ketentuan terbaru di ${revisionInfo.revisionCode}${revisionInfo.revisionChapter}.${revisionInfo.revisionSubsection}.\n\n[Ketentuan Lama]\n${originalContent}`
      : `⚠️ PERHATIAN: Ketentuan ini telah DIHAPUS melalui ${revisionInfo.revisedBy}.\n\n[Ketentuan yang Dihapus]\n${originalContent}`;

  const marks: Array<{
    type: "tooltip" | "reference";
    text: string;
    attrs: Record<string, string | null>;
  }> = [];

  // Add reference to new regulation
  if (revisionInfo.type === "amended") {
    marks.push({
      type: "reference",
      text: `${revisionInfo.revisionCode}${revisionInfo.revisionChapter}.${revisionInfo.revisionSubsection}`,
      attrs: {
        standardCode: revisionInfo.revisionCode,
        chapterCode: revisionInfo.revisionChapter,
        subsectionNumber: revisionInfo.revisionSubsection,
      },
    });
  }

  // Add any additional tooltips
  if (tooltips) {
    marks.push(...tooltips);
  }

  return createRichContent(noticeText, marks);
}

async function main() {
  console.log(
    "🏦 Seeding POJK 11/2016 Modal Minimum Framework (with Revisions)...\n"
  );

  // Delete existing standards if they exist
  const existingCodes = ["POJK11", "POJK34", "POJK27"];
  for (const code of existingCodes) {
    const existing = await prisma.baselStandard.findUnique({
      where: { code },
    });
    if (existing) {
      console.log(`⚠️  ${code} already exists. Deleting and recreating...`);
      await prisma.baselStandard.delete({ where: { code } });
    }
  }

  // ============================================
  // Create Standard 1: POJK 11/2016 (Original)
  // ============================================
  const pojk11 = await prisma.baselStandard.create({
    data: {
      code: "POJK11",
      name: "KPMM Bank Umum (Original)",
      description:
        "Peraturan OJK Nomor 11/POJK.03/2016 tentang Kewajiban Penyediaan Modal Minimum Bank Umum - Ketentuan Asli",
      order: 1,
    },
  });
  console.log(`✅ Created Standard: ${pojk11.code} - ${pojk11.name}`);

  // ============================================
  // Create Standard 2: POJK 34/2016 (Revision 1)
  // ============================================
  const pojk34 = await prisma.baselStandard.create({
    data: {
      code: "POJK34",
      name: "KPMM Bank Umum (Revisi Pertama)",
      description:
        "Peraturan OJK Nomor 34/POJK.03/2016 tentang Perubahan Atas POJK 11/POJK.03/2016 tentang Kewajiban Penyediaan Modal Minimum Bank Umum",
      order: 2,
    },
  });
  console.log(`✅ Created Standard: ${pojk34.code} - ${pojk34.name}`);

  // ============================================
  // Create Standard 3: POJK 27/2022 (Revision 2)
  // ============================================
  const pojk27 = await prisma.baselStandard.create({
    data: {
      code: "POJK27",
      name: "KPMM Bank Umum (Revisi Kedua)",
      description:
        "Peraturan OJK Nomor 27 Tahun 2022 tentang Perubahan Kedua Atas POJK 11/POJK.03/2016 tentang Kewajiban Penyediaan Modal Minimum Bank Umum",
      order: 3,
    },
  });
  console.log(`✅ Created Standard: ${pojk27.code} - ${pojk27.name}`);

  // ============================================
  // POJK11 - Chapter 1: Ketentuan Umum
  // ============================================
  const pojk11_ch01 = await prisma.baselChapter.create({
    data: {
      code: "01",
      title: "Ketentuan Umum",
      standardId: pojk11.id,
      effectiveDate: new Date("2016-01-01"),
      lastUpdate: new Date("2016-02-26"),
      status: "amended", // Has been amended by POJK34
      order: 1,
    },
  });
  console.log(`  📖 Created Chapter: POJK11-${pojk11_ch01.code}`);

  // Section: Definisi
  const pojk11_s01_1 = await prisma.baselSection.create({
    data: {
      title: "Definisi",
      chapterId: pojk11_ch01.id,
      order: 1,
    },
  });

  // Pasal 1 - Definisi (AMENDED by POJK34)
  await prisma.baselSubsection.createMany({
    data: [
      {
        number: "1",
        content: createRevisionNotice(
          "Dalam Peraturan Otoritas Jasa Keuangan ini yang dimaksud dengan: 1. Bank adalah bank umum sebagaimana dimaksud dalam Undang-Undang Nomor 7 Tahun 1992 tentang Perbankan sebagaimana telah diubah dengan Undang-Undang Nomor 10 Tahun 1998, termasuk kantor cabang dari bank yang berkedudukan di luar negeri, yang melakukan kegiatan usaha secara konvensional.",
          {
            revisedBy: "POJK 34/POJK.03/2016",
            revisionCode: "POJK34",
            revisionChapter: "01",
            revisionSubsection: "1",
            type: "amended",
          }
        ),
        sectionId: pojk11_s01_1.id,
        order: 1,
      },
      {
        number: "2",
        content: createRichContent(
          "Direksi: (a) bagi Bank berbentuk badan hukum Perseroan Terbatas adalah direksi sebagaimana dimaksud dalam Undang-Undang Nomor 40 Tahun 2007 tentang Perseroan Terbatas; (b) bagi Bank berbentuk badan hukum Perusahaan Umum Daerah atau Perusahaan Perseroan Daerah adalah direksi sebagaimana dimaksud dalam Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah.",
          [
            {
              type: "tooltip",
              text: "Direksi",
              attrs: {
                definition:
                  "Organ perseroan yang berwenang dan bertanggung jawab penuh atas pengurusan perseroan",
              },
            },
          ]
        ),
        sectionId: pojk11_s01_1.id,
        order: 2,
      },
      {
        number: "3",
        content: createRichContent(
          "Dewan Komisaris: (a) bagi Bank berbentuk badan hukum Perseroan Terbatas adalah dewan komisaris sebagaimana dimaksud dalam Undang-Undang Nomor 40 Tahun 2007 tentang Perseroan Terbatas; (b) bagi Bank berbentuk badan hukum Perusahaan Umum Daerah adalah dewan pengawas sebagaimana dimaksud dalam Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah.",
          [
            {
              type: "tooltip",
              text: "Dewan Komisaris",
              attrs: {
                definition:
                  "Organ perseroan yang bertugas melakukan pengawasan secara umum dan/atau khusus sesuai dengan anggaran dasar",
              },
            },
          ]
        ),
        sectionId: pojk11_s01_1.id,
        order: 3,
      },
      {
        number: "4",
        content: createRichContent(
          "Perusahaan Anak adalah badan hukum atau perusahaan yang dimiliki dan/atau dikendalikan oleh Bank secara langsung maupun tidak langsung, baik di dalam maupun di luar negeri, yang melakukan kegiatan usaha di bidang keuangan, yang terdiri atas: (a) perusahaan subsidiari (subsidiary company) yaitu Perusahaan Anak dengan kepemilikan Bank lebih dari 50%; (b) perusahaan partisipasi (participation company) adalah Perusahaan Anak dengan kepemilikan Bank sebesar 50% atau kurang, namun Bank memiliki pengendalian terhadap perusahaan.",
          [
            {
              type: "tooltip",
              text: "Perusahaan Anak",
              attrs: {
                definition:
                  "Badan hukum yang dimiliki/dikendalikan Bank yang melakukan kegiatan usaha di bidang keuangan",
              },
            },
            {
              type: "tooltip",
              text: "subsidiary company",
              attrs: {
                definition: "Perusahaan dengan kepemilikan lebih dari 50%",
              },
            },
          ]
        ),
        sectionId: pojk11_s01_1.id,
        order: 4,
      },
      {
        number: "5",
        content: createRichContent(
          "Pengendalian adalah pengendalian sebagaimana dimaksud dalam ketentuan yang mengatur mengenai penerapan manajemen risiko terintegrasi bagi konglomerasi keuangan.",
          [
            {
              type: "tooltip",
              text: "Pengendalian",
              attrs: {
                definition:
                  "Kemampuan untuk menentukan kebijakan keuangan dan operasional suatu entitas",
              },
            },
          ]
        ),
        sectionId: pojk11_s01_1.id,
        order: 5,
      },
      {
        number: "6",
        content: createRichContent(
          "Capital Equivalency Maintained Assets, yang selanjutnya disingkat CEMA, adalah alokasi dana usaha kantor cabang dari bank yang berkedudukan di luar negeri yang wajib ditempatkan pada aset keuangan dalam jumlah dan persyaratan tertentu.",
          [
            {
              type: "tooltip",
              text: "CEMA",
              attrs: {
                definition:
                  "Capital Equivalency Maintained Assets - alokasi dana usaha kantor cabang bank asing",
              },
            },
          ]
        ),
        sectionId: pojk11_s01_1.id,
        order: 6,
      },
      {
        number: "7",
        content: createRichContent(
          "Internal Capital Adequacy Assessment Process, yang selanjutnya disingkat ICAAP, adalah proses yang dilakukan Bank untuk menetapkan kecukupan modal sesuai profil risiko Bank dan penetapan strategi untuk memelihara tingkat permodalan.",
          [
            {
              type: "tooltip",
              text: "ICAAP",
              attrs: {
                definition:
                  "Internal Capital Adequacy Assessment Process - proses penilaian internal kecukupan modal",
              },
            },
          ]
        ),
        sectionId: pojk11_s01_1.id,
        order: 7,
      },
      {
        number: "8",
        content: createRichContent(
          "Supervisory Review and Evaluation Process, yang selanjutnya disingkat SREP, adalah proses kaji ulang yang dilakukan oleh Otoritas Jasa Keuangan atas hasil ICAAP Bank.",
          [
            {
              type: "tooltip",
              text: "SREP",
              attrs: {
                definition:
                  "Supervisory Review and Evaluation Process - proses kaji ulang OJK atas ICAAP",
              },
            },
          ]
        ),
        sectionId: pojk11_s01_1.id,
        order: 8,
      },
      {
        number: "9",
        content: createRichContent(
          "Capital Conservation Buffer adalah tambahan modal yang berfungsi sebagai penyangga (buffer) apabila terjadi kerugian pada periode krisis.",
          [
            {
              type: "tooltip",
              text: "Capital Conservation Buffer",
              attrs: {
                definition:
                  "Tambahan modal untuk menyerap kerugian pada periode krisis, ditetapkan 2,5% dari ATMR",
              },
            },
          ]
        ),
        sectionId: pojk11_s01_1.id,
        order: 9,
      },
      {
        number: "10",
        content: createRichContent(
          "Countercyclical Buffer adalah tambahan modal yang berfungsi sebagai penyangga (buffer) untuk mengantisipasi kerugian apabila terjadi pertumbuhan kredit perbankan yang berlebihan sehingga berpotensi mengganggu stabilitas sistem keuangan.",
          [
            {
              type: "tooltip",
              text: "Countercyclical Buffer",
              attrs: {
                definition:
                  "Tambahan modal untuk mengantisipasi pertumbuhan kredit berlebihan, 0-2,5% dari ATMR",
              },
            },
          ]
        ),
        sectionId: pojk11_s01_1.id,
        order: 10,
      },
      {
        number: "11",
        content: createRevisionNotice(
          "Capital Surcharge untuk Domestic Systemically Important Bank, yang selanjutnya disebut Capital Surcharge untuk D-SIB, adalah tambahan modal yang berfungsi untuk mengurangi dampak negatif terhadap stabilitas sistem keuangan dan perekonomian apabila terjadi kegagalan Bank yang berdampak sistemik melalui peningkatan kemampuan Bank dalam menyerap kerugian.",
          {
            revisedBy: "POJK 34/POJK.03/2016",
            revisionCode: "POJK34",
            revisionChapter: "01",
            revisionSubsection: "11",
            type: "amended",
          }
        ),
        sectionId: pojk11_s01_1.id,
        order: 11,
      },
      {
        number: "12",
        content: createRichContent(
          "Risiko Kredit adalah risiko akibat kegagalan debitur dan/atau pihak lain dalam memenuhi kewajiban kepada Bank.",
          [
            {
              type: "tooltip",
              text: "Risiko Kredit",
              attrs: {
                definition:
                  "Credit Risk - risiko gagal bayar dari debitur atau pihak lawan",
              },
            },
          ]
        ),
        sectionId: pojk11_s01_1.id,
        order: 12,
      },
      {
        number: "13",
        content: createRichContent(
          "Risiko Pasar adalah risiko pada posisi neraca dan rekening administratif termasuk transaksi derivatif, akibat perubahan secara keseluruhan dari kondisi pasar, termasuk risiko perubahan harga option.",
          [
            {
              type: "tooltip",
              text: "Risiko Pasar",
              attrs: {
                definition:
                  "Market Risk - risiko akibat perubahan kondisi pasar termasuk harga dan suku bunga",
              },
            },
          ]
        ),
        sectionId: pojk11_s01_1.id,
        order: 13,
      },
      {
        number: "14",
        content: createRichContent(
          "Risiko Operasional adalah risiko akibat ketidakcukupan dan/atau tidak berfungsinya proses internal, kesalahan manusia, kegagalan sistem, dan/atau adanya kejadian-kejadian eksternal yang mempengaruhi operasional Bank.",
          [
            {
              type: "tooltip",
              text: "Risiko Operasional",
              attrs: {
                definition:
                  "Operational Risk - risiko dari kegagalan proses internal, manusia, sistem, atau kejadian eksternal",
              },
            },
          ]
        ),
        sectionId: pojk11_s01_1.id,
        order: 14,
      },
      {
        number: "15",
        content: createRichContent(
          "Trading Book adalah seluruh posisi instrumen keuangan dalam neraca dan rekening administratif termasuk transaksi derivatif yang dimiliki Bank dengan tujuan untuk diperdagangkan dan dapat dipindahtangankan dengan bebas atau dapat dilindung nilai secara keseluruhan.",
          [
            {
              type: "tooltip",
              text: "Trading Book",
              attrs: {
                definition:
                  "Portofolio instrumen keuangan yang dimiliki untuk diperdagangkan",
              },
            },
          ]
        ),
        sectionId: pojk11_s01_1.id,
        order: 15,
      },
      {
        number: "16",
        content: createRichContent(
          "Banking Book adalah semua posisi lainnya yang tidak termasuk dalam Trading Book.",
          [
            {
              type: "tooltip",
              text: "Banking Book",
              attrs: {
                definition:
                  "Portofolio aset dan kewajiban yang tidak termasuk Trading Book",
              },
            },
          ]
        ),
        sectionId: pojk11_s01_1.id,
        order: 16,
      },
    ],
  });

  // Section: Kewajiban Modal Minimum
  const pojk11_s01_2 = await prisma.baselSection.create({
    data: {
      title: "Kewajiban Modal Minimum",
      chapterId: pojk11_ch01.id,
      order: 2,
    },
  });

  // Pasal 2
  await prisma.baselSubsection.createMany({
    data: [
      {
        number: "17",
        content: createRichContent(
          "Pasal 2 ayat (1): Bank wajib menyediakan modal minimum sesuai profil risiko.",
          [
            {
              type: "tooltip",
              text: "profil risiko",
              attrs: {
                definition:
                  "Penilaian terhadap risiko inheren dan kualitas penerapan manajemen risiko Bank",
              },
            },
          ]
        ),
        sectionId: pojk11_s01_2.id,
        order: 1,
      },
      {
        number: "18",
        content: createRichContent(
          "Pasal 2 ayat (2): Penyediaan modal minimum dihitung dengan menggunakan rasio Kewajiban Penyediaan Modal Minimum (KPMM).",
          [
            {
              type: "tooltip",
              text: "KPMM",
              attrs: {
                definition:
                  "Kewajiban Penyediaan Modal Minimum - Capital Adequacy Ratio (CAR)",
              },
            },
          ]
        ),
        sectionId: pojk11_s01_2.id,
        order: 2,
      },
      {
        number: "19",
        content: createRichContent(
          "Pasal 2 ayat (3): Penyediaan modal minimum ditetapkan paling rendah: (a) 8% dari ATMR bagi Bank dengan profil risiko Peringkat 1; (b) 9% sampai dengan kurang dari 10% dari ATMR bagi Bank dengan profil risiko Peringkat 2; (c) 10% sampai dengan kurang dari 11% dari ATMR bagi Bank dengan profil risiko Peringkat 3; atau (d) 11% sampai dengan 14% dari ATMR bagi Bank dengan profil risiko Peringkat 4 atau Peringkat 5.",
          [
            {
              type: "tooltip",
              text: "ATMR",
              attrs: {
                definition:
                  "Aset Tertimbang Menurut Risiko (Risk-Weighted Assets)",
              },
            },
          ]
        ),
        sectionId: pojk11_s01_2.id,
        order: 3,
      },
    ],
  });

  // Section: Tambahan Modal (Buffer)
  const pojk11_s01_3 = await prisma.baselSection.create({
    data: {
      title: "Tambahan Modal (Buffer)",
      chapterId: pojk11_ch01.id,
      order: 3,
    },
  });

  // Pasal 3 (AMENDED by POJK34)
  await prisma.baselSubsection.createMany({
    data: [
      {
        number: "20",
        content: createRevisionNotice(
          "Pasal 3: Selain kewajiban penyediaan modal minimum sesuai profil risiko, Bank wajib membentuk tambahan modal sebagai penyangga (buffer) berupa: (a) Capital Conservation Buffer sebesar 2,5% dari ATMR; (b) Countercyclical Buffer 0% sampai 2,5% dari ATMR; (c) Capital Surcharge untuk D-SIB 1% sampai 2,5% dari ATMR.",
          {
            revisedBy: "POJK 34/POJK.03/2016",
            revisionCode: "POJK34",
            revisionChapter: "01",
            revisionSubsection: "20",
            type: "amended",
          }
        ),
        sectionId: pojk11_s01_3.id,
        order: 1,
      },
      {
        number: "21",
        content: createRevisionNotice(
          "Pasal 4: (1) Bank yang tergolong sebagai Bank Umum Kegiatan Usaha (BUKU) 3 dan BUKU 4 wajib membentuk Capital Conservation Buffer. (2) Kewajiban pembentukan Countercyclical Buffer berlaku bagi seluruh Bank. (3) Bank yang ditetapkan berdampak sistemik wajib membentuk Capital Surcharge untuk D-SIB.",
          {
            revisedBy: "POJK 34/POJK.03/2016 dan POJK 27/2022",
            revisionCode: "POJK27",
            revisionChapter: "01",
            revisionSubsection: "21",
            type: "amended",
          }
        ),
        sectionId: pojk11_s01_3.id,
        order: 2,
      },
      {
        number: "22",
        content: createRevisionNotice(
          "Pasal 5: (1) Otoritas Jasa Keuangan menetapkan Bank yang berdampak sistemik. (2) Otoritas Jasa Keuangan berkoordinasi dengan otoritas yang berwenang dalam menetapkan Bank yang berdampak sistemik.",
          {
            revisedBy: "POJK 34/POJK.03/2016",
            revisionCode: "POJK34",
            revisionChapter: "01",
            revisionSubsection: "22",
            type: "amended",
          }
        ),
        sectionId: pojk11_s01_3.id,
        order: 3,
      },
      {
        number: "23",
        content: createRevisionNotice(
          "Pasal 6: Kewajiban Bank untuk membentuk tambahan modal berupa Capital Conservation Buffer berlaku secara bertahap mulai tanggal 1 Januari 2016 dengan tahapan: 0,625% (2016), 1,25% (2017), 1,875% (2018), dan 2,5% (2019).",
          {
            revisedBy: "POJK 34/POJK.03/2016",
            revisionCode: "POJK34",
            revisionChapter: "01",
            revisionSubsection: "23",
            type: "amended",
          }
        ),
        sectionId: pojk11_s01_3.id,
        order: 4,
      },
    ],
  });

  // ============================================
  // POJK11 - Chapter 2: Modal
  // ============================================
  const pojk11_ch02 = await prisma.baselChapter.create({
    data: {
      code: "02",
      title: "Modal",
      standardId: pojk11.id,
      effectiveDate: new Date("2016-01-01"),
      lastUpdate: new Date("2016-02-26"),
      status: "amended",
      order: 2,
    },
  });
  console.log(`  📖 Created Chapter: POJK11-${pojk11_ch02.code}`);

  // Section: Struktur Modal
  const pojk11_s02_1 = await prisma.baselSection.create({
    data: {
      title: "Struktur Modal",
      chapterId: pojk11_ch02.id,
      order: 1,
    },
  });

  await prisma.baselSubsection.createMany({
    data: [
      {
        number: "1",
        content: createRichContent(
          "Pasal 9 ayat (1): Modal bagi Bank yang berkantor pusat di Indonesia terdiri atas: (a) modal inti (Tier 1) yang meliputi: modal inti utama (Common Equity Tier 1) dan modal inti tambahan (Additional Tier 1); (b) modal pelengkap (Tier 2).",
          [
            {
              type: "tooltip",
              text: "Common Equity Tier 1",
              attrs: {
                definition:
                  "CET1 - Modal inti utama yang terdiri dari modal disetor dan cadangan tambahan modal",
              },
            },
            {
              type: "tooltip",
              text: "Additional Tier 1",
              attrs: {
                definition:
                  "AT1 - Modal inti tambahan seperti instrumen hybrid perpetual",
              },
            },
            {
              type: "tooltip",
              text: "Tier 2",
              attrs: {
                definition:
                  "Modal pelengkap seperti instrumen subordinasi dengan jangka waktu tertentu",
              },
            },
          ]
        ),
        sectionId: pojk11_s02_1.id,
        order: 1,
      },
      {
        number: "2",
        content: createRevisionNotice(
          "Pasal 10: Modal bagi kantor cabang dari bank yang berkedudukan di luar negeri terdiri atas dana usaha, laba ditahan, laba tahun berjalan, cadangan umum, saldo surplus revaluasi aset tetap, pendapatan komprehensif lainnya, cadangan tujuan, dan cadangan umum PPA.",
          {
            revisedBy: "POJK 34/POJK.03/2016",
            revisionCode: "POJK34",
            revisionChapter: "02",
            revisionSubsection: "2",
            type: "amended",
          }
        ),
        sectionId: pojk11_s02_1.id,
        order: 2,
      },
      {
        number: "3",
        content: createRichContent(
          "Pasal 11: (1) Modal inti terdiri atas modal inti utama (CET1) yang mencakup modal disetor dan cadangan tambahan modal, serta modal inti tambahan (AT1). (2) Bank wajib menyediakan modal inti paling rendah sebesar 6% dari ATMR. (3) Bank wajib menyediakan modal inti utama paling rendah sebesar 4,5% dari ATMR.",
          [
            {
              type: "tooltip",
              text: "6% dari ATMR",
              attrs: {
                definition: "Minimum Tier 1 Capital Ratio sesuai Basel III",
              },
            },
            {
              type: "tooltip",
              text: "4,5% dari ATMR",
              attrs: {
                definition: "Minimum CET1 Ratio sesuai Basel III",
              },
            },
          ]
        ),
        sectionId: pojk11_s02_1.id,
        order: 3,
      },
    ],
  });

  // Section: Instrumen Modal
  const pojk11_s02_2 = await prisma.baselSection.create({
    data: {
      title: "Instrumen Modal",
      chapterId: pojk11_ch02.id,
      order: 2,
    },
  });

  await prisma.baselSubsection.createMany({
    data: [
      {
        number: "4",
        content: createRevisionNotice(
          "Pasal 12: Instrumen modal disetor wajib memenuhi persyaratan: (a) diterbitkan dan telah dibayar penuh; (b) bersifat subordinasi; (c) bersifat permanen; (d) tersedia untuk menyerap kerugian; (e) perolehan imbal hasil tidak dapat dipastikan; (f) tidak diproteksi; (g) memiliki karakteristik pembayaran dividen tertentu; (h) sumber pendanaan tidak berasal dari Bank penerbit.",
          {
            revisedBy: "POJK 34/POJK.03/2016",
            revisionCode: "POJK34",
            revisionChapter: "02",
            revisionSubsection: "4",
            type: "amended",
          }
        ),
        sectionId: pojk11_s02_2.id,
        order: 1,
      },
      {
        number: "5",
        content: createRevisionNotice(
          "Pasal 13: Pembelian kembali saham (treasury stock) wajib memenuhi persyaratan: setelah 5 tahun sejak penerbitan, untuk tujuan tertentu, sesuai peraturan perundang-undangan, persetujuan OJK, dan tidak menyebabkan penurunan modal di bawah minimum.",
          {
            revisedBy: "POJK 34/POJK.03/2016",
            revisionCode: "POJK34",
            revisionChapter: "02",
            revisionSubsection: "5",
            type: "amended",
          }
        ),
        sectionId: pojk11_s02_2.id,
        order: 2,
      },
      {
        number: "6",
        content: createRevisionNotice(
          "Pasal 14: Cadangan tambahan modal (disclosed reserve) terdiri atas faktor penambah (agio, modal sumbangan, cadangan umum, laba, dll) dan faktor pengurang (disagio, rugi, selisih kurang PPA, dll).",
          {
            revisedBy: "POJK 34/POJK.03/2016 dan POJK 27/2022",
            revisionCode: "POJK27",
            revisionChapter: "02",
            revisionSubsection: "6",
            type: "amended",
          }
        ),
        sectionId: pojk11_s02_2.id,
        order: 3,
      },
    ],
  });

  // ============================================
  // POJK34 - Chapter 1: Perubahan Pasal-Pasal
  // ============================================
  const pojk34_ch01 = await prisma.baselChapter.create({
    data: {
      code: "01",
      title: "Perubahan Ketentuan Umum dan Buffer",
      standardId: pojk34.id,
      effectiveDate: new Date("2016-09-08"),
      lastUpdate: new Date("2016-09-08"),
      status: "current",
      order: 1,
    },
  });
  console.log(`  📖 Created Chapter: POJK34-${pojk34_ch01.code}`);

  const pojk34_s01_1 = await prisma.baselSection.create({
    data: {
      title: "Perubahan Definisi (Pasal 1)",
      chapterId: pojk34_ch01.id,
      order: 1,
    },
  });

  await prisma.baselSubsection.createMany({
    data: [
      {
        number: "1",
        content: createRichContent(
          "Ketentuan Pasal 1 diubah dengan menambahkan definisi Bank Sistemik: Bank Sistemik adalah bank sebagaimana dimaksud dalam Undang-Undang Nomor 9 Tahun 2016 tentang Pencegahan dan Penanganan Krisis Sistem Keuangan. Definisi ini menggantikan terminologi D-SIB (Domestic Systemically Important Bank) yang digunakan sebelumnya.",
          [
            {
              type: "tooltip",
              text: "Bank Sistemik",
              attrs: {
                definition:
                  "Bank yang ditetapkan OJK yang kegagalannya dapat berdampak pada stabilitas sistem keuangan",
              },
            },
            {
              type: "tooltip",
              text: "UU 9/2016",
              attrs: {
                definition:
                  "Undang-Undang tentang Pencegahan dan Penanganan Krisis Sistem Keuangan (UU PPKSK)",
              },
            },
            {
              type: "reference",
              text: "D-SIB",
              attrs: {
                standardCode: "POJK11",
                chapterCode: "01",
                subsectionNumber: "11",
              },
            },
          ]
        ),
        sectionId: pojk34_s01_1.id,
        order: 1,
      },
      {
        number: "11",
        content: createRichContent(
          "Capital Surcharge untuk Bank Sistemik adalah tambahan modal yang berfungsi untuk mengurangi dampak negatif terhadap stabilitas sistem keuangan dan perekonomian apabila terjadi kegagalan Bank Sistemik melalui peningkatan kemampuan Bank dalam menyerap kerugian. [Menggantikan terminologi Capital Surcharge untuk D-SIB dalam POJK11]",
          [
            {
              type: "tooltip",
              text: "Capital Surcharge",
              attrs: {
                definition:
                  "Tambahan modal untuk bank sistemik, berkisar 1% - 2,5% dari ATMR",
              },
            },
            {
              type: "reference",
              text: "POJK11",
              attrs: {
                standardCode: "POJK11",
                chapterCode: "01",
                subsectionNumber: "11",
              },
            },
          ]
        ),
        sectionId: pojk34_s01_1.id,
        order: 2,
      },
    ],
  });

  const pojk34_s01_2 = await prisma.baselSection.create({
    data: {
      title: "Perubahan Ketentuan Buffer (Pasal 3-6)",
      chapterId: pojk34_ch01.id,
      order: 2,
    },
  });

  await prisma.baselSubsection.createMany({
    data: [
      {
        number: "20",
        content: createRichContent(
          "Perubahan Pasal 3: Terminologi 'Capital Surcharge untuk D-SIB' diubah menjadi 'Capital Surcharge untuk Bank Sistemik'. Ketentuan besaran buffer tetap sama: (a) Capital Conservation Buffer 2,5% dari ATMR; (b) Countercyclical Buffer 0% - 2,5% dari ATMR; (c) Capital Surcharge untuk Bank Sistemik 1% - 2,5% dari ATMR.",
          [
            {
              type: "reference",
              text: "Pasal 3",
              attrs: {
                standardCode: "POJK11",
                chapterCode: "01",
                subsectionNumber: "20",
              },
            },
          ]
        ),
        sectionId: pojk34_s01_2.id,
        order: 1,
      },
      {
        number: "21",
        content: createRichContent(
          "Perubahan Pasal 4: (1) Bank yang tergolong sebagai BUKU 3 dan BUKU 4 wajib membentuk Capital Conservation Buffer. (2) Seluruh Bank wajib membentuk Countercyclical Buffer. (3) Bank yang ditetapkan sebagai Bank Sistemik wajib membentuk Capital Surcharge untuk Bank Sistemik. [Perubahan: ayat (2) menegaskan kewajiban berlaku untuk seluruh Bank, ayat (3) menggunakan terminologi Bank Sistemik]",
          [
            {
              type: "tooltip",
              text: "BUKU 3",
              attrs: {
                definition:
                  "Bank Umum Kegiatan Usaha 3 dengan modal inti Rp5-30 triliun",
              },
            },
            {
              type: "tooltip",
              text: "BUKU 4",
              attrs: {
                definition:
                  "Bank Umum Kegiatan Usaha 4 dengan modal inti di atas Rp30 triliun",
              },
            },
          ]
        ),
        sectionId: pojk34_s01_2.id,
        order: 2,
      },
      {
        number: "22",
        content: createRichContent(
          "Perubahan Pasal 5: (1) Otoritas Jasa Keuangan menetapkan Bank Sistemik. (2) Otoritas Jasa Keuangan berkoordinasi dengan otoritas yang berwenang dalam menetapkan Bank Sistemik. [Perubahan: terminologi 'Bank yang berdampak sistemik' diubah menjadi 'Bank Sistemik']",
          []
        ),
        sectionId: pojk34_s01_2.id,
        order: 3,
      },
      {
        number: "23",
        content: createRichContent(
          "Perubahan Pasal 6: Bank wajib membentuk tambahan modal berupa Capital Conservation Buffer secara bertahap mulai 1 Januari 2016 dengan tahapan yang sama. Perubahan meliputi: (a) ayat (1) dan (2) - penegasan kata 'Bank wajib'; (b) ayat (4) - terminologi Capital Surcharge untuk Bank Sistemik; (c) ayat (5) dan (6) - penyesuaian terminologi.",
          []
        ),
        sectionId: pojk34_s01_2.id,
        order: 4,
      },
    ],
  });

  // ============================================
  // POJK34 - Chapter 2: Perubahan Modal
  // ============================================
  const pojk34_ch02 = await prisma.baselChapter.create({
    data: {
      code: "02",
      title: "Perubahan Ketentuan Modal",
      standardId: pojk34.id,
      effectiveDate: new Date("2016-09-08"),
      lastUpdate: new Date("2016-09-08"),
      status: "current",
      order: 2,
    },
  });
  console.log(`  📖 Created Chapter: POJK34-${pojk34_ch02.code}`);

  const pojk34_s02_1 = await prisma.baselSection.create({
    data: {
      title: "Perubahan Ketentuan Modal Cabang Bank Asing (Pasal 10)",
      chapterId: pojk34_ch02.id,
      order: 1,
    },
  });

  await prisma.baselSubsection.createMany({
    data: [
      {
        number: "2",
        content: createRichContent(
          "Perubahan Pasal 10: Modal bagi kantor cabang dari bank yang berkedudukan di luar negeri terdiri atas: (a) dana usaha; (b) laba ditahan dan laba tahun lalu; (c) laba tahun berjalan; (d) cadangan umum; (e) saldo surplus revaluasi aset tetap; (f) pendapatan komprehensif lainnya; (g) cadangan umum PPA; dan (h) lainnya berdasarkan persetujuan OJK. [Perubahan: butir (g) menghapus 'cadangan tujuan', butir (h) menambahkan 'lainnya berdasarkan persetujuan OJK']",
          [
            {
              type: "reference",
              text: "Pasal 10",
              attrs: {
                standardCode: "POJK11",
                chapterCode: "02",
                subsectionNumber: "2",
              },
            },
          ]
        ),
        sectionId: pojk34_s02_1.id,
        order: 1,
      },
    ],
  });

  const pojk34_s02_2 = await prisma.baselSection.create({
    data: {
      title: "Perubahan Instrumen Modal Disetor (Pasal 12-14)",
      chapterId: pojk34_ch02.id,
      order: 2,
    },
  });

  await prisma.baselSubsection.createMany({
    data: [
      {
        number: "4",
        content: createRichContent(
          "Perubahan Pasal 12: Instrumen modal disetor wajib memenuhi persyaratan: (a)-(c) tidak berubah; (d) tidak dapat dibayar kembali oleh Bank, kecuali treasury stock atau likuidasi [BARU]; (e)-(g) tidak berubah substansi; (h) tidak terdapat kesepakatan yang meningkatkan senioritas [BARU]; (i) karakteristik dividen diperluas [DIUBAH]; (j) sumber pendanaan tidak dari Bank [dipindah]; (k) diklasifikasikan sebagai ekuitas [BARU].",
          [
            {
              type: "tooltip",
              text: "senioritas",
              attrs: {
                definition:
                  "Urutan prioritas klaim atas aset bank dalam hal likuidasi",
              },
            },
          ]
        ),
        sectionId: pojk34_s02_2.id,
        order: 1,
      },
      {
        number: "5",
        content: createRichContent(
          "Perubahan Pasal 13: Bank yang melakukan pembelian kembali saham (treasury stock) sebagaimana dimaksud dalam Pasal 12 huruf d yang telah diakui sebagai komponen modal disetor, wajib memenuhi persyaratan: (a)-(b) tidak berubah; (c) dilakukan sesuai dengan ketentuan peraturan perundang-undangan [DIUBAH redaksi]; (d)-(e) tidak berubah.",
          []
        ),
        sectionId: pojk34_s02_2.id,
        order: 2,
      },
      {
        number: "6",
        content: createRichContent(
          "Perubahan Pasal 14: Cadangan tambahan modal (disclosed reserve) diubah strukturnya menjadi: Faktor penambah: (1) Pendapatan komprehensif lainnya [dipisah]; (2) Cadangan tambahan modal lainnya termasuk agio, cadangan umum, laba, dana setoran modal, waran, opsi saham. Faktor pengurang: (1) Pendapatan komprehensif lainnya berupa kerugian; (2) Cadangan tambahan modal lainnya berupa disagio, rugi, selisih kurang PPA, dll.",
          [
            {
              type: "tooltip",
              text: "disclosed reserve",
              attrs: {
                definition:
                  "Cadangan yang diungkapkan dalam laporan keuangan dan memenuhi syarat sebagai modal",
              },
            },
          ]
        ),
        sectionId: pojk34_s02_2.id,
        order: 3,
      },
    ],
  });

  // ============================================
  // POJK27 - Chapter 1: Perubahan Kedua
  // ============================================
  const pojk27_ch01 = await prisma.baselChapter.create({
    data: {
      code: "01",
      title: "Perubahan Ketentuan Buffer dan Modal",
      standardId: pojk27.id,
      effectiveDate: new Date("2022-10-20"),
      lastUpdate: new Date("2022-10-20"),
      status: "current",
      order: 1,
    },
  });
  console.log(`  📖 Created Chapter: POJK27-${pojk27_ch01.code}`);

  const pojk27_s01_1 = await prisma.baselSection.create({
    data: {
      title: "Perubahan Capital Conservation Buffer (Pasal 4)",
      chapterId: pojk27_ch01.id,
      order: 1,
    },
  });

  await prisma.baselSubsection.createMany({
    data: [
      {
        number: "21",
        content: createRichContent(
          "Perubahan Pasal 4 ayat (1): Bank yang tergolong sebagai kelompok bank berdasarkan modal inti 2, kelompok bank berdasarkan modal inti 3, dan kelompok bank berdasarkan modal inti 4 wajib membentuk Capital Conservation Buffer. [Perubahan: terminologi BUKU diganti dengan 'kelompok bank berdasarkan modal inti' sesuai POJK 12/POJK.03/2021]",
          [
            {
              type: "tooltip",
              text: "kelompok bank berdasarkan modal inti",
              attrs: {
                definition:
                  "Klasifikasi bank berdasarkan POJK 12/2021: KBMI 1 (<Rp6T), KBMI 2 (Rp6-14T), KBMI 3 (Rp14-70T), KBMI 4 (>Rp70T)",
              },
            },
            {
              type: "reference",
              text: "BUKU",
              attrs: {
                standardCode: "POJK34",
                chapterCode: "01",
                subsectionNumber: "21",
              },
            },
          ]
        ),
        sectionId: pojk27_s01_1.id,
        order: 1,
      },
    ],
  });

  const pojk27_s01_2 = await prisma.baselSection.create({
    data: {
      title: "Perubahan Cadangan Tambahan Modal (Pasal 14)",
      chapterId: pojk27_ch01.id,
      order: 2,
    },
  });

  await prisma.baselSubsection.createMany({
    data: [
      {
        number: "6",
        content: createRichContent(
          "Perubahan Pasal 14 ayat (1): Cadangan tambahan modal (disclosed reserve) diubah untuk mengakomodasi PSAK 71 tentang Instrumen Keuangan. Potensi keuntungan/kerugian dari aset keuangan yang 'dikategorikan sebagai kelompok tersedia untuk dijual' dimaknai sebagai 'aset keuangan yang diukur pada nilai wajar melalui penghasilan komprehensif lain' (FVOCI) sesuai standar akuntansi keuangan mengenai instrumen keuangan.",
          [
            {
              type: "tooltip",
              text: "PSAK 71",
              attrs: {
                definition:
                  "Pernyataan Standar Akuntansi Keuangan 71 tentang Instrumen Keuangan (adopsi IFRS 9)",
              },
            },
            {
              type: "tooltip",
              text: "FVOCI",
              attrs: {
                definition:
                  "Fair Value through Other Comprehensive Income - pengukuran nilai wajar melalui penghasilan komprehensif lain",
              },
            },
            {
              type: "tooltip",
              text: "tersedia untuk dijual",
              attrs: {
                definition:
                  "Kategori aset keuangan dalam PSAK 55 (lama) yang tidak lagi digunakan dalam PSAK 71",
              },
            },
          ]
        ),
        sectionId: pojk27_s01_2.id,
        order: 1,
      },
    ],
  });

  // ============================================
  // POJK27 - Chapter 2: ATMR dan CCP
  // ============================================
  const pojk27_ch02 = await prisma.baselChapter.create({
    data: {
      code: "02",
      title: "Ketentuan ATMR dan Central Counterparty",
      standardId: pojk27.id,
      effectiveDate: new Date("2022-10-20"),
      lastUpdate: new Date("2022-10-20"),
      status: "current",
      order: 2,
    },
  });
  console.log(`  📖 Created Chapter: POJK27-${pojk27_ch02.code}`);

  const pojk27_s02_1 = await prisma.baselSection.create({
    data: {
      title: "Perubahan ATMR (Pasal 27, 30-36)",
      chapterId: pojk27_ch02.id,
      order: 1,
    },
  });

  await prisma.baselSubsection.createMany({
    data: [
      {
        number: "1",
        content: createRichContent(
          "Perubahan Pasal 27: ATMR yang digunakan dalam perhitungan modal minimum dan buffer terdiri atas: (a) ATMR untuk Risiko Kredit; (b) ATMR untuk Risiko Operasional; dan (c) ATMR untuk Risiko Pasar. Metode perhitungan ditetapkan oleh OJK. [Substansi tidak berubah signifikan]",
          [
            {
              type: "tooltip",
              text: "ATMR",
              attrs: {
                definition:
                  "Aset Tertimbang Menurut Risiko - dasar perhitungan KPMM",
              },
            },
          ]
        ),
        sectionId: pojk27_s02_1.id,
        order: 1,
      },
      {
        number: "2",
        content: createRichContent(
          "Pasal 30 DIHAPUS: Ketentuan mengenai kriteria Bank yang wajib memperhitungkan ATMR untuk Risiko Pasar dicabut dan diatur dalam Pasal 33A.",
          []
        ),
        sectionId: pojk27_s02_1.id,
        order: 2,
      },
      {
        number: "3",
        content: createRichContent(
          "Pasal 31 DIHAPUS: Ketentuan mengenai kriteria Trading Book dicabut.",
          []
        ),
        sectionId: pojk27_s02_1.id,
        order: 3,
      },
      {
        number: "4",
        content: createRichContent(
          "Pasal 33A (BARU): (1) Pemenuhan kriteria tertentu sebagai dasar kewajiban perhitungan ATMR untuk Risiko Pasar berlaku sampai dengan 31 Desember 2023. (2) Mulai tanggal 1 Januari 2024, seluruh Bank wajib memperhitungkan ATMR untuk Risiko Pasar.",
          [
            {
              type: "tooltip",
              text: "1 Januari 2024",
              attrs: {
                definition:
                  "Tanggal efektif kewajiban seluruh bank memperhitungkan ATMR Risiko Pasar",
              },
            },
          ]
        ),
        sectionId: pojk27_s02_1.id,
        order: 4,
      },
      {
        number: "5",
        content: createRichContent(
          "Pasal 34 DIHAPUS, Pasal 35 DIHAPUS, Pasal 36 DIHAPUS: Ketentuan-ketentuan terkait kriteria perhitungan ATMR Risiko Pasar dicabut seiring dengan berlakunya Pasal 33A.",
          []
        ),
        sectionId: pojk27_s02_1.id,
        order: 5,
      },
    ],
  });

  const pojk27_s02_2 = await prisma.baselSection.create({
    data: {
      title: "Ketentuan Central Counterparty (BAB IIIA, Pasal 42A-42B)",
      chapterId: pojk27_ch02.id,
      order: 2,
    },
  });

  await prisma.baselSubsection.createMany({
    data: [
      {
        number: "6",
        content: createRichContent(
          "BAB IIIA (BARU) - Perhitungan Modal untuk Transaksi Terkait Lembaga Central Counterparty dan Persyaratan Margin: Bab baru yang mengatur perhitungan permodalan untuk eksposur terhadap Central Counterparty (CCP) dan persyaratan margin untuk derivatif non-cleared.",
          [
            {
              type: "tooltip",
              text: "Central Counterparty",
              attrs: {
                definition:
                  "CCP - lembaga yang menjadi pihak lawan sentral dalam transaksi keuangan untuk mengurangi risiko counterparty",
              },
            },
          ]
        ),
        sectionId: pojk27_s02_2.id,
        order: 1,
      },
      {
        number: "7",
        content: createRichContent(
          "Pasal 42A (BARU): (1) Bank wajib memperhitungkan eksposur terhadap lembaga central counterparty dalam perhitungan permodalan. (2) Metode perhitungan permodalan untuk eksposur Bank terhadap lembaga central counterparty ditetapkan oleh OJK. [Implementasi Basel III CCP framework]",
          [
            {
              type: "tooltip",
              text: "eksposur terhadap CCP",
              attrs: {
                definition:
                  "Trade exposures, default fund contributions, dan initial margin yang ditempatkan di CCP",
              },
            },
          ]
        ),
        sectionId: pojk27_s02_2.id,
        order: 2,
      },
      {
        number: "8",
        content: createRichContent(
          "Pasal 42B (BARU): (1) Bank wajib memenuhi persyaratan margin untuk transaksi derivatif yang tidak dikliringkan melalui lembaga central counterparty. (2) Metode perhitungan persyaratan margin ditetapkan oleh OJK. [Implementasi BCBS-IOSCO margin requirements for non-centrally cleared derivatives]",
          [
            {
              type: "tooltip",
              text: "margin requirements",
              attrs: {
                definition:
                  "Initial margin dan variation margin yang wajib dipertukarkan untuk derivatif non-cleared",
              },
            },
            {
              type: "tooltip",
              text: "non-centrally cleared derivatives",
              attrs: {
                definition:
                  "Transaksi derivatif OTC yang tidak dikliringkan melalui CCP",
              },
            },
          ]
        ),
        sectionId: pojk27_s02_2.id,
        order: 3,
      },
    ],
  });

  // ============================================
  // POJK27 - Chapter 3: Pelaporan dan Sanksi
  // ============================================
  const pojk27_ch03 = await prisma.baselChapter.create({
    data: {
      code: "03",
      title: "Pelaporan dan Sanksi",
      standardId: pojk27.id,
      effectiveDate: new Date("2022-10-20"),
      lastUpdate: new Date("2022-10-20"),
      status: "current",
      order: 3,
    },
  });
  console.log(`  📖 Created Chapter: POJK27-${pojk27_ch03.code}`);

  const pojk27_s03_1 = await prisma.baselSection.create({
    data: {
      title: "Perubahan Pelaporan (Pasal 47, 52-53)",
      chapterId: pojk27_ch03.id,
      order: 1,
    },
  });

  await prisma.baselSubsection.createMany({
    data: [
      {
        number: "1",
        content: createRichContent(
          "Perubahan Pasal 47: (1)-(2) Tidak berubah substansi. (3) Laporan disampaikan secara daring melalui sistem pelaporan OJK. (4) Format dan tata cara penyampaian sesuai POJK mengenai pelaporan bank umum melalui sistem pelaporan OJK. [Perubahan: penyampaian laporan secara online/daring]",
          [
            {
              type: "tooltip",
              text: "sistem pelaporan OJK",
              attrs: {
                definition:
                  "Sistem elektronik yang disediakan OJK untuk penyampaian laporan bank secara daring",
              },
            },
          ]
        ),
        sectionId: pojk27_s03_1.id,
        order: 1,
      },
      {
        number: "2",
        content: createRichContent(
          "Perubahan Pasal 52: Tata cara penyampaian laporan ICAAP dan pengungkapan modal dilaksanakan sesuai dengan POJK mengenai pelaporan bank umum melalui sistem pelaporan OJK.",
          []
        ),
        sectionId: pojk27_s03_1.id,
        order: 2,
      },
      {
        number: "3",
        content: createRichContent(
          "Pasal 53 DIHAPUS: Ketentuan tata cara penyampaian laporan dicabut karena telah diatur dalam POJK pelaporan bank umum.",
          []
        ),
        sectionId: pojk27_s03_1.id,
        order: 3,
      },
    ],
  });

  const pojk27_s03_2 = await prisma.baselSection.create({
    data: {
      title: "Perubahan Sanksi (Pasal 55-56)",
      chapterId: pojk27_ch03.id,
      order: 2,
    },
  });

  await prisma.baselSubsection.createMany({
    data: [
      {
        number: "4",
        content: createRichContent(
          "Perubahan Pasal 55: Ketentuan sanksi administratif diperbarui untuk mencakup pelanggaran pasal-pasal baru (Pasal 33A ayat (2), Pasal 42A ayat (1), Pasal 42B ayat (1)). Sanksi berupa: (1) teguran tertulis; (2) larangan transfer laba, larangan ekspansi, pembekuan kegiatan usaha tertentu, dan/atau penurunan tingkat kesehatan; (3) larangan sebagai pihak utama sesuai POJK penilaian kembali pihak utama LJK.",
          [
            {
              type: "tooltip",
              text: "pihak utama",
              attrs: {
                definition:
                  "Pemegang saham pengendali, anggota Direksi, anggota Dewan Komisaris, dan/atau pejabat eksekutif Bank",
              },
            },
          ]
        ),
        sectionId: pojk27_s03_2.id,
        order: 1,
      },
      {
        number: "5",
        content: createRichContent(
          "Perubahan Pasal 56: Bank yang melanggar ketentuan pelaporan Pasal 47 ayat (1) dan/atau ayat (2) dikenai sanksi sebagaimana diatur dalam POJK mengenai pelaporan bank umum melalui sistem pelaporan OJK.",
          []
        ),
        sectionId: pojk27_s03_2.id,
        order: 2,
      },
      {
        number: "6",
        content: createRichContent(
          "Pasal 59 DIHAPUS: Ketentuan peralihan terkait pemberlakuan POJK 11/2016 dicabut karena telah melewati masa transisi.",
          []
        ),
        sectionId: pojk27_s03_2.id,
        order: 3,
      },
    ],
  });

  // ============================================
  // Add FAQs
  // ============================================
  console.log("\n📚 Adding FAQs...");

  // Find subsections for FAQs
  const subsections = await prisma.baselSubsection.findMany({
    include: { section: { include: { chapter: true } } },
  });
  const findSubsection = (chapterCode: string, number: string) => {
    return subsections.find(
      (s) => s.section.chapter.code === chapterCode && s.number === number
    );
  };

  // FAQ for POJK11 - Modal Minimum
  const pojk11_sub19 = subsections.find(
    (s) => s.number === "19" && s.section.title === "Kewajiban Modal Minimum"
  );
  if (pojk11_sub19) {
    await prisma.baselFAQ.createMany({
      data: [
        {
          question: "Bagaimana cara menghitung KPMM berdasarkan profil risiko?",
          answer:
            "KPMM dihitung dengan formula: Modal / ATMR × 100%. Modal terdiri dari Tier 1 (CET1 + AT1) dan Tier 2. ATMR mencakup risiko kredit, operasional, dan pasar. Bank dengan profil risiko Peringkat 1 wajib memiliki KPMM minimal 8%, sedangkan Peringkat 4-5 minimal 11-14%. OJK dapat menetapkan KPMM lebih tinggi berdasarkan SREP.",
          subsectionId: pojk11_sub19.id,
          order: 1,
        },
        {
          question: "Apa perbedaan antara profil risiko Peringkat 1 hingga 5?",
          answer:
            "Peringkat profil risiko mencerminkan tingkat risiko inheren dan kualitas manajemen risiko Bank. Peringkat 1 menunjukkan risiko sangat rendah dengan manajemen risiko sangat baik, sementara Peringkat 5 menunjukkan risiko sangat tinggi dengan manajemen risiko tidak memadai. Penilaian dilakukan OJK setiap semester berdasarkan aspek risiko kredit, pasar, likuiditas, operasional, hukum, stratejik, kepatuhan, dan reputasi.",
          subsectionId: pojk11_sub19.id,
          order: 2,
        },
      ],
    });
  }

  // FAQ for Capital Buffer
  const pojk11_sub20 = subsections.find(
    (s) => s.number === "20" && s.section.title === "Tambahan Modal (Buffer)"
  );
  if (pojk11_sub20) {
    await prisma.baselFAQ.createMany({
      data: [
        {
          question: "Apa perbedaan antara ketiga jenis buffer modal?",
          answer:
            "Capital Conservation Buffer (2,5%) bersifat wajib untuk semua bank KBMI 2-4 dan berfungsi menyerap kerugian pada periode normal. Countercyclical Buffer (0-2,5%) ditetapkan otoritas berdasarkan siklus kredit untuk mencegah pertumbuhan kredit berlebihan. Capital Surcharge untuk Bank Sistemik (1-2,5%) hanya berlaku bagi bank yang ditetapkan OJK sebagai Bank Sistemik untuk mengurangi moral hazard 'too big to fail'.",
          subsectionId: pojk11_sub20.id,
          order: 1,
        },
        {
          question: "Apa konsekuensi jika Bank tidak memenuhi buffer?",
          answer:
            "Bank yang tidak memenuhi buffer dikenakan pembatasan distribusi laba (dividen, bonus, buyback). Semakin besar shortfall, semakin besar pembatasan. Jika CET1 ratio di antara minimum requirement dan buffer requirement, Bank masih dapat beroperasi normal tetapi tidak dapat mendistribusikan laba sampai buffer terpenuhi kembali.",
          subsectionId: pojk11_sub20.id,
          order: 2,
        },
      ],
    });
  }

  // FAQ for POJK27 - CCP
  const pojk27_sub7 = subsections.find(
    (s) =>
      s.number === "7" &&
      s.section.title ===
        "Ketentuan Central Counterparty (BAB IIIA, Pasal 42A-42B)"
  );
  if (pojk27_sub7) {
    await prisma.baselFAQ.createMany({
      data: [
        {
          question: "Mengapa Bank wajib memperhitungkan eksposur terhadap CCP?",
          answer:
            "Eksposur terhadap CCP memiliki risiko counterparty meskipun lebih rendah dibanding bilateral. Bank memiliki trade exposures (nilai mark-to-market), default fund contributions (untuk menutup kerugian jika clearing member gagal), dan initial margin yang ditempatkan di CCP. Perhitungan modal untuk eksposur CCP yang qualifying mendapat bobot risiko lebih rendah (2%) dibanding non-qualifying CCP atau transaksi bilateral.",
          subsectionId: pojk27_sub7.id,
          order: 1,
        },
        {
          question: "Apa yang dimaksud dengan qualifying CCP?",
          answer:
            "Qualifying CCP adalah CCP yang: (1) memiliki izin dari otoritas yang berwenang; (2) diawasi secara prudensial; (3) mematuhi CPSS-IOSCO Principles for Financial Market Infrastructures; dan (4) menyediakan informasi yang memadai untuk perhitungan modal clearing member. CCP yang memenuhi kriteria ini memberikan bobot risiko lebih rendah bagi eksposur bank.",
          subsectionId: pojk27_sub7.id,
          order: 2,
        },
      ],
    });
  }

  // ============================================
  // Add Footnotes
  // ============================================
  console.log("📝 Adding Footnotes...");

  if (pojk11_sub19) {
    await prisma.baselFootnote.create({
      data: {
        number: 1,
        content:
          "Ketentuan KPMM minimum berdasarkan profil risiko ini mengimplementasikan Pilar 2 Basel II/III (Supervisory Review Process). OJK dapat menetapkan KPMM lebih tinggi melalui proses SREP jika hasil ICAAP Bank menunjukkan kebutuhan modal tambahan.",
        subsectionId: pojk11_sub19.id,
      },
    });
  }

  if (pojk11_sub20) {
    await prisma.baselFootnote.create({
      data: {
        number: 2,
        content:
          "Capital Conservation Buffer diimplementasikan secara bertahap: 0,625% (2016), 1,25% (2017), 1,875% (2018), dan 2,5% (2019). Countercyclical Buffer di Indonesia saat ini ditetapkan 0% oleh Bank Indonesia sebagai otoritas makroprudensial.",
        subsectionId: pojk11_sub20.id,
      },
    });
  }

  const pojk11_sub1_cet1 = subsections.find(
    (s) => s.number === "1" && s.section.title === "Struktur Modal"
  );
  if (pojk11_sub1_cet1) {
    await prisma.baselFootnote.create({
      data: {
        number: 3,
        content:
          "Struktur modal Basel III menekankan kualitas modal dengan mewajibkan mayoritas modal berbentuk CET1. Going-concern capital (Tier 1) minimal 6% dan gone-concern capital (Tier 2) maksimal 2% dari total 8% minimum. CET1 yang berkualitas tinggi (saham biasa dan laba ditahan) minimal 4,5%.",
        subsectionId: pojk11_sub1_cet1.id,
      },
    });
  }

  // ============================================
  // Create Basel Update entries
  // ============================================
  console.log("📢 Adding Basel Updates...");

  await prisma.baselUpdate.createMany({
    data: [
      {
        title: "POJK 27/2022 - Perubahan Kedua KPMM Bank Umum",
        description:
          "Perubahan kedua atas POJK 11/POJK.03/2016 tentang KPMM Bank Umum, mencakup ketentuan CCP dan margin requirements untuk derivatif non-cleared",
        link: "/regmaps/pojk27",
        date: new Date("2022-10-20"),
      },
      {
        title: "Kewajiban ATMR Risiko Pasar untuk Seluruh Bank",
        description:
          "Mulai 1 Januari 2024, seluruh bank wajib memperhitungkan ATMR untuk Risiko Pasar (Pasal 33A POJK 27/2022)",
        link: "/regmaps/pojk27/02",
        date: new Date("2024-01-01"),
      },
      {
        title: "POJK 34/2016 - Terminologi Bank Sistemik",
        description:
          "Perubahan terminologi dari D-SIB menjadi Bank Sistemik sesuai UU 9/2016 tentang PPKSK",
        link: "/regmaps/pojk34",
        date: new Date("2016-09-08"),
      },
    ],
  });

  console.log("\n✅ Seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log("   Standards: 3 (POJK11, POJK34, POJK27)");
  console.log("   - POJK11: Original regulation with amendment notices");
  console.log("   - POJK34: First revision (Bank Sistemik terminology)");
  console.log("   - POJK27: Second revision (CCP, margin, KBMI)");
  console.log("\n🔗 Cross-references:");
  console.log("   - Amended articles in POJK11 link to POJK34/POJK27");
  console.log("   - Revision articles reference original provisions");
  console.log("   - Deleted articles marked with notice");
  console.log("\n📌 URLs:");
  console.log("   - http://localhost:3000/regmaps/pojk11 (Original)");
  console.log("   - http://localhost:3000/regmaps/pojk34 (Revisi 1)");
  console.log("   - http://localhost:3000/regmaps/pojk27 (Revisi 2)");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
