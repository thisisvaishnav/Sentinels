const express = require("express");
const jwt = require("jsonwebtoken");
const { supabaseAdmin } = require("../lib/supabaseAdmin");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const MOBILE_REGEX = /^[6-9]\d{9}$/;
const PINCODE_REGEX = /^\d{6}$/;

function validateSignup(body) {
  const errors = [];
  if (!body.fullName || !body.fullName.trim()) errors.push("Full name is required");
  if (!body.mobileNumber || !MOBILE_REGEX.test(body.mobileNumber))
    errors.push("Enter a valid 10-digit Indian mobile number");
  if (!body.password || body.password.length < 6)
    errors.push("Password must be at least 6 characters");
  if (!body.state || !body.state.trim()) errors.push("State is required");
  if (!body.pincode || !PINCODE_REGEX.test(body.pincode))
    errors.push("Enter a valid 6-digit pincode");
  return errors;
}

function validateLogin(body) {
  const errors = [];
  if (!body.mobileNumber || !MOBILE_REGEX.test(body.mobileNumber))
    errors.push("Enter a valid 10-digit Indian mobile number");
  if (!body.password) errors.push("Password is required");
  return errors;
}

function generateCitizenToken(citizenId) {
  return jwt.sign({ id: citizenId, role: "citizen" }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

router.post("/citizen/signup", async (req, res) => {
  const { fullName, mobileNumber, password, state, pincode } = req.body || {};

  const errors = validateSignup({ fullName, mobileNumber, password, state, pincode });
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const { data, error } = await supabaseAdmin.rpc("register_citizen", {
    p_full_name: fullName,
    p_mobile_number: mobileNumber,
    p_password: password,
    p_state: state,
    p_pincode: pincode,
  });

  if (error) {
    if (error.message && error.message.includes("MOBILE_ALREADY_REGISTERED")) {
      return res.status(409).json({
        success: false,
        message: "An account with this mobile number already exists",
      });
    }
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }

  const citizen = Array.isArray(data) ? data[0] : data;
  if (!citizen) {
    return res.status(500).json({ success: false, message: "Server error" });
  }

  const token = generateCitizenToken(citizen.id);

  return res.status(201).json({
    success: true,
    message: "Signup successful",
    token,
    citizen: {
      id: citizen.id,
      fullName: citizen.full_name,
      mobileNumber: citizen.mobile_number,
      state: citizen.state,
      pincode: citizen.pincode,
    },
  });
});

router.post("/citizen/login", async (req, res) => {
  const { mobileNumber, password } = req.body || {};

  const errors = validateLogin({ mobileNumber, password });
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const { data, error } = await supabaseAdmin.rpc("verify_citizen_login", {
    p_mobile_number: mobileNumber,
    p_password: password,
  });

  if (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }

  const citizen = Array.isArray(data) ? data[0] : data;
  if (!citizen) {
    return res.status(401).json({
      success: false,
      message: "Invalid mobile number or password",
    });
  }

  const token = generateCitizenToken(citizen.id);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    citizen: {
      id: citizen.id,
      fullName: citizen.full_name,
      mobileNumber: citizen.mobile_number,
      state: citizen.state,
      pincode: citizen.pincode,
    },
  });
});

module.exports = router;