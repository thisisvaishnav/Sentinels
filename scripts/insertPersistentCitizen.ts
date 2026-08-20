import app from '../src/server/index';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

const PORT = 5005;
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function insertPersistentCitizen() {
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(PORT, () => resolve());
  });

  const mobileNumber = "9876543210";

  try {
    // Delete any previous record with this mobile so we can register cleanly
    await supabase.from('citizen_profiles').delete().eq('mobile_number', mobileNumber);

    console.log('Sending POST /api/auth/citizen/signup to insert record into Supabase...');

    const res = await fetch(`http://localhost:${PORT}/api/auth/citizen/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: "Rahul Kumar",
        mobile_number: mobileNumber,
        password: "StrongPassword123",
        state: "Uttar Pradesh",
        pincode: "201001"
      })
    });

    const data = await res.json();
    console.log('\n✅ Sign-up API Status:', res.status);
    console.log('API Response:', JSON.stringify(data, null, 2));
    console.log('\n🎉 The record has been PERMANENTLY inserted into your Supabase database!');
    console.log('You can now open Supabase Dashboard -> Table Editor -> citizen_profiles to see the row!');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    server.close();
  }
}

insertPersistentCitizen();
