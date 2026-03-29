-- =====================================================
-- Divine Healthcare Services LLC — Full Database Schema
-- Run this against your Supabase project's SQL Editor
-- =====================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. JOBS TABLE — Admin posts jobs, applicants see them
-- =====================================================
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,                          -- e.g. "CNA"
  full_title TEXT NOT NULL,                     -- e.g. "Certified Nursing Assistant"
  category TEXT NOT NULL DEFAULT 'Nursing',     -- Nursing, Aide, Licensed Nurse
  description TEXT,
  requirements JSONB DEFAULT '[]'::jsonb,       -- array of strings
  responsibilities JSONB DEFAULT '[]'::jsonb,   -- array of strings
  types JSONB DEFAULT '["Full-Time"]'::jsonb,   -- FT/PT/PRN
  shifts JSONB DEFAULT '["Day"]'::jsonb,        -- Day/Evening/Night
  pay_range TEXT,
  location TEXT DEFAULT 'Woodbridge, VA',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. APPLICATIONS TABLE — Full 9-step application data
-- =====================================================
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reference_number TEXT UNIQUE NOT NULL,         -- DHH-XXXXXXXX
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','reviewing','interviewed','offered','hired','rejected','withdrawn')),

  -- Step 1: Personal Information (PDF Page 1)
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  preferred_name TEXT,
  ssn_last4 TEXT,                                -- Only last 4 for security
  date_of_birth DATE,
  street TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  gender TEXT,
  home_phone TEXT,
  cell_phone TEXT,
  email TEXT NOT NULL,
  is_over_18 TEXT,
  is_citizen TEXT,
  is_eligible TEXT,
  hear_about_us TEXT,

  -- Background check additional fields (PDF Page 6)
  former_names TEXT,
  drivers_license TEXT,
  drivers_license_state TEXT,
  race TEXT,
  residency_history JSONB DEFAULT '[]'::jsonb,  -- [{city, state, from, to}]

  -- Step 2: Employment Desired (PDF Page 1)
  position TEXT,
  start_date DATE,
  desired_pay TEXT,
  employment_type JSONB DEFAULT '[]'::jsonb,     -- ["Full-Time","Part-Time"]
  preferred_shift JSONB DEFAULT '[]'::jsonb,     -- ["Day","Evening"]
  previously_employed TEXT,
  previous_dates TEXT,

  -- Step 3: Employment History (PDF Page 2)
  employers JSONB DEFAULT '[]'::jsonb,           -- array of employer objects
  convicted TEXT,
  convicted_explanation TEXT,
  excluded_medicaid TEXT,
  excluded_explanation TEXT,
  disciplined TEXT,
  disciplined_explanation TEXT,

  -- Step 4: Education (PDF Page 1)
  education JSONB DEFAULT '[]'::jsonb,           -- array of education objects

  -- Step 5: Licenses & Skills (PDF Pages 1, 5)
  licenses JSONB DEFAULT '[]'::jsonb,            -- array of license objects
  skills_assessment JSONB DEFAULT '{}'::jsonb,   -- {skill: rating}

  -- Step 6: References (PDF Pages 3-4)
  references_data JSONB DEFAULT '[]'::jsonb,     -- array of reference objects

  -- Step 7: Documents — tracked in documents table

  -- Step 8: Agreements (PDF Pages 6, 12, 17-18, 19-23, 25)
  agreements JSONB DEFAULT '{}'::jsonb,          -- {key: bool, keySignature: text}

  -- Direct Deposit Info (PDF Page 7)
  direct_deposit JSONB DEFAULT '{}'::jsonb,      -- {bankName, accountType, routing, account}

  -- HBV Vaccine (PDF Page 9)
  hbv_vaccine_choice TEXT,

  -- Admin fields
  admin_notes TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,

  -- Reference check results (admin fills — PDF Pages 3-4 office staff section)
  reference_checks JSONB DEFAULT '[]'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. DOCUMENTS TABLE — File uploads linked to applications
