"use client";

import { useCallback, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play } from "lucide-react";

import { EASE } from "./ProductLanding";

/**
 * Lazy YouTube embed.
 *
 * The iframe is only mounted once the visitor asks for it: a cold YouTube
 * player pulls well over a megabyte of script before anything is visible,
 * which is not a cost worth paying on a page most visitors scroll past.
 * Until then this renders YouTube's own poster frame plus a play control,
 * so the first paint is a single image.
 */

const POSTER_SIZES = ["maxresdefault", "hqdefault"] as const;

export default function VideoIntro({
  videoId,
  title,
  caption,
}: {
  videoId: string;
  title: string;
  caption?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [posterLevel, setPosterLevel] = useState(0);
  const reduceMotion = useReducedMotion();

  /** Warm the connection on intent, so the click itself feels immediate. */
  const prefetch = useCallback(() => {
    if (typeof document === "undefined") return;
    for (const href of [
      "https://www.youtube-nocookie.com",
      "https://i.ytimg.com",
    ]) {
      if (document.head.querySelector(`link[data-vi][href="${href}"]`)) continue;
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = href;
      link.crossOrigin = "";
      link.dataset.vi = "1";
      document.head.appendChild(link);
    }
  }, []);

  const poster = `https://i.ytimg.com/vi/${videoId}/${POSTER_SIZES[posterLevel]}.jpg`;

  return (
    <motion.figure
      initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative mx-auto max-w-4xl"
    >
      {/* Ambient glow behind the frame, matching the hero's light sources. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-8 -inset-y-6 -z-10 rounded-[2rem] bg-gradient-to-br from-[#e9a261]/12 via-transparent to-[#287aa7]/16 blur-2xl"
      />

      <div className="overflow-hidden rounded-2xl border border-[#102d49]/10 bg-[#102d49] shadow-2xl shadow-[#102d49]/20">
        {/* Player chrome: keeps a third-party embed reading as part of the
            product story rather than a bare YouTube rectangle. */}
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          <div className="ml-2 flex-1 truncate text-center">
            <span className="inline-flex max-w-full items-center gap-2 truncate rounded-md bg-white/[0.07] px-3 py-1 text-[11px] font-medium tracking-wide text-white/60">
              betterbankings · {title}
            </span>
          </div>
        </div>

        <div className="relative aspect-video w-full bg-[#0b2238]">
          {playing ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&color=white`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              onMouseEnter={prefetch}
              onFocus={prefetch}
              aria-label={`Play video: ${title}`}
              className="group absolute inset-0 h-full w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e9a261] focus-visible:ring-inset"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={poster}
                alt=""
                loading="lazy"
                decoding="async"
                onError={() =>
                  setPosterLevel((level) =>
                    Math.min(level + 1, POSTER_SIZES.length - 1),
                  )
                }
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-[#0b2238]/85 via-[#0b2238]/25 to-[#0b2238]/35 transition-opacity duration-500 group-hover:opacity-90"
              />

              <span className="absolute inset-0 flex items-center justify-center">
                <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#e9a261] text-[#102d49] shadow-lg shadow-[#e9a261]/30 transition-all duration-500 group-hover:scale-110 group-hover:bg-[#f2b779] sm:h-[72px] sm:w-[72px] md:h-20 md:w-20">
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-[#e9a261]/35 transition-transform duration-700 group-hover:scale-[1.35] group-hover:opacity-0"
                  />
                  <Play className="relative ml-1 h-6 w-6 fill-current sm:h-7 sm:w-7 md:h-8 md:w-8" />
                </span>
              </span>

              <span className="absolute inset-x-0 bottom-0 hidden items-end justify-between gap-4 p-5 sm:flex md:p-6">
                <span className="text-left">
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#e9a261]">
                    Video introduction
                  </span>
                  <span className="mt-1 block text-[15px] font-semibold text-white md:text-lg">
                    {title}
                  </span>
                </span>
                <span className="hidden shrink-0 rounded-lg border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[12px] font-medium text-white/75 backdrop-blur-sm transition-colors duration-300 group-hover:border-white/30 group-hover:text-white sm:block">
                  Watch now
                </span>
              </span>
            </button>
          )}
        </div>
      </div>

      {caption ? (
        <figcaption className="mt-4 text-center text-[13px] leading-relaxed text-[#556c7d]">
          {caption}
        </figcaption>
      ) : null}
    </motion.figure>
  );
}
