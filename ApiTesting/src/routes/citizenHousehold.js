const express = require("express");
const { supabaseAdmin } = require("../lib/supabaseAdmin");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.post("/household", requireAuth, requireRole("citizen"), async (req, res) => {
  const {
    headFullName,
    headAge,
    headGender,
    headMobileNumber,
    totalMembers,
    maleMembers,
    femaleMembers,
    childrenCount,
    seniorCount,
    houseNo,
    locality,
    ward,
    district,
    pincode,
    hasElectricity,
    hasRunningWater,
    hasIndoorToilet,
    hasLpg,
    hasInternet,
    latitude,
    longitude,
    locationAccuracy,
  } = req.body || {};

  if (!headFullName || !pincode) {
    return res.status(400).json({
      success: false,
      message: "headFullName and pincode are required",
    });
  }

  const { data, error } = await supabaseAdmin
    .from("household_profiles")
    .insert({
      citizen_id: req.user.id,
      head_full_name: headFullName,
      head_age: headAge ?? null,
      head_gender: headGender ?? null,
      head_mobile_number: headMobileNumber ?? null,
      total_members: totalMembers ?? 1,
      male_members: maleMembers ?? 0,
      female_members: femaleMembers ?? 0,
      children_count: childrenCount ?? 0,
      senior_count: seniorCount ?? 0,
      house_no: houseNo ?? null,
      locality: locality ?? null,
      ward: ward ?? null,
      district: district ?? null,
      pincode,
      has_electricity: !!hasElectricity,
      has_running_water: !!hasRunningWater,
      has_indoor_toilet: !!hasIndoorToilet,
      has_lpg: !!hasLpg,
      has_internet: !!hasInternet,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      location_accuracy: locationAccuracy ?? null,
    })
    .select("*")
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }

  return res.status(201).json({ success: true, household: data });
});

router.get("/household", requireAuth, requireRole("citizen"), async (req, res) => {
  const { data: households, error } = await supabaseAdmin
    .from("household_profiles")
    .select("*")
    .eq("citizen_id", req.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }

  if (!households || households.length === 0) {
    return res.status(200).json({ success: true, households: [] });
  }

  const householdIds = households.map((h) => h.id);

  const { data: tasks, error: tasksError } = await supabaseAdmin
    .from("verification_tasks")
    .select(
      `
      id, household_id, status, priority_score, assigned_at, completed_at,
      task_visit_logs ( id, outcome, notes, visited_at )
    `
    )
    .in("household_id", householdIds);

  if (tasksError) {
    console.error(tasksError);
    return res.status(500).json({ success: false, message: "Server error" });
  }

  const householdsWithTasks = households.map((h) => ({
    ...h,
    tasks: (tasks || []).filter((t) => t.household_id === h.id),
  }));

  return res.status(200).json({ success: true, households: householdsWithTasks });
});

module.exports = router;