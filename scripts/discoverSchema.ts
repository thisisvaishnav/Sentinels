import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceRoleKey || supabaseAnonKey);

async function findSchema() {
  console.log("--- Discovering citizen_profiles schema ---");
  
  // Try inserting with minimal fields
  const testRecords = [
    { mobile_number: '9876543210', password: 'password123' },
    { mobile_number: '9876543211', password: 'securepass456' },
  ];

  const { data, error } = await supabase
    .from('citizen_profiles')
    .insert(testRecords)
    .select();

  if (error) {
    console.error("Error:", error.message);
    console.error("Code:", error.code);
  } else {
    console.log("✅ Minimal insert works!");
    console.log("Columns available:", Object.keys(data[0]));
    
    // Now try with more fields
    await testWithMoreFields();
  }
}

async function testWithMoreFields() {
  const fieldsToTest = [
    { mobile_number: '9876543212', password: 'test123', full_name: 'Test User' },
    { mobile_number: '9876543213', password: 'test123', email: 'test@test.com' },
    { mobile_number: '9876543214', password: 'test123', address: '123 Test St' },
  ];

  for (const record of fieldsToTest) {
    const { error } = await supabase.from('citizen_profiles').insert(record);
    if (error) {
      console.log(`❌ Failed with ${Object.keys(record).join(', ')}: ${error.message}`);
    } else {
      console.log(`✅ Works with: ${Object.keys(record).join(', ')}`);
      // Clean up
      await supabase.from('citizen_profiles').delete().eq('mobile_number', record.mobile_number);
    }
  }
}

findSchema();