import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

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

export default router;
