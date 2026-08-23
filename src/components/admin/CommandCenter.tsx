import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/adminTheme';
import { DeploymentOrder } from '@/src/types/admin';
import DeploymentCard from './DeploymentCard';

interface StaffResponseData {
  enumeratorName: string;
  enumeratorId: string;
  message: string;
  time: string;
}

interface CommandCenterProps {
  deployment: DeploymentOrder;
  staffResponse?: StaffResponseData;
  onChangeRecipientsPress?: () => void;
}

export default function CommandCenter({
  deployment,
  staffResponse,
  onChangeRecipientsPress,
}: CommandCenterProps) {
  return (
    <View style={styles.container}>
      <DeploymentCard
        deployment={deployment}
        staffResponse={staffResponse}
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
