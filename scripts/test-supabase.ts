import { createClient } from '@supabase/supabase-js';
import "dotenv/config";
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function test() {
  const mobile_number = '9876543210'; // change this

  console.log('🔍 Searching for:', mobile_number);

  const { data: user, error } = await supabase
    .from('citizen_profiles')
    .select('id, full_name, mobile_number, password_hash, state, pincode')
    .eq('mobile_number', mobile_number)
    .maybeSingle();

  console.log('\n📦 USER:');
  console.log(user);

  console.log('\n❌ ERROR:');
  console.log(error);

  if (error) {
    console.log('\n❌ Supabase query FAILED');
    return;
  }

  if (!user) {
    console.log('\n⚠️ Query worked, but citizen was NOT found');
    return;
  }

  console.log('\n✅ Supabase query is WORKING');
  console.log('Citizen:', user.full_name);
  console.log('Mobile:', user.mobile_number);
  console.log('id:', user.id);
}

test();
