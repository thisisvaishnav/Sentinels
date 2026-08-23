import React from 'react';
import { EnumeratorPlaceholderScreen } from '@/src/features/enumeration/components/EnumeratorPlaceholderScreen';

export default function AssignedZoneScreen() {
  return (
    <EnumeratorPlaceholderScreen
      title="Assigned Zone & Route"
      subtitle="Ward 12 - Shastri Nagar North route map, boundary details, and household list."
      iconName="map-marker-path"
    />
  );
}
