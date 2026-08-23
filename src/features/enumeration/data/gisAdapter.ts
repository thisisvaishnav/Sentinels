/**
 * gisAdapter.ts
 *
 * GIS Data Abstraction Layer
 * Standardizes spatial household data into consistent HouseholdMarker[] and GeoJSON formats.
 *
 * Architecture:
 * Current: Local Household Store -> GIS Adapter -> React Native Map UI
 * Future:  FastAPI + PostGIS API -> GIS Adapter -> React Native Map UI
 */

import { ZoneHouseholdItem } from '../types';

export interface GisCoordinate {
  latitude: number;
  longitude: number;
}

export interface HouseholdMarker {
  id: string;
  householdId: string;
  headName: string;
  locality: string;
  members: number;
  status: ZoneHouseholdItem['status'];
  priority: ZoneHouseholdItem['priority'];
  verificationStatus?: string;
  latitude: number;
  longitude: number;
  areaId: string;
  address?: string;
}

export interface GisFeatureProperties {
  householdId: string;
  headName: string;
  locality: string;
  members: number;
  status: ZoneHouseholdItem['status'];
  priority: ZoneHouseholdItem['priority'];
  verificationStatus?: string;
  address?: string;
}

export interface GisFeature {
  type: 'Feature';
  id: string;
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: GisFeatureProperties;
}

export interface GisFeatureCollection {
  type: 'FeatureCollection';
  features: GisFeature[];
}

// Development coordinates centered around Shiv Nagar / Zone A-12 (Varanasi/Lucknow demo bounds)
export const DEMO_COORDINATES: Record<string, GisCoordinate> = {
  'LV-UP-000124': { latitude: 26.8467, longitude: 80.9462 },
  'LV-UP-000125': { latitude: 26.8485, longitude: 80.9490 },
  'LV-UP-000126': { latitude: 26.8450, longitude: 80.9438 },
  'LV-UP-000127': { latitude: 26.8510, longitude: 80.9520 },
  'LV-UP-000128': { latitude: 26.8432, longitude: 80.9415 },
  'LV-UP-000129': { latitude: 26.8498, longitude: 80.9472 },
  'LV-UP-000130': { latitude: 26.8525, longitude: 80.9550 },
  'LV-UP-000131': { latitude: 26.8418, longitude: 80.9390 },
  'LV-UP-000132': { latitude: 26.8540, longitude: 80.9580 },
  'LV-UP-000133': { latitude: 26.8402, longitude: 80.9450 },
  'LV-UP-000134': { latitude: 26.8460, longitude: 80.9505 },
  'LV-UP-000135': { latitude: 26.8478, longitude: 80.9425 },
  'LV-UP-000136': { latitude: 26.8502, longitude: 80.9540 },
  'LV-UP-000137': { latitude: 26.8445, longitude: 80.9480 },
};

/**
 * Resolves coordinate for a household item.
 */
export function getHouseholdCoordinate(item: ZoneHouseholdItem): GisCoordinate {
  if (item.latitude && item.longitude) {
    return { latitude: item.latitude, longitude: item.longitude };
  }
  if (DEMO_COORDINATES[item.householdId]) {
    return DEMO_COORDINATES[item.householdId];
  }
  const seed = parseInt(item.householdId.replace(/\D/g, '')) || 1;
  return {
    latitude: 26.8467 + (seed % 10) * 0.0012 - 0.005,
    longitude: 80.9462 + ((seed * 7) % 10) * 0.0012 - 0.005,
  };
}

/**
 * Transforms household domain model into unified HouseholdMarker representation for Map UI.
 */
export function mapToHouseholdMarkers(households: ZoneHouseholdItem[]): HouseholdMarker[] {
  return households.map((h) => {
    const coord = getHouseholdCoordinate(h);
    return {
      id: h.id,
      householdId: h.householdId,
      headName: h.headName,
      locality: h.locality,
      members: h.members,
      status: h.status,
      priority: h.priority,
      verificationStatus: h.verificationStatus,
      latitude: coord.latitude,
      longitude: coord.longitude,
      areaId: h.areaId,
      address: h.address,
    };
  });
}

/**
 * Transforms household records into standard GeoJSON FeatureCollection for future GIS endpoints.
 */
export function convertToGeoJson(households: ZoneHouseholdItem[]): GisFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: mapToHouseholdMarkers(households).map((marker) => ({
      type: 'Feature',
      id: marker.id,
      geometry: {
        type: 'Point',
        coordinates: [marker.longitude, marker.latitude],
      },
      properties: {
        householdId: marker.householdId,
        headName: marker.headName,
        locality: marker.locality,
        members: marker.members,
        status: marker.status,
        priority: marker.priority,
        verificationStatus: marker.verificationStatus,
        address: marker.address,
      },
    })),
  };
}
