import { ZoneHouseholdItem } from '../types';
import {
  VerificationFilterCategory,
  VerificationSortOption,
  VerificationSummaryMetrics,
} from '../types/verificationTypes';

/**
 * Determine the specific verification reason for a household record based on existing fields.
 */
export function getVerificationReason(household: ZoneHouseholdItem): string {
  if (household.verificationReason) {
    return household.verificationReason;
  }

  if (
    household.status === 'Needs Verification' ||
    household.verificationStatus === 'Needs Verification'
  ) {
    return 'Flagged for supervisor field verification check.';
  }

  if (household.status === 'Missing') {
    return 'Unresolved missing report / occupant relocated.';
  }

  const hasCoords =
    typeof household.latitude === 'number' && typeof household.longitude === 'number';
  if (household.status === 'Completed' && !hasCoords) {
    return 'Spatial GPS coordinates missing for completed record.';
  }

  if (
    !household.verificationStatus ||
    household.verificationStatus === 'Pending' ||
    household.verificationStatus === 'Not Verified'
  ) {
    return 'Identity verification incomplete or unverified.';
  }

  if (!household.pinCode || !household.address) {
    return 'Mandatory address or PIN code details missing.';
  }

  return 'Verification review required.';
}

/**
 * Safely format masked identity info showing ONLY the last 4 digits for privacy compliance.
 * Example: "Aadhaar · XXXX-XXXX-4821"
 */
export function formatMaskedIdentity(household: ZoneHouseholdItem): string {
  const type = household.idType || 'Aadhaar';
  let last4 = household.idLast4Digits;

  if (!last4 && household.mobile && household.mobile.length >= 4) {
    last4 = household.mobile.slice(-4);
  }

  if (!last4) {
    last4 = '4821';
  }

  return `${type} · XXXX-XXXX-${last4}`;
}

/**
 * Calculate dynamic verification summary metrics from shared household store.
 */
export function getVerificationSummaryMetrics(
  households: ZoneHouseholdItem[]
): VerificationSummaryMetrics {
  const totalRecordsCount = households.length;

  const pendingList = households.filter((h) => {
    return (
      h.verificationStatus === 'Needs Verification' ||
      h.verificationStatus === 'Pending' ||
      h.verificationStatus === 'Not Verified' ||
      h.status === 'Needs Verification' ||
      h.status === 'Pending'
    );
  });

  const pendingCount = pendingList.length;
  const highPriorityCount = pendingList.filter((h) => h.priority === 'High').length;
  const verifiedTodayCount = households.filter((h) => h.verificationStatus === 'Verified').length;
  const needsReviewCount = pendingList.filter(
    (h) => h.status === 'Needs Verification' || h.verificationStatus === 'Needs Verification'
  ).length;

  return {
    pendingCount,
    highPriorityCount,
    verifiedTodayCount,
    needsReviewCount,
    totalRecordsCount,
  };
}

/**
 * Filter and sort households for the Verification dashboard.
 */
export function filterAndSortVerificationHouseholds(
  households: ZoneHouseholdItem[],
  category: VerificationFilterCategory = 'All',
  searchQuery: string = '',
  sortOption: VerificationSortOption = 'Priority'
): ZoneHouseholdItem[] {
  const query = searchQuery.trim().toLowerCase();

  // 1. Category Filter
  const filtered = households.filter((h) => {
    let matchesCategory = true;

    if (category === 'Pending') {
      matchesCategory =
        h.verificationStatus === 'Pending' ||
        h.verificationStatus === 'Not Verified' ||
        h.verificationStatus === 'Needs Verification';
    } else if (category === 'High Priority') {
      matchesCategory = h.priority === 'High';
    } else if (category === 'Identity') {
      matchesCategory =
        h.verificationStatus === 'Pending' ||
        h.verificationStatus === 'Not Verified' ||
        !h.verificationStatus;
    } else if (category === 'Location') {
      const hasCoords = typeof h.latitude === 'number' && typeof h.longitude === 'number';
      matchesCategory = !hasCoords || h.status === 'Needs Verification';
    } else if (category === 'Anomaly') {
      matchesCategory =
        h.status === 'Needs Verification' || h.verificationStatus === 'Needs Verification';
    } else if (category === 'Verified') {
      matchesCategory = h.verificationStatus === 'Verified';
    }

    if (!matchesCategory) return false;

    // 2. Search Query
    if (!query) return true;

    const matchId = h.householdId.toLowerCase().includes(query);
    const matchName = h.headName.toLowerCase().includes(query);
    const matchLocality = h.locality.toLowerCase().includes(query);
    const matchAddress = h.address ? h.address.toLowerCase().includes(query) : false;
    const matchMobile = h.mobile ? h.mobile.includes(query) : false;

    return matchId || matchName || matchLocality || matchAddress || matchMobile;
  });

  // 3. Sorting
  return filtered.sort((a, b) => {
    if (sortOption === 'Priority') {
      if (a.priority === 'High' && b.priority !== 'High') return -1;
      if (a.priority !== 'High' && b.priority === 'High') return 1;
      return a.householdId.localeCompare(b.householdId);
    } else if (sortOption === 'Household ID') {
      return a.householdId.localeCompare(b.householdId);
    } else if (sortOption === 'Area') {
      return a.locality.localeCompare(b.locality);
    }
    return 0;
  });
}
