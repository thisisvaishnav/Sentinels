import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DetailedAdminProfile } from '../../types/adminProfileTypes';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface AdminProfileInfoCardProps {
  profile: DetailedAdminProfile;
}

export const AdminProfileInfoCard: React.FC<AdminProfileInfoCardProps> = ({ profile }) => {
  const fields = [
    { label: 'Full Name', value: profile.name, icon: 'account-outline' },
    { label: 'Employee ID', value: profile.id, icon: 'card-account-details-outline' },
    { label: 'Role', value: profile.role, icon: 'badge-account-outline' },
    { label: 'Authority Level', value: profile.authorityLevel, icon: 'shield-crown-outline' },
    { label: 'District', value: profile.district, icon: 'map-outline' },
    { label: 'Zone Access', value: profile.zone, icon: 'map-marker-radius-outline' },
    { label: 'Email', value: profile.email, icon: 'email-outline' },
    { label: 'Phone', value: profile.phone, icon: 'phone-outline' },
    { label: 'Joined', value: profile.joinedDate, icon: 'calendar-outline' },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="clipboard-account-outline" size={20} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.cardTitle}>Admin Information</Text>
      </View>

      <View style={styles.grid}>
        {fields.map((field, idx) => (
          <View key={idx} style={styles.infoRow}>
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons
                name={field.icon as any}
                size={16}
                color={ENUMERATOR_THEME.colors.textSecondary}
              />
            </View>

            <View style={styles.textWrap}>
              <Text style={styles.label}>{field.label}</Text>
              <Text style={styles.value}>{field.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.subtleBackground,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  grid: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
});
