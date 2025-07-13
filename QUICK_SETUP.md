# Quick Setup Guide - Issue Reporting System

## The Error You're Seeing

The error "Failed to submit issue report" is most likely because the `issue_reports` table doesn't exist in your Supabase database yet.

## Step 1: Create the Database Table

1. Go to your **Supabase Dashboard** (https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor** in the left sidebar
4. Click **"New Query"**
5. Copy and paste this SQL code:

```sql
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
```

6. Click **"Run"** to execute the SQL

## Step 2: Create Storage Bucket (Optional - for screenshots)

If you want screenshot upload functionality, run this additional SQL:

```sql
-- Create storage bucket for issue screenshots
INSERT INTO storage.buckets (id, name, public) VALUES ('issue-screenshots', 'issue-screenshots', true);

-- Create storage policies
CREATE POLICY "Users can upload issue screenshots" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'issue-screenshots' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view issue screenshots" ON storage.objects
    FOR SELECT USING (bucket_id = 'issue-screenshots');
```

## Step 3: Test the System

1. Go back to your HallEase app
2. Navigate to "Report an Issue"
3. Click the **"Test Database Connection"** button (I added this for debugging)
4. If it shows "Database connection successful!", try submitting an issue

## Step 4: Remove Debug Code (Later)

Once everything is working, you can remove the debug section from the report issue page.

## Common Issues

### If you get "table not found" error:

- Make sure you ran the SQL in Step 1
- Check that the table was created in Supabase → Table Editor

### If you get "authentication required" error:

- Make sure you're logged in to your app
- Check your Supabase environment variables

### If you get "profiles table" error:

- Make sure your `profiles` table exists and has the correct structure
- Check that the current user has a profile record

## Environment Variables (Optional)

Add these to your `.env.local` for admin notifications:

```env
# Admin emails for issue notifications (comma-separated)
ADMIN_NOTIFICATION_EMAILS=admin@yourdomain.com,support@yourdomain.com

# Your app URL
NEXT_PUBLIC_BASE_URL=https://hallease.zaploq.com
```

## Next Steps After Setup

1. Test submitting an issue
2. Check that it appears in Supabase → Table Editor → issue_reports
3. Add the admin dashboard to your menu: `/admin/issues`
4. Remove the debug code when everything works
