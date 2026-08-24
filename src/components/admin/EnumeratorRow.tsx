import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import { EnumeratorRosterItem } from '@/src/types/admin';
import StatusBadge from './StatusBadge';

interface EnumeratorRowProps {
  enumerator: EnumeratorRosterItem;
  onPress?: (enumerator: EnumeratorRosterItem) => void;
}

export default function EnumeratorRow({ enumerator, onPress }: EnumeratorRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: ENUMERATOR_THEME.colors.subtleBackground }]}
      onPress={() => onPress?.(enumerator)}
    >
      {/* Avatar */}
      <View style={styles.avatar}>
        {enumerator.avatar ? (
          <Image source={{ uri: enumerator.avatar }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarText}>{enumerator.initials}</Text>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {enumerator.name}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          ID: {enumerator.employeeId} • {enumerator.ward}
        </Text>
      </View>

      {/* Status */}
      <StatusBadge status={enumerator.status} />

      {/* Chevron */}
      <Ionicons
        name="chevron-forward"
        size={18}
        color={ENUMERATOR_THEME.colors.textMuted}
        style={styles.chevron}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.primary,
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  meta: {
    fontSize: 10,
    color: ENUMERATOR_THEME.colors.textSecondary,
    marginTop: 1,
  },
  chevron: {
    marginLeft: 6,
  },
});
