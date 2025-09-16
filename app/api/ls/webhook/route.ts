import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";


export const runtime = "nodejs"; // Node required for crypto HMAC


function verifySignature(rawBody: string, signature: string) {
const hmac = crypto.createHmac("sha256", env.LEMONSQUEEZY_WEBHOOK_SECRET);
hmac.update(rawBody, "utf8");
const digest = hmac.digest("hex");
return crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(digest, "hex"));
}


export async function POST(req: Request) {
const raw = await req.text();
const signature = req.headers.get("x-signature");
if (!signature || !verifySignature(raw, signature)) {
return new NextResponse("Invalid signature", { status: 400 });
}


const evt = JSON.parse(raw);
const attrs = evt?.data?.attributes ?? {};
const clerkUserId: string | undefined = evt?.meta?.custom_data?.clerk_user_id;
if (!clerkUserId) return new NextResponse("missing custom id", { status: 200 });


// Service role bypasses RLS for machine writes
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
auth: { persistSession: false },
});


const payload = {
user_id: clerkUserId,
ls_customer_id: String(attrs?.customer_id ?? ""),
ls_subscription_id: String(evt?.data?.id ?? ""),
status: attrs?.status ?? null,
product_id: String(attrs?.product_id ?? ""),
variant_id: String(attrs?.variant_id ?? ""),
renews_at: attrs?.renews_at ? new Date(attrs.renews_at).toISOString() : null,
ends_at: attrs?.ends_at ? new Date(attrs.ends_at).toISOString() : null,
updated_at: new Date().toISOString(),
};


const { error } = await admin.from("subscriptions").upsert(payload, { onConflict: "user_id" });
if (error) return new NextResponse("db error", { status: 500 });


return new NextResponse("ok", { status: 200 });
}
