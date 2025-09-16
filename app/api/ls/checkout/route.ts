export const runtime = "nodejs";

import { NextRequest } from "next/server";

const HEADERS = {
  Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
  "Content-Type": "application/json",
  Accept: "application/vnd.api+json",
};

const VARIANT_MAP: Record<string, string | undefined> = {
  plus: process.env.LEMONSQUEEZY_VARIANT_ID_PLUS,
  pro: process.env.LEMONSQUEEZY_VARIANT_ID_PRO,
  pro_dpms: process.env.LEMONSQUEEZY_VARIANT_ID_PRO_DPMS,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const plan: string | undefined = body?.plan;
    if (!plan || plan === "basic") {
      return Response.json({ error: "Use paid plans only for checkout" }, { status: 400 });
    }

    const variantId = VARIANT_MAP[plan];
    if (!variantId) return Response.json({ error: "Missing variant id" }, { status: 400 });

    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    if (!storeId) return Response.json({ error: "Missing store id" }, { status: 500 });

    const redirectUrl =
      process.env.NEXT_PUBLIC_AFTER_CHECKOUT_URL ||
      `${process.env.NEXT_PUBLIC_PORTAL_URL || ""}/billing`;

    const cancelUrl =
      `${process.env.NEXT_PUBLIC_PORTAL_URL || ""}/pricing`;

    const payload = {
      data: {
        type: "checkouts",
        attributes: {
          checkout_options: { embed: true },
          cancel_url: cancelUrl,
          redirect_url: redirectUrl
        },
        relationships: {
          store: { data: { type: "stores", id: storeId } },
          variant: { data: { type: "variants", id: variantId } }
        }
      }
    };

    const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    const url = json?.data?.attributes?.url as string | undefined;

    if (!res.ok || !url) {
      return Response.json({ error: "Failed to create checkout", detail: json }, { status: 500 });
    }

    return Response.json({ url });
  } catch (e: any) {
    return Response.json({ error: e?.message || String(e) }, { status: 500 });
  }
}
