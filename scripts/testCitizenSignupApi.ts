import app from '../src/server/index';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

const PORT = 5002;
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  const server = http.createServer(app);
  
  await new Promise<void>((resolve) => {
    server.listen(PORT, () => {
      console.log(`Test server running on port ${PORT}`);
      resolve();
    });
  });

  const testMobile = "9876543210";

  try {
    // Ensure clean state before testing
    await supabase.from('citizen_profiles').delete().eq('mobile_number', testMobile);

    console.log('\n--- Test 1: Valid Citizen Signup ---');
    const signupData = {
      full_name: "Rahul Kumar",
      mobile_number: testMobile,
      password: "StrongPassword123",
      state: "Uttar Pradesh",
      pincode: "201001"
    };

    const res1 = await fetch(`http://localhost:${PORT}/api/auth/citizen/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupData)
    });

    const body1 = await res1.json();
    console.log('Status:', res1.status);
    console.log('Response Body:', JSON.stringify(body1, null, 2));

    if (res1.status !== 201) {
      throw new Error(`Expected 201 Created, got ${res1.status}`);
    }

    if (!body1.token || !body1.user || body1.user.mobile_number !== testMobile) {
      throw new Error('Response payload does not match expected structure');
    }

    console.log('✅ Test 1 Passed: Citizen registered successfully');

    console.log('\n--- Test 2: Duplicate Mobile Number Signup ---');
    const res2 = await fetch(`http://localhost:${PORT}/api/auth/citizen/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupData)
    });

    const body2 = await res2.json();
    console.log('Status:', res2.status);
    console.log('Response Body:', JSON.stringify(body2, null, 2));

    if (res2.status !== 409) {
      throw new Error(`Expected 409 Conflict, got ${res2.status}`);
    }
    console.log('✅ Test 2 Passed: Duplicate registration blocked with 409 Conflict');

    console.log('\n--- Test 3: Invalid Input Payload Validation ---');
    const invalidData = {
      full_name: "",
      mobile_number: "123", // invalid mobile length
      password: "123",       // too short
      state: "",
      pincode: "999"        // invalid pincode length
    };

    const res3 = await fetch(`http://localhost:${PORT}/api/auth/citizen/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidData)
    });

    const body3 = await res3.json();
    console.log('Status:', res3.status);
    console.log('Response Body:', JSON.stringify(body3, null, 2));

    if (res3.status !== 400) {
      throw new Error(`Expected 400 Bad Request, got ${res3.status}`);
    }
    console.log('✅ Test 3 Passed: Validation errors caught properly');

    // Clean up created record
    await supabase.from('citizen_profiles').delete().eq('mobile_number', testMobile);
    console.log('\n🧹 Test record cleaned up');
    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');

  } catch (err) {
    console.error('❌ Test Failed:', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
}

runTests();
