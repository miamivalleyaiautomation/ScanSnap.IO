import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";


type Plan = "basic" | "plus" | "pro" | "pro-dpms";


export async function POST(req: Request) {
const { userId, sessionClaims } = auth();
if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });


const { plan }: { plan?: Plan } = await req.json().catch(() => ({} as any));
if (!plan) return NextResponse.json({ error: "Missing plan" }, { status: 400 });


const email = (sessionClaims as any)?.email || (sessionClaims as any)?.email_address;


const variantMap: Record<Plan, string | undefined> = {
basic: process.env.LEMONSQUEEZY_VARIANT_ID_BASIC,
plus: process.env.LEMONSQUEEZY_VARIANT_ID_PLUS,
pro: process.env.LEMONSQUEEZY_VARIANT_ID_PRO,
"pro-dpms": process.env.LEMONSQUEEZY_VARIANT_ID_PRO_DPMS,
};
const variantId = variantMap[plan];
if (!variantId) return NextResponse.json({ error: "Unknown plan" }, { status: 400 });


const params = new URLSearchParams({
"checkout[custom][clerk_user_id]": userId,
"checkout[success_url]": `${env.NEXT_PUBLIC_SITE_URL}/success`,
"checkout[cancel_url]": `${env.NEXT_PUBLIC_SITE_URL}/#pricing`,
});
if (email) params.set("checkout[email]", String(email));


const url = `https://checkout.lemonsqueezy.com/buy/${variantId}?${params.toString()}`;
return NextResponse.json({ url });
}
