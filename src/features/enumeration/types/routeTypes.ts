import { ZoneHouseholdItem } from '../types';

export interface RouteStop {
  id: string; // Unique stop ID
  householdId: string;
  sequence: number; // 1-based sequence order
  distanceFromPreviousKm: number; // Estimated straight-line distance from previous point
  isVisited: boolean;
  visitedAt?: string; // ISO string when marked visited
  household?: ZoneHouseholdItem; // Merged household details
}

export interface ActiveRoutePlan {
  id: string;
  createdAt: string; // ISO String
  updatedAt: string;
  startLatitude: number;
  startLongitude: number;
  startLocationName: string; // e.g. "My Current Location" or "Zone Center"
  stops: RouteStop[];
  totalStopsCount: number;
  completedStopsCount: number;
  remainingStopsCount: number;
  estimatedTotalDistanceKm: number;
  highPriorityCount: number;
  pendingCount: number;
  isCompleted: boolean;
}

export type RouteFilterCategory =
  | 'All Eligible'
  | 'High Priority'
  | 'Pending'
  | 'Needs Verification'
  | 'Urgent Needs';
