// Tableau moves focus into its iframe once a new dashboard finishes rendering,
// which makes the browser scroll the page to bring the viz into view. That jump
// does not reliably fire a `scroll` event, so we poll the position every frame
// until the tab switch has finished (plus a grace period), and let go early as
// soon as the user scrolls on purpose.
const SCROLL_LOCK_GRACE_MS = 2500;
// Safety net so a switch that never settles can't pin the page forever.
const SCROLL_LOCK_MAX_MS = 20000;

/**
 * Locks the current scroll position. Returns `release(afterMs)`: call it when
 * the switch is done; it unlocks after `afterMs` (default: a short grace
 * period, pass 0 to unlock immediately).
 */
export function lockScrollPosition(): (afterMs?: number) => void {
  if (typeof window === "undefined") return () => {};

  const root = document.documentElement;
  const y = window.scrollY;
  const previousBehavior = root.style.scrollBehavior;
  // mousedown covers dragging the scrollbar, which fires no wheel/touch event
  const userInputEvents = [
    "wheel",
    "touchstart",
    "keydown",
    "mousedown",
  ] as const;

  let rafId = 0;
  let maxTimer: ReturnType<typeof setTimeout>;
  let graceTimer: ReturnType<typeof setTimeout> | undefined;
  let released = false;

  const restore = () => {
    if (Math.abs(window.scrollY - y) > 1) {
      window.scrollTo({ top: y, behavior: "instant" });
    }
  };

  const tick = () => {
    if (released) return;
    restore();
    rafId = requestAnimationFrame(tick);
  };

  const finish = (byUser = false) => {
    if (released) return;
    released = true;
    cancelAnimationFrame(rafId);
    clearTimeout(maxTimer);
    clearTimeout(graceTimer);
    userInputEvents.forEach((e) => window.removeEventListener(e, onUserInput));
    // one last correction, unless the user took over
    if (!byUser) restore();
    root.style.scrollBehavior = previousBehavior;
  };
  const onUserInput = () => finish(true);

  // html has scroll-behavior: smooth, which would turn a restore into a glide
  root.style.scrollBehavior = "auto";
  userInputEvents.forEach((e) =>
    window.addEventListener(e, onUserInput, { passive: true }),
  );
  maxTimer = setTimeout(() => finish(), SCROLL_LOCK_MAX_MS);
  rafId = requestAnimationFrame(tick);

  return (afterMs = SCROLL_LOCK_GRACE_MS) => {
    if (released) return;
    clearTimeout(graceTimer);
    if (afterMs <= 0) finish();
    else graceTimer = setTimeout(() => finish(), afterMs);
  };
}
