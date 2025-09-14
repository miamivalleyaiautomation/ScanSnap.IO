export const runtime = "nodejs";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId, orgId } = auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const sub = await prisma.subscription.findFirst({ where: { OR: [{ userId }, { orgId }] } });
    let portalUrl: string | null = null;

    if (sub?.lsCustomerId) {
      const r = await fetch(`https://api.lemonsqueezy.com/v1/customers/${sub.lsCustomerId}`, {
        headers: { Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`, Accept: "application/vnd.api+json" },
        cache: "no-store",
      });
      if (r.ok) { const j = await r.json(); portalUrl = j?.data?.attributes?.urls?.customer_portal || null; }
    } else {
      const user = await clerkClient.users.getUser(userId);
      const email = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
      if (email) {
        const r = await fetch(`https://api.lemonsqueezy.com/v1/customers?filter[email]=${encodeURIComponent(email)}`, {
          headers: { Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`, Accept: "application/vnd.api+json" },
          cache: "no-store",
        });
        if (r.ok) { const j = await r.json(); portalUrl = j?.data?.[0]?.attributes?.urls?.customer_portal || null; }
      }
    }

    return Response.json({
      status: sub?.status ?? null,
      quantity: sub?.quantity ?? null,
      renewsAt: sub?.currentPeriodEnd?.toISOString() ?? null,
      portalUrl,
    });
  } catch (e: any) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
