/**
 * POJK 11/2016 BAB I Content - Pasal 1 (Definisi)
 * Current version: Revision 1 (POJK 34/2016) - 17 definitions
 *
 * Run after: seed-pojk11-v2.ts
 * Run with: npx tsx prisma/seed-pojk11-v2-pasal1.ts
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
  console.log("📝 Seeding Pasal 1 - Definisi...\n");

  // Find the section
  const section = await prisma.baselSection.findFirst({
    where: { title: "Pasal 1 - Definisi" },
    include: { chapter: { include: { standard: true } } },
  });

  if (!section) {
    throw new Error(
      "Section 'Pasal 1 - Definisi' not found. Run seed-pojk11-v2.ts first.",
    );
  }

  // Delete existing subsections
  await prisma.baselSubsection.deleteMany({ where: { sectionId: section.id } });

  // Create all 17 definitions (Current = Revision 1)
  const definitions = [
    {
      number: "1",
      content: `Dalam Peraturan Otoritas Jasa Keuangan ini yang dimaksud dengan:
1. Bank adalah bank umum sebagaimana dimaksud dalam Undang-Undang Nomor 7 Tahun 1992 tentang Perbankan sebagaimana telah diubah dengan Undang-Undang Nomor 10 Tahun 1998, termasuk kantor cabang dari bank yang berkedudukan di luar negeri, yang melakukan kegiatan usaha secara konvensional.`,
      notes:
        "Definisi Bank mencakup bank umum konvensional termasuk kantor cabang bank asing di Indonesia.",
      hasRevision: false,
    },
    {
      number: "2",
      content: `2. Bank Sistemik adalah bank sebagaimana dimaksud dalam Undang-Undang Nomor 9 Tahun 2016 tentang Pencegahan dan Penanganan Krisis Sistem Keuangan.`,
      notes:
        "Definisi Bank Sistemik ditambahkan melalui POJK 34/2016 mengacu pada UU PPKSK.",
      hasRevision: true,
      originalContent: null, // Not in original - this is NEW in Revision 1
    },
    {
      number: "3",
      content: `3. Direksi:
a. bagi Bank berbentuk badan hukum Perseroan Terbatas adalah direksi sebagaimana dimaksud dalam Undang-Undang Nomor 40 Tahun 2007 tentang Perseroan Terbatas;
b. bagi Bank berbentuk badan hukum:
1) Perusahaan Umum Daerah atau Perusahaan Perseroan Daerah adalah direksi sebagaimana dimaksud dalam Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah sebagaimana telah diubah terakhir dengan Undang-Undang Nomor 9 Tahun 2015;
2) Perusahaan Daerah adalah direksi pada Bank yang belum berubah bentuk menjadi Perusahaan Umum Daerah atau Perusahaan Perseroan Daerah sebagaimana dimaksud dalam Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah sebagaimana telah diubah terakhir dengan Undang-Undang Nomor 9 Tahun 2015;
c. bagi Bank berbentuk badan hukum Koperasi adalah pengurus sebagaimana dimaksud dalam Undang-Undang Nomor 25 Tahun 1992 tentang Perkoperasian;
d. bagi Bank yang berstatus sebagai kantor cabang dari bank yang berkedudukan di luar negeri adalah pemimpin kantor cabang dan pejabat satu tingkat di bawah pemimpin kantor cabang.`,
      notes:
        "Definisi Direksi berbeda tergantung bentuk badan hukum Bank: PT, BUMD, Koperasi, atau Kantor Cabang Bank Asing.",
      hasRevision: false,
    },
    {
      number: "4",
      content: `4. Dewan Komisaris:
a. bagi Bank berbentuk badan hukum Perseroan Terbatas adalah dewan komisaris sebagaimana dimaksud dalam Undang-Undang Nomor 40 Tahun 2007 tentang Perseroan Terbatas;
b. bagi Bank berbentuk badan hukum:
1) Perusahaan Umum Daerah adalah dewan pengawas sebagaimana dimaksud dalam Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah sebagaimana telah diubah terakhir dengan Undang-Undang Nomor 9 Tahun 2015;
2) Perusahaan Perseroan Daerah adalah komisaris sebagaimana dimaksud dalam Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah sebagaimana telah diubah terakhir dengan Undang-Undang Nomor 9 Tahun 2015;
3) Perusahaan Daerah adalah pengawas pada Bank yang belum berubah bentuk menjadi Perusahaan Umum Daerah atau Perusahaan Perseroan Daerah sebagaimana dimaksud dalam Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah sebagaimana telah diubah terakhir dengan Undang-Undang Nomor 9 Tahun 2015;
c. bagi Bank berbentuk badan hukum Koperasi adalah pengawas sebagaimana dimaksud dalam Undang-Undang Nomor 25 Tahun 1992 tentang Perkoperasian;
d. bagi Bank yang berstatus sebagai kantor cabang dari bank yang berkedudukan di luar negeri adalah pihak yang ditunjuk untuk melaksanakan fungsi pengawasan.`,
      notes:
        "Definisi Dewan Komisaris/Pengawas berbeda tergantung bentuk badan hukum Bank.",
      hasRevision: false,
    },
    {
      number: "5",
      content: `5. Perusahaan Anak adalah badan hukum atau perusahaan yang dimiliki dan/atau dikendalikan oleh Bank secara langsung maupun tidak langsung, baik di dalam maupun di luar negeri, yang melakukan kegiatan usaha di bidang keuangan, yang terdiri atas:
a. perusahaan subsidiari (subsidiary company) yaitu Perusahaan Anak dengan kepemilikan Bank lebih dari 50% (lima puluh persen);
b. perusahaan partisipasi (participation company) adalah Perusahaan Anak dengan kepemilikan Bank sebesar 50% (lima puluh persen) atau kurang, namun Bank memiliki pengendalian terhadap perusahaan;
c. perusahaan dengan kepemilikan Bank lebih dari 20% (dua puluh persen) sampai dengan 50% (lima puluh persen) yang memenuhi persyaratan:
1) kepemilikan Bank dan para pihak lainnya pada Perusahaan Anak masing-masing sama besar; dan
2) masing-masing pemilik melakukan pengendalian secara bersama terhadap Perusahaan Anak;
d. entitas lain yang berdasarkan standar akuntansi keuangan harus dikonsolidasikan, namun tidak termasuk perusahaan asuransi dan perusahaan yang dimiliki dalam rangka restrukturisasi kredit.`,
      notes:
        "Perusahaan Anak meliputi subsidiary (>50%), partisipasi (≤50% dengan pengendalian), joint control, dan entitas konsolidasi. Pengecualian: asuransi dan restrukturisasi kredit.",
      hasRevision: false,
    },
    {
      number: "6",
      content: `6. Pengendalian adalah pengendalian sebagaimana dimaksud dalam Peraturan Otoritas Jasa Keuangan mengenai Penerapan Manajemen Risiko Terintegrasi bagi Konglomerasi Keuangan.`,
      notes:
        "Definisi Pengendalian mengacu pada POJK tentang Manajemen Risiko Terintegrasi Konglomerasi Keuangan.",
      hasRevision: false,
    },
    {
      number: "7",
      content: `7. Capital Equivalency Maintained Assets yang selanjutnya disingkat CEMA adalah alokasi dana usaha kantor cabang dari bank yang berkedudukan di luar negeri yang wajib ditempatkan pada aset keuangan dalam jumlah dan persyaratan tertentu.`,
      notes:
        "CEMA adalah pengganti modal bagi kantor cabang bank asing di Indonesia.",
      hasRevision: false,
    },
    {
      number: "8",
      content: `8. Internal Capital Adequacy Assessment Process yang selanjutnya disingkat ICAAP adalah proses yang dilakukan Bank untuk menetapkan kecukupan modal sesuai profil risiko Bank dan penetapan strategi untuk memelihara tingkat permodalan.`,
      notes:
        "ICAAP adalah penilaian internal bank atas kecukupan modal (Pilar 2 Basel).",
      hasRevision: false,
    },
    {
      number: "9",
      content: `9. Supervisory Review and Evaluation Process yang selanjutnya disingkat SREP adalah proses kaji ulang yang dilakukan oleh Otoritas Jasa Keuangan atas hasil ICAAP Bank.`,
      notes: "SREP adalah review OJK atas hasil ICAAP bank (Pilar 2 Basel).",
      hasRevision: false,
    },
    {
      number: "10",
      content: `10. Capital Conservation Buffer adalah tambahan modal yang berfungsi sebagai penyangga (buffer) apabila terjadi kerugian pada periode krisis.`,
      notes:
        "CCB ditetapkan 2,5% dari ATMR untuk menyerap kerugian saat krisis.",
      hasRevision: false,
    },
    {
      number: "11",
      content: `11. Countercyclical Buffer adalah tambahan modal yang berfungsi sebagai penyangga (buffer) untuk mengantisipasi kerugian apabila terjadi pertumbuhan kredit perbankan yang berlebihan sehingga berpotensi mengganggu stabilitas sistem keuangan.`,
      notes:
        "CCyB ditetapkan 0-2,5% dari ATMR berdasarkan kondisi siklus kredit.",
      hasRevision: false,
    },
    {
      number: "12",
      content: `12. Capital Surcharge untuk Bank Sistemik adalah tambahan modal yang berfungsi untuk mengurangi dampak negatif terhadap stabilitas sistem keuangan dan perekonomian apabila terjadi kegagalan Bank Sistemik melalui peningkatan kemampuan Bank dalam menyerap kerugian.`,
      notes:
        "Capital Surcharge untuk D-SIB ditetapkan 1-2,5% dari ATMR. Terminologi diubah dari 'D-SIB' menjadi 'Bank Sistemik' melalui POJK 34/2016.",
      hasRevision: true,
      originalContent: `11. Capital Surcharge untuk Domestic Systemically Important Bank, yang selanjutnya disebut Capital Surcharge untuk D-SIB, adalah tambahan modal yang berfungsi untuk mengurangi dampak negatif terhadap stabilitas sistem keuangan dan perekonomian apabila terjadi kegagalan Bank yang berdampak sistemik melalui peningkatan kemampuan Bank dalam menyerap kerugian.`,
    },
    {
      number: "13",
      content: `13. Risiko Kredit adalah risiko akibat kegagalan debitur dan/atau pihak lain dalam memenuhi kewajiban kepada Bank.`,
      notes: "Credit Risk - risiko default dari debitur atau counterparty.",
      hasRevision: false,
    },
    {
      number: "14",
      content: `14. Risiko Pasar adalah risiko pada posisi neraca dan rekening administratif termasuk transaksi derivatif, akibat perubahan secara keseluruhan dari kondisi pasar, termasuk risiko perubahan harga option.`,
      notes:
        "Market Risk - risiko dari perubahan nilai pasar atas posisi on/off balance sheet.",
      hasRevision: false,
    },
    {
      number: "15",
      content: `15. Risiko Operasional adalah risiko akibat ketidakcukupan dan/atau tidak berfungsinya proses internal, kesalahan manusia, kegagalan sistem, dan/atau adanya kejadian-kejadian eksternal yang mempengaruhi operasional Bank.`,
      notes:
        "Operational Risk - risiko dari proses internal, SDM, sistem, atau kejadian eksternal.",
      hasRevision: false,
    },
    {
      number: "16",
      content: `16. Trading Book adalah seluruh posisi instrumen keuangan dalam neraca dan rekening administratif termasuk transaksi derivatif yang dimiliki Bank dengan tujuan untuk:
a. diperdagangkan dan dapat dipindahtangankan dengan bebas atau dapat dilindung nilai secara keseluruhan, baik dari transaksi untuk kepentingan sendiri (proprietary positions), atas permintaan nasabah maupun kegiatan perantaraan (brokering), dan dalam rangka pembentukan pasar (market making), yang meliputi:
1) posisi yang dimiliki untuk dijual kembali dalam jangka pendek;
2) posisi yang dimiliki untuk tujuan memperoleh keuntungan jangka pendek secara aktual dan/atau potensi dari pergerakan harga (price movement); atau
3) posisi yang dimiliki untuk tujuan mempertahankan keuntungan arbitrase (locking in arbitrage profits); dan
b. lindung nilai atas posisi lainnya dalam Trading Book.`,
      notes:
        "Trading Book = posisi yang dimiliki untuk diperdagangkan atau hedging posisi trading.",
      hasRevision: false,
    },
    {
      number: "17",
      content: `17. Banking Book adalah semua posisi lainnya yang tidak termasuk dalam Trading Book.`,
      notes:
        "Banking Book = semua posisi selain Trading Book (held to maturity, loans, dll).",
      hasRevision: false,
    },
  ];

  for (const def of definitions) {
    const subsection = await prisma.baselSubsection.create({
      data: {
        number: def.number,
        content: createContent(def.content),
        betterBankingNotes: def.notes,
        sectionId: section.id,
        order: parseInt(def.number),
      },
    });

    // Add revision if exists
    if (def.hasRevision && def.originalContent) {
      await prisma.baselRevision.create({
        data: {
          title: "Ketentuan Asli (POJK 11/2016)",
          content: def.originalContent,
          revisionDate: new Date("2016-02-26"),
          subsectionId: subsection.id,
          order: 1,
        },
      });
    }

    console.log(`  ✅ Created definition ${def.number}`);
  }

  console.log("\n✅ Pasal 1 seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
