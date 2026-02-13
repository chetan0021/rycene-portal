import nodemailer from 'nodemailer';

// Create Gmail transporter
export const gmailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export const FROM_EMAIL = process.env.GMAIL_USER || 'noreply@example.com';

interface SendGmailProps {
    to: string;
    subject: string;
    html: string;
    attachments?: {
        filename: string;
        path?: string;
        content?: string | Buffer;
    }[];
}

export async function sendGmail({ to, subject, html, attachments }: SendGmailProps) {
    try {
        const info = await gmailTransporter.sendMail({
            from: `"Rycene Admin" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            html,
            attachments,
        });

        console.log("Message sent: %s", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}
