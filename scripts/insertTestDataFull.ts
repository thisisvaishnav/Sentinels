import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Use service role key if available (bypasses RLS)
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceRoleKey || supabaseAnonKey);

async function insertTestData() {
  console.log("--- Inserting Synthetic Test Data ---");
  
  const testCitizens = [
    { mobile_number: '9876543210', password: 'password123', full_name: 'John Doe', email: 'john.doe@example.com', address: '123 Main St, New York, NY 10001' },
    { mobile_number: '9876543211', password: 'securepass456', full_name: 'Jane Smith', email: 'jane.smith@example.com', address: '456 Oak Ave, Los Angeles, CA 90001' },
    { mobile_number: '9876543212', password: 'mypassword789', full_name: 'Bob Johnson', email: 'bob.j@example.com', address: '789 Pine Rd, Chicago, IL 60601' },
    { mobile_number: '9876543213', password: 'testpass123', full_name: 'Alice Williams', email: 'alice.w@example.com', address: '321 Elm Blvd, Houston, TX 77001' },
    { mobile_number: '9876543214', password: 'demo2024', full_name: 'Charlie Brown', email: 'charlie.b@example.com', address: '654 Maple Dr, Phoenix, AZ 85001' },
    { mobile_number: '9876543215', password: 'welcome1', full_name: 'Diana Prince', email: 'diana.p@example.com', address: '987 Cedar Ln, Philadelphia, PA 19101' },
    { mobile_number: '9876543216', password: 'secret456', full_name: 'Edward Norton', email: 'ed.n@example.com', address: '147 Birch Ct, San Antonio, TX 78201' },
    { mobile_number: '9876543217', password: 'access789', full_name: 'Fiona Gallagher', email: 'fiona.g@example.com', address: '258 Spruce Way, San Diego, CA 92101' },
    { mobile_number: '9876543218', password: 'login321', full_name: 'George Miller', email: 'george.m@example.com', address: '369 Willow Pl, Dallas, TX 75201' },
    { mobile_number: '9876543219', password: 'entry654', full_name: 'Hannah Montana', email: 'hannah.m@example.com', address: '741 Aspen Dr, San Jose, CA 95101' },
  ];

  const { data, error } = await supabase
    .from('citizen_profiles')
    .insert(testCitizens)
    .select();

  if (error) {
    console.error("❌ Insert failed:", error.message);
    console.error("Code:", error.code);
    if (error.code === '42501') {
      console.log("\n⚠️ RLS is blocking inserts. You need to:");
      console.log("1. Go to Supabase Dashboard → SQL Editor");
      console.log("2. Run the SQL from scripts/insert-test-data.sql");
      console.log("OR");
      console.log("3. Add SUPABASE_SERVICE_ROLE_KEY to .env file");
    }
  } else {
    console.log("✅ Test data inserted successfully!");
    console.log("Inserted:", data?.length, "records");
    data?.forEach(d => console.log(`  - ${d.mobile_number}: ${d.full_name}`));
  }
}

insertTestData();