/**
 * Resolving a reference link's anchor to a subsection on a RegMaps chapter page.
 *
 * Every subsection on a chapter page carries the id
 * `{standardCode}{chapterCode}.{subsectionNumber}` (e.g. `CoGvP.VI.30.1-2`), and
 * reference links point at that same shape. Matching it exactly is not enough:
 *
 * - The renderer builds the link's hash with the standard code upper-cased
 *   (`COGVP.VI.30.1-2`) while the page keeps the code as stored (`CoGvP`), and
 *   `getElementById` is case-sensitive. That alone broke every reference into a
 *   mixed-case standard (CoGvP, KPMo, Bank, GovU, CoRM, ...).
 * - Links name the article as it was numbered when the link was made
 *   (`LCR.III.16.a-b`), but subsections get renumbered and regrouped later
 *   (`LCR.III.16`). Landing on the closest enclosing subsection beats not
 *   scrolling at all.
 *
 * The functions below are pure so they can be tested without a DOM.
 */

/**
 * Pick the id from `ids` that `target` refers to, or null.
 *
 * `floor` is the chapter prefix (`CoGvP.VI`): trailing segments of the target
 * are dropped one at a time to find an enclosing subsection, but never past the
 * chapter itself, since chapter codes contain dots too (`.L_I.EI`).
 */
export function resolveAnchorId(
  target: string,
  ids: readonly string[],
  floor = "",
): string | null {
  const want = target.trim().toLowerCase();
  if (!want) return null;
  const lower = ids.map((id) => id.toLowerCase());
  const base = floor.toLowerCase();

  const match = (key: string): string | null => {
    const exact = lower.indexOf(key);
    if (exact !== -1) return ids[exact];
    // "AML.IV.51" -> "AML.IV.51.1-5": the article split into ranged subsections
    const prefixed = lower.findIndex((id) => id.startsWith(key + "."));
    return prefixed !== -1 ? ids[prefixed] : null;
  };

  let key = want.replace(/\.+$/, "");
  while (key) {
    const hit = match(key);
    if (hit) return hit;
    const cut = key.lastIndexOf(".");
    // stop at the chapter: "the chapter's first subsection" is not a match
    if (cut <= 0 || (base && cut <= base.length)) break;
    key = key.slice(0, cut);
  }

  // "AML.IV.Article 50" -> "AML.IV.50"
  if (base && want.startsWith(base + ".")) {
    const num = want.slice(base.length + 1).match(/\d+/);
    if (num) return match(`${base}.${num[0]}`);
  }
  return null;
}

/** Same path, ignoring case and percent-encoding (`/regmaps/CoGvP/.VI`). */
export function samePath(a: string, b: string): boolean {
  const norm = (p: string) => {
    let s = p;
    try {
      s = decodeURIComponent(p);
    } catch {
      /* keep as is */
    }
    return s.replace(/\/+$/, "").toLowerCase();
  };
  return norm(a) === norm(b);
}

/** Attribute every subsection anchor on a chapter page carries. */
export const ANCHOR_ATTR = "data-regmaps-anchor";

/**
 * Find the subsection element a hash refers to on the current page. The
 * chapter prefix (the resolver's floor) is read off the anchors themselves.
 */
export function findAnchorElement(
  root: ParentNode,
  target: string,
): HTMLElement | null {
  let key = target;
  try {
    key = decodeURIComponent(target);
  } catch {
    /* keep as is */
  }
  const els = Array.from(root.querySelectorAll<HTMLElement>(`[${ANCHOR_ATTR}]`));
  if (els.length === 0) return null;
  const floor = els[0].getAttribute(ANCHOR_ATTR) ?? "";
  const id = resolveAnchorId(
    key,
    els.map((el) => el.id),
    floor,
  );
  return id ? (els.find((el) => el.id === id) ?? null) : null;
}

/**
 * A link to a RegMaps page on this site written as an absolute URL
 * (`https://www.betterbankings.com/regmaps/lcr/.III#LCR.III.13`) -> its
 * in-app path, so it navigates like a reference link instead of opening a new
 * tab. Anything else -> null.
 */
export function internalRegmapsPath(href: string): string | null {
  const m = href.match(/^https?:\/\/(?:www\.)?betterbankings\.com(\/regmaps(?:[/?#].*)?)$/i);
  return m ? m[1] : null;
}
