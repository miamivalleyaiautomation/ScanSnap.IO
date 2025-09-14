export const runtime = "nodejs";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { getVariantIdOrThrow } from "@/lib/plans";

export async function POST(req: Request) {
  const { userId, orgId } = auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = await req.json().catch(() => ({}));

  try {
    const variantId = getVariantIdOrThrow(String(plan));
    const user = await clerkClient.users.getUser(userId);
    const email = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;

    const body = {
      data: {
        type: "checkouts",
        attributes: {
          checkout_options: { embed: true, logo: false, desc: false, background_color: "#0B0F19" },
          checkout_data: {
            email, name: user.fullName || undefined,
            custom: { user_id: orgId ? null : userId, org_id: orgId || null, plan: String(plan) }
          },
          success_url: process.env.NEXT_PUBLIC_AFTER_CHECKOUT_URL || "https://app.scansnap.io/app",
          cancel_url: `${process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.scansnap.io"}/pricing`
        },
        relationships: {
          store:   { data: { type: "stores",   id: process.env.LEMONSQUEEZY_STORE_ID } },
          variant: { data: { type: "variants", id: variantId } }
        }
      }
    };

    console.log("[checkout] plan=%s variantId=%s userId=%s orgId=%s", plan, variantId, userId, orgId ?? "");

    const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json"
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) return Response.json({ error: "Lemon Squeezy checkout failed", detail: await res.text() }, { status: 502 });
    const json = await res.json();
    return Response.json({ url: json?.data?.attributes?.url ?? null });
  } catch (e: any) {
    return Response.json({ error: String(e?.message || e) }, { status: 400 });
  }
}
