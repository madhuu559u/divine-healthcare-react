-- =====================================================
-- FIX RLS POLICIES — Allow anon INSERT on public tables
-- Run this in Supabase SQL Editor after 001_initial_schema.sql
-- =====================================================

-- Drop existing policies that conflict
DROP POLICY IF EXISTS "applications_public_insert" ON public.applications;
DROP POLICY IF EXISTS "applications_admin_all" ON public.applications;
DROP POLICY IF EXISTS "documents_public_insert" ON public.documents;
DROP POLICY IF EXISTS "documents_admin_all" ON public.documents;
DROP POLICY IF EXISTS "referrals_public_insert" ON public.referrals;
DROP POLICY IF EXISTS "referrals_admin_all" ON public.referrals;
DROP POLICY IF EXISTS "contact_public_insert" ON public.contact_submissions;
DROP POLICY IF EXISTS "contact_admin_all" ON public.contact_submissions;
DROP POLICY IF EXISTS "jobs_public_read" ON public.jobs;
DROP POLICY IF EXISTS "jobs_admin_all" ON public.jobs;

-- JOBS: anon can read active; authenticated can do everything
CREATE POLICY "jobs_anon_select" ON public.jobs FOR SELECT USING (is_active = true);
CREATE POLICY "jobs_auth_select" ON public.jobs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "jobs_auth_insert" ON public.jobs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "jobs_auth_update" ON public.jobs FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "jobs_auth_delete" ON public.jobs FOR DELETE USING (auth.role() = 'authenticated');

-- APPLICATIONS: anon can INSERT; authenticated can SELECT, UPDATE, DELETE
CREATE POLICY "applications_anon_insert" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "applications_auth_select" ON public.applications FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "applications_auth_update" ON public.applications FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "applications_auth_delete" ON public.applications FOR DELETE USING (auth.role() = 'authenticated');

-- DOCUMENTS: anon can INSERT; authenticated can SELECT, UPDATE, DELETE
CREATE POLICY "documents_anon_insert" ON public.documents FOR INSERT WITH CHECK (true);
CREATE POLICY "documents_auth_select" ON public.documents FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "documents_auth_update" ON public.documents FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "documents_auth_delete" ON public.documents FOR DELETE USING (auth.role() = 'authenticated');

-- REFERRALS: anon can INSERT; authenticated can do everything
CREATE POLICY "referrals_anon_insert" ON public.referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "referrals_auth_select" ON public.referrals FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "referrals_auth_update" ON public.referrals FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "referrals_auth_delete" ON public.referrals FOR DELETE USING (auth.role() = 'authenticated');

-- CONTACT: anon can INSERT; authenticated can do everything
CREATE POLICY "contact_anon_insert" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "contact_auth_select" ON public.contact_submissions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "contact_auth_update" ON public.contact_submissions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "contact_auth_delete" ON public.contact_submissions FOR DELETE USING (auth.role() = 'authenticated');
