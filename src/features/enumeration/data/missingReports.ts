/**
 * missingReports.ts
 *
 * Local AsyncStorage persistence layer for Missing Household Reports.
 * Storage Key: @lokvision_missing_reports
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { MissingHouseholdReport, MissingReportsMetrics } from '../types/missingReportTypes';
import { addEnumeratorActivity } from './activity';

export const MISSING_REPORTS_STORAGE_KEY = '@lokvision_missing_reports';

export const INITIAL_MISSING_REPORTS: MissingHouseholdReport[] = [
  {
    reportId: 'REP-LV-2026-001',
    householdId: 'LV-UP-000135',
    enumeratorId: 'ENUM001',
    headName: 'Amit Verma',
    mobile: '9876500112',
    estimatedMembers: 4,
    address: 'Plot 88, Near Water Tank, Shiv Nagar West',
    locality: 'Shiv Nagar West',
    ward: 'Ward 12',
    pinCode: '221005',
    latitude: 26.8478,
    longitude: 80.9425,
    accuracy: 8.5,
    reason: 'House locked',
    priority: 'Normal',
    remarks: 'House locked during 2 consecutive visits at 10 AM and 4 PM.',
    visitDate: '2026-08-23',
    visitTime: '04:15 PM',
    attemptNumber: 2,
    previousAttemptDate: '2026-08-22 10:30 AM',
    status: 'Submitted',
    createdAt: '2026-08-23T16:15:00Z',
    updatedAt: '2026-08-23T16:15:00Z',
    syncStatus: 'Pending Sync',
  },
  {
    reportId: 'REP-LV-2026-002',
    householdId: 'LV-UP-000137',
    enumeratorId: 'ENUM001',
    headName: 'Kavita Sharma',
    mobile: '9812300998',
    estimatedMembers: 3,
    address: 'Opposite Primary School, Canal Side',
    locality: 'Canal Side',
    ward: 'Ward 12',
    pinCode: '221005',
    latitude: 26.8445,
    longitude: 80.9480,
    accuracy: 12.0,
    reason: 'Household relocated',
    priority: 'High',
    remarks: 'Neighbors confirm family moved to another district 3 months ago.',
    visitDate: '2026-08-23',
    visitTime: '11:30 AM',
    attemptNumber: 1,
    status: 'Submitted',
    createdAt: '2026-08-23T11:30:00Z',
    updatedAt: '2026-08-23T11:30:00Z',
    syncStatus: 'Pending Sync',
  },
];

/**
 * Loads missing reports from AsyncStorage with initial fallback seeding.
 */
export async function loadMissingReports(): Promise<MissingHouseholdReport[]> {
  try {
    const json = await AsyncStorage.getItem(MISSING_REPORTS_STORAGE_KEY);
    if (!json) {
      await AsyncStorage.setItem(MISSING_REPORTS_STORAGE_KEY, JSON.stringify(INITIAL_MISSING_REPORTS));
      return INITIAL_MISSING_REPORTS;
    }
    return JSON.parse(json);
  } catch (error) {
    console.error('Failed to load missing reports from AsyncStorage:', error);
    return INITIAL_MISSING_REPORTS;
  }
}

/**
 * Saves missing reports list to AsyncStorage.
 */
export async function saveMissingReports(reports: MissingHouseholdReport[]): Promise<boolean> {
  try {
    await AsyncStorage.setItem(MISSING_REPORTS_STORAGE_KEY, JSON.stringify(reports));
    return true;
  } catch (error) {
    console.error('Failed to save missing reports to AsyncStorage:', error);
    return false;
  }
}

/**
 * Finds a missing report by ID.
 */
export async function getMissingReportById(reportId: string): Promise<MissingHouseholdReport | null> {
  const reports = await loadMissingReports();
  return reports.find((r) => r.reportId === reportId) || null;
}

/**
 * Saves or updates a missing report.
 */
export async function saveOrUpdateMissingReport(
  reportData: Partial<MissingHouseholdReport>,
  isSubmit: boolean = false
): Promise<MissingHouseholdReport> {
  const reports = await loadMissingReports();
  const now = new Date().toISOString();

  let targetReport: MissingHouseholdReport;

  if (reportData.reportId) {
    const index = reports.findIndex((r) => r.reportId === reportData.reportId);
    if (index !== -1) {
      targetReport = {
        ...reports[index],
        ...reportData,
        status: isSubmit ? 'Submitted' : (reportData.status || 'Draft'),
        updatedAt: now,
        syncStatus: 'Pending Sync',
      };
      reports[index] = targetReport;
    } else {
      targetReport = createNewReportObject(reportData, isSubmit, now);
      reports.unshift(targetReport);
    }
  } else {
    targetReport = createNewReportObject(reportData, isSubmit, now);
    reports.unshift(targetReport);
  }

  await saveMissingReports(reports);

  if (isSubmit) {
    try {
      await addEnumeratorActivity(
        'missing',
        'Missing Household Reported',
        `Reported missing household (${targetReport.headName || targetReport.reportId}) near ${targetReport.address || 'assigned zone'}.`,
        targetReport.householdId,
        targetReport.reportId
      );
    } catch {
      // Ignore activity log error
    }
  }

  return targetReport;
}

function createNewReportObject(
  data: Partial<MissingHouseholdReport>,
  isSubmit: boolean,
  timestamp: string
): MissingHouseholdReport {
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const reportId = data.reportId || `REP-LV-2026-${randomSuffix}`;
  const now = new Date();

  return {
    reportId,
    householdId: data.householdId || undefined,
    enumeratorId: data.enumeratorId || 'ENUM001',
    headName: data.headName || undefined,
    mobile: data.mobile || undefined,
    estimatedMembers: data.estimatedMembers || undefined,
    address: data.address || undefined,
    locality: data.locality || 'Shiv Nagar East',
    ward: data.ward || 'Ward 12',
    pinCode: data.pinCode || '221005',
    latitude: data.latitude || undefined,
    longitude: data.longitude || undefined,
    accuracy: data.accuracy || undefined,
    reason: data.reason || 'House locked',
    otherReason: data.otherReason || undefined,
    priority: data.priority || 'Normal',
    remarks: data.remarks || '',
    visitDate: data.visitDate || now.toISOString().split('T')[0],
    visitTime: data.visitTime || now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    attemptNumber: data.attemptNumber || 1,
    previousAttemptDate: data.previousAttemptDate || undefined,
    photoUri: data.photoUri || undefined,
    status: isSubmit ? 'Submitted' : 'Draft',
    createdAt: timestamp,
    updatedAt: timestamp,
    syncStatus: 'Pending Sync',
  };
}

/**
 * Calculates metrics summary for missing reports.
 */
export function getMissingReportsMetrics(reports: MissingHouseholdReport[]): MissingReportsMetrics {
  return {
    totalReports: reports.length,
    submittedCount: reports.filter((r) => r.status === 'Submitted' || r.status === 'Under Review').length,
    draftsCount: reports.filter((r) => r.status === 'Draft').length,
    pendingSyncCount: reports.filter((r) => r.syncStatus === 'Pending Sync').length,
    highPriorityCount: reports.filter((r) => r.priority === 'High' || r.priority === 'Urgent').length,
  };
}
