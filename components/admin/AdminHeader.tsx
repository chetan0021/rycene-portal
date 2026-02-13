"use client";

import { LogOut, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function AdminHeader() {
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false);

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    }

    function handleRefresh() {
        setIsRefreshing(true);
        router.refresh();
        setTimeout(() => setIsRefreshing(false), 1000);
    }

    return (
        <div className="bg-black border-b border-gray-800 sticky top-0 z-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-4">
                        <div className="relative w-10 h-10 sm:w-32 sm:h-10">
                            <Image
                                src="/Logo.png"
                                alt="Rycene Logo"
                                fill
                                className="object-contain brightness-0 invert"
                                priority
                            />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-lg font-bold text-white leading-tight">Rycene VLSI Technologies</h1>
                            <p className="text-xs text-gray-400">Admin Dashboard</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className={`flex items-center gap-2 px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg hover:bg-gray-700 transition-all ${isRefreshing ? "opacity-50 cursor-not-allowed" : ""}`}
                            title="Refresh table to see latest status"
                        >
                            <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
                            <span className="hidden sm:inline">Refresh</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-all font-medium"
                        >
                            <LogOut size={18} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
