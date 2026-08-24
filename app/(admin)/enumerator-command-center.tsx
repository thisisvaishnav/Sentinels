import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

import AdminLayout from '@/src/components/admin/AdminLayout';
import SectionHeader from '@/src/components/admin/SectionHeader';
import AddEnumeratorButton from '@/src/components/admin/AddEnumeratorButton';
import EnumeratorRoster from '@/src/components/admin/EnumeratorRoster';
import CommandCenter from '@/src/components/admin/CommandCenter';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
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

const ENUMERATOR_RESPONSE = {
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

  return (
    <AdminLayout>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Enumerator Roster section ─────────────────────── */}
        <SectionHeader
          title="Enumerator Roster"
          action={
            <AddEnumeratorButton
              onPress={() => router.push('/(admin)/add-new-enumerator')}
            />
          }
        />

        <EnumeratorRoster
          enumerators={ENUMERATORS}
          totalCount={142}
          onViewAllPress={() =>
            Alert.alert('View All Enumerators', 'Full enumerator list coming soon.')
          }
          onEnumeratorPress={(e) =>
            Alert.alert('Enumerator Details', `${e.name} — ${e.employeeId}`)
          }
        />

        {/* ── Command Center section ─────────────────────────── */}
        <SectionHeader title="Command Center" />

        <CommandCenter
          deployment={DEPLOYMENT}
          enumeratorResponse={ENUMERATOR_RESPONSE}
          onChangeRecipientsPress={() =>
            Alert.alert(
              'Change Recipients',
              'Recipient management coming soon.',
            )
          }
        />
      </ScrollView>
    </AdminLayout>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.background,
  },
  body: {
    paddingHorizontal: 18,
    paddingTop: 20,
  },
});
