import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import { DeploymentOrder } from '@/src/types/admin';
import DeploymentCard from './DeploymentCard';

interface EnumeratorResponseData {
  enumeratorName: string;
  enumeratorId: string;
  message: string;
  time: string;
}

interface CommandCenterProps {
  deployment: DeploymentOrder;
  enumeratorResponse?: EnumeratorResponseData;
  onChangeRecipientsPress?: () => void;
}

export default function CommandCenter({
  deployment,
  enumeratorResponse,
  onChangeRecipientsPress,
}: CommandCenterProps) {
  return (
    <View style={styles.container}>
      <DeploymentCard
        deployment={deployment}
        enumeratorResponse={enumeratorResponse}
        onChangeRecipientsPress={onChangeRecipientsPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
});
