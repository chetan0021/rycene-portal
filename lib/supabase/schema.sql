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

-- Create indexes for performance
CREATE INDEX idx_certificates_created_at ON certificates(created_at DESC);
CREATE INDEX idx_certificates_email ON certificates(student_email);

-- Enable Row Level Security
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Allow public read access for verification (Table Metadata only)
-- This allows the public /v/[id] page to fetch student names, etc.
-- The actual PDF file in Storage is protected by the Private Bucket setting.
CREATE POLICY "public_read_certificates"
ON certificates FOR SELECT
USING (true);

-- Allow INSERT for all users (admin will be authenticated later)
-- For now, allow inserts so the form works
CREATE POLICY "allow_insert_certificates"
ON certificates FOR INSERT
WITH CHECK (true);

-- Storage bucket setup (run this in Supabase Dashboard > Storage)
-- 1. Create a new bucket named "certificates"
-- 2. Set it to "Private bucket" (CRITICAL for security)
-- 3. The bucket will NOT have public read access. Access is via Signed URLs only.

