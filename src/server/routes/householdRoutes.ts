import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { Response, Router } from 'express';
import { z } from 'zod';
import {
    authenticateCitizen,
    AuthenticatedRequest,
} from '../middleware/authenticateCitizen';

dotenv.config();

const router = Router();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

// Validation Schema for Household Payload
const householdSchema = z.object({
  head_full_name: z.string().trim().min(2, 'Full name is required'),
  head_age: z.number().int().min(1).max(120),
  head_gender: z.enum(['Male', 'Female', 'Other']),
  head_mobile_number: z.string().regex(/^[0-9]{10}$/, 'Enter a valid 10-digit mobile number'),
  total_members: z.number().int().min(1),
  male_members: z.number().int().min(0),
  female_members: z.number().int().min(0),
  children_count: z.number().int().min(0),
  senior_count: z.number().int().min(0),
  house_no: z.string().trim().min(1, 'House / Flat number is required'),
  locality: z.string().trim().min(1, 'Locality / Street is required'),
  ward: z.string().trim().min(1, 'Ward is required'),
  district: z.string().trim().min(1, 'District is required'),
  pincode: z.string().regex(/^[0-9]{6}$/, 'Enter a valid 6-digit PIN code'),
  has_electricity: z.boolean(),
  has_running_water: z.boolean(),
  has_indoor_toilet: z.boolean(),
  has_lpg: z.boolean(),
  has_internet: z.boolean(),
  latitude: z.number(),
  longitude: z.number(),
  location_accuracy: z.number().nullable().optional(),
});

const backendHouseholdSchema = householdSchema.superRefine((data, ctx) => {
  if (data.male_members + data.female_members > data.total_members) {
    ctx.addIssue({
      code: 'custom',
      message: 'Male + Female cannot exceed total members',
      path: ['total_members'],
    });
  }
  if (data.children_count > data.total_members) {
    ctx.addIssue({
      code: 'custom',
      message: 'Children cannot exceed total members',
      path: ['children_count'],
    });
  }
  if (data.senior_count > data.total_members) {
    ctx.addIssue({
      code: 'custom',
      message: 'Seniors cannot exceed total members',
      path: ['senior_count'],
    });
  }
});

/**
 * GET /api/household/me
 * Returns the authenticated citizen's household profile if it exists.
 */
router.get(
  '/me',
  authenticateCitizen,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const citizenId = req.citizen!.id;

      const { data: household, error } = await supabase
        .from('household_profiles')
        .select('*')
        .eq('citizen_id', citizenId)
        .maybeSingle();

      if (error) {
        console.error('[Household Profile Fetch Error]:', error);
        res.status(500).json({ error: 'Failed to fetch household profile' });
        return;
      }

      if (!household) {
        res.status(404).json({ error: 'Household profile not found' });
        return;
      }

      res.status(200).json({ household });
    } catch (err: any) {
      console.error('[Household Profile Fetch Error]:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * POST /api/household
 * Registers a new household profile for the authenticated citizen.
 */
router.post(
  '/',
  authenticateCitizen,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const citizenId = req.citizen!.id;

      // 1. Validate Input Payload
      const parseResult = backendHouseholdSchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: parseResult.error.flatten().fieldErrors,
        });
        return;
      }

      const {
        head_full_name,
        head_age,
        head_gender,
        head_mobile_number,
        total_members,
        male_members,
        female_members,
        children_count,
        senior_count,
        house_no,
        locality,
        ward,
        district,
        pincode,
        has_electricity,
        has_running_water,
        has_indoor_toilet,
        has_lpg,
        has_internet,
        latitude,
        longitude,
        location_accuracy,
      } = parseResult.data;

      // 2. Check if citizen already has a registered household
      const { data: existingHousehold, error: checkError } = await supabase
        .from('household_profiles')
        .select('id')
        .eq('citizen_id', citizenId)
        .maybeSingle();

      if (checkError) {
        console.error('[Household Register Check Error]:', checkError);
        res.status(500).json({ error: 'Database check failed' });
        return;
      }

      if (existingHousehold) {
        res.status(409).json({
          error: 'Household profile already registered for this citizen',
        });
        return;
      }

      // 3. Insert household record into Supabase
      const { data: insertedHousehold, error: insertError } = await supabase
        .from('household_profiles')
        .insert({
          citizen_id: citizenId,
          head_full_name,
          head_age,
          head_gender,
          head_mobile_number,
          total_members,
          male_members,
          female_members,
          children_count,
          senior_count,
          house_no,
          locality,
          ward,
          district,
          pincode,
          has_electricity,
          has_running_water,
          has_indoor_toilet,
          has_lpg,
          has_internet,
          latitude,
          longitude,
          location_accuracy,
        })
        .select()
        .single();

      if (insertError || !insertedHousehold) {
        console.error('[Household Insert Error]:', insertError);
        res.status(500).json({ error: 'Failed to register household profile' });
        return;
      }

      // 4. Return success response
      res.status(201).json({
        message: 'Household registered successfully',
        household: insertedHousehold,
      });
    } catch (err: any) {
      console.error('[Household Registration Error]:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
