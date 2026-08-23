import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import DrishtiHeader from '@/src/components/admin/DrishtiHeader';
import SectionHeader from '@/src/components/admin/SectionHeader';
import AddStaffButton from '@/src/components/admin/AddStaffButton';
import EnumeratorRoster from '@/src/components/admin/EnumeratorRoster';
import CommandCenter from '@/src/components/admin/CommandCenter';
import BottomNavigation from '@/src/components/admin/BottomNavigation';
import { COLORS } from '@/constants/adminTheme';
import { EnumeratorRosterItem } from '@/src/types/admin';

/* ------------------------------------------------------------------ */
/* Mock data — swap for API calls later                                */
/* ------------------------------------------------------------------ */

const ENUMERATORS: EnumeratorRosterItem[] = [
  {
    id: '1',
    name: 'Meera Sharma',
    employeeId: 'ENUM-492',
    ward: 'Ward 7',
    initials: 'MS',
    status: 'active',
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    employeeId: 'ENUM-108',
    ward: 'Ward 3',
    initials: 'RK',
    status: 'offDuty',
  },
  {
    id: '3',
    name: 'Anita Nair',
    employeeId: 'ENUM-773',
    ward: 'Ward 12',
    initials: 'AN',
    status: 'issueReported',
  },
];

const DEPLOYMENT = {
  id: '1',
  ward: 'Ward 7 Deployment',
  broadcastCount: 12,
  title: 'OPERATIONAL ORDER',
  message:
    'Focus surveying efforts on Block C today. Ensure all residential forms are complete before 16:00 hrs.',
  sentBy: 'Admin',
  sentAt: '09:00 AM',
  acknowledged: 10,
  total: 12,
};

const STAFF_RESPONSE = {
  enumeratorName: 'Meera Sharma',
  enumeratorId: 'ENUM-492',
  message:
    'Block C perimeter secured. Beginning door-to-door assessment now.',
  time: '09:15 AM',
};

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export default function EnumeratorCommandCenterScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Staff');

  const handleTabPress = useCallback(
    (tab: string) => {
      setActiveTab(tab);
      if (tab === 'Home') {
        router.push('/(admin)/dashboard');
      } else if (tab === 'Staff') {
        router.push('/(admin)/field-enumerators');
      }
    },
    [router],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Fixed Header ──────────────────────────────────────── */}
      <DrishtiHeader
        onNotificationsPress={() =>
          Alert.alert('Notifications', 'No new notifications.')
        }
      />

      {/* ── Scrollable body ───────────────────────────────────── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Enumerator Roster section ─────────────────────── */}
        <SectionHeader
          title="Enumerator Roster"
          action={
            <AddStaffButton
              onPress={() => router.push('/(admin)/add-new-staff')}
            />
          }
        />

        <EnumeratorRoster
          enumerators={ENUMERATORS}
          totalCount={142}
          onViewAllPress={() =>
            Alert.alert('View All Staff', 'Full staff list coming soon.')
          }
          onEnumeratorPress={(e) =>
            Alert.alert('Enumerator Details', `${e.name} — ${e.employeeId}`)
          }
        />

        {/* ── Command Center section ─────────────────────────── */}
        <SectionHeader title="Command Center" />

        <CommandCenter
          deployment={DEPLOYMENT}
          staffResponse={STAFF_RESPONSE}
          onChangeRecipientsPress={() =>
            Alert.alert(
              'Change Recipients',
              'Recipient management coming soon.',
            )
          }
        />

        {/* bottom spacing for bottom nav */}
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* ── Fixed Bottom Nav ──────────────────────────────────── */}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
    marginTop: -30,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  body: {
    paddingHorizontal: 18,
    paddingTop: 20,
  },
});
