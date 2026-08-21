import * as SecureStore from 'expo-secure-store';

const getApiUrl = () => {
  return process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001';
};

// Interface types matching backend models and API responses
export interface Scheme {
  id: string;
  title: string;
  description: string;
  details: string;
  eligibility_criteria: string;
  benefit_amount: string | null;
  category: string;
  status: 'Active' | 'Closing Soon' | 'Closed';
  created_at: string;
}

export interface SchemeApplication {
  id: string;
  status: 'Applied' | 'Under Verification' | 'Approved' | 'Rejected';
  remarks: string | null;
  created_at: string;
  scheme: {
    id: string;
    title: string;
    description: string;
    category: string;
    benefit_amount: string | null;
  };
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  created_at: string;
}

export interface DashboardSummary {
  household: {
    id: string;
    head_full_name: string;
    house_no: string;
    locality: string;
    district: string;
    pincode: string;
  } | null;
  recentActivities: Array<{
    id: string;
    type: 'scheme' | 'ticket' | 'household';
    title: string;
    description: string;
    date: string;
    status: string;
  }>;
  stats: {
    appliedSchemesCount: number;
    activeTicketsCount: number;
  };
}

/**
 * Helper to generate request headers with Authorization Bearer token
 */
async function getHeaders(): Promise<HeadersInit> {
  const token = await SecureStore.getItemAsync('citizen_token');
  if (!token) {
    throw new Error('Citizen authorization token not found in storage');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Helper to handle fetch responses and parse errors gracefully
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  let data: any = {};
  
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Server returned non-JSON response (${response.status}): ${text || 'Empty response'}`);
  }

  if (!response.ok) {
    const errorMsg = data.error || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

/**
 * Fetches all available government schemes.
 */
export async function getSchemes(category?: string): Promise<Scheme[]> {
  const apiUrl = getApiUrl();
  const headers = await getHeaders();
  
  let url = `${apiUrl}/api/citizen/schemes`;
  if (category && category !== 'All') {
    url += `?category=${encodeURIComponent(category)}`;
  }

  const response = await fetch(url, { method: 'GET', headers });
  const result = await handleResponse<{ schemes: Scheme[] }>(response);
  return result.schemes;
}

/**
 * Submits an application for a specific government scheme.
 */
export async function applyForScheme(schemeId: string): Promise<{ message: string; application: any }> {
  const apiUrl = getApiUrl();
  const headers = await getHeaders();

  const response = await fetch(`${apiUrl}/api/citizen/apply-scheme`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ scheme_id: schemeId }),
  });

  return handleResponse<{ message: string; application: any }>(response);
}

/**
 * Fetches all scheme applications submitted by the current citizen.
 */
export async function getApplications(): Promise<SchemeApplication[]> {
  const apiUrl = getApiUrl();
  const headers = await getHeaders();

  const response = await fetch(`${apiUrl}/api/citizen/applications`, { method: 'GET', headers });
  const result = await handleResponse<{ applications: SchemeApplication[] }>(response);
  return result.applications;
}

/**
 * Fetches support tickets created by the current citizen.
 */
export async function getSupportTickets(): Promise<SupportTicket[]> {
  const apiUrl = getApiUrl();
  const headers = await getHeaders();

  const response = await fetch(`${apiUrl}/api/citizen/support`, { method: 'GET', headers });
  const result = await handleResponse<{ tickets: SupportTicket[] }>(response);
  return result.tickets;
}

/**
 * Submits a new support ticket.
 */
export async function createSupportTicket(ticket: {
  subject: string;
  description: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
}): Promise<SupportTicket> {
  const apiUrl = getApiUrl();
  const headers = await getHeaders();

  const response = await fetch(`${apiUrl}/api/citizen/support`, {
    method: 'POST',
    headers,
    body: JSON.stringify(ticket),
  });

  const result = await handleResponse<{ message: string; ticket: SupportTicket }>(response);
  return result.ticket;
}

/**
 * Fetches aggregated dashboard summary (household, activities, stats) for the citizen home tab.
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  const apiUrl = getApiUrl();
  const headers = await getHeaders();

  const response = await fetch(`${apiUrl}/api/citizen/dashboard-summary`, { method: 'GET', headers });
  return handleResponse<DashboardSummary>(response);
}
