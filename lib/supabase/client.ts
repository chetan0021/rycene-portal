import { SupabaseClient, createClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

export function createBrowserClient() {
    if (browserClient) return browserClient;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cssjubjcmuhdubtklacz.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzc2p1YmpjbXVoZHVidGtsYWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NzExNzQsImV4cCI6MjA4NjU0NzE3NH0.srODzHeOVjs_soBiF-oLUFzU65hobuD7kyJcVPsBh8Y";

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Missing Supabase environment variables.");
    }

    browserClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            storage: {
                getItem: (key) => {
                    const name = key + "=";
                    const decodedCookie = decodeURIComponent(document.cookie);
                    const ca = decodedCookie.split(';');
                    for (let i = 0; i < ca.length; i++) {
                        let c = ca[i];
                        while (c.charAt(0) === ' ') {
                            c = c.substring(1);
                        }
                        if (c.indexOf(name) === 0) {
                            return c.substring(name.length, c.length);
                        }
                    }
                    return null;
                },
                setItem: (key, value) => {
                    document.cookie = `${key}=${value}; path=/; max-age=31536000; SameSite=Lax`;
                },
                removeItem: (key) => {
                    document.cookie = `${key}=; path=/; max-age=0`;
                },
            },
        },
    });
    return browserClient;
}

export type Certificate = {
    id: string;
    serial_number: string;
    student_name: string;
    student_email: string;
    course_name: string;
    duration: string;
    pdf_url: string | null;
    is_mailed: boolean;
    created_at: string;
};
