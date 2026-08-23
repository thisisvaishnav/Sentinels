import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DetailedEnumeratorProfile } from '../../types/profileTypes';
import { ENUMERATOR_THEME } from '../../theme';

interface ProfileInfoCardProps {
  profile: DetailedEnumeratorProfile;
}

export const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({ profile }) => {
  const fields = [
    { label: 'Full Name', value: profile.name, icon: 'account-outline' },
    { label: 'Enumerator ID', value: profile.id, icon: 'card-account-details-outline' },
    { label: 'Role', value: profile.role, icon: 'badge-account-outline' },
    { label: 'Assigned Zone', value: profile.zoneName, icon: 'map-marker-radius-outline' },
    { label: 'Ward', value: profile.ward, icon: 'city-variant-outline' },
    { label: 'District', value: `${profile.district} (${profile.pinCode})`, icon: 'map-outline' },
    { label: 'Mobile Contact', value: profile.mobile, icon: 'phone-outline' },
    { label: 'Work Unit', value: `${profile.unit} · Supervisor ${profile.supervisor}`, icon: 'account-group-outline' },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="clipboard-account-outline" size={20} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.cardTitle}>Enumerator Information</Text>
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
