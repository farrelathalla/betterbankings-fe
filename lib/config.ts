/**
 * Site-wide feature configuration.
 *
 * Centralised, hand-editable flags that change product behaviour without
 * touching component logic. Flip the value here and rebuild/redeploy.
 */

/**
 * Should B-Foresight visualizations require the visitor to be logged in?
 *
 *   "YES" -> Gated (the original behaviour). Only the first tab of each page
 *            is visible to logged-out visitors; the rest are blurred behind a
 *            "Premium Insight Access" sign-in prompt.
 *
 *   "NO"  -> Open. Every B-Foresight visualization is fully accessible without
 *            logging in. Use this while the product is new and we want maximum
 *            exposure.
 *
 * Currently set to "NO" for the product-introduction phase. Switch back to
 * "YES" once B-Foresight is well established and we want to gate it again.
 */
export const BFORESIGHT_REQUIRE_LOGIN: "YES" | "NO" = "NO";
