import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import "dotenv/config";
import {
  authenticateCitizen,
  AuthenticatedRequest,
} from "../middleware/authenticateCitizen";

dotenv.config();

const router = Router();
router.get('/test', (_req, res) => {
  res.json({ message: 'Auth router itself works' });
});

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_jwt_secret_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Validation Schema for Citizen Signup
const citizenSignupSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  mobile_number: z.string().regex(/^[0-9]{10}$/, 'Mobile number must be a 10-digit number'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().regex(/^[0-9]{6}$/, 'Pincode must be a 6-digit number'),
});

// Validation Schema for Citizen Login
const citizenLoginSchema = z.object({
  mobile_number: z.string().trim().regex(/^[0-9]{10}$/, 'Mobile number must be a 10-digit number'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * POST /api/auth/citizen/signup
 * Registers a new citizen profile.
 */
router.post('/citizen/signup', async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Validate Input
    const parseResult = citizenSignupSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { full_name, mobile_number, password, state, pincode } = parseResult.data;

    // 2. Check if mobile_number already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('citizen_profiles')
      .select('id')
      .eq('mobile_number', mobile_number.trim())
      .maybeSingle();

    if (checkError) {
      console.error('[Signup Check Error]:', checkError);
      res.status(500).json({ error: 'Database check failed' });
      return;
    }

    if (existingUser) {
      res.status(409).json({ error: 'Mobile number already registered' });
      return;
    }

    // 3. Hash Password with bcrypt
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // 4. INSERT into citizen_profiles
    const { data: insertedUser, error: insertError } = await supabase
      .from('citizen_profiles')
      .insert({
        full_name: full_name.trim(),
        mobile_number: mobile_number.trim(),
        password_hash,
        state: state.trim(),
        pincode: pincode.trim(),
      })
      .select('id, full_name, mobile_number, state, pincode')
      .single();

    if (insertError || !insertedUser) {
      console.error('[Signup Insert Error]:', insertError);
      res.status(500).json({ error: 'Failed to create citizen profile' });
      return;
    }

    // 5. Generate JWT
    const token = jwt.sign(
      {
        id: insertedUser.id,
        mobile_number: insertedUser.mobile_number,
        role: 'citizen',
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );

    // 6. Return user + token response
    res.status(201).json({
      message: 'Citizen registered successfully',
      user: {
        id: insertedUser.id,
        full_name: insertedUser.full_name,
        mobile_number: insertedUser.mobile_number,
        state: insertedUser.state,
        pincode: insertedUser.pincode,
      },
      token,
    });
  } catch (err: any) {
    console.error('[Citizen Signup Error]:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/citizen/login
 * Endpoint to authenticate a Citizen profile
 */
router.post('/citizen/login', async (req: Request, res: Response): Promise<void> => {
  try {
    // Step 1: Input Validation
    const parseResult = citizenLoginSchema.safeParse(req.body);
    if (!parseResult.success) {
      const fieldErrors = parseResult.error.flatten().fieldErrors;
      const errorMsg = fieldErrors.mobile_number?.[0] || fieldErrors.password?.[0] || 'Validation failed';
      res.status(400).json({
        error: errorMsg,
        details: fieldErrors,
        code: 'validation_failed',
      });
      return;
    }

    const { mobile_number, password } = parseResult.data;

    // Step 2: Fetch user profile from Supabase PostgreSQL
    const { data: user, error: fetchError } = await supabase
      .from('citizen_profiles')
      .select('id, full_name, mobile_number, password_hash, state, pincode')
      .eq('mobile_number', mobile_number)
      .maybeSingle();

    if (fetchError) {
      console.error('[Citizen Login Database Error]:', fetchError);
      res.status(500).json({ error: 'Database query failed' });
      return;
    }

    if (!user) {
      res.status(404).json({ error: 'Mobile number is not registered', code: 'mobile_not_found' });
      return;
    }

    if (!user.password_hash) {
      console.error('[Citizen Login Error]: Missing password_hash for citizen', user.id);
      res.status(500).json({ error: 'Citizen credentials are not configured', code: 'credentials_not_configured' });
      return;
    }

    // Step 3: Verify Password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Incorrect password', code: 'incorrect_password' });
      return;
    }

    // Step 4: Generate JWT Token
    const token = jwt.sign(
      {
        id: user.id,
        mobile_number: user.mobile_number,
        role: 'citizen',
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );

    // Step 5: Return Response
    res.status(200).json({
      message: 'Citizen login successful',
      user: {
        id: user.id,
        full_name: user.full_name,
        mobile_number: user.mobile_number,
        state: user.state,
        pincode: user.pincode,
      },
      token,
    });
  } catch (err: any) {
    console.error('[Citizen Login Error]:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/citizen/profile',
  authenticateCitizen,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const citizenId = req.citizen!.id;

      const { data: user, error } = await supabase
        .from('citizen_profiles')
        .select('id, full_name, mobile_number, state, pincode')
        .eq('id', citizenId)
        .single();

      if (error) {
        console.error('[Citizen Profile Error]:', error);
        res.status(500).json({
          error: 'Failed to fetch citizen profile',
        });
        return;
      }

      res.status(200).json({
        user,
      });
    } catch (err) {
      console.error('[Citizen Profile Error]:', err);
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  }
);
console.log("🔥 authRoutes loaded, router:", router);

router.get(
  '/citizen/household-status',
  authenticateCitizen,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const citizenId = req.citizen!.id;

      const { data: household, error } = await supabase
        .from('household_profiles')
        .select('id')
        .eq('citizen_id', citizenId)
        .maybeSingle();

      if (error) {
        console.error('[Household Status Error]:', error);

        res.status(500).json({
          error: 'Failed to check household status',
        });

        return;
      }

      res.status(200).json({
        completed: !!household,
        household_id: household?.id ?? null,
      });
    } catch (err) {
      console.error('[Household Status Error]:', err);

      res.status(500).json({
        error: 'Internal server error',
      });
    }
  }
);

export default router;
