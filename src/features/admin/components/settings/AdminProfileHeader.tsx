import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DetailedAdminProfile } from '../../types/adminProfileTypes';
import { COLORS } from '@/constants/adminTheme';

interface AdminProfileHeaderProps {
  profile: DetailedAdminProfile;
  onBack: () => void;
}

export const AdminProfileHeader: React.FC<AdminProfileHeaderProps> = ({ profile, onBack }) => {
  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.profileBox}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>{initials || 'AD'}</Text>
          <View style={styles.onlineBadge}>
            <MaterialCommunityIcons name="shield-check" size={12} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.metaWrap}>
          <View style={styles.nameRow}>
            <Text style={styles.nameText}>{profile.name}</Text>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{profile.status}</Text>
            </View>
          </View>

          <Text style={styles.roleText}>{profile.role}</Text>

          <View style={styles.tagsRow}>
            <View style={styles.idTag}>
              <MaterialCommunityIcons name="badge-account-horizontal-outline" size={13} color={COLORS.accent} />
              <Text style={styles.idTagText}>ID: {profile.id}</Text>
            </View>

            <View style={styles.zoneTag}>
              <Ionicons name="location-outline" size={13} color={COLORS.textSecondary} />
              <Text style={styles.zoneTagText}>{profile.district}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    gap: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  placeholder: {
    width: 36,
  },
  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.accentSubtle,
    borderWidth: 2,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.accent,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.cardBackground,
  },
  metaWrap: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.success,
  },
  roleText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  idTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.accentLight,
    gap: 4,
  },
  idTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accent,
  },
  zoneTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.subtleBackground,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  zoneTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});
