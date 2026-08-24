import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AdminEscalationMetrics,
  EscalationFilterCategory,
  EscalationReasonType,
  EscalationSortOption,
  RequestedActionType,
  ResolutionOutcomeType,
  SeniorInspector,
  SupervisorEscalationItem,
} from '../types/supervisorEscalationTypes';

export const ADMIN_SUPERVISOR_ESCALATIONS_STORAGE_KEY = '@lokvision_admin_supervisor_escalations';

export const AVAILABLE_SENIOR_INSPECTORS: SeniorInspector[] = [
  {
    id: 'SI-001',
    name: 'Inspector Vikram Singh',
    employeeId: 'EMP-SI01',
    zone: 'Zone A-12 (Varanasi)',
    activeCasesCount: 2,
  },
  {
    id: 'SI-002',
    name: 'Inspector Priya Sharma',
    employeeId: 'EMP-SI02',
    zone: 'Zone A-14 (Varanasi)',
    activeCasesCount: 4,
  },
  {
    id: 'SI-003',
    name: 'Inspector Amit Verma',
    employeeId: 'EMP-SI03',
    zone: 'Zone B-03 (Varanasi)',
    activeCasesCount: 1,
  },
];

export const INITIAL_DEV_SEED_ESCALATIONS: SupervisorEscalationItem[] = [
  {
    id: 'ESC-00021',
    anomalyId: 'ANOM-1029',
    householdId: 'LV-UP-000127',
    householdHead: 'Ramesh Kumar',
    locality: 'Shiv Nagar',
    ward: 'Ward 12',
    district: 'Varanasi',
    address: 'Plot 42, Gali No. 3, Shiv Nagar',
    membersCount: 5,

    enumeratorId: 'ENUM001',
    enumeratorName: 'Sarah Jenkins',
    enumeratorRole: 'Lead Field Enumerator',
    zoneName: 'Zone A-12 - Shastri Nagar',

    anomalyType: 'gps-mismatch',
    anomalySeverity: 'critical',
    anomalyTitle: 'GPS Spatial Coordinates Mismatch',
    anomalyDescription: 'GPS geotag is 420 meters outside assigned Ward 12 boundary polygon.',
    flaggedReason: 'Geotag location outside designated survey polygon boundary',

    reason: 'gps_conflict',
    reasonText: 'GPS / location boundary conflict',
    notes: 'Resident insists household is inside Ward 12. Boundary pins on GIS map appear skewed.',
    requestedAction: 'senior-reassignment',
    priority: 'urgent',
    status: 'pending',

    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),

    history: [
      {
        id: 'H-1',
        action: 'Escalation Submitted',
        actor: 'Sarah Jenkins (ENUM001)',
        role: 'Field Enumerator',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        notes: 'Submitted for senior inspector reassignment.',
      },
    ],
  },
  {
    id: 'ESC-00019',
    anomalyId: 'ANOM-1014',
    householdId: 'LV-UP-000084',
    householdHead: 'Sunita Devi',
    locality: 'Shastri Nagar',
    ward: 'Ward 12',
    district: 'Varanasi',
    address: 'House No. 108, Near Water Tank, Shastri Nagar',
    membersCount: 4,

    enumeratorId: 'ENUM-492',
    enumeratorName: 'Meera Sharma',
    enumeratorRole: 'Field Enumerator',
    zoneName: 'Zone A-12 - Shastri Nagar',

    anomalyType: 'duplicate',
    anomalySeverity: 'high',
    anomalyTitle: 'Duplicate Mobile & Head Name Conflict',
    anomalyDescription: 'Mobile number matching existing record LV-UP-000042.',
    flaggedReason: 'Duplicate head name & mobile number detected',

    reason: 'duplicate_unresolved',
    reasonText: 'Duplicate household conflict cannot be resolved',
    notes: 'Both records claim head name Sunita Devi with identical mobile number.',
    requestedAction: 'supervisor-review',
    priority: 'high',
    status: 'in-review',

    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    supervisorNotes: 'Checking database registry for initial registration source.',

    history: [
      {
        id: 'H-1',
        action: 'Escalation Submitted',
        actor: 'Meera Sharma (ENUM-492)',
        role: 'Field Enumerator',
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: 'H-2',
        action: 'Review Started',
        actor: 'Dr. R. K. Sharma',
        role: 'Zone Supervisor',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        notes: 'Checking database registry for initial registration source.',
      },
    ],
  },
  {
    id: 'ESC-00015',
    anomalyId: 'ANOM-0988',
    householdId: 'LV-UP-000210',
    householdHead: 'Vikramaditya Roy',
    locality: 'Civil Lines',
    ward: 'Ward 7',
    district: 'Varanasi',
    address: 'Bungalow 14, Mall Road, Civil Lines',
    membersCount: 3,

    enumeratorId: 'ENUM-773',
    enumeratorName: 'Anita Nair',
    enumeratorRole: 'Field Enumerator',
    zoneName: 'Zone A-07 - Civil Lines',

    anomalyType: 'verification-required',
    anomalySeverity: 'high',
    anomalyTitle: 'Resident Refused Physical Interview',
    anomalyDescription: 'Respondent declined to disclose income and welfare eligibility metrics.',
    flaggedReason: 'Verification incomplete due to refusal',

    reason: 'resident_refused',
    reasonText: 'Resident refused verification interview',
    notes: 'Resident requested formal authorization notice from District Magistrate office.',
    requestedAction: 'field-revisit',
    priority: 'high',
    status: 'assigned',

    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    assignedTo: 'SI-001',
    assignedToName: 'Inspector Vikram Singh',
    assignedRole: 'Senior Inspector',
    supervisorNotes: 'Assigned Senior Inspector Vikram Singh to accompany field team with official ID.',

    revisitDetails: {
      assignedEnumeratorId: 'ENUM-773',
      assignedEnumeratorName: 'Anita Nair',
      preferredDate: '26 Aug 2026',
      reason: 'Accompanied DM authorization visit',
      notes: 'Joint inspection with Senior Officer Vikram Singh.',
    },

    history: [
      {
        id: 'H-1',
        action: 'Escalation Submitted',
        actor: 'Anita Nair (ENUM-773)',
        role: 'Field Enumerator',
        timestamp: new Date(Date.now() - 3600000 * 28).toISOString(),
      },
      {
        id: 'H-2',
        action: 'Assigned Senior Inspector',
        actor: 'Dr. R. K. Sharma',
        role: 'Zone Supervisor',
        timestamp: new Date(Date.now() - 3600000 * 10).toISOString(),
        notes: 'Assigned Inspector Vikram Singh for joint field visit.',
      },
    ],
  },
  {
    id: 'ESC-00010',
    anomalyId: 'ANOM-0912',
    householdId: 'LV-UP-000055',
    householdHead: 'Govind Swaroop',
    locality: 'Kabir Nagar',
    ward: 'Ward 3',
    district: 'Varanasi',
    address: 'House 88, Kabir Nagar Main Road',
    membersCount: 6,

    enumeratorId: 'ENUM-108',
    enumeratorName: 'Rajesh Kumar',
    enumeratorRole: 'Field Enumerator',
    zoneName: 'Zone A-03 - Kabir Nagar',

    anomalyType: 'invalid-demographic',
    anomalySeverity: 'medium',
    anomalyTitle: 'Unusual Household Size Ratio',
    anomalyDescription: 'Demographic ratio mismatch reported during door-to-door survey.',
    flaggedReason: 'Member count exceeds standard family structure thresholds',

    reason: 'info_incorrect',
    reasonText: 'Household profile information appears incorrect',
    notes: 'Joint family split into two sub-units recently.',
    requestedAction: 'record-correction',
    priority: 'normal',
    status: 'resolved',

    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    supervisorNotes: 'Verified ration card documents; record updated with joint family sub-unit split.',
    resolutionOutcome: 'record_corrected',
    resolutionOutcomeText: 'Household record corrected',

    history: [
      {
        id: 'H-1',
        action: 'Escalation Submitted',
        actor: 'Rajesh Kumar (ENUM-108)',
        role: 'Field Enumerator',
        timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
      },
      {
        id: 'H-2',
        action: 'Record Correction Approved',
        actor: 'Dr. R. K. Sharma',
        role: 'Zone Supervisor',
        timestamp: new Date(Date.now() - 3600000 * 36).toISOString(),
      },
      {
        id: 'H-3',
        action: 'Escalation Resolved',
        actor: 'Dr. R. K. Sharma',
        role: 'Zone Supervisor',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        notes: 'Verified ration card documents; record updated with joint family sub-unit split.',
      },
    ],
  },
];

