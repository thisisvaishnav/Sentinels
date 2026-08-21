const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: Supabase credentials not found in environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const initialSchemes = [
  {
    title: 'Pradhan Mantri Awas Yojana (PMAY)',
    description: 'Affordable housing initiative for lower-income and middle-income groups in urban and rural areas.',
    details: 'Provides interest subsidies on home loans and direct financial assistance of up to ₹2.5 Lakhs for construction of houses to eligible beneficiaries.',
    eligibility_criteria: '1. Household income must be below ₹18 Lakhs per annum.\n2. Must not own any pucca house anywhere in India.\n3. The house must be co-owned by a female head of the family.',
    benefit_amount: 'Up to ₹2,50,000 subsidy',
    category: 'Housing',
    status: 'Active'
  },
  {
    title: 'Ayushman Bharat (PM-JAY)',
    description: 'National health insurance scheme providing free health cover to weak and low-income citizens.',
    details: 'Provides cashless health cover of up to ₹5 Lakhs per family per year for secondary and tertiary care hospitalization across public and private empaneled hospitals.',
    eligibility_criteria: '1. Families listed under the SECC database.\n2. Must belong to economically disadvantaged backgrounds.\n3. No members aged 16 to 59 in rural household.',
    benefit_amount: '₹5,00,000 per year health cover',
    category: 'Health',
    status: 'Active'
  },
  {
    title: 'Jal Jeevan Mission (Har Ghar Jal)',
    description: 'Clean tap water connection for every rural and suburban household.',
    details: 'Aims to provide safe and adequate drinking water through individual household tap connections by 2026 to all households in rural India.',
    eligibility_criteria: '1. Must belong to an area with water scarcity or incomplete piped water.\n2. Citizen must possess a registered household profile.',
    benefit_amount: 'Free clean drinking tap water connection',
    category: 'Utility',
    status: 'Active'
  },
  {
    title: 'PM Ujjwala Yojana',
    description: 'Free LPG connection scheme for women belonging to below poverty line (BPL) households.',
    details: 'Aims to provide clean cooking fuel (LPG) to women of underprivileged households to replace unhealthy traditional wood/coal fuels.',
    eligibility_criteria: '1. Woman applicant above 18 years old.\n2. Must belong to a BPL household.\n3. No other LPG connection in the same household.',
    benefit_amount: 'Free LPG cylinder + regulator kit',
    category: 'Utility',
    status: 'Closing Soon'
  },
  {
    title: 'PM Vidya Lakshmi Scheme',
    description: 'Educational loan portal and scholarship program for financially weak students.',
    details: 'Provides single-window electronic portal access for students to apply for educational loans and government scholarships, ensuring no student misses higher education due to financial crunch.',
    eligibility_criteria: '1. Indian citizen seeking admission in higher education courses.\n2. Family income limit of ₹4.5 Lakhs for full interest subsidy.',
    benefit_amount: 'Up to ₹7,50,000 low-interest student loan with full subsidy',
    category: 'Education',
    status: 'Active'
  }
];

async function seedDatabase() {
  console.log("🌱 Starting Supabase Seeding Script...");

  // 1. Seed Schemes
  console.log("Checking for schemes...");
  const { data: existingSchemes, error: fetchErr } = await supabase.from('schemes').select('*');
  if (fetchErr) {
    console.error("❌ Error fetching schemes. Did you run the SQL migration script to create the 'schemes' table? Details:", fetchErr.message);
    process.exit(1);
  }

  let dbSchemes = existingSchemes;
  if (existingSchemes.length === 0) {
    console.log("No schemes found. Inserting seed schemes...");
    const { data: insertedSchemes, error: insertErr } = await supabase.from('schemes').insert(initialSchemes).select();
    if (insertErr) {
      console.error("❌ Error inserting schemes:", insertErr.message);
      process.exit(1);
    }
    console.log(`✅ Seeded ${insertedSchemes.length} schemes successfully!`);
    dbSchemes = insertedSchemes;
  } else {
    console.log(`✅ Table "schemes" already populated with ${existingSchemes.length} records.`);
  }

  // 2. Fetch a test citizen profile to link applications and support tickets
  const { data: citizens, error: citizenErr } = await supabase.from('citizen_profiles').select('id, full_name').limit(1);
  if (citizenErr || !citizens || citizens.length === 0) {
    console.warn("⚠️ No citizen profiles found in the database. Please register a citizen user first to seed applications and support tickets.");
    console.log("Database seed completed (schemes only).");
    return;
  }

  const testCitizenId = citizens[0].id;
  console.log(`Found test citizen profile: ${citizens[0].full_name} (${testCitizenId})`);

  // 3. Seed test applications if they don't exist
  const { data: existingApps, error: appsErr } = await supabase
    .from('citizen_scheme_applications')
    .select('*')
    .eq('citizen_id', testCitizenId);
    
  if (appsErr) {
    console.error("❌ Error fetching scheme applications. Verify table exists. Error:", appsErr.message);
  } else if (existingApps.length === 0 && dbSchemes.length > 0) {
    console.log("Inserting test scheme applications for user...");
    const testApps = [
      {
        citizen_id: testCitizenId,
        scheme_id: dbSchemes[0].id, // PMAY
        status: 'Under Verification',
        remarks: 'Regional officer has scheduled physical verification of land title.'
      },
      {
        citizen_id: testCitizenId,
        scheme_id: dbSchemes[1].id, // Ayushman Bharat
        status: 'Approved',
        remarks: 'e-Card generated successfully. Download option enabled.'
      }
    ];
    const { error: appInsertErr } = await supabase.from('citizen_scheme_applications').insert(testApps);
    if (appInsertErr) {
      console.error("❌ Error inserting applications:", appInsertErr.message);
    } else {
      console.log("✅ Seeded test scheme applications successfully!");
    }
  } else {
    console.log("✅ Citizen already has scheme applications seeded.");
  }

  // 4. Seed test support tickets if they don't exist
  const { data: existingTickets, error: ticketErr } = await supabase
    .from('support_tickets')
    .select('*')
    .eq('citizen_id', testCitizenId);

  if (ticketErr) {
    console.error("❌ Error fetching support tickets. Verify table exists. Error:", ticketErr.message);
  } else if (existingTickets.length === 0) {
    console.log("Inserting test support tickets for user...");
    const testTickets = [
      {
        citizen_id: testCitizenId,
        subject: 'Inquiry regarding PMAY Subsidy Release Timeline',
        description: 'My application for Pradhan Mantri Awas Yojana (PMAY) is approved, and verification is complete. I would like to know when the first installment of the interest subsidy will be credited to my bank account.',
        category: 'Scheme Inquiry',
        priority: 'Medium',
        status: 'In Progress'
      },
      {
        citizen_id: testCitizenId,
        subject: 'Typo in Locality Name on Household Profile',
        description: 'I submitted my household profile yesterday but noticed a spelling error in my locality field. It is written as "Shastry Nagar" instead of "Shastri Nagar". Please help update it.',
        category: 'Household Registration',
        priority: 'Low',
        status: 'Resolved'
      }
    ];
    const { error: ticketInsertErr } = await supabase.from('support_tickets').insert(testTickets);
    if (ticketInsertErr) {
      console.error("❌ Error inserting support tickets:", ticketInsertErr.message);
    } else {
      console.log("✅ Seeded test support tickets successfully!");
    }
  } else {
    console.log("✅ Citizen already has support tickets seeded.");
  }

  console.log("🌱 Database seeding complete!");
}

seedDatabase();
