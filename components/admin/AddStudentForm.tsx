"use client";

import { addStudent } from "@/lib/actions/certificates";
import { useState, useRef } from "react";

export default function AddStudentForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        const formData = new FormData(e.currentTarget);
        const result = await addStudent(formData);

        if (result.success) {
            setMessage({ type: "success", text: "Student added successfully!" });
            formRef.current?.reset();
        } else {
            setMessage({ type: "error", text: result.error || "Failed to add student" });
        }

        setIsSubmitting(false);
    }

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-4">Add New Student</h2>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="serial_number" className="block text-sm font-semibold text-gray-700 mb-1">
                        Serial Number / Certificate ID
                    </label>
                    <input
                        type="text"
                        id="serial_number"
                        name="serial_number"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-mono"
                        placeholder="RYC-2024-001"
                    />
                </div>

                <div>
                    <label htmlFor="student_name" className="block text-sm font-semibold text-gray-700 mb-1">
                        Student Name
                    </label>
                    <input
                        type="text"
                        id="student_name"
                        name="student_name"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <label htmlFor="student_email" className="block text-sm font-semibold text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="student_email"
                        name="student_email"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="john@example.com"
                    />
                </div>

                <div>
                    <label htmlFor="course_name" className="block text-sm font-semibold text-gray-700 mb-1">
                        Course Name
                    </label>
                    <input
                        type="text"
                        id="course_name"
                        name="course_name"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Advanced VLSI Design"
                    />
                </div>

                <div>
                    <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 mb-1">
                        Duration
                    </label>
                    <input
                        type="text"
                        id="duration"
                        name="duration"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="6 Months"
                    />
                </div>

                {message && (
                    <div
                        className={`p-3 rounded-lg font-medium ${message.type === "success"
                            ? "bg-gray-100 text-black border border-gray-300"
                            : "bg-red-50 text-red-800 border border-red-200"
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                >
                    {isSubmitting ? "Adding..." : "Add Student"}
                </button>
            </form>
        </div>
    );
}
