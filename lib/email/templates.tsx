import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Img,
    Heading,
    Text,
    Button,
    Hr,
} from '@react-email/components';

interface CertificateEmailProps {
    studentName: string;
    courseName: string;
    duration: string;
    serialNumber: string;
    verificationUrl: string;
    qrCodeDataUrl: string;
}

export function CertificateEmail({
    studentName,
    courseName,
    duration,
    serialNumber,
    verificationUrl,
    qrCodeDataUrl,
}: CertificateEmailProps) {
    return (
        <Html>
            <Head />
            <Body style={main}>
                <Container style={container}>
                    {/* Header with Logo */}
                    <Section style={header}>
                        <Heading style={title}>🎓 Certificate Issued!</Heading>
                        <Text style={companyName}>Rycene VLSI Technologies</Text>
                    </Section>

                    {/* Main Content */}
                    <Section style={content}>
                        <Text style={greeting}>Dear {studentName},</Text>
                        <Text style={paragraph}>
                            Congratulations! Your certificate of completion has been successfully issued.
                        </Text>

                        {/* Certificate Details */}
                        <Section style={detailsBox}>
                            <Text style={detailLabel}>Course:</Text>
                            <Text style={detailValue}>{courseName}</Text>

                            <Text style={detailLabel}>Duration:</Text>
                            <Text style={detailValue}>{duration}</Text>

                            <Text style={detailLabel}>Serial Number:</Text>
                            <Text style={detailValueMono}>{serialNumber}</Text>
                        </Section>

                        <Text style={paragraph}>
                            Your certificate is now available for verification and download.
                        </Text>

                        {/* CTA Button */}
                        <Section style={buttonSection}>
                            <Button style={button} href={verificationUrl}>
                                View & Download Certificate
                            </Button>
                        </Section>

                        <Text style={linkText}>
                            Or copy this link: <a href={verificationUrl} style={link}>{verificationUrl}</a>
                        </Text>
                    </Section>

                    <Hr style={hr} />

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            © {new Date().getFullYear()} Rycene VLSI Technologies
                        </Text>
                        <Text style={footerText}>
                            This is an automated email. Please do not reply.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

// Styles
const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0',
    marginBottom: '64px',
    maxWidth: '600px',
};

const header = {
    padding: '40px 40px 20px',
    textAlign: 'center' as const,
    background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
    borderRadius: '12px 12px 0 0',
};

const title = {
    color: '#ffffff',
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '0 0 10px',
};

const companyName = {
    color: '#d1fae5',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0',
};

const content = {
    padding: '40px',
};

const greeting = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 20px',
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#4b5563',
    margin: '16px 0',
};

const detailsBox = {
    backgroundColor: '#f0fdf4',
    border: '2px solid #86efac',
    borderRadius: '12px',
    padding: '24px',
    margin: '24px 0',
};

const detailLabel = {
    fontSize: '12px',
    fontWeight: '700',
    color: '#047857',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    margin: '12px 0 4px',
};

const detailValue = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 8px',
};

const detailValueMono = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'monospace',
    margin: '0 0 8px',
};

const qrSection = {
    textAlign: 'center' as const,
    margin: '32px 0',
};

const qrLabel = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#047857',
    margin: '0 0 16px',
};

const qrCode = {
    margin: '0 auto',
    border: '4px solid #10b981',
    borderRadius: '12px',
};

const buttonSection = {
    textAlign: 'center' as const,
    margin: '32px 0',
};

const button = {
    backgroundColor: '#10b981',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '14px 32px',
};

const linkText = {
    fontSize: '14px',
    color: '#6b7280',
    textAlign: 'center' as const,
    margin: '16px 0',
};

const link = {
    color: '#10b981',
    textDecoration: 'underline',
};

const hr = {
    borderColor: '#e5e7eb',
    margin: '32px 0',
};

const footer = {
    textAlign: 'center' as const,
    padding: '0 40px 40px',
};

const footerText = {
    fontSize: '12px',
    color: '#9ca3af',
    margin: '4px 0',
};

export default CertificateEmail;
