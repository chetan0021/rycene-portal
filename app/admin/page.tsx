import { getCertificates } from "@/lib/actions/certificates";
import AddStudentForm from "@/components/admin/AddStudentForm";
import CertificateTable from "@/components/admin/CertificateTable";
import AdminHeader from "@/components/admin/AdminHeader";
import SearchInput from "@/components/admin/SearchInput";
import { Users, Award, BookOpen } from "lucide-react";

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

export default async function AdminPage({
    searchParams,
}: {
    searchParams?: {
        query?: string;
    };
}) {
    const query = searchParams?.query || "";
    const certificates = await getCertificates(query);
    const totalCertificates = certificates.length;
    const uniqueCourses = new Set(certificates.map((cert: Certificate) => cert.course_name)).size;

    // Calculate course breakdown
    const courseBreakdown = certificates.reduce((acc: Record<string, number>, cert: Certificate) => {
        acc[cert.course_name] = (acc[cert.course_name] || 0) + 1;
        return acc;
    }, {});

    const topCourses = Object.entries(courseBreakdown)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 5);

    return (
        <div className="min-h-screen bg-white">
            <AdminHeader />
            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="space-y-8">
                    {/* Page Title & Search */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-black tracking-tight">
                                Certificate Management
                            </h1>
                            <p className="text-gray-600 mt-1 font-medium">
                                Issue, search, and manage student credentials securely.
                            </p>
                        </div>
                        <div className="w-full md:w-auto">
                            <SearchInput />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-black p-6 rounded-xl border border-gray-800 flex items-center gap-5 transform hover:scale-105 transition-transform">
                            <div className="p-4 bg-gray-900 rounded-xl text-white">
                                <Award size={28} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Issued</p>
                                <p className="text-3xl font-black text-white">{totalCertificates}</p>
                            </div>
                        </div>
                        <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 flex items-center gap-5 transform hover:scale-105 transition-transform">
                            <div className="p-4 bg-gray-800 rounded-xl text-white">
                                <Users size={28} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Active Students</p>
                                <p className="text-3xl font-black text-white">{totalCertificates}</p>
                            </div>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-600 flex items-center gap-5 transform hover:scale-105 transition-transform">
                            <div className="p-4 bg-gray-700 rounded-xl text-white">
                                <BookOpen size={28} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-300 uppercase tracking-wider">Courses Offered</p>
                                <p className="text-3xl font-black text-white">{uniqueCourses}</p>
                            </div>
                        </div>
                    </div>

                    {/* Course Analytics */}
                    {topCourses.length > 0 && (
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-black rounded-lg">
                                    <BookOpen className="text-white" size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-black">Course Analytics</h2>
                            </div>
                            <div className="space-y-3">
                                {topCourses.map(([course, count]) => {
                                    const countNum = count as number;
                                    return (
                                        <div key={course} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                                            <span className="font-semibold text-black">{course}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-black h-2 rounded-full transition-all"
                                                        style={{ width: `${(countNum / totalCertificates) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full min-w-[3rem] text-center">
                                                    {countNum}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Content Sections */}
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                        <div className="xl:col-span-1">
                            <div className="sticky top-10 space-y-6">
                                <h2 className="text-xl font-bold text-black px-1">Issue Certificate</h2>
                                <AddStudentForm />
                            </div>
                        </div>
                        <div className="xl:col-span-3">
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                                    <h2 className="text-lg font-bold text-black">Certificate Directory</h2>
                                    <span className="text-xs font-bold text-gray-700 bg-gray-200 px-3 py-1.5 rounded-full">
                                        {totalCertificates} TOTAL
                                    </span>
                                </div>
                                <div className="p-0">
                                    <CertificateTable certificates={certificates} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
