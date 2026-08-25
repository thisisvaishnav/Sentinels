/**
 * LOKEVISION Admin — shared data types.
 */

export type EnumeratorStatus = 'active' | 'offDuty' | 'issueReported';

export interface EnumeratorRosterItem {
  id: string;
  name: string;
  employeeId: string;
  ward: string;
  initials: string;
  avatar?: string;
  status: EnumeratorStatus;
}

export interface DeploymentOrder {
  id: string;
  ward: string;
  broadcastCount: number;
  title: string;
  message: string;
  sentBy: string;
  sentAt: string;
  acknowledged: number;
  total: number;
}

export interface EnumeratorResponseItem {
  id: string;
  enumeratorName: string;
  enumeratorId: string;
  message: string;
  time: string;
}

export interface EnumeratorProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  aadhaar?: string;
  role: string;
  zone: string;
  employeeId: string;
  password: string;
  photoUri?: string;
  createdAt: string;
}

/* ── Survey Management ─────────────────────────────────────────── */

export type SurveyStatus = 'completed' | 'in_progress' | 'pending';

export interface SurveyTask {
  id: string;
  surveyId: string;
  title: string;
  zone: string;
  surveyType: string;
  enumeratorId?: string;
  enumeratorName?: string;
  totalHouseholds: number;
  completedHouseholds: number;
  progress: number;
  status: SurveyStatus;
  startDate: string;
  dueDate: string;
  completedDate?: string;
}

export interface SurveyEnumerator {
  id: string;
  name: string;
  zone: string;
}

/* ── Citizen Reports ───────────────────────────────────────────── */

export type ReportStatus =
  | 'pending_verification'
  | 'assigned'
  | 'under_investigation'
  | 'verified'
  | 'rejected'
  | 'resolved'
  | 'closed';

export type ReportPriority = 'low' | 'medium' | 'high' | 'critical';

export type ReportCategory =
  | 'water_supply'
  | 'sanitation'
  | 'electricity'
  | 'road_damage'
  | 'garbage'
  | 'public_safety'
  | 'noise'
  | 'other';

export interface CitizenReport {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  priority: ReportPriority;
  citizenName: string;
  citizenPhone: string;
  area: string;
  zone: string;
  reportedDate: string;
  lastUpdated: string;
  imageUri?: string;
  enumeratorId?: string;
  enumeratorName?: string;
  assignedDate?: string;
  dueDate?: string;
  verificationNotes?: string;
  verificationImageUri?: string;
  resolutionNotes?: string;
}

export interface CitizenReportEnumerator {
  id: string;
  name: string;
  zone: string;
}
