# Rycene Credential Management System - Implementation Plan

A robust internal admin dashboard for managing student credentials and a public-facing certificate verification system.

## User Review Required

> [!IMPORTANT]
> **Supabase Project Setup Required**
> You will need to create a Supabase project and provide the following credentials:
> - `NEXT_PUBLIC_SUPABASE_URL`
> - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
> 
> These will be added to `.env.local` after project initialization.

> [!WARNING]
> **Security Consideration**
> The `/admin` route will be accessible to anyone in this skeleton phase. In Phase 2, you should implement authentication (Supabase Auth or similar) to protect this route.

## Proposed Changes

### Project Initialization

#### [NEW] Next.js Project Structure
Initialize a new Next.js 14+ project with App Router in the `rycene-portal` directory with the following structure:

```
rycene-portal/
├── app/
│   ├── admin/
│   │   └── page.tsx          # Admin dashboard
│   ├── v/
│   │   └── [id]/
│   │       └── page.tsx      # Public verification page
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home/redirect page
├── components/
│   ├── admin/
│   │   ├── AddStudentForm.tsx
│   │   ├── CertificateTable.tsx
│   │   └── TableActions.tsx
│   └── ui/
│       └── (shadcn components if needed)
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Browser client
│   │   └── server.ts         # Server client
│   └── utils.ts
├── public/
├── .env.local
├── .env.example
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

### Database & Storage Configuration

#### [NEW] Supabase Schema SQL
Create a SQL migration file that defines the `certificates` table with proper types and constraints:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create certificates table
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  serial_number TEXT UNIQUE NOT NULL,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  course_name TEXT NOT NULL,
  duration TEXT NOT NULL,
  pdf_url TEXT,
  is_mailed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create storage bucket for PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true);

-- RLS Policies for public read access to verification page
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON certificates FOR SELECT
  USING (true);

CREATE POLICY "Allow public storage read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'certificates');
```

#### [NEW] [lib/supabase/client.ts](file:///c:/Users/R&D%20Chetan%20V/Documents/rycene-portal/lib/supabase/client.ts)
Browser-side Supabase client for client components

#### [NEW] [lib/supabase/server.ts](file:///c:/Users/R&D%20Chetan%20V/Documents/rycene-portal/lib/supabase/server.ts)
Server-side Supabase client for server components and actions

---

### Admin Dashboard (`/admin`)

#### [NEW] [app/admin/page.tsx](file:///c:/Users/R&D%20Chetan%20V/Documents/rycene-portal/app/admin/page.tsx)
Main admin dashboard page featuring:
- Server-side data fetching for all certificates
- Integration of AddStudentForm and CertificateTable components
- Server actions for CRUD operations

#### [NEW] [components/admin/AddStudentForm.tsx](file:///c:/Users/R&D%20Chetan%20V/Documents/rycene-portal/components/admin/AddStudentForm.tsx)
Client component with:
- Form fields for all certificate data (serial_number, student_name, student_email, course_name, duration)
- Form validation
- Submit handler calling server action

#### [NEW] [components/admin/CertificateTable.tsx](file:///c:/Users/R&D%20Chetan%20V/Documents/rycene-portal/components/admin/CertificateTable.tsx)
Data table displaying all certificates with columns:
- Serial Number
- Student Name
- Email
- Course
- Duration
- PDF Status
- Mail Status
- Actions (Generate QR, Upload PDF, Send Mail)

#### [NEW] [components/admin/TableActions.tsx](file:///c:/Users/R&D%20Chetan%20V/Documents/rycene-portal/components/admin/TableActions.tsx)
Action buttons component with:
- **Generate QR**: Uses `qrcode.react` to generate QR code pointing to `/v/[uuid]`, displays in modal/download
- **Upload PDF**: File input (accept=".pdf"), uploads to Supabase Storage, updates `pdf_url` in database
- **Send Mail**: Placeholder button that logs student ID to console

---

### Public Verification Page (`/v/[id]`)

#### [NEW] [app/v/[id]/page.tsx](file:///c:/Users/R&D%20Chetan%20V/Documents/rycene-portal/app/v/%5Bid%5D/page.tsx)
Dynamic route with:
- Server-side data fetching using UUID from params
- **Dynamic metadata generation** with Open Graph tags for social sharing
- PDF viewer using `<iframe>` element
- Download button linking to `pdf_url`
- Professional layout with student details
- Error handling for invalid/missing certificates
- **Complete isolation**: No navigation elements, no links to `/admin`

