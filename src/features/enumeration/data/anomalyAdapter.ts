import AsyncStorage from '@react-native-async-storage/async-storage';
import { ZoneHouseholdItem } from '../types';
import { addEnumeratorActivity } from './activity';
import {
  AnomalyFilterCategory,
  AnomalySeverity,
  AnomalySortOption,
  AnomalySummaryMetrics,
  HouseholdAnomaly,
} from '../types/anomalyTypes';

export const REVIEWED_ANOMALIES_STORAGE_KEY = '@lokvision_reviewed_anomalies';

/**
 * Load list of anomaly IDs marked as reviewed by the enumerator.
 */
export async function loadReviewedAnomalyIds(): Promise<string[]> {
  try {
    const json = await AsyncStorage.getItem(REVIEWED_ANOMALIES_STORAGE_KEY);
    if (json) {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignore storage read errors
  }
  return [];
}

/**
 * Save reviewed anomaly IDs list.
 */
export async function saveReviewedAnomalyIds(reviewedIds: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(REVIEWED_ANOMALIES_STORAGE_KEY, JSON.stringify(reviewedIds));
    if (reviewedIds.length > 0) {
      await addEnumeratorActivity(
        'anomaly_reviewed',
        'Density Anomaly Reviewed',
        `Reviewed and acknowledged density anomaly alert #${reviewedIds[reviewedIds.length - 1]}.`
      );
    }
  } catch {
    // Ignore storage save errors
  }
}

import { AnomalyEscalation } from '../types/anomalyTypes';

/**
 * Deterministically analyze current local household dataset and produce typed HouseholdAnomaly[].
 */
