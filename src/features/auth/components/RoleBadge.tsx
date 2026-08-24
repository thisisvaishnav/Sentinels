import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthTheme, AuthRole } from '../theme';

interface RoleBadgeProps {
  theme: AuthTheme;
  role: AuthRole;
}

const ROLE_LABELS: Record<AuthRole, string> = {
  citizen: 'Citizen',
  enumerator: 'Enumerator',
  admin: 'Administrator',
};

export const RoleBadge: React.FC<RoleBadgeProps> = ({ theme, role }) => {
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: theme.colors.accentSubtle,
          borderColor: theme.colors.accent,
          borderRadius: theme.borderRadius.full,
        },
      ]}
    >
      <Text style={[styles.text, { color: theme.colors.accent }]}>
        {ROLE_LABELS[role]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderWidth: 1,
    marginBottom: 20,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
