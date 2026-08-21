import app from '../src/server/index';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

const PORT = 5003;
const API_URL = `http://localhost:${PORT}`;
const TEST_MOBILE = '9876543211';
const TEST_PASSWORD = 'StrongPassword123';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface JsonResponse {
  [key: string]: unknown;
}

async function readJson(response: Response): Promise<JsonResponse> {
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

async function postJson(path: string, body: Record<string, unknown>) {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return {
    response,
    body: await readJson(response),
  };
}

function assertStatus(actual: number, expected: number, label: string) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
  }
}

async function runTests() {
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(PORT, () => {
      console.log(`Citizen login test server running on port ${PORT}`);
      resolve();
    });
  });

  const signupData = {
    full_name: 'Login Test Citizen',
    mobile_number: TEST_MOBILE,
    password: TEST_PASSWORD,
    state: 'Uttar Pradesh',
    pincode: '201001',
  };

  try {
    await supabase.from('citizen_profiles').delete().eq('mobile_number', TEST_MOBILE);

    console.log('\n--- Setup: Create citizen through signup API ---');
    const signup = await postJson('/api/auth/citizen/signup', signupData);
    console.log('Status:', signup.response.status);
    console.log('Response Body:', JSON.stringify(signup.body, null, 2));
    assertStatus(signup.response.status, 201, 'Citizen signup setup');

    console.log('\n--- Test 1: Valid Citizen Login ---');
    const validLogin = await postJson('/api/auth/citizen/login', {
      mobile_number: TEST_MOBILE,
      password: TEST_PASSWORD,
    });
    console.log('Status:', validLogin.response.status);
    console.log('Response Body:', JSON.stringify(validLogin.body, null, 2));
    assertStatus(validLogin.response.status, 200, 'Valid citizen login');

    const loginUser = validLogin.body.user as { mobile_number?: string } | undefined;
    if (!validLogin.body.token || loginUser?.mobile_number !== TEST_MOBILE) {
      throw new Error('Valid login response is missing token or matching user payload');
    }

    console.log('✅ Test 1 Passed: Citizen login returned user and token');

    console.log('\n--- Test 2: Wrong Password ---');
    const wrongPassword = await postJson('/api/auth/citizen/login', {
      mobile_number: TEST_MOBILE,
      password: 'WrongPassword123',
    });
    console.log('Status:', wrongPassword.response.status);
    console.log('Response Body:', JSON.stringify(wrongPassword.body, null, 2));
    assertStatus(wrongPassword.response.status, 401, 'Wrong password login');
    console.log('✅ Test 2 Passed: Wrong password blocked with 401');

    console.log('\n--- Test 3: Unknown Mobile ---');
    const unknownMobile = await postJson('/api/auth/citizen/login', {
      mobile_number: '9876543212',
      password: TEST_PASSWORD,
    });
    console.log('Status:', unknownMobile.response.status);
    console.log('Response Body:', JSON.stringify(unknownMobile.body, null, 2));
    assertStatus(unknownMobile.response.status, 404, 'Unknown mobile login');
    console.log('✅ Test 3 Passed: Unknown mobile returned JSON error');

    console.log('\n--- Test 4: Invalid Mobile Format ---');
    const invalidMobile = await postJson('/api/auth/citizen/login', {
      mobile_number: '123',
      password: TEST_PASSWORD,
    });
    console.log('Status:', invalidMobile.response.status);
    console.log('Response Body:', JSON.stringify(invalidMobile.body, null, 2));
    assertStatus(invalidMobile.response.status, 400, 'Invalid mobile login');
    console.log('✅ Test 4 Passed: Invalid mobile blocked with 400');

    console.log('\n🎉 ALL CITIZEN LOGIN TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Citizen Login Test Failed:', err);
    process.exitCode = 1;
  } finally {
    await supabase.from('citizen_profiles').delete().eq('mobile_number', TEST_MOBILE);
    console.log('\n🧹 Citizen login test record cleaned up');
    server.close();
  }
}

runTests();
