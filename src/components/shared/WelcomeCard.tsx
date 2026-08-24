import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface WelcomeCardProps {
  userName: string;
  zoneInfo?: string;
  onPress?: () => void;
}

export default function WelcomeCard({ userName, zoneInfo, onPress }: WelcomeCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View style={styles.welcomeCard}>
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.avatarBox}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <Text style={styles.avatarText}>{getInitials(userName)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.textWrap}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.name}>{userName}</Text>
        </TouchableOpacity>
      </View>

      {zoneInfo && (
        <TouchableOpacity
          style={styles.zoneBanner}
          activeOpacity={0.8}
        >
          <Ionicons name="location-outline" size={16} color={ENUMERATOR_THEME.colors.accent} />
          <Text style={styles.zoneText}>{zoneInfo}</Text>
          <Ionicons name="chevron-forward" size={16} color={ENUMERATOR_THEME.colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
}

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
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textWhite,
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
