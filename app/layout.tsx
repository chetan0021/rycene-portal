import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Rycene Credential Management System",
    description: "Certificate verification and management for Rycene VLSI Technologies",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">{children}</body>
        </html>
    );
}
