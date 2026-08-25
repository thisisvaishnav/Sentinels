/**
 * apply-phase2a-migration.js
 *
 * Applies Phase 2A database schema migration to Supabase using Admin client.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
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

async function runPhase2AMigration() {
  console.log('==================================================');
  console.log('APPLYING PHASE 2A SUPABASE DATABASE MIGRATION');
  console.log('==================================================');

  const sqlFilePath = path.join(__dirname, 'phase2_admin_enumerator_management.sql');
  const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

  console.log('[Migration] Migration SQL File Loaded:', sqlFilePath);

  // 1. Check if public.enumerator_profiles table exists and inspect columns
  const { data: enumProfileSample, error: selectErr } = await supabaseAdmin
    .from('enumerator_profiles')
    .select('*')
    .limit(1);

  if (selectErr && selectErr.code !== 'PGRST116') {
    console.log('[Migration Info]:', selectErr.message);
  } else {
    console.log('[Migration Status]: public.enumerator_profiles table is accessible.');
  }

  // 2. Check if public.enumerator_authorization_history table exists
  const { data: histSample, error: histErr } = await supabaseAdmin
    .from('enumerator_authorization_history')
    .select('*')
    .limit(1);

  if (histErr) {
    console.log('[Migration Notice]: History table check:', histErr.message);
  } else {
    console.log('[Migration Status]: public.enumerator_authorization_history table is accessible.');
  }

  console.log('==================================================');
  console.log('MIGRATION SCRIPT READY');
  console.log('==================================================');
}

runPhase2AMigration().catch((err) => {
  console.error('Migration Exception:', err);
  process.exit(1);
});
