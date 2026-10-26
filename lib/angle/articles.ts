import { html as ilaapCubeEn } from "./ilaapCubeEn";
import { html as ilaapCubeId } from "./ilaapCubeId";

export type AngleLang = "en" | "id";

export interface AngleArticle {
  slug: string;
  lang: AngleLang;
  /** Slug of the same article in the other language. */
  translationSlug: string;
  title: string;
  description: string;
  author: string;
  /** Figure shown on the listing card. */
  cover: string;
  coverAlt: string;
  publishedAt: string;
  html: string;
}

// Titles, descriptions, slugs and alt text come from each language's
// editorial_metadata.json in the web package.
export const angleArticles: AngleArticle[] = [
  {
    slug: "ilaap-cube-liquidity-resilience",
    lang: "en",
    translationSlug: "ilaap-cube-ketahanan-likuiditas",
    title: "Testing Liquidity Resilience with ILAAP Cube",
    description:
      "ILAAP Cube supplements SPM results with scenario, stress timing and monetisation analysis and ILAAP report materials.",
    author: "Betterbankings",
    cover: "/angle/ilaap-cube/en/03_cash.svg",
    coverAlt:
      "Illustrative end-of-day cash paths before and after additional transactions.",
    publishedAt: "2026-10-26",
    html: ilaapCubeEn,
  },
  {
    slug: "ilaap-cube-ketahanan-likuiditas",
    lang: "id",
    translationSlug: "ilaap-cube-liquidity-resilience",
    title: "Menguji Ketahanan Likuiditas dengan ILAAP Cube",
    description:
      "ILAAP Cube melengkapi hasil SPM dengan analisis skenario, waktu tekanan dan monetisasi serta bahan laporan ILAAP.",
    author: "Betterbankings",
    cover: "/angle/ilaap-cube/id/03_cash.svg",
    coverAlt:
      "Simulasi saldo kas akhir hari sebelum dan setelah transaksi tambahan.",
    publishedAt: "2026-10-26",
    html: ilaapCubeId,
  },
];

export function getAngleArticle(slug: string): AngleArticle | undefined {
  return angleArticles.find((a) => a.slug === slug);
}

export const LANG_LABEL: Record<AngleLang, string> = {
  en: "English",
  id: "Bahasa Indonesia",
};