**Social Sharing Features**:
- Open Graph meta tags (og:title, og:description, og:image, og:url)
- Twitter Card meta tags
- Dynamic title/description based on student data
- Rich preview when shared on LinkedIn/Twitter

---

### Supporting Files

#### [NEW] [.env.example](file:///c:/Users/R&D%20Chetan%20V/Documents/rycene-portal/.env.example)
Template for environment variables

#### [NEW] [lib/utils.ts](file:///c:/Users/R&D%20Chetan%20V/Documents/rycene-portal/lib/utils.ts)
Utility functions for className merging (cn helper)

#### [NEW] [lib/actions/certificates.ts](file:///c:/Users/R&D%20Chetan%20V/Documents/rycene-portal/lib/actions/certificates.ts)
Server actions for CRUD operations (addStudent, uploadPDF, etc.)

#### [NEW] [app/layout.tsx](file:///c:/Users/R&D%20Chetan%20V/Documents/rycene-portal/app/layout.tsx)
Root layout with Tailwind CSS and metadata

#### [NEW] [app/page.tsx](file:///c:/Users/R&D%20Chetan%20V/Documents/rycene-portal/app/page.tsx)
Home page with navigation to admin dashboard

#### [NEW] [app/globals.css](file:///c:/Users/R&D%20Chetan%20V/Documents/rycene-portal/app/globals.css)
Tailwind directives and global styles

#### [NEW] [public/og-image.png](file:///c:/Users/R&D%20Chetan%20V/Documents/rycene-portal/public/og-image.png)
Default Open Graph image for social sharing

#### [NEW] [README.md](file:///c:/Users/R&D%20Chetan%20V/Documents/rycene-portal/README.md)
Setup and deployment instructions

---

## Verification Plan

### Automated Tests
No automated tests in this skeleton phase. Testing will be manual.

### Manual Verification

#### 1. Project Setup Verification
```bash
cd "c:\Users\R&D Chetan V\Documents\rycene-portal"
npm install
npm run dev
```
- Verify the dev server starts on `http://localhost:3000`
- Check that no build errors occur

#### 2. Supabase Configuration
- Navigate to your Supabase project dashboard
- Run the SQL migration script in the SQL Editor
- Verify the `certificates` table exists with correct schema
- Verify the `certificates` storage bucket is created and set to public
- Add Supabase credentials to `.env.local`

#### 3. Admin Dashboard Testing (`http://localhost:3000/admin`)
- **Add Student Form**:
  - Fill in all fields (serial number, name, email, course, duration)
  - Submit the form
  - Verify the new record appears in the table below
  - Check Supabase dashboard to confirm the row was inserted

- **Data Table**:
  - Verify all existing certificates are displayed
  - Check that columns show correct data

- **Generate QR Code**:
  - Click "Generate QR" on any row
  - Verify a QR code is generated/displayed
  - Download the QR code image
  - Scan the QR code with a phone to verify it points to `/v/[uuid]`

- **Upload PDF**:
  - Click "Upload PDF" on a row
  - Select a PDF file
  - Verify the upload completes
  - Check that `pdf_url` is updated in the table
  - Verify the PDF appears in Supabase Storage bucket

- **Send Mail**:
  - Click "Send Mail" on a row
  - Open browser console
  - Verify the student ID is logged

#### 4. Public Verification Page Testing (`http://localhost:3000/v/[uuid]`)
- Copy a UUID from the admin table
- Navigate to `http://localhost:3000/v/[uuid]`
- Verify the student's certificate details are displayed
- Verify the PDF is shown in an iframe (if uploaded)
- Click the "Download" button and verify the PDF downloads
- **Security Check**: Inspect the page source and verify there are NO links or navigation elements pointing to `/admin`
- Test with an invalid UUID and verify appropriate error handling

#### 5. Social Sharing Testing
- From the `/v/[id]` page, copy the URL
- Use a social media preview tool (e.g., https://www.opengraph.xyz/ or LinkedIn post composer)
- Paste the URL and verify:
  - Title shows: "Certificate - [Student Name] - [Course]"
  - Description shows course and duration
  - Image shows the default OG image
- Test on actual LinkedIn/Twitter by creating a post (optional)

#### 6. Isolation Testing
- From the `/v/[id]` page, attempt to navigate to `/admin` manually
- Verify there are no UI elements that allow navigation back to admin
- Verify the public page only shows certificate data, nothing else

---

## Dependencies to Install

```json
{
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.39.0",
    "lucide-react": "^0.316.0",
    "qrcode.react": "^3.1.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.11.5",
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.33",
    "autoprefixer": "^10.4.17"
  }
}
```
```
