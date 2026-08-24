export type OperationalStatus = 'Active' | 'Inactive' | 'Off Duty' | 'Issue Reported';
export type PerformanceStatus = 'On Track' | 'Target Exceeded' | 'Needs Attention' | 'Critical Delay';

export interface EnumeratorCommandCenterRecord {
  enumeratorId: string;
  name: string;
  role: string;
  zone: string;
  ward: string;
  district: string;
  mobile: string;
  email: string;

  operationalStatus: OperationalStatus;
  performanceStatus: PerformanceStatus;

  assignedHouseholds: number;
  completedHouseholds: number;
  inProgressHouseholds: number;
  pendingHouseholds: number;

  dailyTarget: number;
  dailyCompleted: number;
  coveragePercentage: number;

  lastActiveAt: string;
  anomalyCount: number;
  escalationCount: number;
  syncPendingCount: number;
}

export type EnumeratorSortOption =
  | 'Name'
  | 'Completed'
  | 'Pending'
  | 'Anomalies'
  | 'Coverage'
  | 'Last Active';

export type EnumeratorFilterStatus =
  | 'All'
  | 'Active'
  | 'Off Duty'
  | 'Issue Reported'
  | 'On Track'
  | 'Needs Attention';

export interface CommandCenterSummaryMetrics {
  totalEnumerators: number;
  activeCount: number;
  offDutyCount: number;
  issueReportedCount: number;
  totalAssignedHouseholds: number;
  totalCompletedHouseholds: number;
  overallCoveragePercent: number;
  totalAnomaliesCount: number;
  totalEscalationsCount: number;
}
