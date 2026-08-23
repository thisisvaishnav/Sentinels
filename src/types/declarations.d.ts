declare module 'react-native-maps' {
  import * as React from 'react';
  import { ViewProps } from 'react-native';

  export interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }

  export interface MapViewProps extends ViewProps {
    initialRegion?: Region;
    region?: Region;
    onRegionChange?: (region: Region) => void;
    onRegionChangeComplete?: (region: Region) => void;
    provider?: string;
    showsUserLocation?: boolean;
    showsMyLocationButton?: boolean;
    scrollEnabled?: boolean;
    zoomEnabled?: boolean;
    pitchEnabled?: boolean;
    rotateEnabled?: boolean;
    children?: React.ReactNode;
  }

  export interface MarkerProps extends ViewProps {
    coordinate: {
      latitude: number;
      longitude: number;
    };
    title?: string;
    description?: string;
    pinColor?: string;
    children?: React.ReactNode;
  }

  export const PROVIDER_DEFAULT: string;
  export const PROVIDER_GOOGLE: string;

  export class Marker extends React.Component<MarkerProps> {}
  export default class MapView extends React.Component<MapViewProps> {}
}
