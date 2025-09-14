export const runtime = "nodejs";

import { auth, clerkClient } from "@clerk/nextjs/server";

const LS_HEADERS = {
  Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
  Accept: "application/vnd.api+json",
};

type LsResource<T> = { data?: T; errors?: any };
type LsList<T> = { data?: T[]; errors?: any };

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const user = await clerkClient.users.getUser(userId);
    const email =
      user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress ||
      user.emailAddresses[0]?.emailAddress;

    if (!email) {
      return Response.json({ error: "No email on account" }, { status: 400 });
    }

    // 1) Find LS customer by email
    const custRes = await fetch(
      `https://api.lemonsqueezy.com/v1/customers?filter[email]=${encodeURIComponent(email)}`,
      { headers: LS_HEADERS, cache: "no-store" }
    );
    const customers: LsList<any> = await custRes.json();
    const customer = customers.data?.[0];

    if (!customer) {
      // No LS customer yet (hasn't purchased)
      return Response.json({
        status: null,
        quantity: null,
        renewsAt: null,
        portalUrl: null
      });
    }

    const customerId = customer.id as string;
    const portalUrl = customer.attributes?.urls?.customer_portal || null;

    // 2) Get subscriptions for this customer
    const subRes = await fetch(
      `https://api.lemonsqueezy.com/v1/subscriptions?filter[customer_id]=${customerId}`,
      { headers: LS_HEADERS, cache: "no-store" }
    );
    const subs: LsList<any> = await subRes.json();
    const sub = subs.data?.[0]; // assume current/most recent

    if (!sub) {
      return Response.json({
        status: null,
        quantity: null,
        renewsAt: null,
        portalUrl
      });
    }

    const attrs = sub.attributes || {};
    const status = attrs.status || null;
    const quantity = Number(attrs.first_subscription_item?.quantity ?? attrs.quantity ?? 1) || 1;
    const renewsAt = attrs.renews_at || attrs.ends_at || null;

    return Response.json({
      status,
      quantity,
      renewsAt,
      portalUrl
    });
  } catch (e: any) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
