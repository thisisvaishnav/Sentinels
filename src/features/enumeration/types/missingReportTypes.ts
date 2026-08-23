/**
 * missingReportTypes.ts
 * Data models and interfaces for the Lokvision Enumerator Missing Household Reporting module.
 */

export type MissingReason =
  | 'Household not found'
  | 'House locked'
  | 'Family temporarily away'
  | 'Address mismatch'
  | 'GPS/location mismatch'
  | 'Household relocated'
  | 'Duplicate/incorrect household record'
  | 'Refused verification'
  | 'Other';

export type MissingPriority = 'Normal' | 'High' | 'Urgent';

export type MissingReportStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Resolved';

export type MissingReportSyncStatus = 'Pending Sync' | 'Synced';

export interface MissingHouseholdReport {
  reportId: string;
  householdId?: string;
  enumeratorId: string;
  headName?: string;
  mobile?: string;
  estimatedMembers?: number;
  address?: string;
  locality: string;
  ward?: string;
  pinCode?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  reason: MissingReason;
  otherReason?: string;
  priority: MissingPriority;
  remarks: string;
  visitDate: string;
  visitTime: string;
  attemptNumber: number;
  previousAttemptDate?: string;
  photoUri?: string;
  status: MissingReportStatus;
  createdAt: string;
  updatedAt: string;
  syncStatus: MissingReportSyncStatus;
}

export interface MissingReportsMetrics {
  totalReports: number;
  submittedCount: number;
  draftsCount: number;
  pendingSyncCount: number;
  highPriorityCount: number;
}
