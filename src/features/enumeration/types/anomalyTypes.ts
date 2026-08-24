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
  | 'Verification';

export type AnomalySortOption = 'Severity' | 'Newest' | 'Household ID' | 'Area';

export interface AnomalySummaryMetrics {
  totalAnomalies: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  needsReviewCount: number;
  affectedHouseholdsCount: number;
}
