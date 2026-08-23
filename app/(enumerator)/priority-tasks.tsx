import React from 'react';
import { EnumeratorPlaceholderScreen } from '@/src/features/enumeration/components/EnumeratorPlaceholderScreen';

export default function PriorityTasksScreen() {
  return (
    <EnumeratorPlaceholderScreen
      title="Priority Tasks"
      subtitle="High-priority households, blind spots, unverified records, and anomaly alerts."
      iconName="shield-alert-outline"
    />
  );
}
