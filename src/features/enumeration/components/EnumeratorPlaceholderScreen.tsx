import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ENUMERATOR_THEME } from '../theme';

interface EnumeratorPlaceholderScreenProps {
  title: string;
  subtitle: string;
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
}

export const EnumeratorPlaceholderScreen: React.FC<EnumeratorPlaceholderScreenProps> = ({
  title,
  subtitle,
  iconName,
}) => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={ENUMERATOR_THEME.colors.cardBackground} />

      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={ENUMERATOR_THEME.colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerBrand}>Lokvision</Text>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>

        <View style={styles.headerRightSpacer} />
      </View>

      {/* Placeholder Content */}
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name={iconName} size={48} color={ENUMERATOR_THEME.colors.accent} />
        </View>

        <Text style={styles.pageTitle}>{title}</Text>
        <Text style={styles.pageSubtitle}>{subtitle}</Text>

        <View style={styles.devBadge}>
          <MaterialCommunityIcons name="tools" size={16} color={ENUMERATOR_THEME.colors.warning} />
          <Text style={styles.devBadgeText}>Page Under Active Development</Text>
        </View>

        <TouchableOpacity style={styles.backHomeBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="home-outline" size={18} color={ENUMERATOR_THEME.colors.textWhite} />
          <Text style={styles.backHomeText}>Return to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.background,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerBrand: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  headerRightSpacer: {
    width: 38,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
    textAlign: 'center',
  },
  pageSubtitle: {
    fontSize: 14,
    color: ENUMERATOR_THEME.colors.textMuted,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },
  devBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.warningBg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.warningBorder,
  },
  devBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.warningText,
  },
  backHomeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    gap: 8,
    marginTop: 12,
  },
  backHomeText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 14,
    fontWeight: '700',
  },
});
