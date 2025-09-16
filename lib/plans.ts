export type PlanSlug = "basic" | "plus" | "pro" | "pro-dpms";

export const PLAN_TO_VARIANT: Record<PlanSlug, string> = {
  "basic":    process.env.LEMONSQUEEZY_VARIANT_ID_BASIC!,
  "plus":     process.env.LEMONSQUEEZY_VARIANT_ID_PLUS!,
  "pro":      process.env.LEMONSQUEEZY_VARIANT_ID_PRO!,
  "pro-dpms": process.env.LEMONSQUEEZY_VARIANT_ID_PRO_DPMS!,
};

export function getVariantIdOrThrow(slug: string) {
  if (!(slug in PLAN_TO_VARIANT)) throw new Error(`Unknown plan: ${slug}`);
  const id = PLAN_TO_VARIANT[slug as PlanSlug];
  if (!id) throw new Error(`Missing variant id for plan: ${slug}`);
  return id;
}
