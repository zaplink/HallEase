-- Issue Reports Table Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Create the issue_reports table
CREATE TABLE issue_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_type VARCHAR(50) NOT NULL CHECK (issue_type IN ('booking', 'technical', 'other')),
    title VARCHAR(255),
    description TEXT NOT NULL,
    screenshot_url TEXT,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_date DATE DEFAULT CURRENT_DATE,
    created_time TIME DEFAULT CURRENT_TIME,
    updated_date DATE,
    updated_time TIME,
    resolved_date DATE,
    resolved_time TIME,
    resolution_notes TEXT
);

-- Enable Row Level Security
ALTER TABLE issue_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own reports
CREATE POLICY "Users can view own reports" ON issue_reports
    FOR SELECT USING (auth.uid() = reporter_id);

-- Policy: Users can create reports
CREATE POLICY "Users can create reports" ON issue_reports
    FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Policy: Admins can view all reports
CREATE POLICY "Admins can view all reports" ON issue_reports
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('ADMIN', 'SYSTEM')
        )
    );

-- Create indexes for better performance
CREATE INDEX idx_issue_reports_reporter_id ON issue_reports(reporter_id);
CREATE INDEX idx_issue_reports_status ON issue_reports(status);
CREATE INDEX idx_issue_reports_created_date ON issue_reports(created_date);
CREATE INDEX idx_issue_reports_issue_type ON issue_reports(issue_type);

-- Create storage bucket for issue screenshots (run this separately)
INSERT INTO storage.buckets (id, name, public) VALUES ('issue-screenshots', 'issue-screenshots', true);

-- Create storage policies for issue screenshots
CREATE POLICY "Users can upload issue screenshots" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'issue-screenshots' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view issue screenshots" ON storage.objects
    FOR SELECT USING (bucket_id = 'issue-screenshots');

CREATE POLICY "Admins can delete issue screenshots" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'issue-screenshots' AND 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('ADMIN', 'SYSTEM')
        )
    );