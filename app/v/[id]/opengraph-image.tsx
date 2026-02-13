import { ImageResponse } from "next/og";
import { getCertificateByUUID } from "@/lib/actions/certificates";
import { readFileSync } from "fs";
import { join } from "path";

// runtime removed for compatibility with Node.js server actions

export const alt = "Rycene Certificate Verification";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
    const certificate = await getCertificateByUUID(params.id);

    // Load logo
    const logoData = readFileSync(join(process.cwd(), "public", "Logo.png"));
    const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

    // ...

    return new ImageResponse(
        (
            <div
                style={{
                    background: "linear-gradient(to bottom right, #f0f9ff, #e0f2fe)",
                    // ... existing styles
                }}
            >
                {/* ... border div ... */}

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "40px",
                        textAlign: "center",
                    }}
                >
                    {/* Replaced Text with Image */}
                    <img
                        src={logoSrc}
                        alt="Rycene Logo"
                        width="300"
                        height="100" // Approximate aspect ratio, check actual image
                        style={{
                            objectFit: "contain",
                            marginBottom: 20,
                        }}
                    />

                    <div
                        style={{
                            fontSize: 24,
                            color: "#64748b",
                            marginBottom: 40,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                        }}
                    >
                        Certificate of Completion
                    </div>

                    <div
                        style={{
                            fontSize: 64,
                            fontWeight: "bold",
                            color: "#0f172a",
                            marginBottom: 20,
                            lineHeight: 1.1,
                        }}
                    >
                        {certificate.student_name}
                    </div>

                    <div
                        style={{
                            fontSize: 36,
                            color: "#334155",
                            marginBottom: 60,
                        }}
                    >
                        {certificate.course_name}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "40px",
                        }}
                    >
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <span style={{ fontSize: 20, color: "#94a3b8" }}>Issued</span>
                            <span style={{ fontSize: 24, color: "#475569", fontWeight: "bold" }}>
                                {new Date(certificate.created_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                        </div>
                        <div style={{ width: 2, height: 60, background: "#cbd5e1" }} />
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <span style={{ fontSize: 20, color: "#94a3b8" }}>ID</span>
                            <span style={{ fontSize: 24, color: "#475569", fontWeight: "bold" }}>
                                {certificate.serial_number}
                            </span>
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        position: "absolute",
                        bottom: 40,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: 20,
                        color: "#0284c7",
                        fontWeight: "bold",
                    }}
                >
                    ✅ Verified Certificate
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
