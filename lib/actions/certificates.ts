"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addStudent(formData: FormData) {
    try {
        const supabase = createServerClient();

        // Get count of existing certificates to generate serial number
        const { count } = await supabase
            .from("certificates")
            .select("*", { count: "exact", head: true });

        const serialNumber = `RYC-${new Date().getFullYear()}-${String((count || 0) + 1).padStart(3, "0")}`;

        const studentData = {
            serial_number: serialNumber,
            student_name: formData.get("student_name") as string,
            student_email: formData.get("student_email") as string,
            course_name: formData.get("course_name") as string,
            duration: formData.get("duration") as string,
        };

        const { data, error } = await supabase
            .from("certificates")
            .insert([studentData])
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath("/admin");
        return { success: true, data };
    } catch {
        return { success: false, error: "Failed to add student" };
    }
}

export async function getCertificates(query?: string) {
    try {
        const supabase = createServerClient();

        let queryBuilder = supabase
            .from("certificates")
            .select("*")
            .order("created_at", { ascending: false });

        if (query) {
            queryBuilder = queryBuilder.or(
                `student_name.ilike.%${query}%,serial_number.ilike.%${query}%`
            );
        }

        const { data, error } = await queryBuilder;

        if (error) {
            throw error;
        }

        return data;
    } catch {
        console.error("Error fetching certificates: An unknown error occurred");
        return [];
    }
}

export async function deleteCertificate(id: string) {
    try {
        const supabase = createServerClient();

        // 1. Get the certificate to find the PDF path
        const { data: cert } = await supabase
            .from("certificates")
            .select("pdf_url")
            .eq("id", id)
            .single();

        // 2. Delete PDF from storage if it exists
        if (cert?.pdf_url) {
            // Check if pdf_url is a path (e.g. contains uuid) or full URL.
            // Our logic uses filename as path.
            const filePath = cert.pdf_url.split("/").pop(); // safety check
            if (filePath) {
                await supabase.storage.from("certificates").remove([filePath]);
            }
        }

        // 3. Delete record
        const { error } = await supabase.from("certificates").delete().eq("id", id);

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath("/admin");
        return { success: true };
    } catch {
        return { success: false, error: "Failed to delete certificate" };
    }
}

export async function sendCertificateEmail(certificateId: string) {
    try {
        const supabase = createServerClient();
        const { render } = await import('@react-email/components');
        const { gmailTransporter, FROM_EMAIL } = await import('@/lib/email/gmail');
        const { CertificateEmail } = await import('@/lib/email/templates');

        // Get certificate data
        const { data: certificate, error: fetchError } = await supabase
            .from("certificates")
            .select("*")
            .eq("id", certificateId)
            .single();

        if (fetchError || !certificate) {
            return { success: false, error: "Certificate not found" };
        }

        // Generate verification URL
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const verificationUrl = `${baseUrl}/v/${certificate.id}`;

        // Render email HTML
        const emailHtml = await render(
            CertificateEmail({
                studentName: certificate.student_name,
                courseName: certificate.course_name,
                duration: certificate.duration,
                serialNumber: certificate.serial_number,
                verificationUrl,
            })
        );

        // Send email via Gmail SMTP
        await gmailTransporter.sendMail({
            from: `"Rycene VLSI Technologies" <${FROM_EMAIL}>`,
            to: certificate.student_email,
            subject: `🎓 Your Certificate from Rycene VLSI Technologies - ${certificate.course_name}`,
            html: emailHtml,
        });

        // Update is_mailed flag
        const { error: updateError } = await supabase
            .from("certificates")
            .update({ is_mailed: true })
            .eq("id", certificateId);

        if (updateError) {
            return { success: false, error: "Email sent but failed to update status" };
        }

        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to send email" };
    }
}

export async function uploadCertificatePDF(formData: FormData) {
    try {
        const supabase = createServerClient();

        const uuid = formData.get("uuid") as string;
        const file = formData.get("file") as File;

        if (!file || !uuid) {
            return { success: false, error: "Missing file or certificate ID" };
        }

        // Upload file to storage
        const fileName = `${uuid}-certificate.pdf`;
        const { error: uploadError } = await supabase.storage
            .from("certificates")
            .upload(fileName, file, {
                cacheControl: "3600",
                upsert: true,
            });

        if (uploadError) {
            return { success: false, error: uploadError.message };
        }

        // Update database record with the storage path (fileName)
        // We act as if pdf_url stores the path now, or just a flag.
        // For consistency with specific request "instead of storing a public link":
        const { error: updateError } = await supabase
            .from("certificates")
            .update({ pdf_url: fileName })
            .eq("id", uuid);

        if (updateError) {
            return { success: false, error: updateError.message };
        }

        revalidatePath("/admin");
        revalidatePath(`/v/${uuid}`);
        return { success: true };
    } catch {
        return { success: false, error: "Failed to upload PDF" };
    }
}

export async function getCertificateByUUID(uuid: string) {
    try {
        const supabase = createServerClient();

        const { data, error } = await supabase
            .from("certificates")
            .select("*")
            .eq("id", uuid)
            .single();

        if (error || !data) {
            return null;
        }

        // Transform the stored pdf_url (which might be a path or url) into a signed URL
        // If data.pdf_url looks like a filename (doesn't start with http), generate signed url
        // If it is a public URL (legacy), we might want to keep it or force signed if the bucket is private.
        // Assuming we want to enforce signed URLs for all:

        if (data.pdf_url) {
            // The file path is standard `${uuid}-certificate.pdf`
            const filePath = `${uuid}-certificate.pdf`;

            const { data: signedData } = await supabase
                .storage
                .from("certificates")
                .createSignedUrl(filePath, 3600); // 1 hour expiry

            if (signedData?.signedUrl) {
                data.pdf_url = signedData.signedUrl;
            }
        }

        return data;
    } catch {
        return null;
    }
}
