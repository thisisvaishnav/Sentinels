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
import * as SecureStore from 'expo-secure-store';

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

export interface EnumeratorProfile {
  id: string;
  employeeCode: string;
  name: string;
  role: string;
  status: string;
  user_id: string;
  enumerator_id: string;
  [key: string]: unknown;
}

/**
 * Real Supabase Auth enumerator login:
 * 1. signInWithPassword → Supabase issues a JWT (stored securely via SecureStoreAdapter)
 * 2. Fetches profile and enumerator_profiles rows keyed on the authenticated user_id
 * 3. Returns normalized Enumerator profile compatible with existing frontend
 */
export async function loginEnumerator({
  enumeratorId,
  securityKey,
}: EnumeratorLoginData): Promise<{ profile: EnumeratorProfile | null }> {
  const cleanId = enumeratorId.trim();
  const cleanKey = securityKey.trim();

  // DEVELOPMENT ONLY: Temporary dev fallback until real database authentication is fully deployed
  if (cleanId === 'ENUM001' && cleanKey === '123456') {
    return {
      profile: {
        id: 'dev-enumerator-001',
        employeeCode: 'ENUM001',
        name: 'Priya Sharma (Dev Fallback)',
        role: 'enumerator',
        status: 'active',
        user_id: 'dev-enumerator-001',
        enumerator_id: 'ENUM001',
      },
    };
  }

  // Step 1 — Authenticate with Supabase Auth
  const syntheticEmail = `${cleanId}@enumerator.sentinels.app`;
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email: syntheticEmail,
      password: cleanKey,
    });

  if (authError) throw authError;
  if (!authData?.user) throw new Error('Authentication failed. User session not found.');

  const userId = authData.user.id;

  // Step 2 — Fetch matching profiles and enumerator_profiles records
  const { data: baseProfile, error: profileErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (profileErr) {
    console.warn('[Auth] Base profile query warning:', profileErr.message);
  }

  const { data: enumProfile, error: enumErr } = await supabase
    .from('enumerator_profiles')
    .select('*')
    .or(`id.eq.${userId},user_id.eq.${userId}`)
    .maybeSingle();

  if (enumErr) {
    console.warn('[Auth] Enumerator profile query warning:', enumErr.message);
  }

  // Step 3 — Return normalized EnumeratorProfile (using DB row or Auth Metadata fallback)
  const userMeta = authData.user.user_metadata || {};
  const normalizedProfile: EnumeratorProfile = {
    id: enumProfile?.id || enumProfile?.user_id || userId,
    employeeCode: enumProfile?.employee_code || enumProfile?.enumerator_id || userMeta.employee_code || cleanId,
    name: baseProfile?.full_name || userMeta.full_name || 'Field Enumerator',
    role: baseProfile?.role || userMeta.role || 'enumerator',
    status: enumProfile?.status || 'active',
    user_id: userId,
    enumerator_id: enumProfile?.employee_code || enumProfile?.enumerator_id || userMeta.employee_code || cleanId,
  };

  return { profile: normalizedProfile };
}

/**
 * Active session recovery for Enumerators on app launch
 */
