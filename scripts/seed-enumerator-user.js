/**
 * seed-enumerator-user.js
 *
 * Provisioning script for Phase 1 testing.
 * Creates tables (if not existing) and seeds a real Supabase Auth Enumerator user.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Error: EXPO_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function seedEnumeratorUser() {
  console.log('--- Phase 1: Provisioning Real Supabase Enumerator User ---');

  const testEmail = 'ENUM101@enumerator.sentinels.app';
  const testPassword = 'Secret@123456';
  const testEmployeeCode = 'ENUM101';
  const testFullName = 'Priya Sharma (Field Enumerator)';

  // 1. Create or get Auth User
  let userId = null;

  const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
  const existing = existingUsers?.users?.find((u) => u.email?.toLowerCase() === testEmail.toLowerCase());

  if (existing) {
    console.log(`[Auth] Updating existing user ${testEmail} (ID: ${existing.id})...`);
    userId = existing.id;
    await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: testPassword,
      user_metadata: {
        role: 'enumerator',
        full_name: testFullName,
        employee_code: testEmployeeCode,
      },
    });
    console.log(`[Auth] Updated display name to: ${testFullName}`);
  } else {
    console.log(`[Auth] Creating new Supabase Auth user: ${testEmail}`);
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: {
        role: 'enumerator',
        full_name: testFullName,
        employee_code: testEmployeeCode,
      },
    });

    if (createError) {
      console.error('Error creating auth user:', createError.message);
      return;
    }

    userId = newUser.user.id;
    console.log(`[Auth] Successfully created user with ID: ${userId}`);
  }

  // 2. Ensure profile row exists in public.profiles
  console.log('[DB] Upserting public.profiles record...');
  const { error: profileError } = await supabaseAdmin.from('profiles').upsert(
    {
      id: userId,
      full_name: testFullName,
      role: 'enumerator',
      mobile_number: '9876543210',
    },
    { onConflict: 'id' }
  );

  if (profileError) {
    console.error('Error upserting profile:', profileError.message);
  } else {
    console.log('[DB] Profile upserted successfully.');
  }

  // 3. Ensure enumerator_profiles record exists
  console.log('[DB] Upserting public.enumerator_profiles record...');
  const { error: enumError } = await supabaseAdmin.from('enumerator_profiles').upsert(
    {
      id: userId,
      employee_code: testEmployeeCode,
      designation: 'Lead Field Enumerator',
      status: 'active',
    },
    { onConflict: 'id' }
  );

  if (enumError) {
    console.error('Error upserting enumerator_profiles:', enumError.message);
  } else {
    console.log('[DB] Enumerator profile upserted successfully.');
  }

  console.log('\n--- Phase 1 Provisioning Complete ---');
  console.log(`Credentials for testing:`);
  console.log(`Enumerator ID : ${testEmployeeCode}`);
  console.log(`Security Key  : ${testPassword}`);
}

seedEnumeratorUser().catch(console.error);
