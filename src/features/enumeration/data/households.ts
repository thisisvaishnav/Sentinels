import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  EnumeratorActivity,
  EnumeratorProfile,
  PriorityTaskMetric,
  QuickActionItem,
  SyncStatusInfo,
  ZoneAreaItem,
  ZoneHouseholdItem,
} from '../types';

export const HOUSEHOLDS_STORAGE_KEY = '@lokvision_enumerator_households';

export const mockEnumeratorProfile: EnumeratorProfile = {
  id: 'EN-4029',
  name: 'Sarah Jenkins',
  role: 'Lead Field Enumerator',
  assignedZone: 'Zone A-12 · Ward 12 (Shiv Nagar)',
  isOnline: true,
  unreadNotificationsCount: 3,
};

export const mockPriorityTasks: PriorityTaskMetric[] = [
  {
    id: 'p1',
    title: 'High-Priority Households',
    count: 8,
    unit: 'urgent surveys',
    iconName: 'home-alert-outline',
    color: '#EF4444',
    badgeBg: '#FEF2F2',
  },
  {
    id: 'p2',
    title: 'Blind-Spot Areas',
    count: 3,
    unit: 'unmapped clusters',
    iconName: 'radar',
    color: '#F59E0B',
    badgeBg: '#FFFBEB',
  },
  {
    id: 'p3',
    title: 'Unverified Households',
    count: 12,
    unit: 'pending GIS check',
    iconName: 'map-marker-question-outline',
    color: '#3B82F6',
    badgeBg: '#EFF6FF',
  },
  {
    id: 'p4',
    title: 'Anomaly Alerts',
    count: 2,
    unit: 'density flags',
    iconName: 'alert-circle-outline',
    color: '#EC4899',
    badgeBg: '#FDF2F8',
  },
];

export const mockQuickActions: QuickActionItem[] = [
  {
    id: 'act-survey',
    label: 'Start Survey',
    iconName: 'clipboard-edit-outline',
    color: '#6366F1',
    route: '/(enumerator)/start-survey',
  },
  {
    id: 'act-register',
    label: 'Register Household',
    iconName: 'home-plus-outline',
    color: '#10B981',
    route: '/(enumerator)/register-household',
  },
  {
    id: 'act-report',
    label: 'Report Missing',
    iconName: 'alert-decagram-outline',
    color: '#F59E0B',
    route: '/(enumerator)/report-missing',
  },
  {
    id: 'act-map',
    label: 'View Map',
    iconName: 'map-search-outline',
    color: '#0EA5E9',
    route: '/(enumerator)/gis-map',
  },
];

export const mockSyncStatus: SyncStatusInfo = {
  pendingCount: 0,
  lastSynced: '2 mins ago',
  isSyncing: false,
};

export const mockRecentActivities: EnumeratorActivity[] = [
  {
    id: 'act-1',
    title: 'Survey Completed LV-UP-000124',
    detail: 'Captured Rajesh Kumar family (5 members) with GPS coordinates.',
    timestamp: '10:42 AM',
    type: 'registered',
  },
  {
    id: 'act-2',
    title: 'Household Marked High Priority',
    detail: 'Flagged Sunita Devi household for urgent ration assistance.',
    timestamp: '10:15 AM',
    type: 'verified',
  },
  {
    id: 'act-3',
    title: 'New Household Registered',
    detail: 'Added Pooja Sharma household in Shiv Nagar West.',
    timestamp: '09:48 AM',
    type: 'missing',
  },
  {
    id: 'act-4',
    title: 'Batch Data Synchronization',
    detail: 'Successfully synced local field records to local storage.',
    timestamp: '09:21 AM',
    type: 'sync',
  },
];

export const INITIAL_AREAS: ZoneAreaItem[] = [
  { id: 'a1', name: 'Shiv Nagar East', totalHouseholds: 5, completedHouseholds: 4 },
  { id: 'a2', name: 'Shiv Nagar West', totalHouseholds: 3, completedHouseholds: 1 },
  { id: 'a3', name: 'Station Road', totalHouseholds: 3, completedHouseholds: 1 },
  { id: 'a4', name: 'Canal Side', totalHouseholds: 4, completedHouseholds: 1 },
];

