import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EnumeratorProfile } from '../types';
import { ENUMERATOR_THEME, Theme } from '../theme';

interface WelcomeSectionProps {
  profile: EnumeratorProfile;
  theme?: Theme;
  onProfilePress?: () => void;
  onZonePress?: () => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  profile,
  theme = ENUMERATOR_THEME,
  onProfilePress,
  onZonePress,
}) => {
  return (
    <View style={[styles.welcomeCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
      <View style={styles.topRow}>
        <TouchableOpacity style={[styles.avatarBox, { backgroundColor: theme.colors.accentSubtle, borderColor: theme.colors.accent }]} onPress={onProfilePress} activeOpacity={0.8}>
          <MaterialCommunityIcons name="account-hard-hat" size={28} color={theme.colors.accent} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.textWrap} onPress={onProfilePress} activeOpacity={0.8}>
          <Text style={[styles.greeting, { color: theme.colors.textMuted }]}>Good morning,</Text>
          <Text style={[styles.name, { color: theme.colors.textPrimary }]}>{profile.name}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.zoneBanner, { backgroundColor: theme.colors.subtleBackground, borderRadius: theme.borderRadius.md }]} onPress={onZonePress} activeOpacity={0.8}>
        <MaterialCommunityIcons name="map-marker-radius" size={16} color={theme.colors.accent} />
        <Text style={[styles.zoneText, { color: theme.colors.textPrimary }]}>{profile.assignedZone}</Text>
        <MaterialCommunityIcons name="chevron-right" size={16} color={theme.colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeCard: {
    borderRadius: 16,
    padding: 18,
    gap: 14,
    borderWidth: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  textWrap: {
    flex: 1,
  },
  greeting: {
    fontSize: 13,
    fontWeight: '500',
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  zoneBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  zoneText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
});
