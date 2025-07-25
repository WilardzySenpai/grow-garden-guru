-- Create bug_reports table
CREATE TABLE bug_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL, -- Changed from UUID to TEXT to support guest IDs
    message TEXT NOT NULL,
    image_url TEXT,
    external_image_url TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'done')),
    is_guest BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE bug_reports ENABLE ROW LEVEL SECURITY;

-- Bug Reports Policies
-- Allow anyone to create bug reports
CREATE POLICY "Anyone can create bug reports"
ON bug_reports FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Authenticated users can view their own reports
CREATE POLICY "Users can view their own bug reports"
ON bug_reports FOR SELECT
TO authenticated
USING (auth.uid()::text = user_id);

-- Admin can view all bug reports
CREATE POLICY "Admins can view all bug reports"
ON bug_reports FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.role = 'admin'
    )
);

-- Admin can update bug reports
CREATE POLICY "Admins can update bug reports"
ON bug_reports FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.role = 'admin'
    )
);

-- Storage Policies
-- Allow anyone to upload to bug-reports bucket
CREATE POLICY "Anyone can upload to bug-reports bucket"
ON storage.objects FOR INSERT 
TO anon, authenticated
WITH CHECK (bucket_id = 'bug-reports');

-- Allow anyone to view files in bug-reports bucket
CREATE POLICY "Anyone can view bug-reports files"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'bug-reports');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    