import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        console.error("Missing Supabase URL or Service Role Key");
        // Fallback to regular client if keys missing (will fail RLS but prevents crash)
        // actually better to throw error or return null? 
        // We'll let it fail with a clear error if used.
    }

    return createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