export const INITIAL_ENUMERATOR_HOUSEHOLDS: ZoneHouseholdItem[] = [
  {
    id: '1',
    householdId: 'LV-UP-000124',
    headName: 'Rajesh Kumar',
    locality: 'Shiv Nagar East',
    members: 5,
    status: 'Completed',
    priority: 'Normal',
    areaId: 'a1',
    lastVisit: '10:42 AM',
    address: 'House 12, Ward 12, Shiv Nagar East',
    ward: 'Ward 12',
    district: 'Varanasi',
    pinCode: '221005',
    mobile: '9876543210',
    houseType: 'Permanent',
    ownership: 'Owned',
    needs: ['Health Assistance'],
    verificationStatus: 'Verified',
  },
  {
    id: '2',
    householdId: 'LV-UP-000125',
    headName: 'Sunita Devi',
    locality: 'Shiv Nagar West',
    members: 4,
    status: 'In Progress',
    priority: 'Normal',
    areaId: 'a2',
    lastVisit: 'Yesterday',
    address: 'Plot 45, Shiv Nagar West',
    ward: 'Ward 12',
    district: 'Varanasi',
    pinCode: '221005',
    mobile: '9812345678',
    houseType: 'Permanent',
    ownership: 'Owned',
    needs: ['Food / Ration', 'Health Assistance'],
    verificationStatus: 'Pending',
  },
  {
    id: '3',
    householdId: 'LV-UP-000126',
    headName: 'Amitabh Verma',
    locality: 'Station Road',
    members: 6,
    status: 'Completed',
    priority: 'Normal',
    areaId: 'a3',
    lastVisit: 'Yesterday',
    address: 'Block B, Station Road',
    ward: 'Ward 12',
    district: 'Varanasi',
    pinCode: '221005',
    mobile: '9765432109',
    houseType: 'Permanent',
    ownership: 'Rented',
    needs: ['Education Assistance'],
    verificationStatus: 'Verified',
  },
  {
    id: '4',
    householdId: 'LV-UP-000127',
    headName: 'Vikram Singh',
    locality: 'Canal Side',
    members: 3,
    status: 'Pending',
    priority: 'High',
    areaId: 'a4',
    address: 'Near Old Canal Bridge',
    ward: 'Ward 12',
    district: 'Varanasi',
    pinCode: '221005',
    mobile: '9988776655',
    houseType: 'Semi-Permanent',
    ownership: 'Owned',
    needs: ['Financial Assistance'],
    verificationStatus: 'Pending',
  },
  {
    id: '5',
    householdId: 'LV-UP-000128',
    headName: 'Meena Sharma',
    locality: 'Station Road',
    members: 4,
    status: 'Pending',
    priority: 'Normal',
    areaId: 'a3',
    address: 'Street No 4, Station Road',
    ward: 'Ward 12',
    district: 'Varanasi',
    pinCode: '221005',
    mobile: '9871122334',
    houseType: 'Temporary',
    ownership: 'Rented',
    needs: ['Financial Assistance'],
    verificationStatus: 'Pending',
  },
  {
    id: '6',
    householdId: 'LV-UP-000129',
    headName: 'Sanjay Yadav',
    locality: 'Canal Side',
    members: 5,
    status: 'Pending',
    priority: 'High',
    areaId: 'a4',
    address: 'House 88, Canal Side North',
    ward: 'Ward 12',
    district: 'Varanasi',
    pinCode: '221005',
    mobile: '9899001122',
    houseType: 'Permanent',
    ownership: 'Owned',
    needs: ['Food / Ration'],
    verificationStatus: 'Pending',
  },
  {
    id: '7',
    householdId: 'LV-UP-000130',
    headName: 'Ramesh Patel',
    locality: 'Canal Side',
    members: 5,
    status: 'Pending',
    priority: 'High',
    areaId: 'a4',
    address: 'Plot 12B, Canal Side',
    ward: 'Ward 12',
    district: 'Varanasi',
    pinCode: '221005',
    mobile: '9711223344',
    houseType: 'Semi-Permanent',
    ownership: 'Owned',
    needs: ['Health Assistance'],
    verificationStatus: 'Pending',
  },
  {
    id: '8',
    householdId: 'LV-UP-000131',
    headName: 'Anita Rastogi',
    locality: 'Shiv Nagar East',
    members: 3,
    status: 'Needs Verification',
    priority: 'High',
    areaId: 'a1',
    address: 'Lane 3, Shiv Nagar East',
    ward: 'Ward 12',
    district: 'Varanasi',
    pinCode: '221005',
    mobile: '9654321098',
    houseType: 'Permanent',
    ownership: 'Owned',
    needs: ['Housing'],
    verificationStatus: 'Needs Verification',
  },
  {
    id: '9',
    householdId: 'LV-UP-000132',
    headName: 'Suresh Chandra',
    locality: 'Shiv Nagar West',
    members: 6,
    status: 'Completed',
    priority: 'Normal',
    areaId: 'a2',
    lastVisit: '09:15 AM',
    address: 'House 90, Shiv Nagar West',
    ward: 'Ward 12',
    district: 'Varanasi',
    pinCode: '221005',
    mobile: '9543210987',
    houseType: 'Permanent',
    ownership: 'Owned',
    needs: ['Health Assistance'],
    verificationStatus: 'Verified',
  },
  {
    id: '10',
    householdId: 'LV-UP-000133',
    headName: 'Kavita Saxena',
    locality: 'Station Road',
    members: 2,
    status: 'Missing',
    priority: 'High',
    areaId: 'a3',
    address: 'Old Railway Quarters, Station Road',
    ward: 'Ward 12',
    district: 'Varanasi',
    pinCode: '221005',
    mobile: '9432109876',
    houseType: 'Temporary',
    ownership: 'Rented',
    needs: ['Food / Ration'],
    verificationStatus: 'Not Verified',
  },
  {
    id: '11',
    householdId: 'LV-UP-000134',
    headName: 'Deepak Mishra',
    locality: 'Canal Side',
    members: 5,
    status: 'Pending',
    priority: 'Normal',
    areaId: 'a4',
    address: 'H.No 104, Canal Side',
    ward: 'Ward 12',
    district: 'Varanasi',
    pinCode: '221005',
    mobile: '9321098765',
    houseType: 'Permanent',
    ownership: 'Owned',
    needs: ['Housing'],
    verificationStatus: 'Pending',
  },
  {
    id: '12',
    householdId: 'LV-UP-000135',
    headName: 'Priyanka Singh',
    locality: 'Shiv Nagar East',
    members: 4,
    status: 'Completed',
    priority: 'Normal',
    areaId: 'a1',
    lastVisit: '11:05 AM',
    address: 'Corner House, Shiv Nagar East',
    ward: 'Ward 12',
    district: 'Varanasi',
    pinCode: '221005',
    mobile: '9210987654',
    houseType: 'Permanent',
    ownership: 'Owned',
    needs: ['Education Assistance'],
    verificationStatus: 'Verified',
  },
  {
    id: '13',
    householdId: 'LV-UP-000136',
    headName: 'Arjun Yadav',
    locality: 'Shiv Nagar East',
    members: 5,
    status: 'Completed',
    priority: 'Normal',
    areaId: 'a1',
    lastVisit: '11:30 AM',
    address: 'House 55, Shiv Nagar East',
    ward: 'Ward 12',
    district: 'Varanasi',
    pinCode: '221005',
    mobile: '9109876543',
    houseType: 'Permanent',
    ownership: 'Owned',
    needs: ['Health Assistance'],
    verificationStatus: 'Verified',
  },
  {
    id: '14',
    householdId: 'LV-UP-000137',
    headName: 'Pooja Sharma',
    locality: 'Shiv Nagar West',
    members: 3,
    status: 'Pending',
    priority: 'Normal',
    areaId: 'a2',
    address: 'Plot 18, Shiv Nagar West',
    ward: 'Ward 12',
    district: 'Varanasi',
    pinCode: '221005',
    mobile: '9098765432',
    houseType: 'Semi-Permanent',
    ownership: 'Rented',
    needs: ['Financial Assistance'],
    verificationStatus: 'Pending',
  },
];

