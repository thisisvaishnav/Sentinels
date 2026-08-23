import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { EnumeratorProfile } from '../types';
import { ENUMERATOR_THEME } from '../theme';

interface WelcomeSectionProps {
  profile: EnumeratorProfile;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ profile }) => {
  const router = useRouter();

  return (
    <View style={styles.welcomeCard}>
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.avatarBox}
          onPress={() => router.push('/(enumerator)/profile')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="account-hard-hat" size={28} color={ENUMERATOR_THEME.colors.accent} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.textWrap}
          onPress={() => router.push('/(enumerator)/profile')}
          activeOpacity={0.8}
        >
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.name}>{profile.name}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.zoneBanner}
        onPress={() => router.push('/(enumerator)/assigned-zone')}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="map-marker-radius" size={16} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.zoneText}>{profile.assignedZone}</Text>
        <MaterialCommunityIcons name="chevron-right" size={16} color={ENUMERATOR_THEME.colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeCard: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accent,
  },
  textWrap: {
    flex: 1,
  },
  greeting: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '500',
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
    letterSpacing: -0.3,
  },
  zoneBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    gap: 8,
  },
  zoneText: {
    color: ENUMERATOR_THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
});
