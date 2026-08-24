import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AuthTheme } from '../theme';

interface AuthCardProps {
  theme: AuthTheme;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const AuthCard: React.FC<AuthCardProps> = ({ theme, children, style }) => {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.cardBackground,
          borderColor: theme.colors.border,
          borderRadius: theme.borderRadius.xl,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
});
