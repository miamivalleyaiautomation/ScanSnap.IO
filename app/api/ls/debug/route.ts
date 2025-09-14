import { PLAN_TO_VARIANT } from "@/lib/plans";

export async function GET() {
  const mapping = Object.fromEntries(Object.entries(PLAN_TO_VARIANT).map(([k,v]) => [k, v ? "SET" : "MISSING"]));
  return Response.json({
    hasApiKey: !!process.env.LEMONSQUEEZY_API_KEY,
    hasStoreId: !!process.env.LEMONSQUEEZY_STORE_ID,
    mapping
  });
}
