"use client";

import { uploadCertificatePDF, deleteCertificate, sendCertificateEmail } from "@/lib/actions/certificates";
import { QRCodeSVG } from "qrcode.react";
import { Download, QrCode, Upload, Mail, Trash2 } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";

type Certificate = {
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

export default function TableActions({ certificate }: { certificate: Certificate }) {
    const [showQR, setShowQR] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState<string | null>(null);
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [emailMessage, setEmailMessage] = useState<string | null>(null);
    const router = useRouter();

    const verificationUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/v/${certificate.id}`;

    function handleGenerateQR() {
        setShowQR(true);
    }

    function downloadQR() {
        const svg = document.getElementById(`qr-${certificate.id}`);
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");

            const downloadLink = document.createElement("a");
            downloadLink.download = `QR-${certificate.serial_number}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }

    async function handleUploadPDF(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            setUploadMessage("Please upload a PDF file");
            return;
        }

        setIsUploading(true);
        setUploadMessage(null);

        // Create FormData to pass file to server action
        const formData = new FormData();
        formData.append("uuid", certificate.id);
        formData.append("file", file);

        const result = await uploadCertificatePDF(formData);

        if (result.success) {
            setUploadMessage("PDF uploaded successfully!");
            setTimeout(() => {
                setUploadMessage(null);
                router.refresh(); // Refresh to show updated status
            }, 1500);
        } else {
            setUploadMessage(result.error || "Upload failed");
        }

        setIsUploading(false);
        e.target.value = "";
    }

    async function handleSendMail() {
        if (certificate.is_mailed) {
            alert("Email has already been sent to this student.");
            return;
        }

        if (!confirm(`Send certificate email to ${certificate.student_email}?`)) {
            return;
        }

        setIsSendingEmail(true);
        setEmailMessage(null);

        const result = await sendCertificateEmail(certificate.id);

        if (result.success) {
            setEmailMessage("Email sent successfully!");
            setTimeout(() => {
                setEmailMessage(null);
                router.refresh(); // Refresh to show updated status
            }, 1500);
        } else {
            setEmailMessage(result.error || "Failed to send email");
        }

        setIsSendingEmail(false);
    }

    return (
        <div className="flex gap-2 items-center">
            <button
                onClick={handleGenerateQR}
                className="p-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                title="Generate QR Code"
            >
                <QrCode size={18} />
            </button>

            <label
                className={`px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all cursor-pointer shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2 font-bold ${isUploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                title="Upload PDF Certificate"
            >
                <Upload size={20} />
                <span className="hidden sm:inline">Upload PDF</span>
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleUploadPDF}
                    disabled={isUploading}
                    className="hidden"
                />
            </label>

            <button
                onClick={handleSendMail}
                disabled={isSendingEmail || certificate.is_mailed}
                className={`p-2.5 text-white rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95 ${certificate.is_mailed
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isSendingEmail
                        ? 'bg-teal-400 cursor-wait'
                        : 'bg-teal-600 hover:bg-teal-700'
                    }`}
                title={certificate.is_mailed ? "Email already sent" : isSendingEmail ? "Sending..." : "Send Email"}
            >
                <Mail size={18} />
            </button>

            <button
                onClick={async () => {
                    if (confirm("Are you sure you want to delete this certificate? This action cannot be undone.")) {
                        await deleteCertificate(certificate.id);
                    }
                }}
                className="p-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                title="Delete Certificate"
            >
                <Trash2 size={18} />
            </button>

            {showQR && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        <h3 className="text-lg font-bold mb-4">QR Code for {certificate.student_name}</h3>
                        <div className="flex justify-center mb-4">
                            <QRCodeSVG id={`qr-${certificate.id}`} value={verificationUrl} size={256} />
                        </div>
                        <p className="text-sm text-gray-600 mb-4 break-all">{verificationUrl}</p>
                        <div className="flex gap-2">
                            <button
                                onClick={downloadQR}
                                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2 transition-all"
                            >
                                <Download size={16} />
                                Download QR
                            </button>
                            <button
                                onClick={() => setShowQR(false)}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {uploadMessage && (
                <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
                    {uploadMessage}
                </div>
            )}

            {emailMessage && (
                <div className="fixed bottom-4 right-4 bg-white border-2 border-emerald-200 rounded-lg shadow-lg p-4 z-50">
                    <div className="flex items-center gap-2">
                        <Mail className="text-emerald-600" size={18} />
                        <span className="font-medium text-emerald-900">{emailMessage}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
