"use client";

import { signOut } from "@/lib/actions/auth";
import { LogOut } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function AdminHeader() {
    const [isSigningOut, setIsSigningOut] = useState(false);

    const handleSignOut = async () => {
        setIsSigningOut(true);
        await signOut();
    };

    return (
        <header className="bg-black sticky top-0 z-50 border-b border-gray-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="relative w-32 h-10">
                        <Image
                            src="/Logo.png"
                            alt="Rycene"
                            fill
                            className="object-contain object-left brightness-0 invert"
                            priority
                        />
                    </div>
                    <div className="hidden md:block">
                        <h1 className="text-xl font-bold text-white tracking-tight">Rycene VLSI Technologies</h1>
                        <p className="text-xs text-gray-400">Certificate Management Portal</p>
                    </div>
                </div>
                <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="group flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg transition-all disabled:opacity-50 active:scale-[0.98]"
                >
                    <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                    {isSigningOut ? "Signing out..." : "Sign Out"}
                </button>
            </div>
        </header>
    );
}
