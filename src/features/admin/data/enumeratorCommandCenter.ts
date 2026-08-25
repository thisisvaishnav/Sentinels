import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CommandCenterSummaryMetrics,
  EnumeratorCommandCenterRecord,
  EnumeratorFilterStatus,
  EnumeratorSortOption,
} from '../types/commandCenterTypes';
import { loadEnumeratorHouseholds } from '@/src/features/enumeration/data/households';
import { loadAnomalyEscalations } from '@/src/features/enumeration/data/anomalyEscalations';

export const ADMIN_COMMAND_CENTER_STORAGE_KEY = '@lokvision_admin_command_center';

type BaseEnumeratorInfo = Omit<
  EnumeratorCommandCenterRecord,
  | 'assignedHouseholds'
  | 'completedHouseholds'
  | 'inProgressHouseholds'
  | 'pendingHouseholds'
  | 'coveragePercentage'
  | 'anomalyCount'
  | 'escalationCount'
  | 'syncPendingCount'
>;

const BASE_ENUMERATORS: BaseEnumeratorInfo[] = [
  {
    enumeratorId: 'ENUM001',
    name: 'Priya Sharma',
    role: 'Lead Field Enumerator',
    zone: 'Zone A-12',
    ward: 'Ward 12',
    district: 'Varanasi',
    mobile: '+91 98765 43210',
    email: 'ENUM001@enumerator.sentinels.app',
    dailyTarget: 25,
    dailyCompleted: 18,
    lastActiveAt: new Date(Date.now() - 300000).toISOString(),
    operationalStatus: 'Active',
    performanceStatus: 'On Track',
  },
  {
    enumeratorId: 'ENUM-492',
    name: 'Meera Sharma',
    role: 'Field Enumerator',
    zone: 'Zone A-12',
    ward: 'Ward 7',
    district: 'Varanasi',
    mobile: '+91 98765 43211',
    email: 'ENUM492@enumerator.sentinels.app',
    dailyTarget: 20,
    dailyCompleted: 14,
    lastActiveAt: new Date(Date.now() - 1800000).toISOString(),
    operationalStatus: 'Active',
    performanceStatus: 'On Track',
  },
  {
    enumeratorId: 'ENUM-108',
    name: 'Rajesh Kumar',
    role: 'Field Enumerator',
    zone: 'Zone A-03',
    ward: 'Ward 3',
    district: 'Varanasi',
    mobile: '+91 98765 43212',
    email: 'ENUM108@enumerator.sentinels.app',
    dailyTarget: 20,
    dailyCompleted: 8,
    lastActiveAt: new Date(Date.now() - 14400000).toISOString(),
    operationalStatus: 'Off Duty',
    performanceStatus: 'Needs Attention',
  },
  {
    enumeratorId: 'ENUM-773',
    name: 'Anita Nair',
    role: 'Field Enumerator',
    zone: 'Zone A-07',
    ward: 'Ward 12',
    district: 'Varanasi',
    mobile: '+91 98765 43213',
    email: 'ENUM773@enumerator.sentinels.app',
    dailyTarget: 20,
    dailyCompleted: 5,
    lastActiveAt: new Date(Date.now() - 3600000).toISOString(),
    operationalStatus: 'Issue Reported',
    performanceStatus: 'Critical Delay',
  },
];

export async function loadEnumeratorCommandCenterRecords(): Promise<EnumeratorCommandCenterRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(ADMIN_COMMAND_CENTER_STORAGE_KEY);
    const households = await loadEnumeratorHouseholds();
    const escalations = await loadAnomalyEscalations();

    const totalHouseholds = households.length;
    const completedCount = households.filter((h) => h.status === 'Completed').length;
    const inProgressCount = households.filter((h) => h.status === 'In Progress').length;
    const pendingCount = households.filter((h) => h.status === 'Needs Verification' || h.status === 'Pending').length;
    const anomalyCount = households.filter((h) => h.status === 'Needs Verification' || h.priority === 'High').length;
    const escalationCount = escalations.length;

    // Derived records for base enumerators
    const derivedRecords: EnumeratorCommandCenterRecord[] = BASE_ENUMERATORS.map((base, idx) => {
      let enumAssigned = Math.max(1, Math.round(totalHouseholds / BASE_ENUMERATORS.length));
      let enumCompleted = Math.round(completedCount / BASE_ENUMERATORS.length);
      let enumInProgress = Math.round(inProgressCount / BASE_ENUMERATORS.length);
      let enumPending = Math.round(pendingCount / BASE_ENUMERATORS.length);
      let enumAnomalies = Math.round(anomalyCount / BASE_ENUMERATORS.length);
      let enumEscalations = Math.round(escalationCount / BASE_ENUMERATORS.length);

      if (idx === 0) {
        // ENUM001 Priya Sharma gets primary local dataset stats
        enumAssigned = totalHouseholds;
        enumCompleted = completedCount;
        enumInProgress = inProgressCount;
        enumPending = pendingCount;
        enumAnomalies = anomalyCount;
        enumEscalations = escalationCount;
      }

      const covPercent = enumAssigned > 0 ? Math.round((enumCompleted / enumAssigned) * 100) : 0;

      return {
        ...base,
        assignedHouseholds: enumAssigned,
        completedHouseholds: enumCompleted,
        inProgressHouseholds: enumInProgress,
        pendingHouseholds: enumPending,
        coveragePercentage: covPercent,
        anomalyCount: enumAnomalies,
        escalationCount: enumEscalations,
        syncPendingCount: Math.max(0, enumPending - enumCompleted),
      };
    });

    if (raw) {
      try {
        const stored = JSON.parse(raw);
        if (Array.isArray(stored) && stored.length > 0) {
          // Merge stored modifications with derived counts
          return derivedRecords.map((rec) => {
            const match = stored.find((s: any) => s.enumeratorId === rec.enumeratorId);
            return match ? { ...rec, ...match } : rec;
          });
        }
      } catch {
        // Fallback to derived records
      }
    }

    await saveEnumeratorCommandCenterRecords(derivedRecords);
    return derivedRecords;
  } catch (error) {
    console.error('Failed to load enumerator command center records:', error);
    return BASE_ENUMERATORS.map((base) => ({
      ...base,
      assignedHouseholds: 25,
      completedHouseholds: 15,
      inProgressHouseholds: 5,
      pendingHouseholds: 5,
      coveragePercentage: 60,
      anomalyCount: 2,
      escalationCount: 1,
      syncPendingCount: 0,
    }));
  }
}

