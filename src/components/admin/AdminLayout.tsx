import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdminHeader from '@/src/components/admin/AdminHeader';
import AdminDrawer from '@/src/components/admin/AdminDrawer';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <AdminHeader />
      <View style={styles.body}>
        {children}
      </View>
      <AdminDrawer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    marginTop: -30,
  },
  body: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.background,
  },
});
