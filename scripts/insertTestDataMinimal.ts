import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function insertTestData() {
  console.log("--- Inserting Test Citizen Data (minimal fields) ---");
  
  // Based on the search query, we know mobile_number and password exist
  const testCitizens = [
    {
      mobile_number: "9876543210",
      password: "password123",
    },
    {
      mobile_number: "9876543211",
      password: "securepass456",
    },
    {
      mobile_number: "9876543212",
      password: "mypassword789",
    }
  ];

  const { data, error } = await supabase
    .from('citizen_profiles')
    .insert(testCitizens)
    .select();

  if (error) {
    console.error("❌ Insert failed:", error.message);
    console.error("Code:", error.code);
    console.error("Details:", error.details);
    console.error("Hint:", error.hint);
  } else {
    console.log("✅ Test data inserted successfully!");
    console.log("Inserted records:", data);
  }
}

insertTestData();