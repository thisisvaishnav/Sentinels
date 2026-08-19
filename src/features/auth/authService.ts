/**
 * authService.ts
 *
 * Wraps Supabase Auth calls for each role. All tokens are persisted by the
 * SecureStore adapter configured in src/lib/supabase.ts.
 *
 * Identifier strategy
 * -------------------
 * Supabase email/password auth is used for every role so no extra provider
 * (Twilio, etc.) is required. A synthetic email is constructed per role so
 * the same mobile / employee ID can exist across different roles without
 * collision:
 *
 *   citizen    → <mobile>@citizen.sentinels.app
 *   admin      → <corporate email as-is>
 *   enumerator → <enumeratorId>@enumerator.sentinels.app
 *
 * To enable real phone-OTP later, swap the citizen branch to
 * supabase.auth.signInWithOtp({ phone: mobile }).
 */

import { supabase } from '@/src/lib/supabase';

export type Role = 'citizen' | 'enumerator' | 'admin';

// ─── Login ──────────────────────────────────────────────────────────────────

export interface CitizenLoginData {
  mobile: string;
  password: string;
}

export interface AdminLoginData {
  employeeId: string;
  password: string;
}

export interface EnumeratorLoginData {
  enumeratorId: string;
  securityKey: string;
}

export type LoginData = CitizenLoginData | AdminLoginData | EnumeratorLoginData;

export async function loginWithRole(role: Role, data: LoginData) {
  let email: string;
  let password: string;

  switch (role) {
    case 'citizen': {
      const d = data as CitizenLoginData;
      email = `${d.mobile.trim()}@citizen.sentinels.app`;
      password = d.password;
      break;
    }
    case 'admin': {
      const d = data as AdminLoginData;
      email = `${d.employeeId.trim()}@admin.sentinels.app`;
      password = d.password;
      break;
    }
    case 'enumerator': {
      const d = data as EnumeratorLoginData;
      email = `${d.enumeratorId.trim()}@enumerator.sentinels.app`;
      password = d.securityKey;
      break;
    }
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return authData;
}

// ─── Register ───────────────────────────────────────────────────────────────

export interface CitizenRegisterData {
  fullName: string;
  mobile: string;
  password: string;
  state: string;
  district: string;
  pinCode: string;
}

export interface AdminRegisterData {
  fullName: string;
  employeeId: string;
  authorityLevel: string;
  email: string;
  password: string;
}

export type RegisterData = CitizenRegisterData | AdminRegisterData;
export type RegisterRole = 'citizen' | 'admin';

export async function registerWithRole(role: RegisterRole, data: RegisterData) {
  let email: string;
  let password: string;
  let metadata: Record<string, string>;

  if (role === 'citizen') {
    const d = data as CitizenRegisterData;
    email = `${d.mobile.trim()}@citizen.sentinels.app`;
    password = d.password;
    metadata = {
      role: 'citizen',
      full_name: d.fullName,
      mobile: d.mobile,
      state: d.state,
      district: d.district,
      pin_code: d.pinCode,
    };
  } else {
    const d = data as AdminRegisterData;
    email = d.email.trim();
    password = d.password;
    metadata = {
      role: 'admin',
      full_name: d.fullName,
      employee_id: d.employeeId,
      authority_level: d.authorityLevel,
    };
  }

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  });

  if (error) throw error;
  return authData;
}

// ─── Sign out ────────────────────────────────────────────────────────────────

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
