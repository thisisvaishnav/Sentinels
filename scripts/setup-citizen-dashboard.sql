-- Setup tables for Citizen Dashboard
-- Run this in the Supabase SQL Editor

-- 1. GOVERNMENT SCHEMES TABLE (Shown to all citizens)
CREATE TABLE IF NOT EXISTS public.schemes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    details TEXT NOT NULL,
    eligibility_criteria TEXT NOT NULL,
    benefit_amount TEXT,
    category TEXT NOT NULL, -- e.g., 'Housing', 'Health', 'Education', 'Utility', 'Financial'
    status TEXT NOT NULL DEFAULT 'Active', -- 'Active', 'Closing Soon', 'Closed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index on category for filtering schemes quickly
CREATE INDEX IF NOT EXISTS idx_schemes_category ON public.schemes(category);
-- Index on status to easily filter active schemes
CREATE INDEX IF NOT EXISTS idx_schemes_status ON public.schemes(status);

-- 2. CITIZEN SCHEME APPLICATIONS TABLE (Relates citizen to schemes)
CREATE TABLE IF NOT EXISTS public.citizen_scheme_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id UUID NOT NULL REFERENCES public.citizen_profiles(id) ON DELETE CASCADE,
    scheme_id UUID NOT NULL REFERENCES public.schemes(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'Applied', -- 'Applied', 'Under Verification', 'Approved', 'Rejected'
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_citizen_scheme UNIQUE (citizen_id, scheme_id)
);

-- Indexes for performance on joins
CREATE INDEX IF NOT EXISTS idx_scheme_apps_citizen_id ON public.citizen_scheme_applications(citizen_id);
CREATE INDEX IF NOT EXISTS idx_scheme_apps_scheme_id ON public.citizen_scheme_applications(scheme_id);

-- 3. SUPPORT TICKETS TABLE (Citizen support requests)
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id UUID NOT NULL REFERENCES public.citizen_profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL, -- e.g., 'Household Registration', 'Scheme Inquiry', 'Technical Support', 'Other'
    priority TEXT NOT NULL DEFAULT 'Medium', -- 'Low', 'Medium', 'High'
    status TEXT NOT NULL DEFAULT 'Open', -- 'Open', 'In Progress', 'Resolved', 'Closed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for searching support tickets by citizen
CREATE INDEX IF NOT EXISTS idx_support_tickets_citizen_id ON public.support_tickets(citizen_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);

-- Enable Row Level Security (RLS) on new tables
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citizen_scheme_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Setup RLS Policies for mobile client (when accessing Supabase directly with Anon key)
-- Since we also have an Express API running on Service Role that bypasses RLS, these policies 
-- ensure secure and direct mobile reads are allowed if needed.

-- Schemes Policies
CREATE POLICY "Allow read access to schemes for all authenticated users" 
ON public.schemes FOR SELECT TO authenticated USING (true);

-- Applications Policies
CREATE POLICY "Allow citizens to read their own scheme applications" 
ON public.citizen_scheme_applications FOR SELECT TO authenticated 
USING (citizen_id = auth.uid());

CREATE POLICY "Allow citizens to submit their own scheme applications" 
ON public.citizen_scheme_applications FOR INSERT TO authenticated 
WITH CHECK (citizen_id = auth.uid());

-- Support Tickets Policies
CREATE POLICY "Allow citizens to read their own support tickets" 
ON public.support_tickets FOR SELECT TO authenticated 
USING (citizen_id = auth.uid());

CREATE POLICY "Allow citizens to submit their own support tickets" 
ON public.support_tickets FOR INSERT TO authenticated 
WITH CHECK (citizen_id = auth.uid());

-- 4. INSERT REALISTIC SEED DATA FOR SCHEMES
INSERT INTO public.schemes (title, description, details, eligibility_criteria, benefit_amount, category, status)
VALUES
(
    'Pradhan Mantri Awas Yojana (PMAY)',
    'Affordable housing initiative for lower-income and middle-income groups in urban and rural areas.',
    'Provides interest subsidies on home loans and direct financial assistance of up to ₹2.5 Lakhs for construction of houses to eligible beneficiaries.',
    '1. Household income must be below ₹18 Lakhs per annum.\n2. Must not own any pucca house anywhere in India.\n3. The house must be co-owned by a female head of the family.',
    'Up to ₹2,50,000 subsidy',
    'Housing',
    'Active'
),
(
    'Ayushman Bharat (PM-JAY)',
    'National health insurance scheme providing free health cover to weak and low-income citizens.',
    'Provides cashless health cover of up to ₹5 Lakhs per family per year for secondary and tertiary care hospitalization across public and private empaneled hospitals.',
    '1. Families listed under the SECC database.\n2. Must belong to economically disadvantaged backgrounds.\n3. No members aged 16 to 59 in rural household.',
    '₹5,00,000 per year health cover',
    'Health',
    'Active'
),
(
    'Jal Jeevan Mission (Har Ghar Jal)',
    'Clean tap water connection for every rural and suburban household.',
    'Aims to provide safe and adequate drinking water through individual household tap connections by 2026 to all households in rural India.',
    '1. Must belong to an area with water scarcity or incomplete piped water.\n2. Citizen must possess a registered household profile.',
    'Free clean drinking tap water connection',
    'Utility',
    'Active'
),
(
    'PM Ujjwala Yojana',
    'Free LPG connection scheme for women belonging to below poverty line (BPL) households.',
    'Aims to provide clean cooking fuel (LPG) to women of underprivileged households to replace unhealthy traditional wood/coal fuels.',
    '1. Woman applicant above 18 years old.\n2. Must belong to a BPL household.\n3. No other LPG connection in the same household.',
    'Free LPG cylinder + regulator kit',
    'Utility',
    'Closing Soon'
),
(
    'PM Vidya Lakshmi Scheme',
    'Educational loan portal and scholarship program for financially weak students.',
    'Provides single-window electronic portal access for students to apply for educational loans and government scholarships, ensuring no student misses higher education due to financial crunch.',
    '1. Indian citizen seeking admission in higher education courses.\n2. Family income limit of ₹4.5 Lakhs for full interest subsidy.',
    'Up to ₹7,50,000 low-interest student loan with full subsidy',
    'Education',
    'Active'
)
ON CONFLICT DO NOTHING;
