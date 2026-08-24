export type EscalationPriority = 'normal' | 'high' | 'urgent';

export type EscalationStatus =
  | 'pending'
  | 'in-review'
  | 'assigned'
  | 'resolved'
  | 'rejected';

export type RequestedActionType =
  | 'supervisor-review'
  | 'senior-reassignment'
  | 'field-revisit'
  | 'record-correction';

export type EscalationReasonType =
  | 'unable_to_verify'
  | 'duplicate_unresolved'
  | 'gps_conflict'
  | 'info_incorrect'
  | 'resident_refused'
  | 'senior_inspection_needed'
  | 'supervisor_decision_needed'
  | 'other';

export type ResolutionOutcomeType =
  | 'verified_correct'
  | 'duplicate_confirmed'
  | 'gps_resolved'
  | 'record_corrected'
  | 'revisit_completed'
  | 'no_action_required';

export interface SeniorInspector {
  id: string;
  name: string;
  employeeId: string;
  zone: string;
  activeCasesCount: number;
}

export interface EscalationHistoryEvent {
  id: string;
  action: string;
  actor: string;
  role: string;
  timestamp: string;
  notes?: string;
}

export interface RevisitDetails {
  assignedEnumeratorId: string;
  assignedEnumeratorName: string;
  preferredDate: string;
  reason: string;
  notes?: string;
}

export interface SupervisorEscalationItem {
  id: string;
  anomalyId: string;
  householdId: string;
  householdHead: string;
  locality: string;
  ward: string;
  district: string;
  address?: string;
  membersCount?: number;

  enumeratorId: string;
  enumeratorName: string;
  enumeratorRole?: string;
  zoneName?: string;

  anomalyType: string;
  anomalySeverity: 'low' | 'medium' | 'high' | 'critical';
  anomalyTitle: string;
  anomalyDescription: string;
  flaggedReason: string;

  reason: EscalationReasonType;
  reasonText: string;
  notes?: string;
  requestedAction: RequestedActionType;
  priority: EscalationPriority;
  status: EscalationStatus;

  createdAt: string;
  updatedAt: string;

  assignedTo?: string;
  assignedToName?: string;
  assignedRole?: string;
  supervisorNotes?: string;

  resolutionOutcome?: ResolutionOutcomeType;
  resolutionOutcomeText?: string;
  revisitDetails?: RevisitDetails;

  history: EscalationHistoryEvent[];
}

export type EscalationFilterCategory =
  | 'All'
  | 'Pending'
  | 'Urgent'
  | 'High'
  | 'In Review'
  | 'Resolved'
  | 'Rejected'
  | 'Senior Reassignment'
  | 'Field Revisit'
  | 'Record Correction';

export type EscalationSortOption = 'Urgent First' | 'Newest' | 'Oldest';

export interface AdminEscalationMetrics {
  totalCount: number;
  pendingCount: number;
  urgentCount: number;
  highCount: number;
  inReviewCount: number;
  assignedCount: number;
  resolvedCount: number;
  rejectedCount: number;
  seniorReassignmentCount: number;
  fieldRevisitCount: number;
  recordCorrectionCount: number;
}
