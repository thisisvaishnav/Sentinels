const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testEnumeratorLogin(enumeratorId, securityKey) {
  const { data, error } = await supabase
    .rpc('verify_enumerator_login', {
      p_enumerator_id: enumeratorId.trim(),
      p_security_key: securityKey,
    })
    .maybeSingle();

  if (error) {
    return { success: false, error, data: null };
  }

  return { success: Boolean(data), error: null, data };
}

async function runTest() {
  const enumeratorId = process.env.TEST_ENUMERATOR_ID;
  const securityKey = process.env.TEST_ENUMERATOR_SECURITY_KEY;

  if (!enumeratorId || !securityKey) {
    console.log(
      'Set TEST_ENUMERATOR_ID and TEST_ENUMERATOR_SECURITY_KEY to test enumerator login.',
    );
    process.exitCode = 1;
    return;
  }

  const result = await testEnumeratorLogin(enumeratorId, securityKey);

  if (result.error) {
    console.log('DB check failed:', result.error.message);
    process.exitCode = 1;
    return;
  }

  if (!result.success) {
    console.log('No active enumerator matched those credentials.');
    process.exitCode = 1;
    return;
  }

  console.log('Enumerator login check passed:', result.data);
}

if (require.main === module) {
  runTest();
}

module.exports = { testEnumeratorLogin };
