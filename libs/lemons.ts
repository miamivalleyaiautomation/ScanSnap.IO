import { PLAN_TO_VARIANT, PlanSlug } from "./plans";

export type PlanInfo = {
  slug: PlanSlug;
  variantId: string;
  name: string;
  priceCents: number;
  currency: string;
  interval: "day" | "week" | "month" | "year";
};

const LS_HEADERS = {
  Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
  Accept: "application/vnd.api+json",
};

async function fetchVariantName(variantId: string): Promise<string> {
  const r = await fetch(`https://api.lemonsqueezy.com/v1/variants/${variantId}`, {
    headers: LS_HEADERS,
    next: { revalidate: 300 },
  });
  const j = await r.json();
  return j?.data?.attributes?.name ?? "Plan";
}

async function fetchActivePrice(variantId: string) {
  const r = await fetch(
    `https://api.lemonsqueezy.com/v1/prices?filter[variant_id]=${variantId}`,
    { headers: LS_HEADERS, next: { revalidate: 300 } }
  );
  const j = await r.json();
  const list = Array.isArray(j?.data) ? j.data : [];
  const active = list.find((p: any) => p?.attributes?.status === "active") ?? list[0];
  const a = active?.attributes ?? {};
  return {
    cents: Number(a.unit_price ?? 0),
    currency: a.currency ?? "USD",
    interval: (a.renewal_interval_unit ?? "month") as "day"|"week"|"month"|"year",
  };
}

export async function getAllPlans(): Promise<PlanInfo[]> {
  const entries = Object.entries(PLAN_TO_VARIANT) as [PlanSlug, string][];
  const promises = entries.map(async ([slug, variantId]) => {
    const [name, price] = await Promise.all([
      fetchVariantName(variantId),
      fetchActivePrice(variantId),
    ]);
    return {
      slug,
      variantId,
      name,
      priceCents: price.cents,
      currency: price.currency,
      interval: price.interval,
    } as PlanInfo;
  });
  return Promise.all(promises);
}

export function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format((cents || 0) / 100);
}
