-- Run this in Supabase Dashboard > SQL Editor
-- This inserts synthetic test data for citizen_profiles

INSERT INTO citizen_profiles (mobile_number, password, full_name, email, address, created_at)
VALUES 
  ('9876543210', 'password123', 'John Doe', 'john.doe@example.com', '123 Main St, New York, NY 10001', NOW()),
  ('9876543211', 'securepass456', 'Jane Smith', 'jane.smith@example.com', '456 Oak Ave, Los Angeles, CA 90001', NOW()),
  ('9876543212', 'mypassword789', 'Bob Johnson', 'bob.j@example.com', '789 Pine Rd, Chicago, IL 60601', NOW()),
  ('9876543213', 'testpass123', 'Alice Williams', 'alice.w@example.com', '321 Elm Blvd, Houston, TX 77001', NOW()),
  ('9876543214', 'demo2024', 'Charlie Brown', 'charlie.b@example.com', '654 Maple Dr, Phoenix, AZ 85001', NOW()),
  ('9876543215', 'welcome1', 'Diana Prince', 'diana.p@example.com', '987 Cedar Ln, Philadelphia, PA 19101', NOW()),
  ('9876543216', 'secret456', 'Edward Norton', 'ed.n@example.com', '147 Birch Ct, San Antonio, TX 78201', NOW()),
  ('9876543217', 'access789', 'Fiona Gallagher', 'fiona.g@example.com', '258 Spruce Way, San Diego, CA 92101', NOW()),
  ('9876543218', 'login321', 'George Miller', 'george.m@example.com', '369 Willow Pl, Dallas, TX 75201', NOW()),
  ('9876543219', 'entry654', 'Hannah Montana', 'hannah.m@example.com', '741 Aspen Dr, San Jose, CA 95101', NOW());

-- Verify insertion
SELECT * FROM citizen_profiles ORDER BY created_at DESC;