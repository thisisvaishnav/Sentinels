const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: Supabase credentials not found in environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log("Checking tables on Supabase...");
  
  const tables = ['citizen_profiles', 'household_profiles', 'schemes', 'citizen_scheme_applications', 'support_tickets'];
  
  for (const table of tables) {
    try {
      const { data, error, status } = await supabase
        .from(table)
        .select('*')
        .limit(1);
        
      if (error) {
        if (status === 404 || error.code === 'P0001' || error.message.includes('does not exist')) {
          console.log(`❌ Table "${table}" does not exist.`);
        } else {
          console.log(`⚠️ Table "${table}" returned error: ${error.message} (Code: ${error.code})`);
        }
      } else {
        console.log(`✅ Table "${table}" exists! Found ${data.length} test rows.`);
      }
    } catch (err) {
      console.log(`❌ Table "${table}" query threw exception:`, err.message);
    }
  }
}

checkTables();
