import TableActions from "./TableActions";
import { CheckCircle2, Clock, Mail, FileText } from "lucide-react";

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

export default function CertificateTable({ certificates }: { certificates: Certificate[] }) {
    if (certificates.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-gray-500 text-center">No certificates found. Add your first student above.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Serial #
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Student Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Course
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Duration
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                PDF Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {certificates.map((cert) => (
                            <tr key={cert.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {cert.serial_number}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                                    {cert.student_name}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                    {cert.student_email}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                    {cert.course_name}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                    {cert.duration}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                    {cert.pdf_url ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                                            <CheckCircle2 size={14} />
                                            Uploaded
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                                            <Clock size={14} />
                                            Pending
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                    {cert.is_mailed ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                                            <Mail size={14} />
                                            Sent
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                                            <Clock size={14} />
                                            Pending
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                    <TableActions certificate={cert} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
