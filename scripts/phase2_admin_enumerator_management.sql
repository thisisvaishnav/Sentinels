-- ==============================================================================
-- PHASE 2A: ADMIN-CONTROLLED ENUMERATOR MANAGEMENT DATABASE FOUNDATION
-- Project: Lokvision (Sentinels)
-- Supabase Project Ref: fxpupzwwzzvqulddxbed
-- ==============================================================================

-- 1. EXTEND public.enumerator_profiles WITH MANAGEMENT & AUTHORIZATION FIELDS
ALTER TABLE public.enumerator_profiles
    ADD COLUMN IF NOT EXISTS full_name TEXT,
    ADD COLUMN IF NOT EXISTS mobile_number TEXT,
    ADD COLUMN IF NOT EXISTS email TEXT,
    ADD COLUMN IF NOT EXISTS department TEXT DEFAULT 'Municipal Census',
    ADD COLUMN IF NOT EXISTS district TEXT DEFAULT 'Varanasi',
    ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'Uttar Pradesh',
    ADD COLUMN IF NOT EXISTS address TEXT,
    ADD COLUMN IF NOT EXISTS joining_date DATE DEFAULT CURRENT_DATE,
    ADD COLUMN IF NOT EXISTS verification_status TEXT NOT NULL DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS authorized_by UUID REFERENCES public.profiles(id),
    ADD COLUMN IF NOT EXISTS authorized_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS authorization_notes TEXT;

-- Safely update status constraint on enumerator_profiles
ALTER TABLE public.enumerator_profiles 
    DROP CONSTRAINT IF EXISTS enumerator_profiles_status_check;

ALTER TABLE public.enumerator_profiles
    ADD CONSTRAINT enumerator_profiles_status_check 
    CHECK (status IN ('pending', 'active', 'suspended', 'rejected', 'inactive'));

-- Safely update verification_status constraint on enumerator_profiles
ALTER TABLE public.enumerator_profiles 
    DROP CONSTRAINT IF EXISTS enumerator_profiles_verification_status_check;

ALTER TABLE public.enumerator_profiles
    ADD CONSTRAINT enumerator_profiles_verification_status_check 
    CHECK (verification_status IN ('pending', 'verified', 'rejected'));


-- 2. CREATE public.enumerator_authorization_history AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS public.enumerator_authorization_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enumerator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('created', 'approved', 'rejected', 'suspended', 'deactivated', 'reactivated', 'updated', 'assigned')),
    previous_status TEXT,
    new_status TEXT,
    performed_by UUID REFERENCES public.profiles(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_enum_auth_hist_enumerator ON public.enumerator_authorization_history(enumerator_id);
CREATE INDEX IF NOT EXISTS idx_enum_auth_hist_performed_by ON public.enumerator_authorization_history(performed_by);
CREATE INDEX IF NOT EXISTS idx_enum_auth_hist_created_at ON public.enumerator_authorization_history(created_at);


-- 3. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.enumerator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enumerator_authorization_history ENABLE ROW LEVEL SECURITY;


-- 4. CONFIGURE RLS POLICIES FOR public.enumerator_profiles

-- Admin Full Access Policy
DROP POLICY IF EXISTS "Admins full access on enumerator_profiles" ON public.enumerator_profiles;
CREATE POLICY "Admins full access on enumerator_profiles"
    ON public.enumerator_profiles FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Enumerator Self Read Policy
DROP POLICY IF EXISTS "Enumerators read own enumerator_profile" ON public.enumerator_profiles;
CREATE POLICY "Enumerators read own enumerator_profile"
    ON public.enumerator_profiles FOR SELECT
    USING (auth.uid() = id);

-- Enumerator Update Policy (Safe Fields Only)
DROP POLICY IF EXISTS "Enumerators update own safe profile fields" ON public.enumerator_profiles;
CREATE POLICY "Enumerators update own safe profile fields"
    ON public.enumerator_profiles FOR UPDATE
    USING (auth.uid() = id);


-- 5. TAMPER-PREVENTION TRIGGER FOR ENUMERATOR UPDATES
CREATE OR REPLACE FUNCTION public.prevent_enumerator_auth_tampering()
RETURNS TRIGGER AS $$
DECLARE
    caller_role TEXT;
BEGIN
    -- Look up caller role in public.profiles
    SELECT role INTO caller_role
    FROM public.profiles
    WHERE id = auth.uid();

    -- If caller is not an admin, forbid modifying authorization fields or employee_code
    IF caller_role IS DISTINCT FROM 'admin' THEN
        IF NEW.status IS DISTINCT FROM OLD.status OR
           NEW.verification_status IS DISTINCT FROM OLD.verification_status OR
           NEW.authorized_by IS DISTINCT FROM OLD.authorized_by OR
           NEW.authorized_at IS DISTINCT FROM OLD.authorized_at OR
           NEW.authorization_notes IS DISTINCT FROM OLD.authorization_notes OR
           NEW.employee_code IS DISTINCT FROM OLD.employee_code THEN
            RAISE EXCEPTION 'Security Policy Error: Non-admin users are strictly forbidden from modifying authorization status or employee code.';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS check_enumerator_auth_tampering ON public.enumerator_profiles;
CREATE TRIGGER check_enumerator_auth_tampering
    BEFORE UPDATE ON public.enumerator_profiles
    FOR EACH ROW EXECUTE FUNCTION public.prevent_enumerator_auth_tampering();


-- 6. CONFIGURE RLS POLICIES FOR public.enumerator_authorization_history

-- Admins Access Authorization History
DROP POLICY IF EXISTS "Admins access authorization history" ON public.enumerator_authorization_history;
CREATE POLICY "Admins access authorization history"
    ON public.enumerator_authorization_history FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );
