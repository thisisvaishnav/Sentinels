import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthTheme } from '../theme';

interface AuthFooterProps {
  theme: AuthTheme;
  title?: string;
  text?: string;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({
  theme,
  title = 'End-to-End Encrypted',
  text = 'Unauthorized access is strictly\nprohibited and logged.',
}) => {
  return (
    <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
      <View style={styles.titleRow}>
        <Ionicons name="shield-checkmark-outline" size={18} color={theme.colors.textSecondary} />
        <Text style={[styles.title, { color: theme.colors.textSecondary }]}>{title}</Text>
      </View>
      <Text style={[styles.text, { color: theme.colors.textMuted }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 1,
    marginTop: 28,
    paddingTop: 20,
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  text: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 6,
  },
});
