import AsyncStorage from '@react-native-async-storage/async-storage';
import { ZoneHouseholdItem } from '../types';
import { ActiveRoutePlan, RouteStop } from '../types/routeTypes';
import { getHouseholdCoordinate } from './gisAdapter';

export const ROUTE_STORAGE_KEY = '@lokvision_enumerator_route';

// Default Varanasi / Shiv Nagar zone center coordinates fallback
export const DEFAULT_START_LOCATION = {
  latitude: 26.8467,
  longitude: 80.9462,
  name: 'Zone A-12 Center (Shiv Nagar)',
};

/**
 * Calculates Haversine straight-line distance in kilometers between two geographic coordinates.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  if (lat1 === lat2 && lon1 === lon2) return 0;

  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Round to 1 decimal place
  return Math.round(distance * 10) / 10;
}

/**
 * Filters households eligible for route planning (excludes completed records by default).
 */
export function getRouteEligibleHouseholds(
  households: ZoneHouseholdItem[]
): ZoneHouseholdItem[] {
  return households.filter((h) => {
    // Exclude completed records unless specifically re-added
    if (h.status === 'Completed' && h.verificationStatus === 'Verified') {
      return false;
    }
    return true;
  });
}

/**
 * Generates a deterministic local route recommendation:
 * 1. Starts from start coordinates.
 * 2. Ranks remaining eligible households based on priority score & nearest distance.
 * 3. Iteratively picks the optimal next stop.
 */
export function calculateLocalRouteRecommendation(
  startLat: number,
  startLon: number,
  eligibleHouseholds: ZoneHouseholdItem[],
  startLocationName: string = 'Current Location'
): ActiveRoutePlan {
  const unvisitedPool = [...eligibleHouseholds];
  const stops: RouteStop[] = [];

  let currentLat = startLat;
  let currentLon = startLon;
  let accumulatedDistance = 0;
  let sequenceCounter = 1;

  while (unvisitedPool.length > 0) {
    let bestIndex = 0;
    let bestScore = -Infinity;
    let bestDist = 0;

    for (let i = 0; i < unvisitedPool.length; i++) {
      const h = unvisitedPool[i];
      const coord = getHouseholdCoordinate(h);
      const dist = calculateHaversineDistanceKm(
        currentLat,
        currentLon,
        coord.latitude,
        coord.longitude
      );

      // Priority Bonus Scoring
      let priorityScore = 0;
      if (h.priority === 'High') priorityScore += 50;
      if (h.status === 'Needs Verification' || h.verificationStatus === 'Needs Verification') {
        priorityScore += 40;
      }
      if (h.status === 'Missing') priorityScore += 35;
      if (h.status === 'In Progress') priorityScore += 30;

      // Distance penalty (prefer closer points)
      const distancePenalty = dist * 15;
      const totalScore = priorityScore - distancePenalty;

      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestIndex = i;
        bestDist = dist;
      }
    }

    const selectedHousehold = unvisitedPool.splice(bestIndex, 1)[0];
    const selectedCoord = getHouseholdCoordinate(selectedHousehold);

    accumulatedDistance += bestDist;

    stops.push({
      id: `stop-${sequenceCounter}-${selectedHousehold.householdId}`,
      householdId: selectedHousehold.householdId,
      sequence: sequenceCounter,
      distanceFromPreviousKm: Math.round(bestDist * 10) / 10,
      isVisited: false,
      household: selectedHousehold,
    });

    currentLat = selectedCoord.latitude;
    currentLon = selectedCoord.longitude;
    sequenceCounter++;
  }

  const highPriorityCount = eligibleHouseholds.filter((h) => h.priority === 'High').length;
  const pendingCount = eligibleHouseholds.filter((h) => h.status === 'Pending').length;

  return {
    id: `route-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    startLatitude: startLat,
    startLongitude: startLon,
    startLocationName,
    stops,
    totalStopsCount: stops.length,
    completedStopsCount: 0,
    remainingStopsCount: stops.length,
    estimatedTotalDistanceKm: Math.round(accumulatedDistance * 10) / 10,
    highPriorityCount,
    pendingCount,
    isCompleted: false,
  };
}

/**
 * Recalculates distances, sequence numbers, and summary stats for an active route plan.
 */
export function recalculateRoutePlanStats(
  routePlan: ActiveRoutePlan,
  householdsMap: Map<string, ZoneHouseholdItem>
): ActiveRoutePlan {
  let currentLat = routePlan.startLatitude;
  let currentLon = routePlan.startLongitude;
  let accumulatedDistance = 0;
  let completedCount = 0;

  const updatedStops: RouteStop[] = routePlan.stops.map((stop, index) => {
    const hh = householdsMap.get(stop.householdId) || stop.household;
    const coord = hh ? getHouseholdCoordinate(hh) : { latitude: currentLat, longitude: currentLon };

    const dist = calculateHaversineDistanceKm(
      currentLat,
      currentLon,
      coord.latitude,
      coord.longitude
    );

    accumulatedDistance += dist;
    currentLat = coord.latitude;
    currentLon = coord.longitude;

    if (stop.isVisited) {
      completedCount++;
    }

    return {
      ...stop,
      sequence: index + 1,
      distanceFromPreviousKm: Math.round(dist * 10) / 10,
      household: hh || stop.household,
    };
  });

  const total = updatedStops.length;
  const remaining = Math.max(0, total - completedCount);
  const highPriority = updatedStops.filter(
    (s) => s.household && s.household.priority === 'High'
  ).length;
  const pending = updatedStops.filter(
    (s) => s.household && s.household.status === 'Pending'
  ).length;

  return {
    ...routePlan,
    updatedAt: new Date().toISOString(),
    stops: updatedStops,
    totalStopsCount: total,
    completedStopsCount: completedCount,
    remainingStopsCount: remaining,
    estimatedTotalDistanceKm: Math.round(accumulatedDistance * 10) / 10,
    highPriorityCount: highPriority,
    pendingCount: pending,
    isCompleted: total > 0 && completedCount === total,
  };
}

export async function loadActiveRoute(): Promise<ActiveRoutePlan | null> {
  try {
    const json = await AsyncStorage.getItem(ROUTE_STORAGE_KEY);
    if (json) {
      const parsed: ActiveRoutePlan = JSON.parse(json);
      if (parsed && Array.isArray(parsed.stops)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Failed to load active route from AsyncStorage:', error);
  }
  return null;
}

export async function saveActiveRoute(routePlan: ActiveRoutePlan): Promise<void> {
  try {
    await AsyncStorage.setItem(ROUTE_STORAGE_KEY, JSON.stringify(routePlan));
  } catch (error) {
    console.error('Failed to save active route to AsyncStorage:', error);
  }
}

export async function clearActiveRoute(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ROUTE_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear active route from AsyncStorage:', error);
  }
}
