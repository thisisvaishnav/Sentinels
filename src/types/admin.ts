/**
 * DRISHTI Admin — shared data types.
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

export interface StaffResponseItem {
  id: string;
  enumeratorName: string;
  enumeratorId: string;
  message: string;
  time: string;
}