export function detectHouseholdAnomalies(
  households: ZoneHouseholdItem[],
  reviewedIds: string[] = [],
  escalations: AnomalyEscalation[] = []
): HouseholdAnomaly[] {
  const anomalies: HouseholdAnomaly[] = [];

  // Helper maps for duplicate detection
  const mobileMap = new Map<string, ZoneHouseholdItem[]>();
  const headNameLocalityMap = new Map<string, ZoneHouseholdItem[]>();

  households.forEach((h) => {
    if (h.mobile && h.mobile.trim().length >= 7) {
      const mob = h.mobile.trim();
      const list = mobileMap.get(mob) || [];
      list.push(h);
      mobileMap.set(mob, list);
    }

    if (h.headName && h.locality) {
      const key = `${h.headName.trim().toLowerCase()}_${h.locality.trim().toLowerCase()}`;
      const list = headNameLocalityMap.get(key) || [];
      list.push(h);
      headNameLocalityMap.set(key, list);
    }
  });

  households.forEach((h) => {
    // ----------------------------------------------------
    // Rule 1: Duplicate Household Detection
    // ----------------------------------------------------
    let duplicateRelated: string[] = [];
    let duplicateReason = '';

    if (h.mobile && h.mobile.trim().length >= 7) {
      const sameMobileList = mobileMap.get(h.mobile.trim()) || [];
      if (sameMobileList.length > 1) {
        duplicateRelated = sameMobileList
          .filter((item) => item.householdId !== h.householdId)
          .map((item) => item.householdId);
        duplicateReason = `Shared mobile number (${h.mobile}) detected across ${sameMobileList.length} household records.`;
      }
    }

    if (duplicateRelated.length === 0 && h.headName && h.locality) {
      const key = `${h.headName.trim().toLowerCase()}_${h.locality.trim().toLowerCase()}`;
      const sameNameLocalityList = headNameLocalityMap.get(key) || [];
      if (sameNameLocalityList.length > 1) {
        duplicateRelated = sameNameLocalityList
          .filter((item) => item.householdId !== h.householdId)
          .map((item) => item.householdId);
        duplicateReason = `Identical head name (${h.headName}) & locality (${h.locality}) detected in multiple records.`;
      }
    }

    if (duplicateRelated.length > 0) {
      const anomalyId = `${h.householdId}_duplicate`;
      anomalies.push({
        id: anomalyId,
        householdId: h.householdId,
        type: 'duplicate',
        severity: 'high',
        title: 'Possible Duplicate Household',
        description: `Household ${h.householdId} shares key identifying information with other records in ${h.locality}.`,
        reason: duplicateReason,
        detectedAt: 'Today',
        areaId: h.areaId,
        areaName: h.locality,
        headName: h.headName,
        relatedHouseholdIds: duplicateRelated,
        recommendedAction: 'Review both household records and verify head identity.',
        latitude: h.latitude,
        longitude: h.longitude,
        reviewed: reviewedIds.includes(anomalyId),
      });
    }

    // ----------------------------------------------------
    // Rule 2: Invalid Demographic Values
    // ----------------------------------------------------
    if (h.members <= 0 || h.members > 20) {
      const anomalyId = `${h.householdId}_invalid-demographic`;
      anomalies.push({
        id: anomalyId,
        householdId: h.householdId,
        type: 'invalid-demographic',
        severity: h.members <= 0 ? 'critical' : 'medium',
        title: 'Invalid Demographic Values',
        description: `Suspicious household member count (${h.members} members) recorded.`,
        reason:
          h.members <= 0
            ? 'Household member count is zero or negative.'
            : 'Unusually high member count exceeds standard demographic threshold (>20).',
        detectedAt: 'Today',
        areaId: h.areaId,
        areaName: h.locality,
        headName: h.headName,
        recommendedAction: 'Re-survey household to verify exact family member count.',
        latitude: h.latitude,
        longitude: h.longitude,
        reviewed: reviewedIds.includes(anomalyId),
      });
    }

    // ----------------------------------------------------
    // Rule 3: Incomplete Required Information
    // ----------------------------------------------------
    const missingFields: string[] = [];
    if (!h.headName || h.headName.trim().length === 0) missingFields.push('Head Name');
    if (!h.address || h.address.trim().length === 0) missingFields.push('Full Address');
    if (!h.pinCode || h.pinCode.trim().length === 0) missingFields.push('PIN Code');
    if (!h.ward || h.ward.trim().length === 0) missingFields.push('Ward');

    if (missingFields.length > 0) {
      const anomalyId = `${h.householdId}_incomplete-record`;
      anomalies.push({
        id: anomalyId,
        householdId: h.householdId,
        type: 'incomplete-record',
        severity: missingFields.includes('Head Name') ? 'high' : 'medium',
        title: 'Incomplete Household Record',
        description: `Required profile information is missing from record ${h.householdId}.`,
        reason: `Missing mandatory fields: ${missingFields.join(', ')}.`,
        detectedAt: 'Today',
        areaId: h.areaId,
        areaName: h.locality,
        headName: h.headName || 'Unknown',
        missingFields,
        recommendedAction: 'Complete registration or re-interview head of household.',
        latitude: h.latitude,
        longitude: h.longitude,
        reviewed: reviewedIds.includes(anomalyId),
      });
    }

    // ----------------------------------------------------
    // Rule 4: GPS / Location Inconsistency
    // ----------------------------------------------------
    if (h.status === 'Completed' || h.verificationStatus === 'Verified') {
      const hasCoords = typeof h.latitude === 'number' && typeof h.longitude === 'number';
      const invalidBounds =
        hasCoords &&
        (h.latitude! < 20.0 || h.latitude! > 30.0 || h.longitude! < 75.0 || h.longitude! > 88.0);

      if (!hasCoords || invalidBounds) {
        const anomalyId = `${h.householdId}_gps-mismatch`;
        anomalies.push({
          id: anomalyId,
          householdId: h.householdId,
          type: 'gps-mismatch',
          severity: 'high',
          title: 'GPS Location Mismatch',
          description: `Completed household ${h.householdId} lacks valid spatial GPS tags.`,
          reason: !hasCoords
            ? 'Record marked completed but has no geo-coordinates attached.'
            : `Coordinates (${h.latitude}, ${h.longitude}) fall outside assigned zone coordinates.`,
          detectedAt: 'Today',
          areaId: h.areaId,
          areaName: h.locality,
          headName: h.headName,
          recommendedAction: 'Re-visit location and capture geo-location via GIS Map.',
          latitude: h.latitude,
          longitude: h.longitude,
          reviewed: reviewedIds.includes(anomalyId),
        });
      }
    }

    // ----------------------------------------------------
    // Rule 5: Verification-Required Anomaly
    // ----------------------------------------------------
    if (h.status === 'Needs Verification' || h.verificationStatus === 'Needs Verification') {
      const anomalyId = `${h.householdId}_verification-required`;
      anomalies.push({
        id: anomalyId,
        householdId: h.householdId,
        type: 'verification-required',
        severity: 'high',
        title: 'Verification Flagged Record',
        description: `Household ${h.householdId} is explicitly marked for field verification check.`,
        reason: 'Supervisor or automatic validation flagged record for mandatory audit.',
        detectedAt: 'Yesterday',
        areaId: h.areaId,
        areaName: h.locality,
        headName: h.headName,
        recommendedAction: 'Conduct physical field verification check.',
        latitude: h.latitude,
        longitude: h.longitude,
        reviewed: reviewedIds.includes(anomalyId),
      });
    }

    // ----------------------------------------------------
    // Rule 6: Coverage / Status Inconsistency
    // ----------------------------------------------------
    if (h.status === 'Missing' && h.verificationStatus === 'Verified') {
      const anomalyId = `${h.householdId}_coverage-inconsistency`;
      anomalies.push({
        id: anomalyId,
        householdId: h.householdId,
        type: 'coverage-inconsistency',
        severity: 'medium',
        title: 'Status & Verification Conflict',
        description: `Household ${h.householdId} is marked Missing but has a Verified status.`,
        reason: 'Contradictory status tags in local record.',
        detectedAt: '2 days ago',
        areaId: h.areaId,
        areaName: h.locality,
        headName: h.headName,
        recommendedAction: 'Update household status or clear verification tag.',
        latitude: h.latitude,
        longitude: h.longitude,
        reviewed: reviewedIds.includes(anomalyId),
      });
    }
  });

  // Attach active escalation matching anomalyId
  const result = anomalies.map((item) => {
    const esc = escalations.find((e) => e.anomalyId === item.id);
    return esc ? { ...item, escalation: esc } : item;
  });

  return result;
}

