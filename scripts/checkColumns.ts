import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkColumns() {
  console.log("--- Checking citizen_profiles Columns ---");
  
  // Query information_schema for column details
  const { data, error } = await supabase
    .rpc('get_columns', { table_name: 'citizen_profiles' });
  
  if (error) {
    console.log("RPC not available, trying direct query...");
    // We can't directly query information_schema from client, 
    // but we can try selecting with all columns to see what returns
    const { data: sample, error: err2 } = await supabase
      .from('citizen_profiles')
      .select('*')
      .limit(1);
    
    if (err2) {
      console.error("Error:", err2.message);
    } else {
      console.log("Sample row structure (empty):", sample);
      console.log("Columns would be the keys of any returned object");
    }
  } else {
    console.log("Columns:", data);
  }
}

checkColumns();