import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  console.log("--- Checking Supabase Tables ---");
  
  // Query to get all tables in public schema
  const { data: tables, error } = await supabase
    .rpc('get_tables');
  
  if (error) {
    // Try alternative approach - query information_schema
    const { data, error: err2 } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (err2) {
      console.log("Trying to query citizen_profiles directly...");
      const { data: citizens, error: err3 } = await supabase
        .from('citizen_profiles')
        .select('*')
        .limit(10);
      
      if (err3) {
        console.error("Error querying citizen_profiles:", err3.message);
      } else {
        console.log("citizen_profiles table exists. Sample data:", citizens);
      }
    } else {
      console.log("Tables found:", data);
    }
  } else {
    console.log("Tables:", tables);
  }
}

checkTables();