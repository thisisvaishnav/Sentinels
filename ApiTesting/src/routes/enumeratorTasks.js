const express = require("express");
const { supabaseAdmin } = require("../lib/supabaseAdmin");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.post("/tasks", requireAuth, async (req, res) => {
  const { householdId, structureId, enumeratorId, priorityScore, priorityReason } =
    req.body || {};

  if (!enumeratorId) {
    return res.status(400).json({ success: false, message: "enumeratorId is required" });
  }

  const hasHousehold = !!householdId;
  const hasStructure = !!structureId;

  if (hasHousehold === hasStructure) {
    return res.status(400).json({
      success: false,
      message: "Provide exactly one of householdId or structureId, not both or neither",
    });
  }

  const { data, error } = await supabaseAdmin
    .from("verification_tasks")
    .insert({
      household_id: householdId ?? null,
      structure_id: structureId ?? null,
      enumerator_id: enumeratorId,
      status: "assigned",
      priority_score: priorityScore ?? 0,
      priority_reason: priorityReason ?? null,
      assigned_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }

  return res.status(201).json({ success: true, task: data });
});

router.get("/tasks", requireAuth, requireRole("enumerator"), async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from("verification_tasks")
    .select(
      `
      id, status, priority_score, priority_reason, assigned_at, completed_at,
      household_profiles ( id, head_full_name, house_no, locality, ward, pincode ),
      structures ( structure_id, area_id, latitude, longitude, structure_type )
    `
    )
    .eq("enumerator_id", req.user.id)
    .order("priority_score", { ascending: false });

  if (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }

  return res.status(200).json({ success: true, tasks: data });
});

router.get("/tasks/:id", requireAuth, requireRole("enumerator"), async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from("verification_tasks")
    .select(
      `
      *,
      household_profiles (*),
      structures (*),
      task_visit_logs ( id, outcome, notes, visited_at )
    `
    )
    .eq("id", req.params.id)
    .eq("enumerator_id", req.user.id)
    .maybeSingle();

  if (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }

  if (!data) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }

  return res.status(200).json({ success: true, task: data });
});

router.patch("/tasks/:id", requireAuth, requireRole("enumerator"), async (req, res) => {
  const { status } = req.body || {};

  if (status !== "in_progress") {
    return res.status(400).json({
      success: false,
      message: "Only 'in_progress' is supported here -- use POST /tasks/:id/visit to complete a task",
    });
  }

  const { data, error } = await supabaseAdmin
    .from("verification_tasks")
    .update({ status: "in_progress" })
    .eq("id", req.params.id)
    .eq("enumerator_id", req.user.id)
    .select("*")
    .maybeSingle();

  if (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
  if (!data) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }

  return res.status(200).json({ success: true, task: data });
});

const VALID_OUTCOMES = [
  "verified",
  "not_home",
  "refused",
  "incorrect_address",
  "duplicate_found",
  "unmapped_confirmed",
];

router.post("/tasks/:id/visit", requireAuth, requireRole("enumerator"), async (req, res) => {
  const { outcome, notes } = req.body || {};

  if (!VALID_OUTCOMES.includes(outcome)) {
    return res.status(400).json({
      success: false,
      message: `outcome must be one of: ${VALID_OUTCOMES.join(", ")}`,
    });
  }

  const { data: task, error: fetchError } = await supabaseAdmin
    .from("verification_tasks")
    .select("id, enumerator_id")
    .eq("id", req.params.id)
    .eq("enumerator_id", req.user.id)
    .maybeSingle();

  if (fetchError) {
    console.error(fetchError);
    return res.status(500).json({ success: false, message: "Server error" });
  }
  if (!task) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }

  const { data: visitLog, error: logError } = await supabaseAdmin
    .from("task_visit_logs")
    .insert({
      task_id: task.id,
      outcome,
      notes: notes ?? null,
    })
    .select("*")
    .single();

  if (logError) {
    console.error(logError);
    return res.status(500).json({ success: false, message: "Server error" });
  }

  const { data: updatedTask, error: updateError } = await supabaseAdmin
    .from("verification_tasks")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", task.id)
    .select("*")
    .single();

  if (updateError) {
    console.error(updateError);
    return res.status(500).json({
      success: false,
      message: "Visit logged, but failed to mark the task completed",
    });
  }

  return res.status(201).json({ success: true, visit: visitLog, task: updatedTask });
});

module.exports = router;