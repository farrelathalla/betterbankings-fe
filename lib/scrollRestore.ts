/**
 * Scroll-position restoration helpers for RegMaps chapter pages.
 *
 * Scenario: a user scrolls down a chapter page, then clicks a cross-page
 * reference link (or the prev/next chapter buttons) that navigates to a
 * different chapter. When they press the browser **Back** button we want to
 * return to the previous chapter AND restore the exact scroll position they
 * left off at — not jump to the top.
 *
 * We do NOT rely on `history.state` for this: Next.js' App Router performs its
 * own scroll restoration and rewrites `history.state` during navigation, which
 * can silently strip any custom keys we attach. Instead we key the saved scroll
 * position by the page's pathname in `sessionStorage`, and restore it when we
 * detect a back/forward navigation back to that path.
 *
 * The functions below are intentionally pure (they take a Storage-like object
 * and plain values instead of touching `window`/`document` directly) so they
 * can be unit tested without a DOM.
 */

export const SCROLL_KEY_PREFIX = "bbScroll:";

/** Minimal subset of the Web Storage API that we depend on. */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** Build the sessionStorage key used to store the scroll position for a path. */
export function scrollStorageKey(pathname: string): string {
  return `${SCROLL_KEY_PREFIX}${pathname}`;
}

/**
 * Persist the scroll position for the page identified by `pathname`.
 * Negative / non-finite values are clamped to 0 so we never store garbage.
 */
export function saveScrollPosition(
  storage: StorageLike,
  pathname: string,
  scrollY: number,
): void {
  const safeY = Math.max(
    0,
    Math.round(Number.isFinite(scrollY) ? scrollY : 0),
  );
  storage.setItem(scrollStorageKey(pathname), String(safeY));
}

/**
 * Read AND remove the saved scroll position for `pathname`.
 *
 * Returns `null` when nothing valid is stored, so the caller can fall back to
 * default scroll / hash-anchor behaviour. Reading is destructive (consume-once)
 * so a stale value can never be re-applied on a later forward navigation.
 */
export function consumeScrollPosition(
  storage: StorageLike,
  pathname: string,
): number | null {
  const key = scrollStorageKey(pathname);
  const raw = storage.getItem(key);
  if (raw === null) return null;

  storage.removeItem(key);

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed;
}

/**
 * Decide whether the *initial document load* arrived via the browser
 * back/forward buttons (as opposed to a fresh navigation or reload). Used to
 * restore scroll after a full-page (non client-side) back navigation.
 *
 * Prefers the modern Navigation Timing Level 2 entries
 * (`performance.getEntriesByType("navigation")`), falling back to the
 * deprecated `performance.navigation.type` (2 === TYPE_BACK_FORWARD).
 */
export function isBackForwardNavigation(
  navEntries?: ReadonlyArray<{ type: string }>,
  legacyType?: number,
): boolean {
  if (navEntries && navEntries.length > 0) {
    return navEntries[0].type === "back_forward";
  }
  if (typeof legacyType === "number") {
    return legacyType === 2;
  }
  return false;
}

/**
 * Given the current document height, viewport height and a desired scroll
 * target, decide whether the page is now tall enough for the target to be
 * reachable. Async-loaded chapter content grows the page over several frames,
 * so we wait until the target is actually reachable before scrolling — this is
 * what stops a restore from landing short (at the bottom of a not-yet-full
 * page).
 */
export function isScrollTargetReachable(
  scrollHeight: number,
  viewportHeight: number,
  targetY: number,
  tolerance = 2,
): boolean {
  // A target of 0 is always reachable.
  if (targetY <= 0) return true;
  return scrollHeight - viewportHeight >= targetY - tolerance;
}
