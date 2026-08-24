import AsyncStorage from '@react-native-async-storage/async-storage';
import { EnumeratorActivityLog, EnumeratorActivityType, WorkBreakdownMetrics } from '../types';

export const ACTIVITY_STORAGE_KEY = '@lokvision_enumerator_activity';

// Helper to construct today's date string with specific time
function getTodayIsoTime(hours: number, minutes: number): string {
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

// Helper to construct yesterday's date string with specific time
function getYesterdayIsoTime(hours: number, minutes: number): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

// Helper to construct day before yesterday ISO time
function getDaysAgoIsoTime(daysAgo: number, hours: number, minutes: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

export const INITIAL_ACTIVITIES: EnumeratorActivityLog[] = [
  {
    id: 'act-101',
    type: 'survey_completed',
    title: 'Survey Completed',
    description: 'Captured Rajesh Kumar family (5 members) with spatial GPS coordinates.',
    householdId: 'LV-UP-000124',
    timestamp: getTodayIsoTime(10, 42),
  },
  {
    id: 'act-102',
    type: 'verification_completed',
    title: 'Verification Completed',
    description: 'Verified head of household Aadhaar identity & address details.',
    householdId: 'LV-UP-000126',
    timestamp: getTodayIsoTime(10, 15),
  },
  {
    id: 'act-103',
    type: 'registered',
    title: 'New Household Registered',
    description: 'Added Pooja Sharma household record in Shiv Nagar West.',
    householdId: 'LV-UP-000137',
    timestamp: getTodayIsoTime(9, 48),
  },
  {
    id: 'act-104',
    type: 'sync',
    title: 'Batch Data Synchronization',
    description: 'Successfully synced local field records to storage.',
    timestamp: getTodayIsoTime(9, 21),
  },
  {
    id: 'act-105',
    type: 'missing',
    title: 'Missing Household Reported',
    description: 'Reported structure unmapped / relocated near Canal Side.',
    householdId: 'LV-UP-000133',
    areaId: 'a4',
    timestamp: getTodayIsoTime(8, 55),
  },
  {
    id: 'act-106',
    type: 'anomaly_reviewed',
    title: 'Density Anomaly Reviewed',
    description: 'Confirmed high density cluster in Station Road Ward 12.',
    householdId: 'LV-UP-000128',
    timestamp: getYesterdayIsoTime(16, 30),
  },
  {
    id: 'act-107',
    type: 'survey_completed',
    title: 'Survey Completed',
    description: 'Completed comprehensive survey for Amitabh Verma household.',
    householdId: 'LV-UP-000126',
    timestamp: getYesterdayIsoTime(14, 15),
  },
  {
    id: 'act-108',
    type: 'survey_started',
    title: 'Survey Started',
    description: 'Started preliminary survey for Sunita Devi household.',
    householdId: 'LV-UP-000125',
    timestamp: getYesterdayIsoTime(11, 20),
  },
  {
    id: 'act-109',
    type: 'registered',
    title: 'New Household Registered',
    description: 'Registered Priyanka Singh household in Shiv Nagar East.',
    householdId: 'LV-UP-000135',
    timestamp: getDaysAgoIsoTime(2, 15, 10),
  },
];

export async function loadEnumeratorActivity(): Promise<EnumeratorActivityLog[]> {
  try {
    const json = await AsyncStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (json) {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Failed to load activity logs from AsyncStorage:', error);
  }
  // Default fallback seed dataset
  await saveEnumeratorActivity(INITIAL_ACTIVITIES);
  return INITIAL_ACTIVITIES;
}

export async function saveEnumeratorActivity(activities: EnumeratorActivityLog[]): Promise<void> {
  try {
    await AsyncStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activities));
  } catch (error) {
    console.error('Failed to save activity logs to AsyncStorage:', error);
  }
}

export async function addEnumeratorActivity(
  type: EnumeratorActivityType,
  title: string,
  description?: string,
  householdId?: string,
  areaId?: string
): Promise<EnumeratorActivityLog[]> {
  const current = await loadEnumeratorActivity();
  const newActivity: EnumeratorActivityLog = {
    id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    type,
    title,
    description,
    householdId,
    areaId,
    timestamp: new Date().toISOString(),
  };

  const updated = [newActivity, ...current];
  await saveEnumeratorActivity(updated);
  return updated;
}

/**
 * Check if a date string/timestamp falls on the same calendar day as targetDate in local timezone
 */
export function isSameLocalDay(date1Str: string, date2: Date = new Date()): boolean {
  try {
    const d1 = new Date(date1Str);
    return (
      d1.getFullYear() === date2.getFullYear() &&
      d1.getMonth() === date2.getMonth() &&
      d1.getDate() === date2.getDate()
    );
  } catch {
    return false;
  }
}

/**
 * Check if a date string is yesterday in local timezone
 */
export function isYesterdayLocalDay(dateStr: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameLocalDay(dateStr, yesterday);
}

/**
 * Filter activities for Today vs Earlier
 */
export function filterTodayActivities(activities: EnumeratorActivityLog[]) {
  const today: EnumeratorActivityLog[] = [];
  const earlier: EnumeratorActivityLog[] = [];

  const now = new Date();

  activities.forEach((act) => {
    if (isSameLocalDay(act.timestamp, now)) {
      today.push(act);
    } else {
      earlier.push(act);
    }
  });

  return { today, earlier };
}

/**
 * Calculate Work Breakdown Metrics derived from actual activity events & shared stores
 */
export function deriveWorkBreakdownMetrics(
  activities: EnumeratorActivityLog[],
  todayOnly: boolean = true
): WorkBreakdownMetrics {
  const now = new Date();
  const filtered = todayOnly
    ? activities.filter((act) => isSameLocalDay(act.timestamp, now))
    : activities;

  return {
    householdsRegistered: filtered.filter((act) => act.type === 'registered').length,
    surveysStarted: filtered.filter((act) => act.type === 'survey_started').length,
    surveysCompleted: filtered.filter((act) => act.type === 'survey_completed').length,
    verificationsCompleted: filtered.filter((act) => act.type === 'verification_completed').length,
    missingReports: filtered.filter((act) => act.type === 'missing').length,
    anomaliesReviewed: filtered.filter((act) => act.type === 'anomaly_reviewed').length,
  };
}

/**
 * Format timestamp into user-friendly time string (e.g., "10:42 AM" or "Today, 10:42 AM")
 */
export function formatActivityTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;

    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const now = new Date();

    if (isSameLocalDay(isoString, now)) {
      return timeStr;
    }

    if (isYesterdayLocalDay(isoString)) {
      return `Yesterday, ${timeStr}`;
    }

    return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
  } catch {
    return isoString;
  }
}
