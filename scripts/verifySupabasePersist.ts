import app from '../src/server/index';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

const PORT = 5003;
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySupabasePersist() {
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(PORT, () => {
      console.log(`Verification server running on port ${PORT}`);
      resolve();
    });
  });

  const testMobile = "9876599999";

  try {
    // 1. Clean up any previous test record
    await supabase.from('citizen_profiles').delete().eq('mobile_number', testMobile);

    console.log('Step 1: Sending POST /api/auth/citizen/signup...');
    const signupPayload = {
      full_name: "Rahul Kumar (Persist Test)",
      mobile_number: testMobile,
      password: "StrongPassword123",
      state: "Uttar Pradesh",
      pincode: "201001"
    };

    const res = await fetch(`http://localhost:${PORT}/api/auth/citizen/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupPayload)
    });

    const responseJson = await res.json();
    console.log('API Response Status:', res.status);
    console.log('API Response Body:', JSON.stringify(responseJson, null, 2));

    if (res.status !== 201) {
      throw new Error(`API failed with status ${res.status}`);
    }

    // 2. Directly query Supabase DB to verify the record actually exists in PostgreSQL!
    console.log('\nStep 2: Directly querying Supabase DB for mobile:', testMobile);
    const { data: dbRow, error: dbError } = await supabase
      .from('citizen_profiles')
      .select('id, full_name, mobile_number, password_hash, state, pincode, is_active, created_at')
      .eq('mobile_number', testMobile)
      .single();

    if (dbError || !dbRow) {
      throw new Error(`Supabase query failed or record not found: ${dbError?.message}`);
    }

    console.log('\n✅ DIRECT SUPABASE DATABASE RECORD CONFIRMED:');
    console.log(JSON.stringify(dbRow, null, 2));

    // 3. Clean up after verification
    await supabase.from('citizen_profiles').delete().eq('mobile_number', testMobile);
    console.log('\n🧹 Test record cleaned up from Supabase.');

  } catch (err) {
    console.error('❌ Verification failed:', err);
  } finally {
    server.close();
  }
}

verifySupabasePersist();
