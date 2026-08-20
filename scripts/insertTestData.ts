import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function insertTestData() {
  console.log("--- Inserting Test Citizen Data ---");
  
  const testCitizens = [
    {
      mobile_number: "9876543210",
      password: "password123",
      full_name: "John Doe",
      email: "john.doe@example.com",
      address: "123 Main St, City",
      created_at: new Date().toISOString()
    },
    {
      mobile_number: "9876543211",
      password: "securepass456",
      full_name: "Jane Smith",
      email: "jane.smith@example.com",
      address: "456 Oak Ave, Town",
      created_at: new Date().toISOString()
    },
    {
      mobile_number: "9876543212",
      password: "mypassword789",
      full_name: "Bob Johnson",
      email: "bob.j@example.com",
      address: "789 Pine Rd, Village",
      created_at: new Date().toISOString()
    }
  ];

  const { data, error } = await supabase
    .from('citizen_profiles')
    .insert(testCitizens)
    .select();

  if (error) {
    console.error("❌ Insert failed:", error.message);
    console.error("Details:", error);
  } else {
    console.log("✅ Test data inserted successfully!");
    console.log("Inserted records:", data);
  }
}

insertTestData();