import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export function createServerClient() {
    const cookieStore = cookies();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cssjubjcmuhdubtklacz.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzc2p1YmpjbXVoZHVidGtsYWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NzExNzQsImV4cCI6MjA4NjU0NzE3NH0.srODzHeOVjs_soBiF-oLUFzU65hobuD7kyJcVPsBh8Y";

    return createClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            auth: {
                detectSessionInUrl: false,
                persistSession: false,
                storage: {
                    getItem: (key: string) => {
                        return cookieStore.get(key)?.value ?? null;
                    },
                    setItem: (key: string, value: string) => {
                        try {
                            cookieStore.set({ name: key, value });
                        } catch {
                            // The `set` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                    removeItem: (key: string) => {
                        try {
                            cookieStore.delete({ name: key });
                        } catch {
                            // The `delete` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                },
            },
        }
    );
}