/**
 * Derive summary metrics from detected anomaly list.
 */
export function getAnomalySummaryMetrics(anomalies: HouseholdAnomaly[]): AnomalySummaryMetrics {
  const totalAnomalies = anomalies.length;
  const criticalCount = anomalies.filter((a) => a.severity === 'critical').length;
  const highCount = anomalies.filter((a) => a.severity === 'high').length;
  const mediumCount = anomalies.filter((a) => a.severity === 'medium').length;
  const lowCount = anomalies.filter((a) => a.severity === 'low').length;
  const needsReviewCount = anomalies.filter((a) => !a.reviewed).length;
  const escalatedCount = anomalies.filter((a) => !!a.escalation).length;

  const affectedHouseholdSet = new Set(anomalies.map((a) => a.householdId));
  const affectedHouseholdsCount = affectedHouseholdSet.size;

  return {
    totalAnomalies,
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    needsReviewCount,
    escalatedCount,
    affectedHouseholdsCount,
  };
}

/**
 * Filter and sort anomaly items based on category, search query, and sort option.
 */
export function filterAndSortAnomalies(
  anomalies: HouseholdAnomaly[],
  category: AnomalyFilterCategory = 'All',
  searchQuery: string = '',
  sortOption: AnomalySortOption = 'Severity'
): HouseholdAnomaly[] {
  const query = searchQuery.trim().toLowerCase();

  // 1. Filter
  const filtered = anomalies.filter((a) => {
    let matchesCategory = true;
    if (category === 'Critical') matchesCategory = a.severity === 'critical';
    else if (category === 'High') matchesCategory = a.severity === 'high';
    else if (category === 'Medium') matchesCategory = a.severity === 'medium';
    else if (category === 'Low') matchesCategory = a.severity === 'low';
    else if (category === 'Duplicate') matchesCategory = a.type === 'duplicate';
    else if (category === 'Demographic') matchesCategory = a.type === 'invalid-demographic';
    else if (category === 'GPS') matchesCategory = a.type === 'gps-mismatch';
    else if (category === 'Incomplete') matchesCategory = a.type === 'incomplete-record';
    else if (category === 'Verification') matchesCategory = a.type === 'verification-required';
    else if (category === 'Escalated') matchesCategory = !!a.escalation;

    if (!matchesCategory) return false;

    if (!query) return true;

    const matchId = a.householdId.toLowerCase().includes(query);
    const matchTitle = a.title.toLowerCase().includes(query);
    const matchHead = a.headName ? a.headName.toLowerCase().includes(query) : false;
    const matchArea = a.areaName ? a.areaName.toLowerCase().includes(query) : false;
    const matchDesc = a.description.toLowerCase().includes(query);

    return matchId || matchTitle || matchHead || matchArea || matchDesc;
  });

  // 2. Sort
  const severityScore: Record<AnomalySeverity, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  return filtered.sort((a, b) => {
    if (sortOption === 'Severity') {
      const scoreA = severityScore[a.severity];
      const scoreB = severityScore[b.severity];
      if (scoreA !== scoreB) return scoreB - scoreA;
      return a.householdId.localeCompare(b.householdId);
    } else if (sortOption === 'Household ID') {
      return a.householdId.localeCompare(b.householdId);
    } else if (sortOption === 'Area') {
      return (a.areaName || '').localeCompare(b.areaName || '');
    }
    return 0;
  });
}
