import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CitizenHeader from '@/src/components/citizen/CitizenHeader';
import CitizenDrawer from '@/src/components/citizen/CitizenDrawer';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface CitizenLayoutProps {
  children: React.ReactNode;
  userName?: string;
  userId?: string;
  title?: string;
  showBack?: boolean;
}

export default function CitizenLayout({
  children,
  userName = 'Citizen',
  userId = '',
  title,
  showBack = false,
}: CitizenLayoutProps) {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      {title ? (
        <View style={styles.header}>
          {showBack && (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color={ENUMERATOR_THEME.colors.textPrimary}
              />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconBtn}
              activeOpacity={0.6}
              onPress={() => setDrawerVisible(true)}
            >
              <Ionicons name="menu" size={22} color={ENUMERATOR_THEME.colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <CitizenHeader
          onOpenDrawer={() => setDrawerVisible(true)}
          userName={userName}
        />
      )}
      <View style={styles.body}>
        {children}
      </View>
      <CitizenDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        userName={userName}
        userId={userId}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    marginTop: -30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
  },
  backBtn: {
    padding: 6,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    color: ENUMERATOR_THEME.colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    padding: 6,
  },
  body: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.background,
  },
});
