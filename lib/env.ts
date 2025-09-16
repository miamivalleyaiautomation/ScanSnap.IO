import { z } from "zod";


const schema = z.object({
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
CLERK_SECRET_KEY: z.string().min(1),
NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
NEXT_PUBLIC_SUPABASE_KEY: z.string().min(1),
SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
LEMONSQUEEZY_API_KEY: z.string().min(1),
LEMONSQUEEZY_WEBHOOK_SECRET: z.string().min(1),
NEXT_PUBLIC_SITE_URL: z.string().url(),
LEMONSQUEEZY_VARIANT_ID_BASIC: z.string().optional(),
LEMONSQUEEZY_VARIANT_ID_PLUS: z.string().optional(),
LEMONSQUEEZY_VARIANT_ID_PRO: z.string().optional(),
LEMONSQUEEZY_VARIANT_ID_PRO_DPMS: z.string().optional(),
});


const parsed = schema.safeParse(process.env);
if (!parsed.success) {
console.error("Invalid env:", parsed.error.flatten().fieldErrors);
throw new Error("Invalid environment configuration");
}


export const env = parsed.data;
