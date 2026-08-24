import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import { DeploymentOrder } from '@/src/types/admin';
import OperationalOrder from './OperationalOrder';
import AcknowledgementBadge from './AcknowledgementBadge';
import EnumeratorResponse from './EnumeratorResponse';

interface DeploymentCardProps {
  deployment: DeploymentOrder;
  enumeratorResponse?: {
    enumeratorName: string;
    enumeratorId: string;
    message: string;
    time: string;
  };
  onChangeRecipientsPress?: () => void;
}

export default function DeploymentCard({
  deployment,
  enumeratorResponse,
  onChangeRecipientsPress,
}: DeploymentCardProps) {
  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <Text style={styles.wardTitle}>{deployment.ward}</Text>
        <Pressable
          style={({ pressed }) => [styles.recipientsBtn, pressed && { opacity: 0.7 }]}
          onPress={onChangeRecipientsPress}
        >
          <Text style={styles.recipientsBtnText}>Change Recipients</Text>
        </Pressable>
      </View>

      <Text style={styles.broadcastText}>
        Broadcast to {deployment.broadcastCount} Enumerators
      </Text>

      {/* Operational Order */}
      <OperationalOrder title={deployment.title} message={deployment.message} />

      {/* Sent by */}
      <Text style={styles.sentBy}>
        Sent by {deployment.sentBy} • {deployment.sentAt}
      </Text>

      {/* Acknowledgement */}
      <AcknowledgementBadge
        acknowledged={deployment.acknowledged}
        total={deployment.total}
      />

      {/* Enumerator Response */}
      {enumeratorResponse && (
        <EnumeratorResponse
          response={{
            id: '1',
            ...enumeratorResponse,
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  recipientsBtn: {
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.primary,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  recipientsBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.primary,
  },
  broadcastText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textSecondary,
    marginTop: 4,
    marginBottom: 2,
  },
  sentBy: {
    fontSize: 9,
    color: ENUMERATOR_THEME.colors.textMuted,
    textAlign: 'right',
    marginTop: 8,
  },
});
