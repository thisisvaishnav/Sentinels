import { loadEnumeratorHouseholds } from './households';
import { loadMissingReports } from './missingReports';
import { ZoneHouseholdItem } from '../types';

export type BlindSpotSeverity = 'critical' | 'high' | 'medium' | 'low';
export type BlindSpotFilterCategory = 'All' | 'Critical' | 'High' | 'Medium' | 'Low';
export type BlindSpotSortOption = 'coverage' | 'risk' | 'remaining' | 'name';

export interface BlindSpotItem {
  id: string;
  areaId: string;
  areaName: string;
  ward: string;
  district: string;
  totalHouseholds: number;
  completedHouseholds: number;
  pendingHouseholds: number;
  inProgressHouseholds: number;
  coveragePercent: number;
  remainingHouseholds: number;
  severity: BlindSpotSeverity;
  priorityHouseholdsCount: number;
  needsVerificationCount: number;
  missingReportsCount: number;
  reason: string;
  recommendedAction: string;
  recommendedNextHouseholdId?: string;
  recommendedNextHeadName?: string;
}

/**
 * Transforms existing household records into deterministic blind spot areas.
 * Safe for offline local storage and designed for clean future FastAPI/PostGIS backend integration.
 */
export async function getDerivedBlindSpots(): Promise<BlindSpotItem[]> {
  const households = await loadEnumeratorHouseholds();
  const missingReports = await loadMissingReports();

  // Group households by locality / area
  const areaGroups: Record<string, ZoneHouseholdItem[]> = {};

  households.forEach((hh) => {
    const key = hh.locality || 'General Sector';
    if (!areaGroups[key]) {
      areaGroups[key] = [];
    }
    areaGroups[key].push(hh);
  });

  // Default areas if dataset is small
  const defaultAreaConfigs = [
    { name: 'Canal Side Slum Belt', areaId: 'CS-01', ward: 'Ward 12' },
    { name: 'Station Road Cluster', areaId: 'SR-02', ward: 'Ward 12' },
    { name: 'Shiv Nagar Sector 4', areaId: 'SN-04', ward: 'Ward 12' },
    { name: 'Shastri Nagar North', areaId: 'SN-01', ward: 'Ward 12' },
    { name: 'Vishwanath Corridor West', areaId: 'VC-03', ward: 'Ward 12' },
  ];

  const result: BlindSpotItem[] = [];

  // Process grouped localities
  Object.keys(areaGroups).forEach((localityName, index) => {
    const items = areaGroups[localityName];
    const total = Math.max(items.length, 10);
    const completed = items.filter((h) => h.status === 'Completed').length;
    const inProgress = items.filter((h) => h.status === 'In Progress').length;
    const pending = items.filter(
      (h) => h.status === 'Pending' || h.status === 'Needs Verification' || h.status === 'Missing'
    ).length;

    const remaining = Math.max(0, total - completed);
    const coveragePercent = Math.min(100, Math.round((completed / total) * 100));

    const priorityCount = items.filter((h) => h.priority === 'High').length;
    const needsVerificationCount = items.filter((h) => h.status === 'Needs Verification').length;
    const areaMissingCount = missingReports.filter(
      (mr) => mr.locality.toLowerCase() === localityName.toLowerCase()
    ).length;

    // Severity calculation
    let severity: BlindSpotSeverity = 'low';
    if (coveragePercent < 25 || (remaining >= 10 && priorityCount >= 3)) {
      severity = 'critical';
    } else if (coveragePercent < 40 || remaining >= 8) {
      severity = 'high';
    } else if (coveragePercent < 65) {
      severity = 'medium';
    }

    // Next recommended household
    const recommendedNext =
      items.find((h) => h.priority === 'High' && h.status !== 'Completed') ||
      items.find((h) => h.status === 'Needs Verification') ||
      items.find((h) => h.status !== 'Completed');

    // Reason calculation
    let reason = `${remaining} pending households out of ${total} total assigned in ${localityName}.`;
    if (severity === 'critical') {
      reason = `Critically low coverage (${coveragePercent}%) with ${priorityCount} high-priority survey backlogs.`;
    } else if (severity === 'high') {
      reason = `Incomplete coverage (${coveragePercent}%) with ${needsVerificationCount} unverified households.`;
    }

    let recommendedAction = `Schedule immediate field enumeration sweep in ${localityName}.`;
    if (recommendedNext) {
      recommendedAction = `Target next pending survey for ${recommendedNext.headName} (${recommendedNext.householdId}).`;
    }

    const config = defaultAreaConfigs[index % defaultAreaConfigs.length];

    result.push({
      id: `bs-${index + 1}`,
      areaId: items[0]?.areaId || config.areaId,
      areaName: localityName,
      ward: items[0]?.ward || config.ward,
      district: items[0]?.district || 'Varanasi',
      totalHouseholds: total,
      completedHouseholds: completed,
      pendingHouseholds: pending,
      inProgressHouseholds: inProgress,
      coveragePercent,
      remainingHouseholds: remaining,
      severity,
      priorityHouseholdsCount: priorityCount,
      needsVerificationCount,
      missingReportsCount: areaMissingCount,
      reason,
      recommendedAction,
      recommendedNextHouseholdId: recommendedNext?.householdId,
      recommendedNextHeadName: recommendedNext?.headName,
    });
  });

  return result;
}

/**
 * Filter and sort blind spot items
 */
export function filterAndSortBlindSpots(
  items: BlindSpotItem[],
  category: BlindSpotFilterCategory,
  searchQuery: string,
  sortBy: BlindSpotSortOption
): BlindSpotItem[] {
  let filtered = [...items];

  // Category filter
  if (category !== 'All') {
    const targetSeverity = category.toLowerCase() as BlindSpotSeverity;
    filtered = filtered.filter((item) => item.severity === targetSeverity);
  }

  // Search filter
  if (searchQuery.trim().length > 0) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (item) =>
        item.areaName.toLowerCase().includes(q) ||
        item.areaId.toLowerCase().includes(q) ||
        item.reason.toLowerCase().includes(q)
    );
  }

  // Sorting
  filtered.sort((a, b) => {
    if (sortBy === 'coverage') {
      return a.coveragePercent - b.coveragePercent; // lowest coverage first
    }
    if (sortBy === 'risk') {
      const rank: Record<BlindSpotSeverity, number> = { critical: 4, high: 3, medium: 2, low: 1 };
      return rank[b.severity] - rank[a.severity];
    }
    if (sortBy === 'remaining') {
      return b.remainingHouseholds - a.remainingHouseholds;
    }
    if (sortBy === 'name') {
      return a.areaName.localeCompare(b.areaName);
    }
    return 0;
  });

  return filtered;
}
