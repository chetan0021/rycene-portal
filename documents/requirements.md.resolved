# Requirements Document
## Rycene Credential Management System

---

## 1. Functional Requirements

### FR-1: Student Record Management
- **FR-1.1**: Admin shall be able to add new student records with fields: Serial Number, Name, Email, Course, Duration
- **FR-1.2**: System shall generate a unique UUID for each student record upon creation
- **FR-1.3**: Serial Number must be unique across all records
- **FR-1.4**: Admin shall view all student records in a tabular format
- **FR-1.5**: System shall persist all records in Supabase Postgres database

### FR-2: QR Code Generation
- **FR-2.1**: Admin shall generate a QR code for any student record
- **FR-2.2**: QR code shall encode the URL: `https://[domain]/v/[uuid]`
- **FR-2.3**: Generated QR code shall be downloadable as an image file
- **FR-2.4**: QR code generation shall occur client-side using `qrcode.react`

### FR-3: Certificate PDF Management
- **FR-3.1**: Admin shall upload PDF certificates for student records
- **FR-3.2**: System shall only accept `.pdf` file format
- **FR-3.3**: PDF files shall be stored in Supabase Storage bucket named `certificates`
- **FR-3.4**: System shall update the `pdf_url` field in the database upon successful upload
- **FR-3.5**: System shall display PDF upload status in the admin table

### FR-4: Email Notification (Placeholder)
- **FR-4.1**: Admin shall trigger email sending via "Send Mail" button
- **FR-4.2**: System shall log the student ID to console (Phase 1 placeholder)
- **FR-4.3**: Future implementation shall send congratulatory email with verification link

### FR-5: Public Certificate Verification
- **FR-5.1**: Public users shall access certificates via `/v/[uuid]` URL
- **FR-5.2**: System shall fetch certificate data server-side using UUID from URL
- **FR-5.3**: System shall display student details: Name, Email, Course, Duration
- **FR-5.4**: System shall render PDF certificate in an embedded viewer (iframe)
- **FR-5.5**: Public users shall download the PDF certificate
- **FR-5.6**: System shall display appropriate error for invalid/missing UUIDs

### FR-6: Social Media Sharing
- **FR-6.1**: Verification page shall include Open Graph meta tags
- **FR-6.2**: Shared links on LinkedIn/Twitter shall display rich preview with:
  - Certificate title (Student Name + Course)
  - Description (Course duration and institution)
  - Rycene VLSI Technologies branding
- **FR-6.3**: Meta tags shall be generated server-side for SEO compatibility

---

## 2. Non-Functional Requirements

### NFR-1: Security
- **NFR-1.1**: Public verification page (`/v/[id]`) shall have NO navigation links to admin dashboard
- **NFR-1.2**: Database shall implement Row Level Security (RLS) for public read access
- **NFR-1.3**: Supabase Storage bucket shall be publicly readable for certificate PDFs
- **NFR-1.4**: Admin routes shall be unprotected in Phase 1 (authentication in Phase 2)

### NFR-2: Performance
- **NFR-2.1**: Certificate verification page shall load within 2 seconds on 3G connection
- **NFR-2.2**: PDF viewer shall support files up to 5MB
- **NFR-2.3**: Admin table shall efficiently display up to 1000 records

### NFR-3: Usability
- **NFR-3.1**: UI shall use Tailwind CSS for clean, functional styling
- **NFR-3.2**: Admin dashboard shall use Lucide-React icons for visual clarity
- **NFR-3.3**: Forms shall provide immediate validation feedback
- **NFR-3.4**: PDF viewer shall be responsive on mobile and desktop

### NFR-4: Maintainability
- **NFR-4.1**: Code shall follow Next.js 14+ App Router conventions
- **NFR-4.2**: Components shall be modular and reusable
- **NFR-4.3**: Environment variables shall be documented in `.env.example`
- **NFR-4.4**: Project shall include comprehensive README with setup instructions

### NFR-5: Compatibility
- **NFR-5.1**: Application shall run on Node.js 18+
- **NFR-5.2**: Application shall be compatible with modern browsers (Chrome, Firefox, Safari, Edge)
- **NFR-5.3**: QR codes shall be scannable by standard mobile QR readers

---

## 3. Data Requirements

### DR-1: Database Schema
**Table: `certificates`**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| `serial_number` | TEXT | UNIQUE, NOT NULL | Internal tracking number |
| `student_name` | TEXT | NOT NULL | Full name of student |
| `student_email` | TEXT | NOT NULL | Email address |
| `course_name` | TEXT | NOT NULL | Course/program name |
| `duration` | TEXT | NOT NULL | Course duration (e.g., "6 months") |
| `pdf_url` | TEXT | NULLABLE | Supabase Storage URL |
| `is_mailed` | BOOLEAN | DEFAULT false | Email sent status |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Record creation timestamp |

### DR-2: Storage Requirements
- **Bucket Name**: `certificates`
- **Access**: Public read
- **File Types**: PDF only
- **Naming Convention**: `[uuid]-certificate.pdf`

---

## 4. System Constraints

### SC-1: Technology Stack
- **Framework**: Next.js 14+ with App Router
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Styling**: Tailwind CSS
- **Icons**: Lucide-React
- **QR Library**: qrcode.react

### SC-2: Development Environment
- **Local Development**: `npm run dev` on localhost:3000
- **Package Manager**: npm
- **TypeScript**: Required for type safety

### SC-3: External Dependencies
- Supabase project with valid credentials
- Internet connection for Supabase API calls

---

## 5. Future Enhancements (Phase 2+)

- **Authentication**: Protect `/admin` route with Supabase Auth
- **Email Integration**: SMTP configuration for automated emails
- **Bulk Upload**: CSV import for multiple student records
- **Analytics**: Track certificate views and downloads
- **Certificate Templates**: Dynamic PDF generation with QR embedded
- **Search & Filter**: Advanced filtering in admin dashboard
- **Audit Logs**: Track all admin actions
