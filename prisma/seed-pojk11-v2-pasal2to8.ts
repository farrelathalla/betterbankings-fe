/**
 * POJK 11/2016 BAB I Content - Pasal 2-8
 *
 * Run after: seed-pojk11-v2.ts and seed-pojk11-v2-pasal1.ts
 * Run with: npx tsx prisma/seed-pojk11-v2-pasal2to8.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function createContent(text: string): string {
  return JSON.stringify({
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text }] }],
  });
}

async function seedPasal(
  sectionTitle: string,
  subsections: Array<{
    number: string;
    content: string;
    notes: string;
    footnote?: string;
    revisions?: Array<{ title: string; content: string; date: string }>;
  }>,
) {
  const section = await prisma.baselSection.findFirst({
    where: { title: sectionTitle },
  });

  if (!section) {
    console.log(`⚠️ Section '${sectionTitle}' not found. Skipping.`);
    return;
  }

  await prisma.baselSubsection.deleteMany({ where: { sectionId: section.id } });

  for (const sub of subsections) {
    const subsection = await prisma.baselSubsection.create({
      data: {
        number: sub.number,
        content: createContent(sub.content),
        betterBankingNotes: sub.notes,
        sectionId: section.id,
        order: parseInt(sub.number.replace(/\D/g, "") || "0"),
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
        const rev = sub.revisions[i];
        await prisma.baselRevision.create({
          data: {
            title: rev.title,
            content: rev.content,
            revisionDate: new Date(rev.date),
            subsectionId: subsection.id,
            order: i + 1,
          },
        });
      }
    }
  }

  console.log(
    `✅ Seeded ${sectionTitle} with ${subsections.length} subsections`,
  );
}

async function main() {
  console.log("📝 Seeding Pasal 2-8...\n");

  // PASAL 2 - Kewajiban Modal Minimum (No changes across revisions)
  await seedPasal("Pasal 2 - Kewajiban Modal Minimum", [
    {
      number: "2.1",
      content: `(1) Bank wajib menyediakan modal minimum sesuai profil risiko.`,
      notes:
        "Kewajiban dasar KPMM: modal minimum harus sesuai dengan profil risiko bank.",
      footnote:
        "Yang dimaksud dengan 'profil risiko' adalah profil risiko Bank sebagaimana diatur dalam ketentuan mengenai penilaian tingkat kesehatan Bank.",
    },
    {
      number: "2.2",
      content: `(2) Penyediaan modal minimum sebagaimana dimaksud pada ayat (1) dihitung dengan menggunakan rasio Kewajiban Penyediaan Modal Minimum (KPMM).`,
      notes:
        "KPMM = Modal / ATMR. Rasio ini dikenal juga sebagai Capital Adequacy Ratio (CAR).",
      footnote:
        "Yang dimaksud dengan 'rasio KPMM' adalah perbandingan antara modal Bank dengan ATMR.",
    },
    {
      number: "2.3",
      content: `(3) Penyediaan modal minimum sebagaimana dimaksud pada ayat (1) ditetapkan paling rendah:
a. 8% (delapan persen) dari Aset Tertimbang Menurut Risiko (ATMR) bagi Bank dengan profil risiko Peringkat 1;
b. 9% (sembilan persen) sampai dengan kurang dari 10% (sepuluh persen) dari ATMR bagi Bank dengan profil risiko Peringkat 2;
c. 10% (sepuluh persen) sampai dengan kurang dari 11% (sebelas persen) dari ATMR bagi Bank dengan profil risiko Peringkat 3; atau
d. 11% (sebelas persen) sampai dengan 14% (empat belas persen) dari ATMR bagi Bank dengan profil risiko Peringkat 4 atau Peringkat 5.`,
      notes:
        "KPMM minimum berbeda-beda: 8% (Peringkat 1), 9-<10% (Peringkat 2), 10-<11% (Peringkat 3), 11-14% (Peringkat 4/5).",
    },
    {
      number: "2.4",
      content: `(4) Otoritas Jasa Keuangan berwenang menetapkan modal minimum lebih besar dari modal minimum sebagaimana dimaksud pada ayat (3) dalam hal Otoritas Jasa Keuangan menilai Bank menghadapi potensi kerugian yang membutuhkan modal lebih besar.`,
      notes:
        "OJK dapat menetapkan KPMM lebih tinggi dari ketentuan jika bank menghadapi risiko yang lebih besar.",
    },
    {
      number: "2.5",
      content: `(5) Kewajiban pemenuhan modal minimum sesuai profil risiko sebagaimana dimaksud pada ayat (1) ditetapkan:
a. pemenuhan modal minimum posisi bulan Maret sampai dengan bulan Agustus didasarkan pada peringkat profil risiko posisi bulan Desember tahun sebelumnya;
b. pemenuhan modal minimum posisi bulan September sampai dengan bulan Februari tahun berikutnya didasarkan pada peringkat profil risiko posisi bulan Juni;
c. dalam hal terjadi perubahan peringkat profil risiko di antara periode penilaian profil risiko, pemenuhan modal minimum didasarkan pada peringkat profil risiko terakhir.`,
      notes:
        "Timeline penilaian: Mar-Agu mengacu Des tahun lalu; Sep-Feb mengacu Jun. Perubahan peringkat diikuti segera.",
    },
  ]);

  // PASAL 3 - Tambahan Modal Buffer (Changed in Revision 1)
  await seedPasal("Pasal 3 - Tambahan Modal (Buffer)", [
    {
      number: "3.1",
      content: `(1) Selain kewajiban penyediaan modal minimum sesuai profil risiko sebagaimana dimaksud dalam Pasal 2, Bank wajib membentuk tambahan modal sebagai penyangga (buffer) sesuai kriteria yang diatur dalam Peraturan Otoritas Jasa Keuangan ini.`,
      notes:
        "Selain KPMM minimum, bank wajib membentuk buffer tambahan sesuai POJK ini.",
      footnote:
        "Pembentukan tambahan modal selain modal minimum sebagaimana dimaksud dalam ayat ini berfungsi sebagai penyangga (buffer) apabila terjadi krisis keuangan dan ekonomi yang dapat mengganggu stabilitas sistem keuangan.",
    },
    {
      number: "3.2",
      content: `(2) Tambahan modal sebagaimana dimaksud pada ayat (1) dapat berupa:
a. Capital Conservation Buffer;
b. Countercyclical Buffer; dan/atau
c. Capital Surcharge untuk Bank Sistemik.`,
      notes:
        "3 jenis buffer: CCB (2,5%), CCyB (0-2,5%), dan Capital Surcharge untuk Bank Sistemik (1-2,5%).",
      revisions: [
        {
          title: "Ketentuan Asli (POJK 11/2016)",
          content: `(2) Tambahan modal sebagaimana dimaksud pada ayat (1) dapat berupa:
a. Capital Conservation Buffer;
b. Countercyclical Buffer; dan/atau
c. Capital Surcharge untuk D-SIB.`,
          date: "2016-02-26",
        },
      ],
    },
    {
      number: "3.3",
      content: `(3) Besarnya tambahan modal sebagaimana dimaksud pada ayat (2) diatur:
a. Capital Conservation Buffer ditetapkan sebesar 2,5% (dua koma lima persen) dari ATMR;
b. Countercyclical Buffer ditetapkan dalam kisaran sebesar 0% (nol persen) sampai dengan 2,5% (dua koma lima persen) dari ATMR;
c. Capital Surcharge untuk Bank Sistemik ditetapkan dalam kisaran sebesar 1% (satu persen) sampai dengan 2,5% (dua koma lima persen) dari ATMR.`,
      notes:
        "Besaran buffer: CCB=2,5%, CCyB=0-2,5%, Capital Surcharge=1-2,5% (semuanya dari ATMR).",
      revisions: [
        {
          title: "Ketentuan Asli (POJK 11/2016)",
          content: `c. Capital Surcharge untuk D-SIB ditetapkan dalam kisaran sebesar 1% (satu persen) sampai dengan 2,5% (dua koma lima persen) dari ATMR.`,
          date: "2016-02-26",
        },
      ],
    },
    {
      number: "3.4",
      content: `(4) Besarnya persentase Countercyclical Buffer sebagaimana dimaksud pada ayat (3) huruf b berdasarkan penetapan otoritas yang berwenang.`,
      notes:
        "CCyB ditetapkan oleh Bank Indonesia berdasarkan kondisi siklus kredit.",
      footnote:
        "Yang dimaksud dengan 'otoritas yang berwenang' adalah Bank Indonesia.",
    },
    {
      number: "3.5",
      content: `(5) Otoritas Jasa Keuangan menetapkan besarnya persentase Capital Surcharge untuk Bank Sistemik sebagaimana dimaksud pada ayat (3) huruf c.`,
      notes:
        "OJK menetapkan besaran Capital Surcharge untuk masing-masing Bank Sistemik.",
    },
    {
      number: "3.6",
      content: `(6) Dalam menetapkan besar Capital Surcharge untuk Bank Sistemik sebagaimana dimaksud pada ayat (5), Otoritas Jasa Keuangan berkoordinasi dengan otoritas yang berwenang.`,
      notes:
        "OJK berkoordinasi dengan Bank Indonesia dalam menetapkan Capital Surcharge.",
      footnote:
        "Yang dimaksud dengan 'otoritas yang berwenang' adalah Bank Indonesia.",
    },
    {
      number: "3.7",
      content: `(7) Otoritas Jasa Keuangan dapat menetapkan persentase Capital Surcharge untuk Bank Sistemik yang lebih besar dari kisaran sebagaimana dimaksud pada ayat (3) huruf c.`,
      notes: "OJK dapat menetapkan Capital Surcharge >2,5% jika diperlukan.",
    },
    {
      number: "3.8",
      content: `(8) Pemenuhan tambahan modal sebagaimana dimaksud pada ayat (3) dipenuhi dengan komponen modal inti utama (Common Equity Tier 1).`,
      notes: "Semua buffer harus dipenuhi dengan CET1, bukan AT1 atau Tier 2.",
      footnote:
        "Pemenuhan tambahan modal sebagaimana dimaksud pada ayat (3) untuk kantor cabang dari bank yang berkedudukan di luar negeri dipenuhi dari bagian dana usaha yang ditempatkan dalam CEMA.",
    },
    {
      number: "3.9",
      content: `(9) Pemenuhan tambahan modal sebagaimana dimaksud pada ayat (8) diperhitungkan setelah komponen modal inti utama (Common Equity Tier 1) dialokasikan untuk memenuhi kewajiban penyediaan:
a. modal inti utama minimum sebagaimana dimaksud dalam Pasal 11 ayat (3);
b. modal inti minimum sebagaimana dimaksud dalam Pasal 11 ayat (2); dan
c. modal minimum sesuai profil risiko sebagaimana dimaksud dalam Pasal 2 ayat (3).`,
      notes:
        "Urutan alokasi CET1: (1) CET1 min 4,5%, (2) Tier 1 min 6%, (3) KPMM sesuai profil risiko, (4) Buffer.",
    },
  ]);

  // PASAL 4 - Kewajiban Pembentukan Buffer (Changed in Revision 1 & 2)
  await seedPasal("Pasal 4 - Kewajiban Pembentukan Buffer", [
    {
      number: "4.1",
      content: `(1) Bank yang tergolong sebagai kelompok bank berdasarkan modal inti 2, kelompok bank berdasarkan modal inti 3, dan kelompok bank berdasarkan modal inti 4 wajib membentuk Capital Conservation Buffer sebagaimana dimaksud dalam Pasal 3 ayat (3) huruf a.`,
      notes:
        "CCB wajib untuk KBMI 2, 3, dan 4 (sebelumnya BUKU 3 dan 4). KBMI 1 tidak wajib CCB.",
      footnote:
        "Pengelompokan kelompok bank berdasarkan modal inti mengacu pada ketentuan yang mengatur mengenai kegiatan usaha dan jaringan kantor berdasarkan modal inti Bank.",
      revisions: [
        {
          title: "Revisi 1 (POJK 34/2016)",
          content: `(1) Bank yang tergolong sebagai Bank Umum Kegiatan Usaha (BUKU) 3 dan BUKU 4 wajib membentuk Capital Conservation Buffer sebagaimana dimaksud dalam Pasal 3 ayat (3) huruf a.`,
          date: "2016-09-01",
        },
        {
          title: "Ketentuan Asli (POJK 11/2016)",
          content: `(1) Bank yang tergolong sebagai Bank Umum Kegiatan Usaha (BUKU) 3 dan BUKU 4 wajib membentuk Capital Conservation Buffer sebagaimana dimaksud dalam Pasal 3 ayat (3) huruf a.`,
          date: "2016-02-26",
        },
      ],
    },
    {
      number: "4.2",
      content: `(2) Seluruh Bank wajib membentuk Countercyclical Buffer sebagaimana dimaksud dalam Pasal 3 ayat (3) huruf b.`,
      notes: "CCyB wajib untuk SEMUA bank tanpa kecuali.",
    },
    {
      number: "4.3",
      content: `(3) Bank yang ditetapkan sebagai Bank Sistemik wajib membentuk Capital Surcharge untuk Bank Sistemik sebagaimana dimaksud dalam Pasal 3 ayat (3) huruf c.`,
      notes:
        "Capital Surcharge hanya wajib bagi bank yang ditetapkan OJK sebagai Bank Sistemik.",
      revisions: [
        {
          title: "Ketentuan Asli (POJK 11/2016)",
          content: `(3) Bank yang ditetapkan berdampak sistemik wajib membentuk Capital Surcharge untuk D-SIB sebagaimana dimaksud dalam Pasal 3 ayat (3) huruf c.`,
          date: "2016-02-26",
        },
      ],
    },
  ]);

  // PASAL 5 - Penetapan Bank Sistemik (Changed in Revision 1)
  await seedPasal("Pasal 5 - Penetapan Bank Sistemik", [
    {
      number: "5.1",
      content: `(1) Otoritas Jasa Keuangan menetapkan Bank Sistemik sebagaimana dimaksud dalam Pasal 4 ayat (3).`,
      notes: "OJK yang menetapkan bank mana yang termasuk Bank Sistemik.",
      revisions: [
        {
          title: "Ketentuan Asli (POJK 11/2016)",
          content: `(1) Otoritas Jasa Keuangan menetapkan Bank yang berdampak sistemik sebagaimana dimaksud dalam Pasal 4 ayat (3).`,
          date: "2016-02-26",
        },
      ],
    },
    {
      number: "5.2",
      content: `(2) Otoritas Jasa Keuangan berkoordinasi dengan otoritas yang berwenang dalam menetapkan Bank Sistemik sebagaimana dimaksud pada ayat (1).`,
      notes:
        "OJK berkoordinasi dengan Bank Indonesia dalam menetapkan daftar Bank Sistemik.",
      footnote:
        "Yang dimaksud dengan 'otoritas yang berwenang' adalah Bank Indonesia.",
      revisions: [
        {
          title: "Ketentuan Asli (POJK 11/2016)",
          content: `(2) Otoritas Jasa Keuangan berkoordinasi dengan otoritas yang berwenang dalam menetapkan Bank yang berdampak sistemik sebagaimana dimaksud pada ayat (1).`,
          date: "2016-02-26",
        },
      ],
    },
  ]);

  // PASAL 6 - Pemberlakuan (Changed in Revision 1)
  await seedPasal("Pasal 6 - Pemberlakuan Tambahan Modal", [
    {
      number: "6.1",
      content: `(1) Bank wajib membentuk tambahan modal berupa Capital Conservation Buffer sebagaimana dimaksud dalam Pasal 3 ayat (3) huruf a secara bertahap mulai tanggal 1 Januari 2016.`,
      notes:
        "CCB berlaku bertahap sejak 1 Jan 2016 hingga full 2,5% pada 1 Jan 2019.",
    },
    {
      number: "6.2",
      content: `(2) Bank wajib memenuhi pembentukan Capital Conservation Buffer sebagaimana dimaksud pada ayat (1) secara bertahap:
a. sebesar 0,625% (nol koma enam ratus dua puluh lima persen) dari ATMR mulai tanggal 1 Januari 2016;
b. sebesar 1,25% (satu koma dua puluh lima persen) dari ATMR mulai tanggal 1 Januari 2017;
c. sebesar 1,875% (satu koma delapan ratus tujuh puluh lima persen) dari ATMR mulai tanggal 1 Januari 2018; dan
d. sebesar 2,5% (dua koma lima persen) dari ATMR mulai tanggal 1 Januari 2019.`,
      notes:
        "Tahapan CCB: 2016=0,625%, 2017=1,25%, 2018=1,875%, 2019=2,5% (full).",
    },
    {
      number: "6.3",
      content: `(3) Bank wajib membentuk tambahan modal berupa Countercyclical Buffer sebagaimana dimaksud dalam Pasal 3 ayat (3) huruf b mulai tanggal 1 Januari 2016.`,
      notes:
        "CCyB berlaku sejak 1 Jan 2016 (besaran ditetapkan BI, saat ini masih 0%).",
    },
    {
      number: "6.4",
      content: `(4) Bank wajib membentuk Capital Surcharge bagi Bank Sistemik sebagaimana dimaksud dalam Pasal 3 ayat (3) huruf c mulai tanggal 1 Januari 2016.`,
      notes: "Capital Surcharge berlaku sejak 1 Jan 2016 bagi Bank Sistemik.",
    },
    {
      number: "6.5",
      content: `(5) Metode perhitungan dan tata cara pembentukan Capital Surcharge untuk Bank Sistemik diatur dalam ketentuan Otoritas Jasa Keuangan.`,
      notes:
        "Metode dan tata cara Capital Surcharge diatur dalam POJK tersendiri.",
    },
    {
      number: "6.6",
      content: `(6) Otoritas Jasa Keuangan berkoordinasi dengan otoritas yang berwenang dalam menetapkan metode perhitungan dan tata cara pembentukan Capital Surcharge untuk Bank Sistemik sebagaimana dimaksud pada ayat (5).`,
      notes: "OJK berkoordinasi dengan BI untuk metode Capital Surcharge.",
      footnote:
        "Yang dimaksud dengan 'otoritas yang berwenang' adalah Bank Indonesia.",
    },
  ]);

  // PASAL 7 - Konsolidasi (No changes)
  await seedPasal("Pasal 7 - Kewajiban Konsolidasi", [
    {
      number: "7.1",
      content: `Dalam hal Bank memiliki dan/atau melakukan Pengendalian terhadap Perusahaan Anak, kewajiban penyediaan modal minimum sebagaimana dimaksud dalam Pasal 2 dan kewajiban pembentukan tambahan modal sebagai penyangga (buffer) sebagaimana dimaksud dalam Pasal 3 berlaku bagi Bank baik secara individu maupun secara konsolidasi dengan Perusahaan Anak.`,
      notes:
        "KPMM dan buffer berlaku secara INDIVIDU dan KONSOLIDASI dengan Perusahaan Anak.",
    },
  ]);

  // PASAL 8 - Distribusi Laba (No changes)
  await seedPasal("Pasal 8 - Pembatasan Distribusi Laba", [
    {
      number: "8.1",
      content: `(1) Bank dilarang melakukan distribusi laba jika distribusi laba dimaksud mengakibatkan kondisi permodalan Bank tidak memenuhi ketentuan sebagaimana dimaksud dalam Pasal 2 baik secara individu maupun secara konsolidasi dengan Perusahaan Anak.`,
      notes: "DILARANG distribusi laba jika menyebabkan KPMM di bawah minimum.",
      footnote:
        "Yang dimaksud dengan distribusi laba antara lain berupa pembayaran dividen dan pembayaran bonus kepada pengurus.",
    },
    {
      number: "8.2",
      content: `(2) Bank dikenakan pembatasan distribusi laba jika distribusi laba mengakibatkan kondisi permodalan Bank tidak memenuhi ketentuan sebagaimana dimaksud dalam Pasal 3 baik secara individu maupun secara konsolidasi dengan Perusahaan Anak.`,
      notes:
        "DIBATASI distribusi laba jika menyebabkan buffer tidak terpenuhi.",
    },
    {
      number: "8.3",
      content: `(3) Bank wajib melaksanakan pembatasan distribusi laba sebagaimana dimaksud pada ayat (2).`,
      notes:
        "Bank wajib mematuhi pembatasan distribusi laba yang ditetapkan OJK.",
    },
    {
      number: "8.4",
      content: `(4) Otoritas Jasa Keuangan menetapkan pembatasan distribusi laba sebagaimana dimaksud pada ayat (2).`,
      notes:
        "OJK yang menetapkan batasan distribusi laba bagi bank yang tidak memenuhi buffer.",
      footnote:
        "Penentuan batasan distribusi laba antara lain mempertimbangkan faktor-faktor berupa besarnya kekurangan pemenuhan tambahan modal, kondisi keuangan Bank, proyeksi kemampuan Bank untuk meningkatkan modal, dan tren ekspansi bisnis Bank.",
    },
  ]);

  console.log("\n✅ All Pasal 2-8 seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
