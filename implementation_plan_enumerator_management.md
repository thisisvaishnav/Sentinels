# Implementation Plan: Admin-Controlled Enumerator Management System

This document outlines the detailed architectural implementation plan for the **Admin-controlled Enumerator Management System** in Lokvision (Sentinels) using Supabase as the central backend.

---

## 1. Architectural Blueprint & Current State Audit

### Current State
* **Auth Layer**: Supabase Auth handles user sessions. Enumerators sign in using synthetic emails (`<employee_code>@enumerator.sentinels.app`) mapped from their Employee ID (e.g. `ENUM101`).
* **Database Layer**:
  * `public.profiles`: Extends `auth.users(id)` with `full_name`, `role`, `mobile_number`.
  * `public.enumerator_profiles`: Extends `public.profiles(id)` with `employee_code`, `designation`, `status`, `assigned_zone_id`.
* **Security Model**:
  * React Native client only has access to `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (Anon Key).
  * `SUPABASE_SERVICE_ROLE_KEY` is kept strictly server-side (`.env`, `backend/app/core/config.py`, seed scripts).

### Proposed Admin Management Architecture
```
┌─────────────────────────┐
│ Admin React Native UI   │
└────────────┬────────────┘
             │ HTTP (Admin JWT Token)
             ▼
┌─────────────────────────┐     SUPABASE_SERVICE_ROLE_KEY     ┌────────────────────────┐
│ FastAPI Server Backend  │ ─────────────────────────────────►│ Supabase Admin API     │
│ (Port 5001)             │                                   │ (auth.admin.createUser)│
└────────────┬────────────┘                                   └───────────┬────────────┘
             │                                                            │
             │ Creates Profile & Audit History Record                     ▼
             └─────────────────────────────────────────────────►┌──────────────────────┐
                                                                │ Supabase PostgreSQL  │
                                                                │  - auth.users        │
                                                                │  - profiles          │
                                                                │  - enumerator_       │
                                                                │    profiles          │
                                                                │  - enumerator_       │
                                                                │    authorization_    │
                                                                │    history           │
                                                                └──────────────────────┘
```

---

## 2. Database Schema Extensions (DDL Migration)

### `public.enumerator_profiles` Extension
We extend the existing `public.enumerator_profiles` table without creating duplicate tables:

```sql
-- Extend public.enumerator_profiles table with management & authorization fields
ALTER TABLE public.enumerator_profiles
    ADD COLUMN IF NOT EXISTS full_name TEXT,
    ADD COLUMN IF NOT EXISTS mobile_number TEXT,
    ADD COLUMN IF NOT EXISTS email TEXT,
    ADD COLUMN IF NOT EXISTS department TEXT DEFAULT 'Municipal Census',
    ADD COLUMN IF NOT EXISTS district TEXT DEFAULT 'Varanasi',
    ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'Uttar Pradesh',
    ADD COLUMN IF NOT EXISTS address TEXT,
    ADD COLUMN IF NOT EXISTS joining_date DATE DEFAULT CURRENT_DATE,
    ADD COLUMN IF NOT EXISTS verification_status TEXT NOT NULL DEFAULT 'pending' 
        CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    ADD COLUMN IF NOT EXISTS authorized_by UUID REFERENCES public.profiles(id),
    ADD COLUMN IF NOT EXISTS authorized_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS authorization_notes TEXT;

-- Update status constraint to enforce allowed admin states
ALTER TABLE public.enumerator_profiles 
    DROP CONSTRAINT IF EXISTS enumerator_profiles_status_check;

ALTER TABLE public.enumerator_profiles
    ADD CONSTRAINT enumerator_profiles_status_check 
    CHECK (status IN ('pending', 'active', 'suspended', 'rejected', 'inactive'));
```

### `public.enumerator_authorization_history` Audit Log Table
```sql
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

