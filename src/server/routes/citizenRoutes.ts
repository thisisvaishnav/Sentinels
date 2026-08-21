import { Router, Response } from 'express';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import {
  authenticateCitizen,
  AuthenticatedRequest,
} from '../middleware/authenticateCitizen';

dotenv.config();

const router = Router();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Zod validation schemas
const applySchemeSchema = z.object({
  scheme_id: z.string().uuid('Invalid scheme ID format'),
});

const supportTicketSchema = z.object({
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters long'),
  description: z.string().trim().min(5, 'Description must be at least 5 characters long'),
  category: z.string().trim().min(1, 'Category is required'),
  priority: z.enum(['Low', 'Medium', 'High']).default('Medium'),
});

/**
 * GET /api/citizen/schemes
 * Fetches all available government schemes, with optional category filtering.
 */
router.get('/schemes', authenticateCitizen, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { category } = req.query;

    let query = supabase.from('schemes').select('*').order('created_at', { ascending: false });

    if (category && typeof category === 'string' && category.toLowerCase() !== 'all') {
      // Perform case-insensitive check or direct match
      query = query.eq('category', category);
    }

    const { data: schemes, error } = await query;

    if (error) {
      console.error('[Get Schemes Error]:', error);
      res.status(500).json({ error: 'Failed to fetch schemes' });
      return;
    }

    res.status(200).json({ schemes });
  } catch (err) {
    console.error('[Get Schemes Server Error]:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/citizen/apply-scheme
 * Allows a citizen to apply for an active government scheme.
 */
router.post('/apply-scheme', authenticateCitizen, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const citizenId = req.citizen!.id;

    // 1. Validate payload
    const parseResult = applySchemeSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { scheme_id } = parseResult.data;

    // 2. Verify scheme exists and is active
    const { data: scheme, error: schemeErr } = await supabase
      .from('schemes')
      .select('id, title, status')
      .eq('id', scheme_id)
      .maybeSingle();

    if (schemeErr || !scheme) {
      res.status(404).json({ error: 'Scheme not found' });
      return;
    }

    if (scheme.status === 'Closed') {
      res.status(400).json({ error: 'This scheme is closed for applications' });
      return;
    }

    // 3. Check for duplicate application
    const { data: existingApp, error: appCheckErr } = await supabase
      .from('citizen_scheme_applications')
      .select('id')
      .eq('citizen_id', citizenId)
      .eq('scheme_id', scheme_id)
      .maybeSingle();

    if (appCheckErr) {
      console.error('[Scheme App Check Error]:', appCheckErr);
      res.status(500).json({ error: 'Failed to verify existing applications' });
      return;
    }

    if (existingApp) {
      res.status(409).json({ error: 'You have already applied for this scheme' });
      return;
    }

    // 4. Insert application record
    const { data: application, error: insertErr } = await supabase
      .from('citizen_scheme_applications')
      .insert({
        citizen_id: citizenId,
        scheme_id,
        status: 'Applied',
        remarks: 'Application submitted successfully. Under initial review.',
      })
      .select()
      .single();

    if (insertErr || !application) {
      console.error('[Scheme Insert App Error]:', insertErr);
      res.status(500).json({ error: 'Failed to submit scheme application' });
      return;
    }

    res.status(201).json({
      message: 'Successfully applied to scheme',
      application,
    });
  } catch (err) {
    console.error('[Apply Scheme Error]:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/citizen/applications
 * Returns all scheme applications submitted by the logged-in citizen.
 */
router.get('/applications', authenticateCitizen, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const citizenId = req.citizen!.id;

    // Join with schemes table to retrieve title and details
    const { data: applications, error } = await supabase
      .from('citizen_scheme_applications')
      .select(`
        id,
        status,
        remarks,
        created_at,
        scheme:schemes (
          id,
          title,
          description,
          category,
          benefit_amount
        )
      `)
      .eq('citizen_id', citizenId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Get Applications Error]:', error);
      res.status(500).json({ error: 'Failed to fetch your applications' });
      return;
    }

    res.status(200).json({ applications });
  } catch (err) {
    console.error('[Get Applications Server Error]:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/citizen/support
 * Fetches all support tickets created by the logged-in citizen.
 */
router.get('/support', authenticateCitizen, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const citizenId = req.citizen!.id;

    const { data: tickets, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('citizen_id', citizenId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Get Tickets Error]:', error);
      res.status(500).json({ error: 'Failed to fetch support tickets' });
      return;
    }

    res.status(200).json({ tickets });
  } catch (err) {
    console.error('[Get Tickets Server Error]:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/citizen/support
 * Submits a new support ticket on behalf of the logged-in citizen.
 */
router.post('/support', authenticateCitizen, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const citizenId = req.citizen!.id;

    // 1. Validate payload
    const parseResult = supportTicketSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { subject, description, category, priority } = parseResult.data;

    // 2. Insert ticket
    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .insert({
        citizen_id: citizenId,
        subject,
        description,
        category,
        priority,
        status: 'Open',
      })
      .select()
      .single();

    if (error || !ticket) {
      console.error('[Submit Ticket Error]:', error);
      res.status(500).json({ error: 'Failed to submit support ticket' });
      return;
    }

    res.status(201).json({
      message: 'Support ticket submitted successfully',
      ticket,
    });
  } catch (err) {
    console.error('[Submit Ticket Server Error]:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/citizen/dashboard-summary
 * Aggregates information for the citizen home screen (household info, verification, recent activities, basic counts).
 */
router.get('/dashboard-summary', authenticateCitizen, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const citizenId = req.citizen!.id;

    // 1. Fetch Household Profile
    const { data: household, error: householdErr } = await supabase
      .from('household_profiles')
      .select('id, head_full_name, house_no, locality, district, pincode')
      .eq('citizen_id', citizenId)
      .maybeSingle();

    if (householdErr) {
      console.error('[Summary Household Error]:', householdErr);
      res.status(500).json({ error: 'Failed to load dashboard summary' });
      return;
    }

    // 2. Fetch Recent Activities (composed from applications and tickets)
    const activities: Array<{
      id: string;
      type: 'scheme' | 'ticket' | 'household';
      title: string;
      description: string;
      date: string;
      status: string;
    }> = [];

    // If household exists, add a household registered activity
    if (household) {
      activities.push({
        id: `hh-${household.id}`,
        type: 'household',
        title: 'Household Profile Active',
        description: `Your household profile at ${household.house_no}, ${household.locality} is registered and verified.`,
        date: new Date().toISOString(), // Mock dates or use household.created_at if available
        status: 'Completed',
      });
    }

    // Fetch latest scheme applications
    const { data: apps } = await supabase
      .from('citizen_scheme_applications')
      .select(`
        id,
        status,
        remarks,
        created_at,
        scheme:schemes (title)
      `)
      .eq('citizen_id', citizenId)
      .order('created_at', { ascending: false })
      .limit(3);

    if (apps) {
      apps.forEach((app: any) => {
        activities.push({
          id: `app-${app.id}`,
          type: 'scheme',
          title: `Scheme: ${app.scheme?.title || 'Application'}`,
          description: app.remarks || `Your application status is ${app.status}.`,
          date: app.created_at,
          status: app.status,
        });
      });
    }

    // Fetch latest tickets
    const { data: tickets } = await supabase
      .from('support_tickets')
      .select('id, subject, status, created_at')
      .eq('citizen_id', citizenId)
      .order('created_at', { ascending: false })
      .limit(3);

    if (tickets) {
      tickets.forEach((ticket) => {
        activities.push({
          id: `ticket-${ticket.id}`,
          type: 'ticket',
          title: `Support: ${ticket.subject}`,
          description: `Ticket is currently marked as ${ticket.status}.`,
          date: ticket.created_at,
          status: ticket.status,
        });
      });
    }

    // Sort combined activities by date descending
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.status(200).json({
      household: household || null,
      recentActivities: activities.slice(0, 5), // Return top 5 activities
      stats: {
        appliedSchemesCount: apps?.length || 0,
        activeTicketsCount: tickets?.filter((t) => t.status !== 'Closed' && t.status !== 'Resolved').length || 0,
      },
    });
  } catch (err) {
    console.error('[Dashboard Summary Server Error]:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
