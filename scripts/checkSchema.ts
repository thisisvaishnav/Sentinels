import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
  console.log("--- Checking citizen_profiles Schema ---");
  
  // Try to insert with minimal fields to see what columns exist
  const { data, error } = await supabase
    .from('citizen_profiles')
    .insert({ mobile_number: "9876543210", password: "password123" })
    .select();

  if (error) {
    console.error("Error:", error.message);
    console.error("Code:", error.code);
    console.error("Details:", error.details);
    console.error("Hint:", error.hint);
  } else {
    console.log("Success:", data);
    // Clean up test record
    await supabase.from('citizen_profiles').delete().eq('mobile_number', '9876543210');
  }
}

checkSchema();