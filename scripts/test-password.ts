import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const mobile_number = "0192837465";
const password = "IILM@1234";

async function testPassword() {
  const { data: user, error } = await supabase
    .from("citizen_profiles")
    .select("id, full_name, mobile_number, password_hash")
    .eq("mobile_number", mobile_number)
    .maybeSingle();

  if (error) {
    console.error("❌ Database error:", error);
    return;
  }

  if (!user) {
    console.log("❌ User not found");
    return;
  }

  const isCorrect = await bcrypt.compare(password, user.password_hash);

  console.log("\nUSER:");
  console.log("ID:", user.id);
  console.log("Name:", user.full_name);
  console.log("Mobile:", user.mobile_number);

  if (isCorrect) {
    console.log("\n✅ PASSWORD IS CORRECT");
  } else {
    console.log("\n❌ PASSWORD IS INCORRECT");
  }
}

testPassword();
