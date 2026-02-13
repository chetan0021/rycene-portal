import { getCertificateByUUID } from "@/lib/actions/certificates";
import { Download, CheckCircle, Award, Calendar, Hash, User, Lock, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import SocialShare from "@/components/verification/SocialShare";
import Confetti from "@/components/ui/Confetti";

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
        <div className="min-h-screen bg-[#050505] relative overflow-hidden flex flex-col">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />
            <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] bg-purple-900/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute top-[200px] -left-[200px] w-[500px] h-[500px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Confetti Celebration */}
            <Confetti />

            <div className="flex-grow py-8 px-4 relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Brand Header */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="relative w-40 h-14 mb-4 transform hover:scale-105 transition-transform duration-500">
                            <Image
                                src="/Logo.png"
                                alt="Rycene Logo"
                                fill
                                className="object-contain brightness-0 invert"
                                priority
                            />
                        </div>
                        <h2 className="text-xl font-medium text-gray-300 mb-4 tracking-wide">Rycene VLSI Technologies</h2>

                        {/* Premium Badge */}
                        <div className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-yellow-600/20 to-yellow-500/10 border border-yellow-500/50 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.2)] backdrop-blur-sm animate-fade-in-up">
                            <div className="bg-yellow-500 rounded-full p-0.5">
                                <CheckCircle className="text-black" size={16} fill="currentColor" />
                            </div>
                            <span className="text-yellow-400 text-sm font-bold uppercase tracking-wider text-shadow-sm">
                                Verified Credential
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                        {/* Left Column - Details */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
                                <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                                    <h2 className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                                        Recipient Details
                                    </h2>
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                </div>
                                <div className="p-6 space-y-5">
                                    <div className="group flex items-start gap-4 transition-all duration-300 hover:translate-x-1">
                                        <div className="p-2.5 bg-gray-800 rounded-xl group-hover:bg-blue-900/30 transition-colors border border-gray-700/50 group-hover:border-blue-500/30">
                                            <User className="text-blue-400" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Student Name</p>
                                            <p className="text-white font-bold text-lg leading-tight group-hover:text-blue-200 transition-colors">{certificate.student_name}</p>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-gray-800" />

                                    <div className="group flex items-start gap-4 transition-all duration-300 hover:translate-x-1">
                                        <div className="p-2.5 bg-gray-800 rounded-xl group-hover:bg-purple-900/30 transition-colors border border-gray-700/50 group-hover:border-purple-500/30">
                                            <Award className="text-purple-400" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Course</p>
                                            <p className="text-white font-bold text-lg leading-tight group-hover:text-purple-200 transition-colors">{certificate.course_name}</p>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-gray-800" />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="group">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Issue Date</p>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="text-gray-400" size={14} />
                                                <p className="text-gray-200 font-medium text-sm">
                                                    {new Date(certificate.created_at).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="group">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Duration</p>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="text-gray-400" size={14} />
                                                <p className="text-gray-200 font-medium text-sm">
                                                    {certificate.duration}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <div className="bg-black/30 rounded-lg p-3 border border-gray-800 flex items-center justify-between group hover:border-gray-700 transition-colors">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Serial Number</p>
                                                <p className="text-gray-400 font-mono text-xs mt-0.5">{certificate.serial_number}</p>
                                            </div>
                                            <Hash className="text-gray-700 group-hover:text-gray-500 transition-colors" size={16} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Download Button */}
                            {certificate.pdf_url && (
                                <a
                                    href={certificate.pdf_url}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center justify-center gap-3 w-full py-3.5 bg-white text-black rounded-xl font-bold hover:bg-gray-100 hover:scale-[1.02] transition-all active:scale-[0.98] shadow-lg shadow-white/5"
                                >
                                    <Download size={18} className="group-hover:animate-bounce" />
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
                        <div className="lg:col-span-2 h-full">
                            {certificate.pdf_url ? (
                                <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-2 h-full shadow-2xl relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                    {/* Mobile View */}
                                    <div className="md:hidden flex flex-col items-center justify-center p-8 text-center bg-gray-900 rounded-xl m-1 border border-gray-800 min-h-[300px]">
                                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                            <Award className="text-white" size={32} />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">Certificate Available</h3>
                                        <p className="text-sm text-gray-400 mb-8 max-w-[240px]">
                                            Your official completion certificate is ready for viewing.
                                        </p>
                                        <a
                                            href={certificate.pdf_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all"
                                        >
                                            <ExternalLink size={18} />
                                            Open PDF Document
                                        </a>
                                    </div>

                                    {/* Desktop Viewer */}
                                    <div className="hidden md:block rounded-xl overflow-hidden h-full bg-gray-800 relative">
                                        <iframe
                                            src={`${certificate.pdf_url}#toolbar=0`}
                                            className="w-full h-full min-h-[600px] border-0"
                                            title="Certificate PDF"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 bg-gray-900/30 rounded-2xl border border-gray-800 text-center backdrop-blur-sm">
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-6 relative z-10">
                                            <div className="animate-spin w-8 h-8 border-2 border-gray-600 border-t-white rounded-full" />
                                        </div>
                                        <div className="absolute top-0 left-0 w-full h-full bg-blue-500/20 blur-xl rounded-full animate-pulse" />
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2">Processing Document</h3>
                                    <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
                                        The secure certificate document is being finalized by our system.
                                        <br />This enhances security and ensures authenticity.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Lock size={12} className="text-green-500" />
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                                Secured by Rycene Blockchain Technology
                            </p>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-1 bg-gray-900 rounded-lg text-[10px] font-mono border border-gray-800 text-gray-500">
                            <span>TOKEN ID:</span>
                            <span className="text-gray-300">{certificate.id}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