CREATE INDEX IF NOT EXISTS idx_enum_auth_hist_enumerator ON public.enumerator_authorization_history(enumerator_id);
CREATE INDEX IF NOT EXISTS idx_enum_auth_hist_performed_by ON public.enumerator_authorization_history(performed_by);
```

---

## 3. Row Level Security (RLS) & Permissions Matrix

| Role | Target Table | Select | Insert | Update | Delete | Notes |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **Admin** | `enumerator_profiles` | ✅ | ✅ | ✅ | ✅ | Full management capabilities |
| **Admin** | `authorization_history` | ✅ | ✅ | ❌ | ❌ | Audit trail access |
| **Enumerator** | `enumerator_profiles` | ✅ (Own row) | ❌ | ⚠️ (Safe fields only) | ❌ | Cannot edit `status`, `verification_status`, `authorized_by` |
| **Enumerator** | `authorization_history` | ❌ | ❌ | ❌ | ❌ | No access to audit logs |

```sql
-- Enable RLS
ALTER TABLE public.enumerator_authorization_history ENABLE ROW LEVEL SECURITY;

-- Policy: Admin full access on enumerator_profiles
CREATE POLICY "Admin full access on enumerator_profiles"
    ON public.enumerator_profiles FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Policy: Enumerators read own profile only
CREATE POLICY "Enumerators read own enumerator_profile"
    ON public.enumerator_profiles FOR SELECT
    USING (auth.uid() = id);

-- Policy: Admin access to authorization history
CREATE POLICY "Admin access to authorization history"
    ON public.enumerator_authorization_history FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );
```

---

## 4. Admin Management Server API Endpoints

All admin creation and authorization operations execute via trusted server backend (`backend/app/api/v1/endpoints/admin_enumerators.py`):

1. `POST /api/v1/admin/enumerators`
   * Accepts: `full_name`, `mobile_number`, `email`, `employee_code`, `password`, `designation`, `district`, `state`, `zone_id`.
   * Action: Calls Supabase Admin Auth API (`auth.admin.createUser`) using `SUPABASE_SERVICE_ROLE_KEY`. Inserts `profiles` & `enumerator_profiles` with `status = 'pending'`, `verification_status = 'pending'`. Records `created` audit event.
   * Safety: Implements atomic cleanup on error.

2. `POST /api/v1/admin/enumerators/{id}/approve`
   * Updates `status = 'active'`, `verification_status = 'verified'`, `authorized_by = admin_id`, `authorized_at = NOW()`.
   * Records `approved` audit log.

3. `POST /api/v1/admin/enumerators/{id}/reject`
   * Updates `status = 'rejected'`, `verification_status = 'rejected'`, `authorization_notes = reason`.
   * Records `rejected` audit log.

4. `POST /api/v1/admin/enumerators/{id}/suspend`
   * Updates `status = 'suspended'`. Records `suspended` audit log.

5. `POST /api/v1/admin/enumerators/{id}/deactivate`
   * Updates `status = 'inactive'`. Records `deactivated` audit log.

6. `POST /api/v1/admin/enumerators/{id}/reactivate`
   * Updates `status = 'active'`, `verification_status = 'verified'`. Records `reactivated` audit log.

---

## 5. Enumerator Login Guard & Status Validation

In `loginEnumerator()` in [`src/features/auth/authService.ts`](file:///c:/Users/supri/OneDrive/Desktop/Sentinels/src/features/auth/authService.ts):

After `supabase.auth.signInWithPassword()` succeeds, the profile `status` and `verification_status` are evaluated:

```typescript
if (enumProfile.status === 'pending' || enumProfile.verification_status === 'pending') {
  await supabase.auth.signOut();
  throw new Error('Your account is awaiting admin approval.');
}

if (enumProfile.status === 'rejected' || enumProfile.verification_status === 'rejected') {
  await supabase.auth.signOut();
  throw new Error('Your Enumerator account was rejected. Contact your administrator.');
}

if (enumProfile.status === 'suspended') {
  await supabase.auth.signOut();
  throw new Error('Your account has been suspended. Contact your administrator.');
}