export async function loadSupervisorEscalations(): Promise<SupervisorEscalationItem[]> {
  try {
    const raw = await AsyncStorage.getItem(ADMIN_SUPERVISOR_ESCALATIONS_STORAGE_KEY);
    if (!raw) {
      await saveSupervisorEscalations(INITIAL_DEV_SEED_ESCALATIONS);
      return INITIAL_DEV_SEED_ESCALATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DEV_SEED_ESCALATIONS;
  } catch (error) {
    console.error('Failed to load admin supervisor escalations:', error);
    return INITIAL_DEV_SEED_ESCALATIONS;
  }
}

export async function saveSupervisorEscalations(
  escalations: SupervisorEscalationItem[]
): Promise<boolean> {
  try {
    await AsyncStorage.setItem(
      ADMIN_SUPERVISOR_ESCALATIONS_STORAGE_KEY,
      JSON.stringify(escalations)
    );
    return true;
  } catch (error) {
    console.error('Failed to save admin supervisor escalations:', error);
    return false;
  }
}

export async function getSupervisorEscalationById(
  id: string
): Promise<SupervisorEscalationItem | null> {
  const list = await loadSupervisorEscalations();
  const match = list.find((e) => e.id === id);
  return match || null;
}

export async function startSupervisorReview(
  id: string,
  supervisorNotes?: string,
  supervisorName: string = 'Dr. R. K. Sharma'
): Promise<SupervisorEscalationItem | null> {
  const list = await loadSupervisorEscalations();
  const item = list.find((e) => e.id === id);
  if (!item) return null;

  const now = new Date().toISOString();
  item.status = 'in-review';
  item.updatedAt = now;
  if (supervisorNotes) item.supervisorNotes = supervisorNotes.trim();

  item.history.unshift({
    id: `H-${Date.now()}`,
    action: 'Review Started',
    actor: supervisorName,
    role: 'Zone Supervisor',
    timestamp: now,
    notes: supervisorNotes?.trim() || 'Supervisor initiated detailed review of escalation.',
  });

  await saveSupervisorEscalations(list);
  return item;
}

export async function assignSeniorInspector(
  id: string,
  inspectorId: string,
  inspectorName: string,
  notes?: string,
  supervisorName: string = 'Dr. R. K. Sharma'
): Promise<SupervisorEscalationItem | null> {
  const list = await loadSupervisorEscalations();
  const item = list.find((e) => e.id === id);
  if (!item) return null;

  const now = new Date().toISOString();
  item.status = 'assigned';
  item.assignedTo = inspectorId;
  item.assignedToName = inspectorName;
  item.assignedRole = 'Senior Field Inspector';
  item.updatedAt = now;
  if (notes) item.supervisorNotes = notes.trim();

  item.history.unshift({
    id: `H-${Date.now()}`,
    action: 'Assigned Senior Inspector',
    actor: supervisorName,
    role: 'Zone Supervisor',
    timestamp: now,
    notes: `Assigned ${inspectorName} (${inspectorId}). ${notes ? notes.trim() : ''}`,
  });

  await saveSupervisorEscalations(list);
  return item;
}

export async function requestFieldRevisit(
  id: string,
  enumeratorId: string,
  enumeratorName: string,
  preferredDate: string,
  reason: string,
  notes?: string,
  supervisorName: string = 'Dr. R. K. Sharma'
): Promise<SupervisorEscalationItem | null> {
  const list = await loadSupervisorEscalations();
  const item = list.find((e) => e.id === id);
  if (!item) return null;

  const now = new Date().toISOString();
  item.status = 'assigned';
  item.requestedAction = 'field-revisit';
  item.updatedAt = now;
  item.revisitDetails = {
    assignedEnumeratorId: enumeratorId,
    assignedEnumeratorName: enumeratorName,
    preferredDate,
    reason,
    notes: notes?.trim(),
  };
  if (notes) item.supervisorNotes = notes.trim();

  item.history.unshift({
    id: `H-${Date.now()}`,
    action: 'Field Revisit Scheduled',
    actor: supervisorName,
    role: 'Zone Supervisor',
    timestamp: now,
    notes: `Scheduled field revisit with ${enumeratorName} on ${preferredDate}. ${reason}`,
  });

  await saveSupervisorEscalations(list);
  return item;
}

export async function approveRecordCorrection(
  id: string,
  notes?: string,
  supervisorName: string = 'Dr. R. K. Sharma'
): Promise<SupervisorEscalationItem | null> {
  const list = await loadSupervisorEscalations();
  const item = list.find((e) => e.id === id);
  if (!item) return null;

  const now = new Date().toISOString();
  item.status = 'in-review';
  item.requestedAction = 'record-correction';
  item.updatedAt = now;
  if (notes) item.supervisorNotes = notes.trim();

  item.history.unshift({
    id: `H-${Date.now()}`,
    action: 'Record Correction Approved for Processing',
    actor: supervisorName,
    role: 'Zone Supervisor',
    timestamp: now,
    notes: notes?.trim() || 'Approved data record correction request.',
  });

  await saveSupervisorEscalations(list);
  return item;
}

export async function resolveSupervisorEscalation(
  id: string,
  outcome: ResolutionOutcomeType,
  outcomeText: string,
  notes: string,
  supervisorName: string = 'Dr. R. K. Sharma'
): Promise<SupervisorEscalationItem | null> {
  const list = await loadSupervisorEscalations();
  const item = list.find((e) => e.id === id);
  if (!item) return null;

  const now = new Date().toISOString();
  item.status = 'resolved';
  item.resolutionOutcome = outcome;
  item.resolutionOutcomeText = outcomeText;
  item.supervisorNotes = notes.trim();
  item.updatedAt = now;

  item.history.unshift({
    id: `H-${Date.now()}`,
    action: 'Escalation Resolved',
    actor: supervisorName,
    role: 'Zone Supervisor',
    timestamp: now,
    notes: `Resolved (${outcomeText}): ${notes.trim()}`,
  });

  await saveSupervisorEscalations(list);
  return item;
}

export async function rejectSupervisorEscalation(
  id: string,
  reason: string,
  notes: string,
  supervisorName: string = 'Dr. R. K. Sharma'
): Promise<SupervisorEscalationItem | null> {
  const list = await loadSupervisorEscalations();
  const item = list.find((e) => e.id === id);
  if (!item) return null;

  const now = new Date().toISOString();
  item.status = 'rejected';
  item.supervisorNotes = `${reason}: ${notes.trim()}`;
  item.updatedAt = now;

  item.history.unshift({
    id: `H-${Date.now()}`,
    action: 'Escalation Rejected',
    actor: supervisorName,
    role: 'Zone Supervisor',
    timestamp: now,
    notes: `Rejected (${reason}): ${notes.trim()}`,
  });

  await saveSupervisorEscalations(list);
  return item;
}

export function getSupervisorEscalationMetrics(
  escalations: SupervisorEscalationItem[]
): AdminEscalationMetrics {
  return {
    totalCount: escalations.length,
    pendingCount: escalations.filter((e) => e.status === 'pending').length,
    urgentCount: escalations.filter((e) => e.priority === 'urgent').length,
    highCount: escalations.filter((e) => e.priority === 'high').length,
    inReviewCount: escalations.filter((e) => e.status === 'in-review').length,
    assignedCount: escalations.filter((e) => e.status === 'assigned').length,
    resolvedCount: escalations.filter((e) => e.status === 'resolved').length,
    rejectedCount: escalations.filter((e) => e.status === 'rejected').length,
    seniorReassignmentCount: escalations.filter((e) => e.requestedAction === 'senior-reassignment').length,
    fieldRevisitCount: escalations.filter((e) => e.requestedAction === 'field-revisit').length,
    recordCorrectionCount: escalations.filter((e) => e.requestedAction === 'record-correction').length,
  };
}

export function filterAndSortSupervisorEscalations(
  escalations: SupervisorEscalationItem[],
  category: EscalationFilterCategory = 'All',
  searchQuery: string = '',
  sortOption: EscalationSortOption = 'Urgent First'
): SupervisorEscalationItem[] {
  const query = searchQuery.trim().toLowerCase();

  // 1. Filter
  const filtered = escalations.filter((e) => {
    let matchesCategory = true;
    if (category === 'Pending') matchesCategory = e.status === 'pending';
    else if (category === 'Urgent') matchesCategory = e.priority === 'urgent';
    else if (category === 'High') matchesCategory = e.priority === 'high';
    else if (category === 'In Review') matchesCategory = e.status === 'in-review' || e.status === 'assigned';
    else if (category === 'Resolved') matchesCategory = e.status === 'resolved';
    else if (category === 'Rejected') matchesCategory = e.status === 'rejected';
    else if (category === 'Senior Reassignment') matchesCategory = e.requestedAction === 'senior-reassignment';
    else if (category === 'Field Revisit') matchesCategory = e.requestedAction === 'field-revisit';
    else if (category === 'Record Correction') matchesCategory = e.requestedAction === 'record-correction';

    if (!matchesCategory) return false;
    if (!query) return true;

    const matchId = e.id.toLowerCase().includes(query);
    const matchHh = e.householdId.toLowerCase().includes(query);
    const matchEnumId = e.enumeratorId.toLowerCase().includes(query);
    const matchEnumName = e.enumeratorName.toLowerCase().includes(query);
    const matchHead = e.householdHead.toLowerCase().includes(query);
    const matchLocality = e.locality.toLowerCase().includes(query);
    const matchType = e.anomalyType.toLowerCase().includes(query);

    return matchId || matchHh || matchEnumId || matchEnumName || matchHead || matchLocality || matchType;
  });

  // 2. Sort
  return filtered.sort((a, b) => {
    if (sortOption === 'Newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortOption === 'Oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }

    // Default: Urgent First (Urgent -> High -> Normal, then newest)
    const priorityScore = (p: string) => (p === 'urgent' ? 3 : p === 'high' ? 2 : 1);
    const scoreA = priorityScore(a.priority);
    const scoreB = priorityScore(b.priority);
    if (scoreB !== scoreA) return scoreB - scoreA;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}
