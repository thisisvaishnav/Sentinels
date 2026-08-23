import React from 'react';
import { EnumeratorPlaceholderScreen } from '@/src/features/enumeration/components/EnumeratorPlaceholderScreen';

export default function ReportMissingScreen() {
  return (
    <EnumeratorPlaceholderScreen
      title="Report Missing Household"
      subtitle="Flag unmapped structures or unrecorded households in your active zone."
      iconName="alert-decagram-outline"
    />
  );
}
