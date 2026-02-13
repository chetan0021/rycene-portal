import { getCertificateByUUID } from "@/lib/actions/certificates";
import { Download, CheckCircle, Award, Calendar, Hash, User, Lock } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import SocialShare from "@/components/verification/SocialShare";

type Props = {
    params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const certificate = await getCertificateByUUID(params.id);

    if (!certificate) {
        return {
            title: "Certificate Not Found",
        };
    }

    const title = `Verified Certificate - ${certificate.student_name}`;
    const description = `Verified certificate from Rycene VLSI Technologies for ${certificate.course_name}.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "website",
            url: `/v/${params.id}`,
            siteName: "Rycene VLSI Technologies",
        },
    };
}

export default async function VerificationPage({ params }: Props) {
    const certificate = await getCertificateByUUID(params.id);

    if (!certificate) {
        notFound();
    }

    const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/v/${certificate.id}`;

    return (
        <div className="min-h-screen bg-black py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Brand Header */}
                <div className="flex flex-col items-center mb-12">
                    <div className="relative w-48 h-16 mb-6">
                        <Image
                            src="/Logo.png"
                            alt="Rycene Logo"
                            fill
                            className="object-contain brightness-0 invert"
                            priority
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Rycene VLSI Technologies</h2>
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-700 rounded-full">
                        <CheckCircle className="text-white" size={20} />
                        <span className="text-white text-sm font-bold uppercase tracking-wider">
                            ✓ Verified Credential
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
                            <div className="bg-white px-6 py-4">
                                <h2 className="text-sm font-bold text-black uppercase tracking-widest">
                                    Recipient Details
                                </h2>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-gray-800 rounded-lg">
                                        <User className="text-white" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Student Name</p>
                                        <p className="text-white font-bold leading-tight">{certificate.student_name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-gray-800 rounded-lg">
                                        <Award className="text-white" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Course</p>
                                        <p className="text-white font-bold leading-tight">{certificate.course_name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-gray-800 rounded-lg">
                                        <Calendar className="text-white" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Duration</p>
                                        <p className="text-white font-medium leading-tight">{certificate.duration}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-gray-800 rounded-lg">
                                        <Calendar className="text-white" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Issue Date</p>
                                        <p className="text-white font-medium leading-tight">
                                            {new Date(certificate.created_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-gray-800 rounded-lg">
                                        <Hash className="text-white" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Serial Number</p>
                                        <p className="text-gray-400 font-mono text-xs">{certificate.serial_number}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Download CTA */}
                        {certificate.pdf_url && (
                            <a
                                href={certificate.pdf_url}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 w-full py-4 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition-all active:scale-[0.98] border-2 border-white"
                            >
                                <Download size={20} />
                                Download Certificate
                            </a>
                        )}

                        {/* Social Share */}
                        <SocialShare
                            verificationUrl={verificationUrl}
                            courseName={certificate.course_name}
                        />
                    </div>

                    {/* Right Column - PDF Viewer */}
                    <div className="lg:col-span-2">
                        {certificate.pdf_url ? (
                            <div className="bg-white rounded-xl border border-gray-200 p-2 h-full min-h-[600px] flex flex-col">
                                {/* Mobile View */}
                                <div className="md:hidden flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg m-2 border border-gray-200">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                                        <Award className="text-black" size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-black mb-2">Certificate Available</h3>
                                    <p className="text-sm text-gray-700 mb-8 max-w-[240px]">
                                        Your official completion certificate is ready for viewing.
                                    </p>
                                    <a
                                        href={certificate.pdf_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-black text-white rounded-xl font-bold hover:bg-gray-900 transition-all"
                                    >
                                        <Download size={20} />
                                        Open PDF Document
                                    </a>
                                </div>

                                {/* Desktop Viewer */}
                                <div className="hidden md:block flex-1 rounded-lg overflow-hidden">
                                    <iframe
                                        src={`${certificate.pdf_url}#toolbar=0`}
                                        className="w-full h-full min-h-[700px]"
                                        title="Certificate PDF"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 bg-gray-50 rounded-xl border border-gray-200 text-center">
                                <div className="animate-pulse w-12 h-12 bg-gray-300 rounded-full mb-4" />
                                <h3 className="text-lg font-bold text-black mb-1">Processing Document</h3>
                                <p className="text-gray-600 max-w-xs text-sm">
                                    The secure certificate document is being generated. Please check back in a few moments.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Secure Footer */}
                <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600">
                    <p className="text-xs uppercase tracking-widest font-bold">
                        © {new Date().getFullYear()} Rycene VLSI Technologies
                    </p>
                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-xs font-mono border border-gray-200">
                        <Lock size={12} />
                        SECURE TOKEN: {certificate.id.slice(0, 8)}...
                    </div>
                </div>
            </div>
        </div>
    );
}
