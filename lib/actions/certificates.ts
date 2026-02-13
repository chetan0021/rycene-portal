"use server";
// Trigger Vercel build


import { createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { render } from "@react-email/components";
import CertificateEmail from "@/lib/email/templates";
import { sendGmail } from "@/lib/email/gmail";

export async function addStudent(formData: FormData) {
    try {
        const supabase = createServerClient();

        // Generate Serial Number automatically: RYC-YYYYMMDD-XXXX
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
        const autoSerialNumber = `RYC-${year}${month}${day}-${randomSuffix}`;

        const studentData = {
            serial_number: (formData.get("serial_number") as string) || autoSerialNumber,
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
        // Use admin client if available to ensure we can delete, otherwise fallback
        const adminSupabase = createAdminClient();
        const supabase = adminSupabase || createServerClient();

        if (!adminSupabase) {
            console.warn("Using regular client for delete - operation may fail if RLS is strict (missing Service Role Key)");
        }

        // 1. Get the certificate to find the PDF path
        const { data: cert } = await supabase
            .from("certificates")
            .select("pdf_url")
            .eq("id", id)
            .single();

        // 2. Delete PDF from storage if it exists
        if (cert?.pdf_url) {
            const filePath = cert.pdf_url.split("/").pop(); // safety check
            if (filePath) {
                await supabase.storage.from("certificates").remove([filePath]);
            }
        }

        // 3. Delete record from database
        const { error } = await supabase
            .from("certificates")
            .delete()
            .eq("id", id);

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

        // 1. Fetch certificate details
        const { data: certificate, error: fetchError } = await supabase
            .from("certificates")
            .select("*")
            .eq("id", certificateId)
            .single();

        if (fetchError || !certificate) {
            return { success: false, error: "Certificate not found" };
        }

        if (!certificate.pdf_url) {
            return { success: false, error: "Upload PDF before sending email" };
        }

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://rycene-portal.vercel.app';
        const verificationUrl = `${baseUrl}/v/${certificate.id}`;

        // 2. Render email template
        const emailHtml = await render(
            CertificateEmail({
                studentName: certificate.student_name,
                courseName: certificate.course_name,
                verificationUrl: verificationUrl,
                duration: certificate.duration,
                serialNumber: certificate.serial_number,
            })
        );

        // 3. Send email using Gmail SMTP
        // Note: Gmail blocks data URLs (base64) for security, so we don't attach QR code.
        // We link to the verification page instead.

        await sendGmail({
            to: certificate.student_email,
            subject: `Your Certificate: ${certificate.course_name}`,
            html: emailHtml,
        });

        // 4. Update is_mailed status
        // Use admin client for update to ensure RLS doesn't block
        const adminSupabase = createAdminClient();
        const updateClient = adminSupabase || supabase;

        const { error: updateError } = await updateClient
            .from("certificates")
            .update({ is_mailed: true })
            .eq("id", certificateId);

        if (updateError) {
            console.error("Failed to update mail status:", updateError);
            // We don't fail the whole request since email was sent
        }

        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Email sending error:", error);
        return { success: false, error: "Failed to send email" };
    }
}

export async function uploadCertificatePDF(formData: FormData) {
    try {
        // Use admin client if available to ensure we can update DB, otherwise fallback
        const adminSupabase = createAdminClient();
        const supabase = adminSupabase || createServerClient();

        if (!adminSupabase) {
            console.warn("Using regular client for upload - operation may fail if RLS is strict (missing Service Role Key)");
        }

        const uuid = formData.get("uuid") as string;
        const file = formData.get("file") as File;

        if (!file || !uuid) {
            return { success: false, error: "Missing file or certificate ID" };
        }

        console.log(`Uploading PDF for ${uuid}...`);

        // Upload file to storage
        const fileName = `${uuid}-certificate.pdf`;
        const { error: uploadError } = await supabase.storage
            .from("certificates")
            .upload(fileName, file, {
                cacheControl: "3600",
                upsert: true,
            });

        if (uploadError) {
            console.error("Storage upload failed:", uploadError);
            return { success: false, error: uploadError.message };
        }

        console.log("Storage upload successful. Updating database...");

        // Update database record with the storage path (fileName)
        const { error: updateError } = await supabase
            .from("certificates")
            .update({ pdf_url: fileName })
            .eq("id", uuid);

        if (updateError) {
            console.error("Database update failed:", updateError);
            return { success: false, error: updateError.message };
        }

        console.log("Database updated successfully.");

        revalidatePath("/admin");
        revalidatePath(`/v/${uuid}`);
        return { success: true };
    } catch (error) {
        console.error("Upload handler error:", error);
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
        if (data.pdf_url && !data.pdf_url.startsWith("http")) {
            const filePath = data.pdf_url; // It stores the filename now

            const { data: signedData } = await supabase
                .storage
                .from("certificates")
                .createSignedUrl(filePath, 3600); // 1 hour expiry

            if (signedData?.signedUrl) {
                data.pdf_url = signedData.signedUrl;
            } else {
                console.warn("Failed to sign URL for:", filePath);
            }
        }

        return data;
    } catch {
        return null;
    }
}
