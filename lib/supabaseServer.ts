import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";


export function createServerSupabase() {
const { getToken } = auth();
return createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_KEY!,
{ accessToken: async () => (await getToken()) ?? null }
);
}
