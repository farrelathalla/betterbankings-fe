/**
 * POJK 11/2016 BAB II - MODAL Part 2 (Pasal 14-26)
 *
 * Run after: seed-pojk11-v2-bab2.ts
 * Run with: npx tsx prisma/seed-pojk11-v2-bab2-part2.ts
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
  console.log("📝 Seeding BAB II - Pasal 14-26...\n");

  // Find BAB II from POJK11V2
  const chapter = await prisma.baselChapter.findFirst({
    where: {
      code: "02",
      standard: { code: "POJK11V2" },
    },
    include: { standard: true },
  });

  if (!chapter) {
    throw new Error("BAB II not found. Run seed-pojk11-v2-bab2.ts first.");
  }

  const chapterId = chapter.id;

  // Helper
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

  // === PASAL 14 - Cadangan Tambahan Modal (Disclosed Reserve) ===
  await createPasal(14, "Cadangan Tambahan Modal (Disclosed Reserve)", 6, [
    {
      number: "14",
      content: `(1) Cadangan tambahan modal (disclosed reserve) sebagaimana dimaksud dalam Pasal 11 ayat (1) huruf a angka 2 terdiri atas:
a. faktor penambah, yaitu:
1. Pendapatan komprehensif lainnya berupa:
a) selisih lebih penjabaran laporan keuangan;
b) potensi keuntungan yang berasal dari peningkatan nilai wajar aset keuangan yang dikategorikan sebagai kelompok tersedia untuk dijual yang dimaknai sebagai aset keuangan yang diukur pada nilai wajar melalui penghasilan komprehensif lain sesuai standar akuntansi keuangan mengenai instrumen keuangan; dan
c) saldo surplus revaluasi aset tetap;
2. cadangan tambahan modal lainnya (other disclosed reserves) berupa:
a) agio yang berasal dari penerbitan instrumen yang tergolong sebagai modal inti utama (Common Equity Tier 1);
b) cadangan umum;
c) laba tahun-tahun lalu;
d) laba tahun berjalan;
e) dana setoran modal, yang memenuhi persyaratan:
1) telah disetor penuh untuk tujuan penambahan modal namun belum didukung dengan kelengkapan persyaratan untuk dapat digolongkan sebagai modal disetor;
2) ditempatkan pada rekening khusus (escrow account) yang tidak diberikan imbal hasil;
3) tidak boleh ditarik kembali oleh pemegang saham atau calon pemegang saham dan tersedia untuk menyerap kerugian; dan
4) penggunaan dana harus dengan persetujuan Otoritas Jasa Keuangan; dan
f) lainnya berdasarkan persetujuan Otoritas Jasa Keuangan;
b. faktor pengurang, yaitu:
1. pendapatan komprehensif lainnya berupa:
a) selisih kurang penjabaran laporan keuangan; dan
b) potensi kerugian yang berasal dari penurunan nilai wajar aset keuangan yang dikategorikan sebagai kelompok tersedia untuk dijual yang dimaknai sebagai aset keuangan yang diukur pada nilai wajar melalui penghasilan komprehensif lain sesuai standar akuntansi keuangan mengenai instrumen keuangan;
2. cadangan tambahan modal lainnya (other disclosed reserves) berupa:
a) disagio yang berasal dari penerbitan instrumen yang tergolong sebagai modal inti utama (Common Equity Tier 1);
b) rugi tahun-tahun lalu;
c) rugi tahun berjalan;
d) selisih kurang antara PPA atas aset produktif dan Cadangan Kerugian Penurunan Nilai (CKPN) atas aset produktif;
e) selisih kurang antara jumlah penyesuaian terhadap hasil valuasi dari instrumen keuangan dalam Trading Book dan jumlah penyesuaian berdasarkan standar akuntansi keuangan;
f) PPA non-produktif; dan
g) lainnya berdasarkan persetujuan Otoritas Jasa Keuangan.
(2) Dalam perhitungan laba rugi tahun-tahun lalu dan/atau tahun berjalan sebagaimana dimaksud pada ayat (1) huruf a angka 2 huruf c) dan huruf d) harus dikeluarkan dari pengaruh faktor:
a. peningkatan atau penurunan nilai wajar atas kewajiban keuangan; dan/atau
b. keuntungan atas penjualan aset dalam transaksi sekuritisasi (gain on sale).`,
      notes:
        "Disclosed Reserve = OCI + Other Reserves. Faktor (+): agio, cadangan umum, laba, dana setoran modal. Faktor (-): disagio, rugi, selisih PPA-CKPN. Rev 2: menambah penyesuaian PSAK 71 untuk FVOCI.",
      revisions: [
        {
          title: "Revisi 1 (POJK 34/2016)",
          content: `Struktur diubah: OCI dan other disclosed reserves dipisahkan. Dihapus: modal sumbangan, waran 50%, opsi saham 50%, kerugian remeasurement pensiun. Ditambah: 'lainnya berdasarkan persetujuan OJK'.`,
          date: "2016-09-01",
        },
        {
          title: "Ketentuan Asli (POJK 11/2016)",
          content: `Struktur berbeda: 11 faktor penambah (agio, modal sumbangan, cadangan umum, laba tahun lalu, laba tahun berjalan, selisih lebih penjabaran, dana setoran modal, waran 50%, opsi saham 50%, OCI gain AFS, surplus revaluasi). 8 faktor pengurang (disagio, rugi tahun lalu, rugi tahun berjalan, selisih kurang penjabaran, OCI loss AFS, remeasurement pensiun, selisih PPA-CKPN, Trading Book adj, PPA non-produktif).`,
          date: "2016-02-26",
        },
      ],
    },
  ]);

  // === PASAL 15 - Modal Inti Tambahan (AT1) ===
  await createPasal(15, "Instrumen Modal Inti Tambahan (AT1)", 7, [
    {
      number: "15",
      content: `(1) Instrumen modal inti tambahan sebagaimana dimaksud dalam Pasal 11 ayat (1) huruf b wajib memenuhi persyaratan:
a. diterbitkan dan telah dibayar penuh;
b. tidak memiliki jangka waktu dan tidak terdapat persyaratan yang mewajibkan pelunasan oleh Bank di masa mendatang;
c. pembelian kembali atau pembayaran pokok instrumen harus mendapat persetujuan pengawas;
d. tidak memiliki fitur step-up;
e. memiliki fitur untuk dikonversi menjadi saham biasa atau dilakukan write down dalam hal Bank berpotensi terganggu kelangsungan usahanya (point of non-viability) yang dinyatakan secara jelas dalam dokumentasi penerbitan atau perjanjian;
f. bersifat subordinasi pada saat likuidasi, yang secara jelas dinyatakan dalam dokumentasi penerbitan atau perjanjian;
g. perolehan imbal hasil tidak dapat dipastikan baik jumlah maupun waktu dan tidak dapat diakumulasikan antar periode serta bank memiliki kewenangan penuh (full access) untuk membatalkan pembayaran imbal hasil pada saat timbul kewajiban pembayaran imbal hasil;
h. tidak diproteksi maupun dijamin oleh Bank atau Perusahaan Anak;
i. tidak terdapat kesepakatan yang dapat meningkatkan senioritas instrumen secara legal atau ekonomi;
j. tidak memiliki fitur pembayaran dividen atau imbal hasil yang sensitif terhadap Risiko Kredit;
k. dalam hal disertai dengan fitur opsi beli (call option), harus memenuhi persyaratan:
1. hanya dapat dieksekusi paling cepat 5 (lima) tahun setelah instrumen modal diterbitkan;
2. dokumentasi penerbitan harus menyatakan bahwa opsi hanya dapat dieksekusi atas persetujuan Otoritas Jasa Keuangan; dan
3. Bank tidak memberikan ekspektasi akan membeli kembali, atau melakukan aktivitas lain yang dapat memberikan ekspektasi tersebut;
l. tidak dapat dibeli oleh Bank penerbit dan/atau Perusahaan Anak;
m. sumber pendanaan tidak berasal dari Bank penerbit baik secara langsung maupun tidak langsung;
n. tidak memiliki fitur yang menghambat proses penambahan modal pada masa mendatang;
o. dalam kondisi tertentu apabila dibutuhkan tambahan modal melalui penerbitan instrumen oleh entitas lain yang berada diluar cakupan konsolidasi maka dana hasil penerbitan harus segera diserahkan kepada Bank; dan
p. telah memperoleh persetujuan Otoritas Jasa Keuangan untuk diperhitungkan sebagai komponen modal.
(2) Bank hanya dapat melakukan eksekusi opsi beli (call option) sebagaimana dimaksud pada ayat (1) huruf k sepanjang:
a. telah memperoleh persetujuan Otoritas Jasa Keuangan;
b. kondisi rentabilitas Bank dalam keadaan yang baik;
c. setelah eksekusi opsi beli (call option), permodalan Bank tetap berada di atas persyaratan minimum sebagaimana dimaksud dalam Pasal 2, Pasal 3, dan Pasal 7; dan
d. digantikan dengan instrumen modal yang mempunyai kualitas sama atau lebih baik.`,
      notes:
        "AT1: 16 kriteria. Perpetual, PONV trigger, subordinasi, non-cumulative, full discretion, no step-up, no credit-sensitive. Call option min 5 tahun + persetujuan OJK + no expectation.",
      footnote: `Yang dimaksud dengan "fitur step-up" adalah fitur yang menjanjikan kenaikan tingkat suku bunga atau imbal hasil apabila opsi beli tidak dieksekusi pada jangka waktu yang telah ditetapkan.`,
      revisions: [
        {
          title: "Ketentuan Asli (POJK 11/2016)",
          content: `14 kriteria. Revisi 1 menambah:
- huruf g: "serta bank memiliki kewenangan penuh (full access) untuk membatalkan pembayaran imbal hasil"
- huruf i: "tidak terdapat kesepakatan yang dapat meningkatkan senioritas"
- huruf k.3: "Bank tidak memberikan ekspektasi akan membeli kembali"
- huruf o: "penerbitan instrumen oleh entitas diluar konsolidasi"
- Ayat (2) huruf b: "kondisi rentabilitas Bank dalam keadaan yang baik"`,
          date: "2016-02-26",
        },
      ],
    },
  ]);

  // === PASAL 16 - Kepentingan Non-Pengendali ===
  await createPasal(16, "Kepentingan Non-Pengendali (NCI)", 8, [
    {
      number: "16",
      content: `(1) Dalam perhitungan rasio KPMM secara konsolidasi, kepentingan non-pengendali (non-controlling interest) wajib diperhitungkan sebagai modal inti utama kecuali terdapat bagian dari kepentingan non-pengendali yang tidak sesuai dengan persyaratan komponen modal inti utama.
(2) Kepentingan non-pengendali sebagaimana dimaksud pada ayat (1) dapat diperhitungkan dalam modal inti utama secara konsolidasi apabila kepemilikan Bank pada Perusahaan Anak lebih dari 50% (lima puluh persen) dan memenuhi persyaratan:
a. Perusahaan Anak berupa Bank;
b. terdapat keterkaitan atau afiliasi antara pemegang saham non-pengendali pada Perusahaan Anak dengan Bank; dan
c. terdapat komitmen dari pemegang saham non-pengendali pada Perusahaan Anak untuk mendukung modal kelompok usaha Bank yang dinyatakan dalam surat pernyataan atau keputusan rapat umum pemegang saham Perusahaan Anak.`,
      notes:
        "NCI dapat masuk CET1 konsolidasi jika: kepemilikan >50%, anak adalah bank, ada afiliasi, ada komitmen dukungan modal dari pemegang saham NCI.",
      footnote: `Yang dimaksud dengan "kepentingan non-pengendali" adalah kepentingan bukan pengendali sebagaimana dimaksud dalam standar akuntansi keuangan.`,
    },
  ]);

  // === PASAL 17 - Faktor Pengurang CET1 ===
  await createPasal(17, "Faktor Pengurang Modal Inti Utama", 9, [
    {
      number: "17",
      content: `(1) Modal inti utama sebagaimana dimaksud dalam Pasal 9 ayat (1) huruf a angka 1 diperhitungkan dengan faktor pengurang berupa:
a. pajak tangguhan (deferred tax);
b. goodwill;
c. seluruh aset tidak berwujud lainnya;
d. seluruh penyertaan Bank yang meliputi:
1. penyertaan Bank kepada Perusahaan Anak kecuali penyertaan modal sementara Bank kepada Perusahaan Anak dalam rangka restrukturisasi kredit;
2. penyertaan kepada perusahaan atau badan hukum dengan kepemilikan Bank lebih dari 20% (dua puluh persen) sampai dengan 50% (lima puluh persen) namun Bank tidak memiliki Pengendalian; dan
3. penyertaan kepada perusahaan asuransi;
e. kekurangan modal (shortfall) dari pemenuhan tingkat rasio solvabilitas minimum (Risk Based Capital atau RBC minimum) pada perusahaan asuransi yang dimiliki dan dikendalikan oleh Bank;
f. eksposur sekuritisasi; dan
g. faktor pengurang modal inti utama lainnya sebagaimana dimaksud dalam Pasal 22.
(2) Faktor pengurang modal sebagaimana dimaksud pada ayat (1) huruf a, huruf b, huruf c, huruf d, huruf e, dan huruf g tidak diperhitungkan dalam ATMR untuk Risiko Kredit.`,
      notes:
        "Pengurang CET1: DTA, goodwill, intangible, penyertaan (anak, 20-50%, asuransi), shortfall RBC asuransi, sekuritisasi, lainnya (Ps 22). Rev 1: ayat (2) diperluas.",
      footnote: `Pajak tangguhan dikurangkan sebesar 100% baik atas perhitungan pajak tangguhan pada tahun-tahun lalu maupun pada tahun berjalan. Goodwill mengacu pada PSAK kombinasi bisnis. Aset tidak berwujud termasuk copyright, hak paten, dan software.`,
      revisions: [
        {
          title: "Ketentuan Asli (POJK 11/2016)",
          content: `Ayat (2): "Faktor pengurang modal sebagaimana dimaksud pada ayat (1) huruf d dan huruf e tidak diperhitungkan lagi dalam ATMR untuk Risiko Kredit."
Revisi 1: diperluas menjadi huruf a, b, c, d, e, dan g.`,
          date: "2016-02-26",
        },
      ],
    },
  ]);

  // === PASAL 18 - Batasan Modal Pelengkap ===
  await createPasal(18, "Batasan Modal Pelengkap", 10, [
    {
      number: "18",
      content: `Modal pelengkap sebagaimana dimaksud dalam Pasal 9 ayat (1) huruf b hanya dapat diperhitungkan paling tinggi sebesar 100% (seratus persen) dari modal inti sebagaimana dimaksud dalam Pasal 9 ayat (1) huruf a.`,
      notes:
        "Tier 2 maksimal 100% dari Tier 1. Total Capital = Tier 1 + min(Tier 2, Tier 1).",
    },
  ]);

  // === PASAL 19 - Instrumen Modal Pelengkap (Tier 2) ===
  await createPasal(19, "Instrumen Modal Pelengkap (Tier 2)", 11, [
    {
      number: "19",
      content: `(1) Instrumen modal pelengkap sebagaimana dimaksud dalam Pasal 9 ayat (1) huruf b wajib memenuhi persyaratan:
a. diterbitkan dan telah dibayar penuh;
b. memiliki jangka waktu 5 (lima) tahun atau lebih dan hanya dapat dilunasi setelah memperoleh persetujuan Otoritas Jasa Keuangan;
c. memiliki fitur untuk dikonversi menjadi saham biasa atau dilakukan write down dalam hal Bank berpotensi terganggu kelangsungan usahanya (point of non-viability), yang dinyatakan secara jelas dalam dokumentasi penerbitan atau perjanjian;
d. bersifat subordinasi yang dinyatakan dalam dokumentasi penerbitan atau perjanjian;
e. pembayaran pokok dan/atau imbal hasil ditangguhkan dan diakumulasikan antar periode (cummulative) apabila pembayaran dapat menyebabkan rasio KPMM secara individu atau secara konsolidasi tidak memenuhi ketentuan sebagaimana dimaksud dalam Pasal 2, Pasal 3, dan Pasal 7;
f. tidak diproteksi maupun dijamin oleh Bank atau Perusahaan Anak;
g. tidak memiliki fitur pembayaran dividen atau imbal hasil yang sensitif terhadap Risiko Kredit;
h. tidak memiliki fitur step-up;
i. apabila disertai dengan fitur opsi beli (call option), harus memenuhi persyaratan:
1. hanya dapat dieksekusi paling cepat 5 (lima) tahun setelah instrumen modal diterbitkan;
2. dokumentasi penerbitan harus menyatakan bahwa opsi hanya dapat dieksekusi atas persetujuan Otoritas Jasa Keuangan; dan
3. Bank tidak memberikan ekspektasi akan membeli kembali atau melakukan aktivitas lain yang dapat memberikan ekspektasi akan membeli kembali;
j. tidak memiliki persyaratan percepatan pembayaran bunga atau pokok yang dinyatakan dalam dokumentasi penerbitan atau perjanjian;
k. tidak dapat dibeli oleh Bank penerbit dan/atau Perusahaan Anak;
l. sumber pendanaan tidak berasal dari Bank penerbit baik secara langsung maupun tidak langsung;
m. dalam kondisi tertentu apabila dibutuhkan tambahan modal melalui penerbitan instrumen oleh entitas lain yang berada diluar cakupan konsolidasi maka dana hasil penerbitan harus segera diserahkan kepada Bank; dan
n. telah memperoleh persetujuan Otoritas Jasa Keuangan untuk diperhitungkan sebagai komponen modal.
(2) Bank hanya dapat melakukan eksekusi opsi beli (call option) sebagaimana dimaksud pada ayat (1) huruf i sepanjang:
a. telah memperoleh persetujuan Otoritas Jasa Keuangan;
b. kondisi rentabilitas Bank dalam keadaan yang baik; dan
c. setelah eksekusi opsi beli (call option), permodalan Bank tetap berada di atas persyaratan minimum sebagaimana dimaksud dalam Pasal 2, Pasal 3, dan Pasal 7 atau digantikan dengan instrumen modal yang mempunyai:
1. kualitas sama atau lebih baik; dan
2. dalam jumlah yang sama atau jumlah yang berbeda sepanjang tidak melebihi batasan modal pelengkap sebagaimana dimaksud dalam Pasal 18.
(3) Jumlah yang dapat diperhitungkan sebagai modal pelengkap adalah jumlah modal pelengkap dikurangi amortisasi yang dihitung dengan menggunakan metode garis lurus.
(4) Amortisasi sebagaimana dimaksud pada ayat (3) dilakukan untuk sisa jangka waktu instrumen 5 (lima) tahun terakhir.
(5) Dalam hal terdapat opsi beli (call option), jangka waktu sampai Bank dapat mengeksekusi opsi beli (call option) merupakan sisa jangka waktu instrumen.`,
      notes:
        "Tier 2: 14 kriteria. Min 5 tahun, PONV trigger, subordinasi, cumulative, no step-up. Diamortisasi 20%/tahun dalam 5 tahun terakhir. Rev 1: tambah huruf i.3, m, ayat (2) huruf b.",
      revisions: [
        {
          title: "Ketentuan Asli (POJK 11/2016)",
          content: `13 kriteria. Revisi 1 menambah:
- huruf i.3: "Bank tidak memberikan ekspektasi akan membeli kembali"
- huruf m: "penerbitan instrumen oleh entitas diluar konsolidasi"
- Ayat (2) huruf b: "kondisi rentabilitas Bank dalam keadaan yang baik"`,
          date: "2016-02-26",
        },
      ],
    },
  ]);

  // === PASAL 20 - Komponen Modal Pelengkap ===
  await createPasal(20, "Komponen Modal Pelengkap", 12, [
    {
      number: "20",
      content: `(1) Modal pelengkap meliputi:
a. instrumen modal dalam bentuk saham atau dalam bentuk lainnya yang memenuhi persyaratan sebagaimana dimaksud dalam Pasal 19;
b. agio atau disagio yang berasal dari penerbitan instrumen modal yang tergolong sebagai modal pelengkap; dan
c. cadangan umum PPA atas aset produktif yang wajib dihitung dengan jumlah paling tinggi sebesar 1,25% (satu koma dua puluh lima persen) dari ATMR untuk Risiko Kredit.
(2) Selisih lebih cadangan umum yang wajib dihitung dari batasan sebagaimana dimaksud pada ayat (1) huruf c dapat diperhitungkan sebagai faktor pengurang perhitungan ATMR untuk Risiko Kredit.`,
      notes:
        "Komponen Tier 2: instrumen modal, agio/disagio, PPA umum (max 1,25% ATMR Kredit). Excess PPA mengurangi ATMR. Rev 1: menghapus huruf d 'cadangan tujuan'.",
      footnote: `Contoh instrumen modal Tier 2: cumulative preference share, cumulative subordinated debt, mandatory convertible bond.`,
      revisions: [
        {
          title: "Ketentuan Asli (POJK 11/2016)",
          content: `Ayat (1) huruf d: "cadangan tujuan" - DIHAPUS oleh Revisi 1.`,
          date: "2016-02-26",
        },
      ],
    },
  ]);

  // === PASAL 21 - Sinking Fund ===
  await createPasal(21, "Sinking Fund Modal Pelengkap", 13, [
    {
      number: "21",
      content: `Bagian dari modal pelengkap yang telah dibentuk cadangan pelunasan (sinking fund) tidak diperhitungkan sebagai komponen modal pelengkap, dalam hal Bank:
a. telah menetapkan untuk menyisihkan dan mengelola dana cadangan pelunasan (sinking fund) secara khusus; dan
b. telah mempublikasikan pembentukan cadangan pelunasan (sinking fund), termasuk dalam Rapat Umum Pemegang Obligasi (RUPO).`,
      notes:
        "Tier 2 yang sudah ada sinking fund tidak dihitung sebagai modal. Sinking fund harus dikelola khusus dan dipublikasikan di RUPO.",
    },
  ]);

  // === PASAL 22 - Faktor Pengurang Modal Lainnya ===
  await createPasal(22, "Faktor Pengurang Modal Lainnya", 14, [
    {
      number: "22",
      content: `(1) Faktor-faktor yang menjadi pengurang modal sebagaimana dimaksud dalam Pasal 9 ayat (2) dan Pasal 10 ayat (2) mencakup:
a. pembelian kembali instrumen modal yang telah diakui sebagai komponen permodalan Bank;
b. penempatan dana pada instrumen utang Bank lain yang diakui sebagai komponen modal oleh Bank lain (Bank penerbit); dan
c. kepemilikan silang yang diperoleh berdasarkan peralihan karena hukum, hibah, atau hibah wasiat sebagaimana dimaksud dalam Undang-Undang mengenai Perseroan Terbatas sepanjang belum dialihkan kepada pihak lain.
(2) Seluruh faktor pengurang modal sebagaimana dimaksud pada ayat (1) huruf b dan huruf c tidak diperhitungkan lagi dalam ATMR untuk Risiko Kredit.`,
      notes:
        "Pengurang modal: treasury stock, penempatan di instrumen modal bank lain, kepemilikan silang. Rev 1: menambah huruf c (kepemilikan silang).",
      revisions: [
        {
          title: "Ketentuan Asli (POJK 11/2016)",
          content: `Ayat (1): Hanya huruf a dan b. Revisi 1 menambah huruf c: "kepemilikan silang yang diperoleh berdasarkan peralihan karena hukum, hibah, atau hibah wasiat".
Ayat (2): "huruf b" saja. Revisi 1 mengubah menjadi "huruf b dan huruf c".`,
          date: "2016-02-26",
        },
      ],
    },
  ]);

  // === PASAL 23 - Data Pendukung Konsolidasi ===
  await createPasal(23, "Data Pendukung Perhitungan Konsolidasi", 15, [
    {
      number: "23",
      content: `Dalam perhitungan KPMM secara konsolidasi sebagaimana dimaksud dalam Pasal 9 ayat (3), Bank wajib menyampaikan data pendukung untuk komponen modal inti tambahan dan modal pelengkap, yang menunjukkan bahwa komponen modal Perusahaan Anak yang diperhitungkan telah memenuhi seluruh persyaratan sebagai komponen modal.`,
      notes:
        "Bank wajib menyampaikan data pendukung untuk modal AT1 dan Tier 2 Perusahaan Anak yang dikonsolidasi.",
    },
  ]);

  // === PASAL 24 - CEMA Minimum ===
  await createPasal(24, "CEMA Minimum", 16, [
    {
      number: "24",
      content: `(1) Kantor cabang dari bank yang berkedudukan di luar negeri wajib memenuhi CEMA minimum.
(2) CEMA minimum sebagaimana dimaksud pada ayat (1) ditetapkan sebesar 8% (delapan persen) dari total kewajiban kantor cabang dari bank yang berkedudukan di luar negeri pada setiap bulan dan paling sedikit sebesar Rp1.000.000.000.000,00 (satu triliun rupiah).
(3) Pemenuhan CEMA minimum sebagaimana dimaksud pada ayat (2) dilakukan dengan tahapan:
a. sampai dengan posisi bulan November 2017, CEMA minimum ditetapkan sebesar 8% (delapan persen) dari total kewajiban kantor cabang dari bank yang berkedudukan di luar negeri pada setiap bulan;
b. mulai posisi bulan Desember 2017, CEMA minimum ditetapkan 8% (delapan persen) dari total kewajiban kantor cabang dari bank yang berkedudukan di luar negeri pada setiap bulan dan paling sedikit sebesar Rp1.000.000.000.000,00 (satu triliun rupiah).`,
      notes:
        "CEMA minimum: 8% total kewajiban, minimal Rp 1 triliun. Berlaku penuh sejak Des 2017.",
      footnote: `Total kewajiban bank adalah total kewajiban dikurangi seluruh kewajiban antar kantor (kantor pusat dan kantor cabang lainnya di luar negeri). Dihitung berdasarkan rata-rata kewajiban bank secara mingguan.`,
    },
  ]);

  // === PASAL 25 - Pemenuhan CEMA ===
  await createPasal(25, "Pemenuhan CEMA", 17, [
    {
      number: "25",
      content: `(1) CEMA minimum sebagaimana dimaksud dalam Pasal 24 ayat (2) wajib dipenuhi dari dana usaha sebagaimana dimaksud dalam Pasal 10 ayat (1) huruf a.
(2) Dana usaha yang dimiliki kantor cabang dari bank yang berkedudukan di luar negeri harus memenuhi KPMM sesuai profil risiko dan CEMA minimum.
(3) CEMA minimum sebagaimana dimaksud dalam Pasal 24 ayat (2) dihitung setiap bulan.
(4) CEMA minimum sebagaimana dimaksud dalam Pasal 24 ayat (2) wajib dipenuhi dan ditempatkan paling lambat tanggal 6 bulan berikutnya.`,
      notes:
        "CEMA dari dana usaha, dihitung bulanan, dipenuhi paling lambat tanggal 6 bulan berikutnya.",
    },
  ]);

  // === PASAL 26 - Aset Keuangan CEMA ===
  await createPasal(26, "Aset Keuangan CEMA", 18, [
    {
      number: "26",
      content: `(1) Kantor cabang dari bank yang berkedudukan di luar negeri wajib menetapkan aset keuangan yang digunakan untuk memenuhi CEMA minimum.
(2) Aset keuangan yang telah ditetapkan untuk memenuhi CEMA minimum dilarang dipertukarkan dan diubah dalam periode pemenuhan CEMA minimum.
(3) Aset keuangan sebagaimana dimaksud pada ayat (1) yang memenuhi syarat dan dapat diperhitungkan sebagai CEMA adalah:
a. surat berharga yang diterbitkan oleh Pemerintah Republik Indonesia dan dimaksudkan untuk dimiliki hingga jatuh tempo;
b. surat berharga yang diterbitkan oleh Bank lain yang berbadan hukum Indonesia dan memenuhi kriteria:
1. tidak bersifat ekuitas;
2. memiliki peringkat investasi; dan
3. tidak dimaksudkan untuk tujuan diperdagangkan (trading); dan/atau
c. surat berharga yang diterbitkan oleh korporasi berbadan hukum Indonesia dan memenuhi kriteria:
1. tidak bersifat ekuitas;
2. memiliki peringkat surat berharga paling kurang A+ atau yang setara;
3. tidak dimaksudkan untuk tujuan diperdagangkan (trading); dan
4. porsi surat berharga korporasi paling banyak sebesar 20% (dua puluh persen) dari total CEMA minimum.
(4) Aset keuangan yang digunakan sebagai CEMA harus bebas dari klaim pihak manapun.
(5) Perhitungan aset keuangan yang digunakan untuk memenuhi CEMA minimum:
a. untuk aset keuangan yang telah dimiliki oleh Bank, dihitung berdasarkan nilai tercatat aset keuangan pada posisi akhir bulan laporan;
b. untuk aset keuangan yang dibeli setelah posisi akhir bulan laporan, dihitung berdasarkan nilai tercatat aset keuangan pada posisi pembelian aset keuangan.`,
      notes:
        "Aset CEMA: (a) SBN HTM, (b) surat berharga bank lain (investment grade, non-trading), (c) korporasi (min A+, max 20%). Aset harus bebas klaim, tidak boleh dipertukarkan.",
      footnote: `Contoh SBN: SUN dan SBSN. Surat berharga dapat dikategorikan HTM atau AFS yang didukung komitmen untuk dimiliki hingga jatuh tempo. Bebas dari klaim artinya tidak sedang dijaminkan, disita, atau di-repo-kan.`,
    },
  ]);

  console.log("\n✅ BAB II Complete! (18 Pasal: 9-26)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
