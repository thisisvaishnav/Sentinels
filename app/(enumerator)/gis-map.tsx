import React from 'react';
import { EnumeratorPlaceholderScreen } from '@/src/features/enumeration/components/EnumeratorPlaceholderScreen';

export default function EnumeratorGisMapScreen() {
  return (
    <EnumeratorPlaceholderScreen
      title="Field GIS Map"
      subtitle="Interactive satellite view, boundary maps, and geo-referenced household markers."
      iconName="map-search-outline"
    />
  );
}