if (enumProfile.status === 'inactive') {
  await supabase.auth.signOut();
  throw new Error('Your account is inactive. Contact your administrator.');
}
```

---

## 6. Proposed Changes per File

### `[NEW]` [`scripts/phase2_admin_enumerator_management.sql`](file:///c:/Users/supri/OneDrive/Desktop/Sentinels/scripts/phase2_admin_enumerator_management.sql)
DDL script to extend `public.enumerator_profiles`, create `public.enumerator_authorization_history`, and configure RLS policies.

### `[NEW]` [`backend/app/api/v1/endpoints/admin_enumerators.py`](file:///c:/Users/supri/OneDrive/Desktop/Sentinels/backend/app/api/v1/endpoints/admin_enumerators.py)
FastAPI endpoints for Admin creation, approval, rejection, suspension, deactivation, and reactivation of enumerators.

### `[MODIFY]` [`backend/app/api/v1/router.py`](file:///c:/Users/supri/OneDrive/Desktop/Sentinels/backend/app/api/v1/router.py)
Mount `admin_enumerators.router` under `/admin/enumerators`.

### `[MODIFY]` [`src/features/auth/authService.ts`](file:///c:/Users/supri/OneDrive/Desktop/Sentinels/src/features/auth/authService.ts)
Enforce status checks (`pending`, `rejected`, `suspended`, `inactive`) upon successful Supabase Auth.

### `[MODIFY]` [`app/(admin)/add-new-enumerator.tsx`](file:///c:/Users/supri/OneDrive/Desktop/Sentinels/app/(admin)/add-new-enumerator.tsx)
Connect creation form to `POST /api/v1/admin/enumerators` backend API.

### `[MODIFY]` [`app/(admin)/field-enumerators.tsx`](file:///c:/Users/supri/OneDrive/Desktop/Sentinels/app/(admin)/field-enumerators.tsx)
Add quick-action controls for Approve, Reject, Suspend, Deactivate, and Reactivate with status badge filtering.

### `[NEW]` [`scripts/seed-phase2-enumerators.js`](file:///c:/Users/supri/OneDrive/Desktop/Sentinels/scripts/seed-phase2-enumerators.js)
Seed script for Indian dataset (`ENUM101` to `ENUM108`).

### `[NEW]` [`scripts/verify-phase2-admin-enumerator.js`](file:///c:/Users/supri/OneDrive/Desktop/Sentinels/scripts/verify-phase2-admin-enumerator.js)
Automated verification suite testing all 18 user test criteria.

---

## 7. Verification & Testing Plan

1. **Automated Test Suite (`node scripts/verify-phase2-admin-enumerator.js`)**:
   * Admin creation of new enumerator (`ENUM102`).
   * Verify Auth user created with synthetic email `ENUM102@enumerator.sentinels.app`.
   * Verify `profiles` and `enumerator_profiles` created with `status = 'pending'`.
   * Verify password is **not** stored in `enumerator_profiles`.
   * Test login attempt by `ENUM102` fails with *"Your account is awaiting admin approval."*.
   * Admin approves `ENUM102`.
   * Verify `status = 'active'` and `verification_status = 'verified'`.
   * Test login attempt by `ENUM102` succeeds.
   * Admin suspends `ENUM102` $\rightarrow$ Login fails with *"Your account has been suspended..."*.
   * Admin rejects enumerator $\rightarrow$ Login fails with *"Your Enumerator account was rejected..."*.
   * Verify RLS prevents Enumerators from reading other enumerator profiles or updating authorization status.
   * Verify zero presence of `SUPABASE_SERVICE_ROLE_KEY` in frontend client code.

---

## 8. Security Risk Audit

* **Service Role Key Isolation**: Verified 100%. `SUPABASE_SERVICE_ROLE_KEY` is strictly confined to `.env` and server-side scripts/Python config.
* **Plaintext Password Audit**: `enumerator_profiles` has no password column; passwords are handled exclusively by Supabase Auth (`auth.users`).
* **RLS Protection**: Status changes require Admin role in `profiles` and are enforced at the database level via Postgres RLS.