export async function getEnumeratorSession(): Promise<EnumeratorProfile | null> {
  try {
    const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
    if (sessionErr || !sessionData?.session?.user) return null;

    const userId = sessionData.session.user.id;

    const { data: baseProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    const { data: enumProfile } = await supabase
      .from('enumerator_profiles')
      .select('*')
      .or(`id.eq.${userId},user_id.eq.${userId}`)
      .maybeSingle();

    const userMeta = sessionData.session.user.user_metadata || {};
    return {
      id: enumProfile?.id || enumProfile?.user_id || userId,
      employeeCode: enumProfile?.employee_code || enumProfile?.enumerator_id || userMeta.employee_code || 'ENUMERATOR',
      name: baseProfile?.full_name || userMeta.full_name || 'Field Enumerator',
      role: baseProfile?.role || userMeta.role || 'enumerator',
      status: enumProfile?.status || 'active',
      user_id: userId,
      enumerator_id: enumProfile?.employee_code || enumProfile?.enumerator_id || userMeta.employee_code || 'ENUMERATOR',
    };
  } catch (err) {
    console.error('[Auth] Error recovering session:', err);
    return null;
  }
}


export async function loginWithRole(role: Role, data: LoginData) {
  if (role === 'citizen') {
    const d = data as CitizenLoginData;
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001';
    console.log('[CitizenLogin] API URL:', apiUrl);

    const response = await fetch(`${apiUrl}/api/auth/citizen/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobile_number: d.mobile,
        password: d.password,
      }),
    });

    const text = await response.text();
    let resData: any = {};
    try {
      resData = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(`Server returned non-JSON response (${response.status}): ${text || 'Empty response'}`);
    }

    if (!response.ok) {
      const err: any = new Error(
        resData.error || (resData.details ? JSON.stringify(resData.details) : `Login failed (${response.status})`)
      );
      err.status = response.status;
      err.code = resData.code;
      throw err;
    }

    if (resData.token) {
      await SecureStore.setItemAsync('citizen_token', resData.token);
      if (resData.user) {
        await SecureStore.setItemAsync('citizen_user', JSON.stringify(resData.user));
      }
    }

    return resData;
  }

  let email: string;
  let password: string;

  switch (role) {
    case 'admin': {
      const d = data as AdminLoginData;
      email = `${d.employeeId.trim()}@admin.sentinels.app`;
      password = d.password;
      break;
    }
    case 'enumerator': {
      const d = data as EnumeratorLoginData;
      // DEVELOPMENT ONLY: Temporary dev authentication for testing while backend and database authentication are not implemented.
      if (d.enumeratorId.trim() === 'ENUM001' && d.securityKey.trim() === '123456') {
        return {
          user: {
            id: 'dev-enumerator-001',
            email: 'ENUM001@enumerator.sentinels.app',
          },
        };
      }
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
  if (role === 'citizen') {
    const d = data as CitizenRegisterData;
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001';

    const response = await fetch(`${apiUrl}/api/auth/citizen/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: d.fullName,
        mobile_number: d.mobile,
        password: d.password,
        state: d.state,
        pincode: d.pinCode,
      }),
    });

    const text = await response.text();
    let resData: any = {};
    try {
      resData = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(`Server returned non-JSON response (${response.status}): ${text || 'Empty response'}`);
    }

    if (!response.ok) {
      const errorMsg = resData.error || (resData.details ? JSON.stringify(resData.details) : `Registration failed (${response.status})`);
      throw new Error(errorMsg);
    }

    if (resData.token) {
      await SecureStore.setItemAsync('citizen_token', resData.token);
      if (resData.user) {
        await SecureStore.setItemAsync('citizen_user', JSON.stringify(resData.user));
      }
    }

    return resData;
  } else {
    const d = data as AdminRegisterData;
    const email = d.email.trim();
    const password = d.password;
    const metadata = {
      role: 'admin',
      full_name: d.fullName,
      employee_id: d.employeeId,
      authority_level: d.authorityLevel,
    };

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });

    if (error) throw error;
    return authData;
  }
}

// ─── Citizen Household Status ───────────────────────────────────────────────

export interface HouseholdStatus {
  completed: boolean;
  household_id: string | null;
}

export async function getCitizenHouseholdStatus(): Promise<HouseholdStatus> {
  const token = await SecureStore.getItemAsync('citizen_token');

  if (!token) {
    throw new Error('Citizen authentication token not found');
  }

  const apiUrl =
    process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001';

  const response = await fetch(
    `${apiUrl}/api/auth/citizen/household-status`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const text = await response.text();

  let resData: any = {};

  try {
    resData = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      `Server returned non-JSON response (${response.status})`
    );
  }

  if (!response.ok) {
    throw new Error(
      resData.error ||
        `Failed to check household status (${response.status})`
    );
  }

  return resData;
}

// ─── Sign out ────────────────────────────────────────────────────────────────

export async function signOut() {
  try {
    await SecureStore.deleteItemAsync('citizen_token');
    await SecureStore.deleteItemAsync('citizen_user');
  } catch {
    // Ignore cleanup errors
  }
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