export async function loadEnumeratorHouseholds(): Promise<ZoneHouseholdItem[]> {
  try {
    const json = await AsyncStorage.getItem(HOUSEHOLDS_STORAGE_KEY);
    if (json) {
      const parsed: ZoneHouseholdItem[] = JSON.parse(json);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore read error
  }
  // Default to initial seed dataset
  await saveEnumeratorHouseholds(INITIAL_ENUMERATOR_HOUSEHOLDS);
  return INITIAL_ENUMERATOR_HOUSEHOLDS;
}

export async function saveEnumeratorHouseholds(households: ZoneHouseholdItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(HOUSEHOLDS_STORAGE_KEY, JSON.stringify(households));
  } catch {
    // Ignore save error
  }
}

export async function updateHouseholdStatusInStore(
  householdId: string,
  newStatus: ZoneHouseholdItem['status'],
  priority?: ZoneHouseholdItem['priority']
): Promise<ZoneHouseholdItem[]> {
  const current = await loadEnumeratorHouseholds();
  const updated = current.map((h) => {
    if (h.householdId === householdId || h.id === householdId) {
      return {
        ...h,
        status: newStatus,
        priority: priority ?? h.priority,
        lastVisit: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    }
    return h;
  });
  await saveEnumeratorHouseholds(updated);
  return updated;
}

// Single Source of Truth Metrics Calculator
export function getDerivedZoneMetrics(
  households: ZoneHouseholdItem[],
  baseAreas: ZoneAreaItem[] = INITIAL_AREAS
) {
  const totalHouseholds = households.length;
  const completedCount = households.filter((h) => h.status === 'Completed').length;
  const inProgressCount = households.filter((h) => h.status === 'In Progress').length;
  const pendingCount = households.filter((h) => h.status === 'Pending').length;
  const needsVerificationCount = households.filter(
    (h) => h.status === 'Needs Verification' || h.verificationStatus === 'Needs Verification'
  ).length;
  const missingCount = households.filter((h) => h.status === 'Missing').length;

  const highPriorityCount = households.filter((h) => h.priority === 'High').length;
  const urgentNeedsCount = households.filter(
    (h) =>
      h.needs &&
      h.needs.some(
        (n) => n.includes('Ration') || n.includes('Emergency') || n.includes('Health')
      )
  ).length;

  const overallCoveragePercent =
    totalHouseholds > 0 ? Math.round((completedCount / totalHouseholds) * 100) : 0;

  // Calculate dynamic area metrics from households array
  const derivedAreas: ZoneAreaItem[] = baseAreas.map((area) => {
    const areaHouseholds = households.filter(
      (h) => h.locality.toLowerCase().includes(area.name.toLowerCase()) || h.areaId === area.id
    );
    const totalInArea = areaHouseholds.length;
    const completedInArea = areaHouseholds.filter((h) => h.status === 'Completed').length;

    return {
      id: area.id,
      name: area.name,
      totalHouseholds: totalInArea,
      completedHouseholds: completedInArea,
    };
  });

  // Dynamic lowest coverage area
  const sortedAreasByCoverage = [...derivedAreas].sort((a, b) => {
    const covA = a.totalHouseholds > 0 ? (a.completedHouseholds / a.totalHouseholds) * 100 : 0;
    const covB = b.totalHouseholds > 0 ? (b.completedHouseholds / b.totalHouseholds) * 100 : 0;
    return covA - covB;
  });

  const lowestArea = sortedAreasByCoverage[0] || derivedAreas[0];
  const lowestAreaCoveragePercent =
    lowestArea && lowestArea.totalHouseholds > 0
      ? Math.round((lowestArea.completedHouseholds / lowestArea.totalHouseholds) * 100)
      : 0;
  const lowestAreaUnvisitedCount =
    lowestArea ? Math.max(0, lowestArea.totalHouseholds - lowestArea.completedHouseholds) : 0;

  return {
    totalHouseholds,
    completedCount,
    inProgressCount,
    pendingCount,
    needsVerificationCount,
    missingCount,
    highPriorityCount,
    urgentNeedsCount,
    overallCoveragePercent,
    derivedAreas,
    lowestArea,
    lowestAreaCoveragePercent,
    lowestAreaUnvisitedCount,
  };
}