-- =====================================================
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL,                        -- id, passport, ssn, nursing_license, etc.
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  storage_path TEXT NOT NULL,                    -- path in Supabase Storage
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. REFERRALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','reviewing','accepted','in_progress','completed','declined')),

  -- Referrer info
  referrer_name TEXT NOT NULL,
  referrer_org TEXT NOT NULL,
  referrer_title TEXT,
  referrer_phone TEXT NOT NULL,
  referrer_email TEXT NOT NULL,
  referrer_fax TEXT,

  -- Patient info
  patient_name TEXT NOT NULL,
  patient_dob DATE,
  patient_address TEXT,
  patient_phone TEXT,
  insurance_type TEXT,
  medicaid_id TEXT,

  -- Service details
  service_requested TEXT,
  start_date DATE,
  urgency TEXT DEFAULT 'routine',
  clinical_notes TEXT,
  preferred_schedule TEXT,

  -- Admin
  admin_notes TEXT,
  reviewed_by TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. CONTACT_SUBMISSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','read','replied','archived')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_email ON public.applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_created ON public.applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_ref ON public.applications(reference_number);
CREATE INDEX IF NOT EXISTS idx_jobs_active ON public.jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_documents_app ON public.documents(application_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.referrals(status);
CREATE INDEX IF NOT EXISTS idx_contact_status ON public.contact_submissions(status);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- JOBS: Anyone can read active jobs; authenticated users (admins) can do everything
CREATE POLICY "jobs_public_read" ON public.jobs FOR SELECT USING (is_active = true);
CREATE POLICY "jobs_admin_all" ON public.jobs FOR ALL USING (auth.role() = 'authenticated');

-- APPLICATIONS: Anyone can insert; authenticated users can read/update all
CREATE POLICY "applications_public_insert" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "applications_admin_all" ON public.applications FOR ALL USING (auth.role() = 'authenticated');

-- DOCUMENTS: Anyone can insert; authenticated users can read all
CREATE POLICY "documents_public_insert" ON public.documents FOR INSERT WITH CHECK (true);
CREATE POLICY "documents_admin_all" ON public.documents FOR ALL USING (auth.role() = 'authenticated');

-- REFERRALS: Anyone can insert; authenticated users can do everything
CREATE POLICY "referrals_public_insert" ON public.referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "referrals_admin_all" ON public.referrals FOR ALL USING (auth.role() = 'authenticated');

-- CONTACT: Anyone can insert; authenticated users can do everything
CREATE POLICY "contact_public_insert" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "contact_admin_all" ON public.contact_submissions FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- UPDATED_AT TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_referrals_updated_at BEFORE UPDATE ON public.referrals FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- SEED: Default job listings
-- =====================================================
INSERT INTO public.jobs (title, full_title, category, description, requirements, responsibilities, types, shifts) VALUES
('CNA', 'Certified Nursing Assistant', 'Nursing',
 'Provide direct patient care under the supervision of nursing staff, including assisting with daily living activities, monitoring vital signs, and ensuring patient comfort and safety.',
 '["Active CNA certification in Virginia","Current CPR and First Aid certification","Minimum 1 year experience in home health or long-term care","Valid driver''s license and reliable transportation","Ability to lift up to 50 lbs","Clear background check","TB test within the last year"]',
 '["Assist patients with activities of daily living","Monitor and record vital signs","Assist with mobility and transfers","Observe and report changes in patient condition","Maintain clean and safe patient environment","Follow individualized care plans","Document care provided accurately"]',
 '["Full-Time","Part-Time","PRN"]', '["Day","Evening","Night"]'),

('GNA', 'Geriatric Nursing Assistant', 'Nursing',
 'Specialize in providing compassionate care for elderly patients, addressing their unique physical, emotional, and social needs in the home setting.',
 '["Active GNA certification in Virginia","Current CPR and First Aid certification","Experience with geriatric patients preferred","Valid driver''s license and reliable transportation","Clear background check"]',
 '["Provide personal care to elderly patients","Assist with medication reminders","Monitor patient health and report changes","Provide companionship and emotional support","Assist with meal preparation and feeding","Document daily care activities"]',
 '["Full-Time","Part-Time"]', '["Day","Evening"]'),

('CMT', 'Certified Medication Technician', 'Nursing',
 'Administer medications to patients under the direction of a licensed nurse, ensuring safe and accurate medication delivery in home health settings.',
 '["Active CMT certification in Virginia","Current CPR and First Aid certification","Knowledge of medication administration protocols","Minimum 6 months healthcare experience","Valid driver''s license","Clear background check"]',
 '["Administer medications as directed","Monitor patients for side effects","Maintain accurate medication records","Report medication errors immediately","Ensure proper medication storage","Follow all medication safety protocols"]',
 '["Full-Time","Part-Time","PRN"]', '["Day","Evening","Night"]'),

('HHA', 'Home Health Aide', 'Aide',
 'Provide essential home care services including personal care, light housekeeping, and companionship to help clients maintain independence in their homes.',
 '["HHA certification or equivalent training","Current CPR certification","Compassionate and patient demeanor","Valid driver''s license","Clear background check"]',
 '["Assist with personal care and hygiene","Light housekeeping and laundry","Meal preparation and feeding assistance","Provide companionship","Accompany clients to appointments","Monitor client condition"]',
 '["Full-Time","Part-Time"]', '["Day","Evening"]'),

('PCA', 'Personal Care Aide', 'Aide',
 'Assist individuals with daily living activities, promoting independence and quality of life in the comfort of their own homes.',
 '["PCA certification in Virginia","Current CPR certification preferred","Genuine passion for helping others","Valid driver''s license","Clear background check"]',
 '["Assist with bathing, dressing, and grooming","Help with meal preparation","Light housekeeping duties","Provide companionship","Assist with errands and shopping","Medication reminders"]',
 '["Full-Time","Part-Time","PRN"]', '["Day","Evening","Night"]'),

('LPN', 'Licensed Practical Nurse', 'Licensed Nurse',
 'Provide skilled nursing care in home settings, including wound care, medication administration, and patient assessment under RN supervision.',
 '["Active LPN license in Virginia","Current CPR and First Aid certification","Minimum 1 year clinical experience","Home health experience preferred","Valid driver''s license","Clear background check"]',
 '["Administer medications and treatments","Perform wound care","Monitor patient vital signs","Coordinate care with RN supervisors","Educate patients and families","Maintain clinical documentation"]',
 '["Full-Time","Part-Time"]', '["Day","Evening"]'),

('RN', 'Registered Nurse', 'Licensed Nurse',
 'Lead patient care in home health settings, performing assessments, developing care plans, supervising other nursing staff, and ensuring quality care delivery.',
 '["Active RN license in Virginia","BSN preferred","Current CPR and First Aid certification","Minimum 2 years clinical experience","Home health experience strongly preferred","Valid driver''s license","Clear background check"]',
 '["Perform comprehensive patient assessments","Develop and update care plans","Supervise CNAs, GNAs, and LPNs","Administer complex medications","Coordinate with physicians","Ensure regulatory compliance","Maintain clinical documentation"]',
 '["Full-Time","Part-Time","PRN"]', '["Day","Evening","Night"]'),

('NP', 'Nurse Practitioner', 'Licensed Nurse',
 'Provide advanced nursing care including patient assessments, diagnostic evaluations, prescribing treatments, and overseeing care delivery in home health settings.',
 '["Active NP license in Virginia","Master''s degree in Nursing","National board certification","DEA registration","Minimum 3 years clinical experience","Valid driver''s license","Clear background check"]',
 '["Conduct comprehensive health assessments","Diagnose and treat conditions","Prescribe medications","Order and interpret diagnostic tests","Develop patient care plans","Collaborate with physicians","Mentor nursing staff"]',
 '["Full-Time"]', '["Day"]')

ON CONFLICT DO NOTHING;