export async function saveEnumeratorCommandCenterRecords(
  records: EnumeratorCommandCenterRecord[]
): Promise<boolean> {
  try {
    await AsyncStorage.setItem(ADMIN_COMMAND_CENTER_STORAGE_KEY, JSON.stringify(records));
    return true;
  } catch (error) {
    console.error('Failed to save enumerator command center records:', error);
    return false;
  }
}

export function getCommandCenterSummaryMetrics(
  records: EnumeratorCommandCenterRecord[]
): CommandCenterSummaryMetrics {
  const totalEnumerators = records.length;
  const activeCount = records.filter((r) => r.operationalStatus === 'Active').length;
  const offDutyCount = records.filter((r) => r.operationalStatus === 'Off Duty').length;
  const issueReportedCount = records.filter((r) => r.operationalStatus === 'Issue Reported').length;

  const totalAssignedHouseholds = records.reduce((acc, r) => acc + r.assignedHouseholds, 0);
  const totalCompletedHouseholds = records.reduce((acc, r) => acc + r.completedHouseholds, 0);
  const overallCoveragePercent =
    totalAssignedHouseholds > 0
      ? Math.round((totalCompletedHouseholds / totalAssignedHouseholds) * 100)
      : 0;

  const totalAnomaliesCount = records.reduce((acc, r) => acc + r.anomalyCount, 0);
  const totalEscalationsCount = records.reduce((acc, r) => acc + r.escalationCount, 0);

  return {
    totalEnumerators,
    activeCount,
    offDutyCount,
    issueReportedCount,
    totalAssignedHouseholds,
    totalCompletedHouseholds,
    overallCoveragePercent,
    totalAnomaliesCount,
    totalEscalationsCount,
  };
}

export function filterAndSortCommandCenterRecords(
  records: EnumeratorCommandCenterRecord[],
  statusFilter: EnumeratorFilterStatus = 'All',
  searchQuery: string = '',
  sortOption: EnumeratorSortOption = 'Name'
): EnumeratorCommandCenterRecord[] {
  const query = searchQuery.trim().toLowerCase();

  // 1. Filter
  const filtered = records.filter((r) => {
    let matchesStatus = true;
    if (statusFilter === 'Active') matchesStatus = r.operationalStatus === 'Active';
    else if (statusFilter === 'Off Duty') matchesStatus = r.operationalStatus === 'Off Duty';
    else if (statusFilter === 'Issue Reported') matchesStatus = r.operationalStatus === 'Issue Reported';
    else if (statusFilter === 'On Track') matchesStatus = r.performanceStatus === 'On Track';
    else if (statusFilter === 'Needs Attention') matchesStatus = r.performanceStatus === 'Needs Attention' || r.performanceStatus === 'Critical Delay';

    if (!matchesStatus) return false;
    if (!query) return true;

    const matchName = r.name.toLowerCase().includes(query);
    const matchId = r.enumeratorId.toLowerCase().includes(query);
    const matchZone = r.zone.toLowerCase().includes(query);
    const matchWard = r.ward.toLowerCase().includes(query);

    return matchName || matchId || matchZone || matchWard;
  });

  // 2. Sort
  return filtered.sort((a, b) => {
    if (sortOption === 'Completed') return b.completedHouseholds - a.completedHouseholds;
    if (sortOption === 'Pending') return b.pendingHouseholds - a.pendingHouseholds;
    if (sortOption === 'Anomalies') return b.anomalyCount - a.anomalyCount;
    if (sortOption === 'Coverage') return b.coveragePercentage - a.coveragePercentage;
    if (sortOption === 'Last Active') return new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime();
    return a.name.localeCompare(b.name);
  });
}
