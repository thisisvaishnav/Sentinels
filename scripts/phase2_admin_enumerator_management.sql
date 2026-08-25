-- ==============================================================================
-- PHASE 2A: ADMIN-CONTROLLED ENUMERATOR MANAGEMENT PRODUCTION-SAFE MIGRATION
-- Project: Lokvision (Sentinels)
-- Supabase Project Ref: fxpupzwwzzvqulddxbed
-- ==============================================================================

-- 1. CREATE PUBLIC.PROFILES TABLE FIRST (Prevents function dependency error)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'enumerator' CHECK (role IN ('citizen', 'enumerator', 'admin')),
    mobile_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CREATE IS_ADMIN HELPER FUNCTION WITH SAFE SEARCH_PATH
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- 3. BACKFILL PROFILES FOR ENUM101 AUTH USER
INSERT INTO public.profiles (id, full_name, role)
VALUES ('fcfdebbd-fdd9-4aa8-92f5-c14ded68be37', 'Priya Sharma (Field Enumerator)', 'enumerator')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

-- 4. BACKFILL PROFILES FOR ANY EXISTING USER_ID IN ENUMERATOR_PROFILES
INSERT INTO public.profiles (id, full_name, role)
SELECT user_id, COALESCE(enumerator_id, 'Field Enumerator'), 'enumerator'
FROM public.enumerator_profiles
ON CONFLICT (id) DO NOTHING;

-- 5. SAFELY EXTEND PUBLIC.ENUMERATOR_PROFILES TABLE
ALTER TABLE public.enumerator_profiles
    ADD COLUMN IF NOT EXISTS full_name TEXT DEFAULT 'Field Enumerator',
    ADD COLUMN IF NOT EXISTS mobile_number TEXT,
    ADD COLUMN IF NOT EXISTS email TEXT,
    ADD COLUMN IF NOT EXISTS designation TEXT DEFAULT 'Field Enumerator',
    ADD COLUMN IF NOT EXISTS department TEXT DEFAULT 'Municipal Census',
    ADD COLUMN IF NOT EXISTS district TEXT DEFAULT 'Varanasi',
    ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'Uttar Pradesh',
    ADD COLUMN IF NOT EXISTS address TEXT,
    ADD COLUMN IF NOT EXISTS joining_date DATE DEFAULT CURRENT_DATE,
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
    ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'verified',
    ADD COLUMN IF NOT EXISTS authorized_by UUID REFERENCES public.profiles(id),
    ADD COLUMN IF NOT EXISTS authorized_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS authorization_notes TEXT,
    ADD COLUMN IF NOT EXISTS assigned_zone_id TEXT;

-- Safely set existing rows to active + verified so legacy accounts are not disabled
UPDATE public.enumerator_profiles
SET status = 'active', verification_status = 'verified'
WHERE status IS NULL OR verification_status IS NULL;

-- Apply status constraint safely
ALTER TABLE public.enumerator_profiles 
    DROP CONSTRAINT IF EXISTS enumerator_profiles_status_check;

ALTER TABLE public.enumerator_profiles 
    ADD CONSTRAINT enumerator_profiles_status_check 
    CHECK (status IN ('pending', 'active', 'suspended', 'rejected', 'inactive'));

-- Apply verification_status constraint safely
ALTER TABLE public.enumerator_profiles 
    DROP CONSTRAINT IF EXISTS enumerator_profiles_verification_status_check;

ALTER TABLE public.enumerator_profiles 
    ADD CONSTRAINT enumerator_profiles_verification_status_check 
    CHECK (verification_status IN ('pending', 'verified', 'rejected'));

-- Ensure unique constraint on enumerator_id
ALTER TABLE public.enumerator_profiles 
    DROP CONSTRAINT IF EXISTS enumerator_profiles_enumerator_id_key;

ALTER TABLE public.enumerator_profiles 
    ADD CONSTRAINT enumerator_profiles_enumerator_id_key UNIQUE (enumerator_id);

-- Connect ENUM101 auth user record in enumerator_profiles as active & verified
INSERT INTO public.enumerator_profiles (
    user_id, enumerator_id, full_name, designation, status, verification_status
) VALUES (
    'fcfdebbd-fdd9-4aa8-92f5-c14ded68be37',
    'ENUM101',
    'Priya Sharma',
    'Senior Field Officer',
    'active',
    'verified'
)
ON CONFLICT (user_id) DO UPDATE SET
    enumerator_id = EXCLUDED.enumerator_id,
    full_name = EXCLUDED.full_name,
    status = 'active',
    verification_status = 'verified';

-- 6. CREATE PUBLIC.ENUMERATOR_AUTHORIZATION_HISTORY AUDIT LOG TABLE
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

-- Audit table indexes
CREATE INDEX IF NOT EXISTS idx_enum_auth_hist_enumerator ON public.enumerator_authorization_history(enumerator_id);
CREATE INDEX IF NOT EXISTS idx_enum_auth_hist_performed_by ON public.enumerator_authorization_history(performed_by);
CREATE INDEX IF NOT EXISTS idx_enum_auth_hist_created_at ON public.enumerator_authorization_history(created_at);

-- 7. ENABLE ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enumerator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enumerator_authorization_history ENABLE ROW LEVEL SECURITY;

-- Policies for public.profiles
DROP POLICY IF EXISTS "Admins full access on profiles" ON public.profiles;
CREATE POLICY "Admins full access on profiles" 
    ON public.profiles FOR ALL
    USING (public.is_admin());

DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
CREATE POLICY "Users read own profile" 
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Policies for public.enumerator_profiles
DROP POLICY IF EXISTS "Admins full access on enumerator_profiles" ON public.enumerator_profiles;
CREATE POLICY "Admins full access on enumerator_profiles" 
    ON public.enumerator_profiles FOR ALL
    USING (public.is_admin());

DROP POLICY IF EXISTS "Enumerators read own enumerator_profile" ON public.enumerator_profiles;
CREATE POLICY "Enumerators read own enumerator_profile" 
    ON public.enumerator_profiles FOR SELECT
    USING (auth.uid() = user_id);

-- Policies for public.enumerator_authorization_history
DROP POLICY IF EXISTS "Admins access authorization history" ON public.enumerator_authorization_history;
CREATE POLICY "Admins access authorization history" 
    ON public.enumerator_authorization_history FOR ALL
    USING (public.is_admin());

-- 8. TAMPER PREVENTION TRIGGER FOR ENUMERATORS
CREATE OR REPLACE FUNCTION public.prevent_enumerator_auth_tampering()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT public.is_admin() THEN
        IF NEW.status IS DISTINCT FROM OLD.status OR
           NEW.verification_status IS DISTINCT FROM OLD.verification_status OR
           NEW.authorized_by IS DISTINCT FROM OLD.authorized_by OR
           NEW.authorized_at IS DISTINCT FROM OLD.authorized_at OR
           NEW.authorization_notes IS DISTINCT FROM OLD.authorization_notes OR
           NEW.enumerator_id IS DISTINCT FROM OLD.enumerator_id THEN
            RAISE EXCEPTION 'Security Error: Non-admin users are strictly forbidden from modifying authorization status or employee code.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS check_enumerator_auth_tampering ON public.enumerator_profiles;
CREATE TRIGGER check_enumerator_auth_tampering
    BEFORE UPDATE ON public.enumerator_profiles
    FOR EACH ROW EXECUTE FUNCTION public.prevent_enumerator_auth_tampering();
