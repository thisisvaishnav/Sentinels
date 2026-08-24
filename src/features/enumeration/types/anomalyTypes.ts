/**
 * anomalyTypes.ts
 *
 * Data models & types for the Lokvision Anomaly Detection feature.
 */

export type AnomalyType =
  | 'duplicate'
  | 'invalid-demographic'
  | 'gps-mismatch'
  | 'incomplete-record'
  | 'unusual-household'
  | 'coverage-inconsistency'
  | 'verification-required';

export type AnomalySeverity = 'low' | 'medium' | 'high' | 'critical';

export type AnomalyEscalationReason =
  | 'unable_to_verify'
  | 'duplicate_unresolved'
  | 'gps_conflict'
  | 'info_incorrect'
  | 'resident_refused'
  | 'senior_inspection_needed'
  | 'supervisor_decision_needed'
  | 'other';

export type AnomalyRequestedAction =
  | 'supervisor-review'
  | 'senior-reassignment'
  | 'field-revisit'
  | 'record-correction';

export type AnomalyEscalationPriority = 'normal' | 'high' | 'urgent';

export type AnomalyEscalationStatus =
  | 'pending'
  | 'assigned'
  | 'in-review'
  | 'resolved'
  | 'rejected';

export interface AnomalyEscalation {
  id: string;
  anomalyId: string;
  householdId: string;
  enumeratorId: string;
  anomalyType: string;
  severity: string;
  reason: AnomalyEscalationReason;
  reasonText: string;
  notes?: string;
  requestedAction: AnomalyRequestedAction;
  priority: AnomalyEscalationPriority;
  status: AnomalyEscalationStatus;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  assignedRole?: string;
  supervisorNotes?: string;
}

export interface HouseholdAnomaly {
  id: string;
  householdId: string;
  type: AnomalyType;
  severity: AnomalySeverity;
  title: string;
  description: string;
  reason: string;
  detectedAt: string;
  areaId?: string;
  areaName?: string;
  headName?: string;
  relatedHouseholdIds?: string[];
  missingFields?: string[];
  recommendedAction: string;
  latitude?: number;
  longitude?: number;
  reviewed?: boolean;
  escalation?: AnomalyEscalation;
}

export type AnomalyFilterCategory =
  | 'All'
  | 'Critical'
  | 'High'
  | 'Medium'
  | 'Low'
  | 'Duplicate'
  | 'Demographic'
  | 'GPS'
  | 'Incomplete'
  | 'Verification'
  | 'Escalated';

export type AnomalySortOption = 'Severity' | 'Newest' | 'Household ID' | 'Area';

export interface AnomalySummaryMetrics {
  totalAnomalies: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  needsReviewCount: number;
  escalatedCount: number;
  affectedHouseholdsCount: number;
}
