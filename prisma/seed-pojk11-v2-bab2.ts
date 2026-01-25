/**
 * POJK 11/2016 BAB II - MODAL (Structure + All Content)
 *
 * Creates BAB II with 18 Pasal (9-26), each as separate section
 * Run after: seed-pojk11-v2.ts
 * Run with: npx tsx prisma/seed-pojk11-v2-bab2.ts
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
  console.log("🏦 Seeding BAB II - MODAL...\n");

  const standard = await prisma.baselStandard.findUnique({
    where: { code: "POJK11V2" },
  });

  if (!standard) {
    throw new Error(
      "Standard POJK11V2 not found. Run seed-pojk11-v2.ts first.",
    );
  }

  // Delete existing BAB II
  const existingBab2 = await prisma.baselChapter.findFirst({
    where: { standardId: standard.id, code: "02" },
  });
  if (existingBab2) {
    console.log("⚠️ BAB II exists. Deleting...");
    await prisma.baselChapter.delete({ where: { id: existingBab2.id } });
  }

  // Create BAB II
  const bab2 = await prisma.baselChapter.create({
    data: {
      code: "02",
      title: "Modal",
      standardId: standard.id,
      effectiveDate: new Date("2016-01-01"),
      lastUpdate: new Date("2022-12-01"),
      status: "current",
      order: 2,
    },
  });
  console.log(`📖 Created BAB II: ${bab2.title}\n`);

  // Helper to create section + subsection
  async function createPasal(
    number: number,
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
        chapterId: bab2.id,
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

  // === PASAL 9 - Struktur Modal ===
  await createPasal(9, "Struktur Modal", 1, [
    {
      number: "9",
      content: `(1) Modal bagi Bank yang berkantor pusat di Indonesia terdiri atas:
a. modal inti (Tier 1) yang meliputi:
1. modal inti utama (Common Equity Tier 1);
2. modal inti tambahan (Additional Tier 1); dan
b. modal pelengkap (Tier 2).
(2) Modal sebagaimana dimaksud pada ayat (1) wajib memperhitungkan faktor-faktor yang menjadi pengurang modal sebagaimana dimaksud dalam Pasal 17 dan Pasal 22.
(3) Dalam perhitungan modal secara konsolidasi, komponen modal Perusahaan Anak yang dapat diperhitungkan sebagai modal inti utama, modal inti tambahan, dan modal pelengkap harus memenuhi persyaratan yang berlaku untuk masing-masing komponen modal sebagaimana diterapkan bagi Bank secara individu.
(4) Dalam perhitungan modal secara konsolidasi sebagaimana dimaksud dalam ayat (3) untuk modal inti tambahan dan modal pelengkap yang diterbitkan oleh Perusahaan Anak bukan Bank harus:
a. memenuhi persyaratan sebagaimana dimaksud pada ayat (3); dan
b. memiliki fitur untuk dikonversi menjadi saham biasa atau mekanisme write down, dalam hal Bank secara konsolidasi berpotensi terganggu kelangsungan usahanya (point of non-viability).
(5) Fitur untuk dikonversi menjadi saham biasa atau mekanisme write down sebagaimana dimaksud pada ayat (4) huruf b dinyatakan secara jelas dalam dokumentasi penerbitan.`,
      notes:
        "Struktur modal Bank: Tier 1 (CET1 + AT1) + Tier 2. Modal harus memperhitungkan faktor pengurang. Instrumen modal Perusahaan Anak harus memiliki fitur PONV.",
    },
  ]);

  // === PASAL 10 - Modal Kantor Cabang Bank Asing ===
  await createPasal(10, "Modal Kantor Cabang Bank Asing", 2, [
    {
      number: "10",
      content: `(1) Modal bagi kantor cabang dari bank yang berkedudukan di luar negeri terdiri atas:
a. dana usaha;
b. laba ditahan dan laba tahun lalu setelah dikeluarkan pengaruh faktor-faktor sebagaimana dimaksud dalam Pasal 14 ayat (2);
c. laba tahun berjalan setelah dikeluarkan pengaruh faktor-faktor sebagaimana dimaksud dalam Pasal 14 ayat (2);
d. cadangan umum;
e. saldo surplus revaluasi aset tetap;
f. pendapatan komprehensif lainnya berupa potensi keuntungan yang berasal dari peningkatan nilai wajar aset keuangan yang diklasifikasikan dalam kelompok tersedia untuk dijual;
g. cadangan umum Penyisihan Penghapusan Aset (PPA) atas aset produktif dengan perhitungan sebagaimana dimaksud dalam Pasal 20 ayat (1) huruf c; dan
h. lainnya berdasarkan persetujuan Otoritas Jasa Keuangan.
(2) Modal bagi kantor cabang dari bank yang berkedudukan di luar negeri sebagaimana dimaksud pada ayat (1) wajib memperhitungkan faktor-faktor yang menjadi pengurang modal sebagaimana diatur dalam Pasal 14 ayat (1) huruf b, Pasal 17, dan Pasal 22.
(3) Perhitungan dana usaha sebagai komponen modal sebagaimana dimaksud pada ayat (1) huruf a dilakukan dalam hal:
a. posisi dana usaha yang sebenarnya (actual dana usaha) lebih besar dari dana usaha yang dinyatakan (declared dana usaha), yang diperhitungkan adalah dana usaha yang dinyatakan (declared dana usaha);
b. posisi dana usaha yang sebenarnya (actual dana usaha) lebih kecil dari dana usaha yang dinyatakan (declared dana usaha), yang diperhitungkan adalah dana usaha yang sebenarnya (actual dana usaha); atau
c. posisi dana usaha yang sebenarnya negatif, menjadi faktor pengurang komponen modal sebagaimana dimaksud pada ayat (1).`,
      notes:
        "Modal kantor cabang bank asing: dana usaha + laba + cadangan + OCI + lainnya (persetujuan OJK). Rev 1: menghapus 'cadangan tujuan', menambah huruf h.",
      footnote: `Yang dimaksud dengan "dana usaha" adalah penempatan yang berasal dari kantor pusat bank pada kantor cabang dari bank yang berkedudukan di luar negeri setelah dikurangi dengan penempatan yang berasal dari kantor cabang bank yang berkedudukan di luar negeri pada: 1. kantor pusat; 2. kantor-kantor bank yang bersangkutan di luar negeri; dan 3. kantor lainnya seperti sister company dari bank yang berkedudukan di luar negeri.`,
      revisions: [
        {
          title: "Ketentuan Asli (POJK 11/2016)",
          content: `Ayat (1) huruf g: "cadangan tujuan; dan" (dihapus di Revisi 1)
Ayat (1) huruf h: "cadangan umum PPA..." (sebelumnya huruf g)
Tidak ada huruf h "lainnya berdasarkan persetujuan OJK"`,
          date: "2016-02-26",
        },
      ],
    },
  ]);

  // === PASAL 11 - Komponen Modal Inti ===
  await createPasal(11, "Komponen Modal Inti", 3, [
    {
      number: "11",
      content: `(1) Modal inti sebagaimana dimaksud dalam Pasal 9 ayat (1) huruf a terdiri atas:
a. modal inti utama (Common Equity Tier 1) yang mencakup:
1. modal disetor;
2. cadangan tambahan modal (disclosed reserve); dan
b. modal inti tambahan (Additional Tier 1).
(2) Bank wajib menyediakan modal inti paling rendah sebesar 6% (enam persen) dari ATMR baik secara individu maupun secara konsolidasi dengan Perusahaan Anak.
(3) Bank wajib menyediakan modal inti utama paling rendah sebesar 4,5% (empat koma lima persen) dari ATMR baik secara individu maupun secara konsolidasi dengan Perusahaan Anak.`,
      notes:
        "Tier 1 = CET1 (modal disetor + disclosed reserve) + AT1. Minimum: Tier 1 ≥ 6% ATMR, CET1 ≥ 4,5% ATMR.",
      footnote: `Yang termasuk komponen modal inti tambahan antara lain: 1. perpetual non-cumulative subordinated debt; 2. perpetual non-cumulative preference shares; 3. instrumen hybrid perpetual dan non-cumulative; 4. agio/disagio dari penerbitan instrumen AT1.`,
    },
  ]);

  // === PASAL 12 - Persyaratan Modal Disetor ===
  await createPasal(12, "Persyaratan Modal Disetor", 4, [
    {
      number: "12",
      content: `Instrumen modal disetor sebagaimana dimaksud dalam Pasal 11 ayat (1) huruf a angka 1 wajib memenuhi persyaratan:
a. diterbitkan dan telah dibayar penuh;
b. bersifat subordinasi terhadap komponen modal lain;
c. bersifat permanen;
d. tidak dapat dibayar kembali oleh Bank, kecuali memenuhi kriteria pembelian kembali saham (treasury stock) atau pada saat likuidasi;
e. tersedia untuk menyerap kerugian yang terjadi sebelum likuidasi maupun pada saat likuidasi;
f. perolehan imbal hasil tidak dapat dipastikan dan tidak dapat diakumulasikan antar periode;
g. tidak diproteksi maupun dijamin oleh Bank atau Perusahaan Anak;
h. tidak terdapat kesepakatan yang dapat meningkatkan senioritas instrumen secara legal atau ekonomis;
i. memiliki karakteristik pembayaran dividen atau imbal hasil:
1. hanya dapat dilakukan jika Bank telah memenuhi seluruh kewajiban legal dan kontraktual serta melakukan pembayaran atas imbal hasil instrumen modal lainnya;
2. berasal dari saldo laba dan/atau laba tahun berjalan;
3. tidak memiliki nilai yang pasti dan tidak terkait dengan nilai yang dibayarkan atas instrumen modal; dan
4. tidak memiliki fitur preferensi;
j. sumber pendanaan tidak berasal dari Bank penerbit baik secara langsung atau tidak langsung; dan
k. diklasifikasikan sebagai ekuitas berdasarkan standar akuntansi keuangan.`,
      notes:
        "11 kriteria CET1: paid-up, subordinasi, permanen, no repurchase, loss-absorbing, non-cumulative, unprotected, no seniority, dividen dari laba, no self-funding, SAK equity. Rev 1 menambah huruf d, h, i.1, dan k.",
      revisions: [
        {
          title: "Ketentuan Asli (POJK 11/2016)",
          content: `8 kriteria (huruf a-h). Revisi 1 mengubah menjadi 11 kriteria dengan menambah:
- huruf d (tidak dapat dibayar kembali)
- huruf h (tidak ada kesepakatan meningkatkan senioritas)
- huruf i.1 (dividen hanya setelah memenuhi kewajiban)
- huruf k (diklasifikasikan sebagai ekuitas)`,
          date: "2016-02-26",
        },
      ],
    },
  ]);

  // === PASAL 13 - Treasury Stock ===
  await createPasal(13, "Pembelian Kembali Saham (Treasury Stock)", 5, [
    {
      number: "13",
      content: `Bank yang melakukan pembelian kembali saham (treasury stock) sebagaimana dimaksud dalam Pasal 12 huruf d yang telah diakui sebagai komponen modal disetor, wajib memenuhi persyaratan:
a. setelah jangka waktu 5 (lima) tahun sejak penerbitan;
b. untuk tujuan tertentu;
c. dilakukan sesuai dengan ketentuan peraturan perundang-undangan;
d. telah memperoleh persetujuan Otoritas Jasa Keuangan; dan
e. tidak menyebabkan penurunan modal di bawah persyaratan minimum sebagaimana dimaksud dalam Pasal 2, Pasal 3, dan Pasal 7.`,
      notes:
        "Treasury stock: min 5 tahun, tujuan tertentu (ESOP, hindari takeover), sesuai UU PT, persetujuan OJK, tidak di bawah KPMM minimum.",
      footnote: `Tujuan tertentu untuk melakukan pembelian kembali saham yaitu sebagai persediaan saham dalam rangka program employee stock option atau management stock option atau menghindari upaya take over.`,
      revisions: [
        {
          title: "Ketentuan Asli (POJK 11/2016)",
          content: `Tidak ada referensi ke Pasal 12 huruf d. Revisi 1 menambah: "sebagaimana dimaksud dalam Pasal 12 huruf d".`,
          date: "2016-02-26",
        },
      ],
    },
  ]);

  console.log(
    "\n✅ Pasal 9-13 created. Run seed-pojk11-v2-bab2-part2.ts for Pasal 14-26.",
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
