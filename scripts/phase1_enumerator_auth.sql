-- ==============================================================================
-- PHASE 1: ENUMERATOR AUTHENTICATION & PROFILES MIGRATION
-- Project: Lokvision (Sentinels)
-- Supabase Project Ref: fxpupzwwzzvqulddxbed
-- ==============================================================================

-- 1. Create Core PROFILES Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'enumerator' CHECK (role IN ('citizen', 'enumerator', 'admin')),
    mobile_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for mobile number lookups
CREATE INDEX IF NOT EXISTS idx_profiles_mobile ON public.profiles(mobile_number);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 2. Create ENUMERATOR_PROFILES Table (Extends public.profiles)
CREATE TABLE IF NOT EXISTS public.enumerator_profiles (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    employee_code TEXT UNIQUE NOT NULL,
    designation TEXT DEFAULT 'Field Enumerator',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    assigned_zone_id UUID NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast employee_code lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_enumerator_employee_code ON public.enumerator_profiles(employee_code);

-- 3. Automatic updated_at Trigger Function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_enumerator_profiles_updated_at ON public.enumerator_profiles;
CREATE TRIGGER set_enumerator_profiles_updated_at
    BEFORE UPDATE ON public.enumerator_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enumerator_profiles ENABLE ROW LEVEL SECURITY;

-- RLS: Users can read their own profile
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- RLS: Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- RLS: Enumerators can read their own enumerator_profile record
DROP POLICY IF EXISTS "Enumerators read own profile" ON public.enumerator_profiles;
CREATE POLICY "Enumerators read own profile"
    ON public.enumerator_profiles FOR SELECT
    USING (auth.uid() = id);

-- RLS: Enumerators can update their own status/record
DROP POLICY IF EXISTS "Enumerators update own profile" ON public.enumerator_profiles;
CREATE POLICY "Enumerators update own profile"
    ON public.enumerator_profiles FOR UPDATE
    USING (auth.uid() = id);

-- 5. Automatic Profile Creation Trigger on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role TEXT;
    user_full_name TEXT;
    user_employee_code TEXT;
BEGIN
    user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'enumerator');
    user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'Field Enumerator');
    user_employee_code := NEW.raw_user_meta_data->>'employee_code';

    -- Insert into public.profiles
    INSERT INTO public.profiles (id, full_name, role, mobile_number)
    VALUES (
        NEW.id,
        user_full_name,
        user_role,
        NEW.phone
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role;

    -- If enumerator role and employee_code is provided, auto-create enumerator_profile
    IF user_role = 'enumerator' AND user_employee_code IS NOT NULL THEN
        INSERT INTO public.enumerator_profiles (id, employee_code, designation, status)
        VALUES (
            NEW.id,
            user_employee_code,
            COALESCE(NEW.raw_user_meta_data->>'designation', 'Field Enumerator'),
            'active'
        )
        ON CONFLICT (id) DO UPDATE SET
            employee_code = EXCLUDED.employee_code;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
