/**
 * verificationTypes.ts
 *
 * Data models and types for the Lokvision Verification workflow.
 */

export type VerificationFilterCategory =
  | 'All'
  | 'Pending'
  | 'High Priority'
  | 'Identity'
  | 'Location'
  | 'Anomaly'
  | 'Verified';

export type VerificationSortOption = 'Priority' | 'Newest' | 'Household ID' | 'Area';

export type VerificationOutcome = 'Verified' | 'Needs Recheck' | 'Unable to Verify';

export interface VerificationSummaryMetrics {
  pendingCount: number;
  highPriorityCount: number;
  verifiedTodayCount: number;
  needsReviewCount: number;
  totalRecordsCount: number;
}
