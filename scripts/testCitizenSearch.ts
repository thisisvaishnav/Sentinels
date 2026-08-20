import { supabase } from "../src/lib/supabase";

/**
 * Helper function to query/authenticate a citizen profile by mobile number and password.
 */
export async function searchCitizenProfile(mobileNumber: string, password: string) {
  const { data, error } = await supabase
    .from("citizen_profiles")
    .select("*")
    .eq("mobile_number", mobileNumber.trim())
    .eq("password", password)
    .maybeSingle();

  if (error) {
    console.error("[Search Error]:", error.message);
    return { success: false, error, data: null };
  }

  if (!data) {
    return { success: false, error: null, data: null };
  }

  return { success: true, error: null, data };
}

/**
 * Runnable test execution script
 */
async function runTest() {
  console.log("--- Testing Supabase Search for Citizen Sign-In ---");

  // Sample credentials to query
  const testMobile = "9876543210";
  const testPassword = "password123";

  console.log(`Searching for mobile: ${testMobile}...`);
  const result = await searchCitizenProfile(testMobile, testPassword);

  if (result.error) {
    console.log("❌ DB Search Failed:", result.error);
  } else if (!result.data) {
    console.log("⚠️ Search finished: No citizen account found with provided credentials.");
  } else {
    console.log("✅ Search successful! Found Citizen profile:", result.data);
  }
}

// Execute test
runTest();
