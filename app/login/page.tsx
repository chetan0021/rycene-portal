"use client";

import { useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { Lock, Loader2, Info } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const supabase = createBrowserClient();
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 500));
            window.location.href = "/admin";
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 space-y-8">
                    <div className="text-center flex flex-col items-center">
                        <div className="relative w-48 h-20 mb-8 p-4 bg-black rounded-xl flex items-center justify-center">
                            <div className="relative w-full h-full">
                                <Image
                                    src="/Logo.png"
                                    alt="Rycene Logo"
                                    fill
                                    className="object-contain brightness-0 invert"
                                    priority
                                />
                            </div>
                        </div>
                        <h1 className="text-2xl font-black text-black tracking-tight">
                            Admin Portal
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 font-medium">
                            Rycene VLSI Technologies
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email-address" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-black bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                    placeholder="admin@rycene.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-black bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-600 text-xs font-bold text-center bg-red-50 py-3 rounded-lg border border-red-200">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Lock size={18} />
                                        Sign In
                                    </span>
                                )}
                            </button>
                        </div>

                        <div className="flex items-center gap-2 justify-center py-2 px-4 bg-gray-50 rounded-lg border border-gray-200">
                            <Info size={14} className="text-gray-600" />
                            <p className="text-xs text-gray-600 font-medium">
                                Contact admin for access
                            </p>
                        </div>
                    </form>
                </div>

                <p className="mt-8 text-center text-xs text-gray-500 font-medium">
                    © {new Date().getFullYear()} Rycene VLSI Technologies
                </p>
            </div>
        </div>
    );
}
