import React from 'react';
import { EnumeratorPlaceholderScreen } from '@/src/features/enumeration/components/EnumeratorPlaceholderScreen';

export default function StartSurveyScreen() {
  return (
    <EnumeratorPlaceholderScreen
      title="Start Household Survey"
      subtitle="Complete field enumeration questionnaire for assigned households."
      iconName="clipboard-text-outline"
    />
  );
}
