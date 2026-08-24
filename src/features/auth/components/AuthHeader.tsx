import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthTheme, AuthRole } from '../theme';

interface AuthHeaderProps {
  theme: AuthTheme;
  role: AuthRole;
  subtitle: string;
  icon?: React.ReactNode;
}

const ROLE_ICONS: Record<AuthRole, { name: string; library: 'ion' | 'material' }> = {
  citizen: { name: 'person', library: 'ion' },
  enumerator: { name: 'satellite-variant', library: 'material' },
  admin: { name: 'shield-checkmark', library: 'ion' },
};

export const AuthHeader: React.FC<AuthHeaderProps> = ({ theme, role, subtitle, icon }) => {
  const roleIcon = ROLE_ICONS[role];

  return (
    <View style={styles.header}>
      <View
        style={[
          styles.logoBox,
          {
            backgroundColor: theme.colors.accent,
            borderRadius: theme.borderRadius.xl,
          },
        ]}
      >
        {icon ||
          (roleIcon.library === 'material' ? (
            <MaterialCommunityIcons
              name={roleIcon.name as any}
              size={30}
              color={theme.colors.textWhite}
            />
          ) : (
            <Ionicons
              name={roleIcon.name as any}
              size={30}
              color={theme.colors.textWhite}
            />
          ))}
      </View>

      <Text style={[styles.brand, { color: theme.colors.accent }]}>Lokvision</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBox: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  brand: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 6,
    textAlign: 'center',
  },
});
