import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';
import { FamilyMember } from '../../types';

interface Props {
  members: FamilyMember[];
  onAddPress: () => void;
  onEditPress: (member: FamilyMember) => void;
  onRemovePress: (id: string) => void;
  errors?: Record<string, string>;
}

export function FamilyMembersCardList({
  members,
  onAddPress,
  onEditPress,
  onRemovePress,
  errors,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRowBetween}>
        <View style={styles.cardHeaderRow}>
          <MaterialCommunityIcons name="account-group-outline" size={22} color={ENUMERATOR_THEME.colors.accent} />
          <Text style={styles.cardTitle}>Family Members ({members.length})</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={onAddPress} activeOpacity={0.8}>
          <Ionicons name="add" size={16} color={ENUMERATOR_THEME.colors.textWhite} />
          <Text style={styles.addBtnText}>Add Member</Text>
        </TouchableOpacity>
      </View>

      {errors?.members ? <Text style={styles.errorText}>{errors.members}</Text> : null}

      {members.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No additional family members recorded yet.</Text>
        </View>
      ) : (
        <View style={styles.membersList}>
          {members.map((item, index) => (
            <View key={item.id} style={styles.memberCard}>
              <View style={styles.memberMain}>
                <View style={styles.nameRow}>
                  <Text style={styles.cardNumber}>Member {String(index + 1).padStart(2, '0')}</Text>
                  <Text style={styles.memberName}>{item.name}</Text>
                </View>
                <Text style={styles.memberDetails}>
                  {item.age} years · {item.gender} · {item.relationship}
                </Text>
                <Text style={styles.memberSubDetails}>
                  {item.occupation} {item.education ? `· ${item.education}` : ''}
                </Text>
              </View>

              <View style={styles.actionColumn}>
                <TouchableOpacity
                  style={styles.iconActionBtn}
                  onPress={() => onEditPress(item)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="create-outline" size={16} color={ENUMERATOR_THEME.colors.accent} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconActionBtn}
                  onPress={() => onRemovePress(item.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={16} color={ENUMERATOR_THEME.colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 12,
  },
  cardHeaderRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
    gap: 4,
  },
  addBtnText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 12,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.danger,
    fontWeight: '500',
  },
  emptyBox: {
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    padding: 14,
    alignItems: 'center',
  },
  emptyText: {
    color: ENUMERATOR_THEME.colors.textMuted,
    fontSize: 13,
  },
  membersList: {
    gap: 8,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    justifyContent: 'space-between',
  },
  memberMain: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardNumber: {
    fontSize: 10,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  memberDetails: {
    fontSize: 12,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  memberSubDetails: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  actionColumn: {
    flexDirection: 'row',
    gap: 6,
  },
  iconActionBtn: {
    width: 32,
    height: 32,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
