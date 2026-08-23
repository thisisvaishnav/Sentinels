import React from 'react';
import { EnumeratorPlaceholderScreen } from '@/src/features/enumeration/components/EnumeratorPlaceholderScreen';

export default function EnumeratorNotificationsScreen() {
  return (
    <EnumeratorPlaceholderScreen
      title="Notifications & Alerts"
      subtitle="Supervisor dispatches, zone assignment updates, and field alert notifications."
      iconName="bell-outline"
    />
  );
}
