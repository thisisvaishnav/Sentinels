# Implementation Plan — Phase 2A: Database Foundation for Admin-Controlled Enumerator Management

This document outlines the **Phase 2A** implementation plan for the **Lokvision (Sentinels)** project using **Supabase** (`fxpupzwwzzvqulddxbed`).

---

## 1. What Already Exists
* **Supabase Authentication**: Enabled and connected (`https://fxpupzwwzzvqulddxbed.supabase.co`).
* **`public.profiles` Table**: Extends `auth.users(id)` to store user `full_name`, `role` (`citizen`, `enumerator`, `admin`), and `mobile_number`.
* **`public.enumerator_profiles` Table**: Extends `public.profiles(id)` with `employee_code`, `designation`, `status`, `assigned_zone_id`.
* **Phase 1 Auth Flow**: Enumerators log in using synthetic emails (`ENUM101@enumerator.sentinels.app`) mapped from their Employee Code (`ENUM101`). Tokens are securely stored using `SecureStoreAdapter`.

---

## 2. What We Are Adding in Phase 2A
1. **Schema Extensions for `public.enumerator_profiles`**:
   * Management & demographic fields: `full_name`, `mobile_number`, `email`, `department`, `district`, `state`, `address`, `joining_date`.
   * Authorization fields: `verification_status` (`pending`, `verified`, `rejected`), `authorized_by`, `authorized_at`, `authorization_notes`.
   * Expanded status allowed values: `pending`, `active`, `suspended`, `rejected`, `inactive`.
2. **Audit Log Table `public.enumerator_authorization_history`**:
   * Tracks full lifecycle events (`created`, `approved`, `rejected`, `suspended`, `deactivated`, `reactivated`, `updated`, `assigned`).
3. **Database-Enforced Security (RLS + Tamper Prevention Trigger)**:
   * Only **Admins** (`public.profiles.role = 'admin'`) can view/edit authorization history and update sensitive fields.
   * Enumerators can **only** read their own profile row (`auth.uid() = id`) and are strictly forbidden from modifying their own `status`, `verification_status`, `authorized_by`, or `employee_code`.
4. **Migration & Verification Suite**:
   * Safe SQL Migration: [`scripts/phase2_admin_enumerator_management.sql`](file:///c:/Users/supri/OneDrive/Desktop/Sentinels/scripts/phase2_admin_enumerator_management.sql).
   * Standalone Automated Verification Test: [`scripts/verify-phase2a-enumerator-management.js`](file:///c:/Users/supri/OneDrive/Desktop/Sentinels/scripts/verify-phase2a-enumerator-management.js).

---

## 3. Why Each Database Field Exists

| Field Name | Type | Purpose |
| :--- | :--- | :--- |
| `verification_status` | `TEXT` | Tracks approval lifecycle state (`pending`, `verified`, `rejected`). Default is `pending`. |
| `authorized_by` | `UUID` | Stores the Supabase `profiles(id)` of the Admin who approved/authorized the enumerator. |
| `authorized_at` | `TIMESTAMPTZ` | Timestamp when the authorization action was taken by an Admin. |
| `authorization_notes` | `TEXT` | Notes recorded by an Admin (e.g. rejection or suspension reason). |
| `department` | `TEXT` | Municipal department (default: `'Municipal Census'`). |
| `district` | `TEXT` | Operational district (default: `'Varanasi'`). |
| `state` | `TEXT` | Operational state (default: `'Uttar Pradesh'`). |
| `address` | `TEXT` | Contact/residential address of the field enumerator. |
| `joining_date` | `DATE` | Date when the enumerator joined service (default: `CURRENT_DATE`). |

---

## 4. How Admin & Enumerator Authorization Works

### Admin Authorization
* **Identity Check**: Role check is enforced in PostgreSQL via `public.profiles.role = 'admin'` for `auth.uid()`.
* **Capabilities**: Admins have full access to read all enumerators, approve, reject, suspend, deactivate, reactivate, and inspect audit logs.

### Enumerator Authorization Lifecycle
* **`pending`**: Account created by Admin, awaiting verification. Cannot access field dashboard.
* **`active` & `verified`**: Fully authorized. Can log in and collect household data.
* **`suspended`**: Temporarily barred by Admin due to anomalies or review. Access blocked.
* **`rejected`**: Account application declined by Admin. Access blocked.
* **`inactive`**: Deactivated account (e.g. off-boarded). Access blocked.

---

## 5. How Row Level Security (RLS) Protects Data

1. **`public.enumerator_profiles`**:
   * `SELECT`: Policy `auth.uid() = id` ensures an enumerator can ONLY see their own profile row.
   * `UPDATE`: A PostgreSQL trigger (`prevent_enumerator_auth_tampering()`) intercepts updates. If the caller's role in `public.profiles` is NOT `'admin'`, any attempt to modify `status`, `verification_status`, `authorized_by`, `authorized_at`, `authorization_notes`, or `employee_code` throws an immediate PostgreSQL exception.
2. **`public.enumerator_authorization_history`**:
   * RLS is enabled and only accessible to users with `role = 'admin'` in `public.profiles`. Enumerators receive `403 Forbidden / 0 rows` if they attempt to query or insert audit records.

---

## 6. Audit Log Workflow

Every authorization lifecycle change generates a record in `public.enumerator_authorization_history`:
```
Rahul Verma (ENUM102)
  │
  ├─ Action: 'created'     │ Status: 'pending'   │ Performed by: Admin A
  ├─ Action: 'approved'    │ Status: 'active'    │ Performed by: Admin A
  ├─ Action: 'suspended'   │ Status: 'suspended' │ Performed by: Admin B
  └─ Action: 'reactivated' │ Status: 'active'    │ Performed by: Admin A
```

---

## 7. What Will Be Implemented in Phase 2B (Future)
* Admin Creation & Management React Native UI screens.
* Admin FastAPI endpoints (`POST /api/v1/admin/enumerators`, `/approve`, `/reject`, `/suspend`, `/reactivate`).
* Status guard integration in login flow UI messages.
