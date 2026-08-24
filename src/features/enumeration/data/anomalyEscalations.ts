import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AnomalyEscalation,
  AnomalyEscalationPriority,
  AnomalyEscalationReason,
  AnomalyRequestedAction,
  HouseholdAnomaly,
} from '../types/anomalyTypes';
import { addEnumeratorActivity } from './activity';
import { enqueueSyncItem } from './syncQueue';

export const ANOMALY_ESCALATIONS_STORAGE_KEY = '@lokvision_anomaly_escalations';

const REASON_LABELS: Record<AnomalyEscalationReason, string> = {
  unable_to_verify: 'Unable to verify household in field',
  duplicate_unresolved: 'Duplicate household conflict cannot be resolved',
  gps_conflict: 'GPS / location boundary conflict',
  info_incorrect: 'Household profile information appears incorrect',
  resident_refused: 'Resident refused verification interview',
  senior_inspection_needed: 'Household requires senior inspection',
  supervisor_decision_needed: 'Enumerator needs supervisor decision',
  other: 'Other custom observation',
};

export function getEscalationReasonLabel(reason: AnomalyEscalationReason): string {
  return REASON_LABELS[reason] || reason;
}

const ACTION_LABELS: Record<AnomalyRequestedAction, string> = {
  'supervisor-review': 'Supervisor Review',
  'senior-reassignment': 'Senior Re-Assignment',
  'field-revisit': 'Field Revisit Request',
  'record-correction': 'Record Correction',
};

export function getRequestedActionLabel(action: AnomalyRequestedAction): string {
  return ACTION_LABELS[action] || action;
}

/**
 * Load all anomaly escalations from AsyncStorage.
 */
export async function loadAnomalyEscalations(): Promise<AnomalyEscalation[]> {
  try {
    const raw = await AsyncStorage.getItem(ANOMALY_ESCALATIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load anomaly escalations:', error);
    return [];
  }
}

/**
 * Save anomaly escalations array to AsyncStorage.
 */
export async function saveAnomalyEscalations(
  escalations: AnomalyEscalation[]
): Promise<boolean> {
  try {
    await AsyncStorage.setItem(
      ANOMALY_ESCALATIONS_STORAGE_KEY,
      JSON.stringify(escalations)
    );
    return true;
  } catch (error) {
    console.error('Failed to save anomaly escalations:', error);
    return false;
  }
}

/**
 * Get active escalation for a specific anomaly ID.
 */
export async function getEscalationForAnomaly(
  anomalyId: string
): Promise<AnomalyEscalation | null> {
  const escalations = await loadAnomalyEscalations();
  const match = escalations.find(
    (e) =>
      e.anomalyId === anomalyId &&
      (e.status === 'pending' || e.status === 'assigned' || e.status === 'in-review')
  );
  return match || null;
}

export interface CreateEscalationParams {
  anomaly: HouseholdAnomaly;
  reason: AnomalyEscalationReason;
  customReasonText?: string;
  notes?: string;
  requestedAction: AnomalyRequestedAction;
  priority: AnomalyEscalationPriority;
  enumeratorId?: string;
}

export interface CreateEscalationResult {
  success: boolean;
  isDuplicate?: boolean;
  escalation?: AnomalyEscalation;
  message?: string;
}

/**
 * Submit a new escalation request. Checks for active duplicate escalations before creating.
 */
export async function createAnomalyEscalation(
  params: CreateEscalationParams
): Promise<CreateEscalationResult> {
  const {
    anomaly,
    reason,
    customReasonText,
    notes,
    requestedAction,
    priority,
    enumeratorId = 'EN-4029',
  } = params;

  // 1. Duplicate Check: Block creating duplicate active escalations for same anomaly ID
  const existingActive = await getEscalationForAnomaly(anomaly.id);
  if (existingActive) {
    return {
      success: false,
      isDuplicate: true,
      escalation: existingActive,
      message: `An escalation request (${existingActive.id}) is already active for anomaly ${anomaly.householdId}.`,
    };
  }

  const now = new Date().toISOString();
  const escalationId = `ESC-${Date.now().toString().slice(-6)}`;
  const reasonText =
    reason === 'other'
      ? customReasonText || 'Other custom observation'
      : getEscalationReasonLabel(reason);

  const newEscalation: AnomalyEscalation = {
    id: escalationId,
    anomalyId: anomaly.id,
    householdId: anomaly.householdId,
    enumeratorId,
    anomalyType: anomaly.type,
    severity: anomaly.severity,
    reason,
    reasonText,
    notes: notes?.trim(),
    requestedAction,
    priority,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
    assignedRole: requestedAction === 'senior-reassignment' ? 'Senior Field Inspector' : 'Supervisor',
  };

  const currentList = await loadAnomalyEscalations();
  const updatedList = [newEscalation, ...currentList];
  await saveAnomalyEscalations(updatedList);

  // 2. Enqueue item into Centralized Offline Sync Queue
  try {
    await enqueueSyncItem('anomaly_escalation', 'create', escalationId, newEscalation);
  } catch {
    // Ignore sync queue error
  }

  // 3. Register activity
  try {
    await addEnumeratorActivity(
      'anomaly_reviewed',
      'Anomaly Escalated',
      `Escalated ${anomaly.title} for household ${anomaly.householdId} (${getRequestedActionLabel(requestedAction)}).`,
      anomaly.householdId
    );
  } catch {
    // Ignore activity log error
  }

  return {
    success: true,
    escalation: newEscalation,
    message: `Escalation ${escalationId} submitted successfully (Pending Sync).`,
  };
}

/**
 * Cancel a pending escalation request.
 */
export async function cancelAnomalyEscalation(
  escalationId: string
): Promise<boolean> {
  const currentList = await loadAnomalyEscalations();
  const updated = currentList.filter(
    (e) => !(e.id === escalationId && e.status === 'pending')
  );
  return await saveAnomalyEscalations(updated);
}
