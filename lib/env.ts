function must(key: string): string {
const v = process.env[key];
if (!v) throw new Error(`Missing env: ${key}`);
return v;
}


// Public (client-embedded) vars — read from server code only when needed
export const publicEnv = {
NEXT_PUBLIC_SUPABASE_URL: () => must('NEXT_PUBLIC_SUPABASE_URL'),
NEXT_PUBLIC_SUPABASE_KEY: () => must('NEXT_PUBLIC_SUPABASE_KEY'),
NEXT_PUBLIC_SITE_URL: () => must('NEXT_PUBLIC_SITE_URL'),
};


// Server-only secrets (never expose to client)
export const serverEnv = {
SUPABASE_SERVICE_ROLE_KEY: () => must('SUPABASE_SERVICE_ROLE_KEY'),
LEMONSQUEEZY_WEBHOOK_SECRET: () => must('LEMONSQUEEZY_WEBHOOK_SECRET'),
};
