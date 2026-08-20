import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAllRecords() {
  console.log("--- Checking ALL records in citizen_profiles ---");
  
  const { data, error, count } = await supabase
    .from('citizen_profiles')
    .select('*', { count: 'exact', head: false });

  if (error) {
    console.error("❌ Query failed:", error.message);
  } else {
    console.log(`Total records: ${count}`);
    console.log("Records:", data);
  }
}

checkAllRecords();