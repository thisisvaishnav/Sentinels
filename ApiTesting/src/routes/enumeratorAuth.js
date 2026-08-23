const express = require("express");
const jwt = require("jsonwebtoken");
const { supabaseAdmin } = require("../lib/supabaseAdmin");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

router.post("/enumerator/login", async (req, res) => {
  const { enumeratorId, securityKey } = req.body || {};

  if (!enumeratorId || !securityKey) {
    return res.status(400).json({
      success: false,
      message: "enumeratorId and securityKey are required",
    });
  }

  const { data, error } = await supabaseAdmin.rpc("verify_enumerator_login", {
    p_enumerator_id: enumeratorId,
    p_security_key: securityKey,
  });

  if (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }

  const enumerator = Array.isArray(data) ? data[0] : data;

  if (!enumerator) {
    return res.status(401).json({
      success: false,
      message: "Invalid enumerator ID or security key",
    });
  }

  const token = jwt.sign(
    { id: enumerator.user_id, role: "enumerator" },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    enumerator: {
      id: enumerator.user_id,
      enumeratorId: enumerator.enumerator_id,
    },
  });
});

module.exports = router;