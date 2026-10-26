import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import {
  angleArticles,
  getAngleArticle,
  LANG_LABEL,
  type AngleLang,
} from "@/lib/angle/articles";
import { cn } from "@/lib/utils";
import "../article.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return angleArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getAngleArticle(slug);
  if (!article) return {};
  const translation = getAngleArticle(article.translationSlug);
  const languages: Record<string, string> = {
    [article.lang]: `/betterbankings-angle/${article.slug}`,
  };
  if (translation) {
    languages[translation.lang] = `/betterbankings-angle/${translation.slug}`;
  }
  return {
    title: `${article.title} | BetterBankings Angle`,
    description: article.description,
    alternates: {
      canonical: `/betterbankings-angle/${article.slug}`,
      languages,
    },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      authors: [article.author],
      publishedTime: article.publishedAt,
    },
  };
}

export default async function AngleArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getAngleArticle(slug);
  if (!article) notFound();

  // Language switch, always English first.
  const slugFor = (lang: AngleLang) =>
    lang === article.lang ? article.slug : article.translationSlug;
  const versions = (["en", "id"] as const).map((lang) => ({
    lang,
    slug: slugFor(lang),
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row overflow-x-hidden">
      <Sidebar />

      <main className="w-full flex-1 lg:ml-[280px] relative">
        <div className="relative z-10 px-4 lg:px-12 pt-20 pb-8 lg:pt-8">
          <div className="max-w-[960px] mx-auto mb-4 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/betterbankings-angle"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#355189] hover:text-[#F48C25] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {article.lang === "id"
                ? "Kembali ke BetterBankings Angle"
                : "Back to BetterBankings Angle"}
            </Link>

            <nav
              aria-label={article.lang === "id" ? "Bahasa" : "Language"}
              className="inline-flex rounded-full border border-[#E1E7EF] bg-white p-1 text-sm"
            >
              {versions.map((v) => (
                <Link
                  key={v.lang}
                  href={`/betterbankings-angle/${v.slug}`}
                  hrefLang={v.lang}
                  aria-current={v.lang === article.lang ? "page" : undefined}
                  className={cn(
                    "px-3 py-1 rounded-full font-medium transition-colors",
                    v.lang === article.lang
                      ? "bg-[#F48C25] text-white"
                      : "text-gray-600 hover:text-[#14213D]",
                  )}
                >
                  {LANG_LABEL[v.lang]}
                </Link>
              ))}
            </nav>
          </div>

          {/* Trusted, static article markup shipped with the repo (lib/angle). */}
          <div
            className="max-w-[960px] mx-auto rounded-2xl border border-[#E1E7EF] bg-white overflow-hidden"
            dangerouslySetInnerHTML={{ __html: article.html }}
          />
        </div>

        <Footer />
      </main>
    </div>
  );
}
