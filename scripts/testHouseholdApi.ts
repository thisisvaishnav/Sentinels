import app from '../src/server/index';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

const PORT = 5004;
const API_URL = `http://localhost:${PORT}`;
const TEST_MOBILE = '9876543213';
const TEST_PASSWORD = 'StrongPassword123';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface JsonResponse {
  [key: string]: any;
}

async function readJson(response: Response): Promise<JsonResponse> {
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

async function postJson(path: string, body: Record<string, any>, token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers,
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
      console.log(`Household API test server running on port ${PORT}`);
      resolve();
    });
  });

  let citizenId = '';
  let token = '';

  try {
    // 1. Clean up potential old test records
    const { data: oldCitizen } = await supabase.from('citizen_profiles').select('id').eq('mobile_number', TEST_MOBILE).maybeSingle();
    if (oldCitizen) {
      await supabase.from('household_profiles').delete().eq('citizen_id', oldCitizen.id);
      await supabase.from('citizen_profiles').delete().eq('id', oldCitizen.id);
    }

    console.log('\n--- Setup: Create test citizen ---');
    const signupData = {
      full_name: 'Household Test Citizen',
      mobile_number: TEST_MOBILE,
      password: TEST_PASSWORD,
      state: 'Uttar Pradesh',
      pincode: '201001',
    };
    const signup = await postJson('/api/auth/citizen/signup', signupData);
    assertStatus(signup.response.status, 201, 'Citizen signup setup');
    citizenId = signup.body.user.id;
    token = signup.body.token;
    console.log('Test citizen created with ID:', citizenId);

    console.log('\n--- Test 1: Submit valid household form ---');
    const householdPayload = {
      head_full_name: 'Rajesh Kumar',
      head_age: 45,
      head_gender: 'Male',
      head_mobile_number: '9876543210',
      total_members: 5,
      male_members: 2,
      female_members: 2,
      children_count: 1,
      senior_count: 1,
      house_no: 'H-102',
      locality: 'Shastri Nagar',
      ward: 'Ward 12',
      district: 'Ghaziabad',
      pincode: '201002',
      has_electricity: true,
      has_running_water: true,
      has_indoor_toilet: true,
      has_lpg: true,
      has_internet: true,
      latitude: 28.6692,
      longitude: 77.4538,
      location_accuracy: 15.5
    };

    const submitResponse = await postJson('/api/household', householdPayload, token);
    console.log('Status:', submitResponse.response.status);
    console.log('Response Body:', JSON.stringify(submitResponse.body, null, 2));
    assertStatus(submitResponse.response.status, 201, 'Household submission');

    if (submitResponse.body.household.citizen_id !== citizenId) {
      throw new Error('Inserted household has incorrect citizen_id');
    }
    console.log('✅ Test 1 Passed: Household registered and saved successfully');

    console.log('\n--- Test 2: Double submission check ---');
    const doubleResponse = await postJson('/api/household', householdPayload, token);
    console.log('Status:', doubleResponse.response.status);
    console.log('Response Body:', JSON.stringify(doubleResponse.body, null, 2));
    assertStatus(doubleResponse.response.status, 409, 'Double household submission');
    console.log('✅ Test 2 Passed: Double submission blocked with 409 conflict');

    console.log('\n--- Test 3: Invalid data check (female + male > total) ---');
    const invalidPayload = {
      ...householdPayload,
      male_members: 4,
      female_members: 4, // 4 + 4 = 8, which is > total_members (5)
    };
    const invalidResponse = await postJson('/api/household', invalidPayload, token);
    console.log('Status:', invalidResponse.response.status);
    console.log('Response Body:', JSON.stringify(invalidResponse.body, null, 2));
    assertStatus(invalidResponse.response.status, 400, 'Invalid household submission');
    console.log('✅ Test 3 Passed: Invalid data validation blocked with 400 bad request');

    console.log('\n🎉 ALL HOUSEHOLD ROUTE TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Household API Test Failed:', err);
    process.exitCode = 1;
  } finally {
    if (citizenId) {
      console.log('\n--- Cleanup: Deleting test household and citizen profiles ---');
      await supabase.from('household_profiles').delete().eq('citizen_id', citizenId);
      await supabase.from('citizen_profiles').delete().eq('id', citizenId);
      console.log('🧹 Cleaned up');
    }
    server.close();
  }
}

runTests();
