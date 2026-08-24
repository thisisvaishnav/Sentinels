import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { EnumeratorHeader } from '@/src/features/enumeration/components/EnumeratorHeader';
import { useCitizenDrawer } from '@/src/contexts/CitizenDrawerContext';
import { CITIZEN_THEME } from '@/src/features/enumeration/theme';
import { EnumeratorProfile } from '@/src/features/enumeration/types';

const T = CITIZEN_THEME;
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001';

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type RequestStatus = 'submitted' | 'verified' | 'completed' | 'under_verification' | 'assigned' | 'pending';

type RequestItem = {
  id: string;
  requestId: string;
  title: string;
  date: string;
  status: RequestStatus;
  steps: { label: string; done: boolean }[];
};

/* -------------------------------------------------------------------------- */
/*                                  Mock Data                                 */
/* -------------------------------------------------------------------------- */

const MOCK_ACTIVE_REQUESTS: RequestItem[] = [
  {
    id: '1',
    requestId: 'HR-4920-A',
    title: 'Household Registration',
    date: 'Oct 24, 2023',
    status: 'verified',
    steps: [
      { label: 'Submitted', done: true },
      { label: 'Verified', done: true },
      { label: 'Completed', done: false },
    ],
  },
  {
    id: '2',
    requestId: 'MH-1184-X',
    title: 'Missing Household Report',
    date: 'Oct 22, 2023',
    status: 'under_verification',
    steps: [
      { label: 'Submitted', done: true },
      { label: 'Under Review', done: false },
      { label: 'Resolved', done: false },
    ],
  },
  {
    id: '3',
    requestId: 'WN-8821-B',
    title: 'Water Need',
    date: 'Oct 20, 2023',
    status: 'assigned',
    steps: [
      { label: 'Submitted', done: true },
      { label: 'Assigned', done: false },
      { label: 'Resolved', done: false },
    ],
  },
  {
    id: '4',
    requestId: 'SR-3349-Z',
    title: 'Scheme Request',
    date: 'Oct 15, 2023',
    status: 'submitted',
    steps: [
      { label: 'Submitted', done: false },
      { label: 'Reviewed', done: false },
      { label: 'Approved', done: false },
    ],
  },
];

const MOCK_PAST_REQUESTS: RequestItem[] = [
  {
    id: '5',
    requestId: 'HR-3201-K',
    title: 'Household Registration',
    date: 'Sep 10, 2023',
    status: 'completed',
    steps: [
      { label: 'Submitted', done: true },
      { label: 'Verified', done: true },
      { label: 'Completed', done: true },
    ],
  },
  {
    id: '6',
    requestId: 'SR-2190-P',
    title: 'Scheme Request',
    date: 'Aug 28, 2023',
    status: 'completed',
    steps: [
      { label: 'Submitted', done: true },
      { label: 'Reviewed', done: true },
      { label: 'Approved', done: true },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                              Status Badge                                  */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }: { status: RequestStatus }) {
  const config: Record<RequestStatus, { label: string; bg: string; fg: string; icon: keyof typeof Ionicons.glyphMap }> = {
    submitted: { label: 'SUBMITTED', bg: T.colors.accentSubtle, fg: T.colors.accent, icon: 'paper-plane-outline' },
    verified: { label: 'VERIFIED', bg: T.colors.successBg, fg: T.colors.success, icon: 'checkmark-circle-outline' },
    completed: { label: 'COMPLETED', bg: T.colors.successBg, fg: T.colors.successText, icon: 'checkmark-done-outline' },
    under_verification: { label: 'UNDER VERIFICATION', bg: T.colors.warningBg, fg: T.colors.warningText, icon: 'time-outline' },
    assigned: { label: 'ASSIGNED', bg: T.colors.accentSubtle, fg: T.colors.accent, icon: 'person-outline' },
    pending: { label: 'PENDING', bg: T.colors.subtleBackground, fg: T.colors.textMuted, icon: 'hourglass-outline' },
  };

  const c = config[status];

  return (
    <View style={[badgeStyles.badge, { backgroundColor: c.bg }]}>
      <Ionicons name={c.icon} size={14} color={c.fg} />
      <Text style={[badgeStyles.text, { color: c.fg }]}>{c.label}</Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 5,
    marginTop: 8,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});

/* -------------------------------------------------------------------------- */
/*                              Step Progress                                 */
/* -------------------------------------------------------------------------- */

function StepProgress({ steps }: { steps: { label: string; done: boolean }[] }) {
  return (
    <View style={stepStyles.container}>
      {steps.map((step, i) => (
        <React.Fragment key={step.label}>
          <View style={stepStyles.step}>
            <View style={[stepStyles.dot, step.done && stepStyles.dotDone]}>
              {step.done && <Ionicons name="checkmark" size={12} color={T.colors.textWhite} />}
            </View>
            <Text style={[stepStyles.label, step.done && stepStyles.labelDone]}>{step.label}</Text>
          </View>
          {i < steps.length - 1 && (
            <View style={[stepStyles.line, step.done && steps[i + 1]?.done && stepStyles.lineDone]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const stepStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingHorizontal: 4,
  },
  step: {
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: T.colors.borderSubtle,
    backgroundColor: T.colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: {
    backgroundColor: T.colors.accent,
    borderColor: T.colors.accent,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: T.colors.textMuted,
    textAlign: 'center',
    maxWidth: 70,
  },
  labelDone: {
    color: T.colors.accent,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: T.colors.border,
    marginBottom: 22,
    marginHorizontal: -4,
  },
  lineDone: {
    backgroundColor: T.colors.accent,
  },
});

/* -------------------------------------------------------------------------- */
/*                              Request Card                                  */
/* -------------------------------------------------------------------------- */

function RequestCard({ item }: { item: RequestItem }) {
  return (
    <View style={cardStyles.card}>
      <View style={cardStyles.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={cardStyles.title}>{item.title}</Text>
          <Text style={cardStyles.id}>ID: {item.requestId}</Text>
        </View>
        <Text style={cardStyles.date}>{item.date}</Text>
      </View>

      {item.steps.some((s) => s.done) ? (
        <StepProgress steps={item.steps} />
      ) : (
        <StatusBadge status={item.status} />
      )}

      {!item.steps.some((s) => s.done) && <View style={{ height: 4 }} />}
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: T.colors.cardBackground,
    borderRadius: T.borderRadius.lg,
    borderWidth: 1,
    borderColor: T.colors.border,
    padding: 18,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: T.colors.textPrimary,
  },
  id: {
    fontSize: 12,
    color: T.colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    color: T.colors.textMuted,
    fontWeight: '500',
  },
});

/* -------------------------------------------------------------------------- */
/*                              Main Screen                                   */
/* -------------------------------------------------------------------------- */

type Tab = 'active' | 'past';

export default function CitizenProgressScreen() {
  const router = useRouter();
  const { open: openDrawer } = useCitizenDrawer();
  const [tab, setTab] = useState<Tab>('active');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<EnumeratorProfile>({
    id: 'CIT-001',
    name: 'Citizen',
    role: 'Citizen',
    assignedZone: '',
    isOnline: true,
    unreadNotificationsCount: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const token = await SecureStore.getItemAsync('citizen_token');
        if (!token) { router.replace({ pathname: '/(auth)/login', params: { role: 'citizen' } }); return; }

        const res = await fetch(`${API_URL}/api/household/me`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        if (res.ok) {
          const result = await res.json();
          const h = result.household;
          if (h) {
            setProfile({
              id: h.head_mobile_number ?? 'CIT-001',
              name: h.head_full_name?.split(' ')[0] ?? 'Citizen',
              role: 'Citizen',
              assignedZone: `${h.locality ?? ''} · Ward ${h.ward ?? ''}`,
              isOnline: true,
              unreadNotificationsCount: 0,
            });
          }
        }
      } catch (e) {
        console.error('Failed to load profile:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const requests = tab === 'active' ? MOCK_ACTIVE_REQUESTS : MOCK_PAST_REQUESTS;
  const activeCount = MOCK_ACTIVE_REQUESTS.length;

  return (
    <SafeAreaView style={s.container}>
      <EnumeratorHeader profile={profile} onOpenDrawer={openDrawer} />

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        {/* Section Header */}
        <View style={s.sectionHeader}>
          <View style={s.sectionLeft}>
            <View style={s.sectionIconWrap}>
              <Ionicons name="stats-chart-outline" size={20} color={T.colors.accent} />
            </View>
            <View>
              <Text style={s.sectionTitle}>Daily Progress</Text>
              <Text style={s.sectionSub}>{activeCount} active request{activeCount !== 1 ? 's' : ''}</Text>
            </View>
          </View>
          <TouchableOpacity style={s.refreshBtn} activeOpacity={0.7}>
            <Ionicons name="refresh-outline" size={20} color={T.colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={s.tabs}>
          <TouchableOpacity
            style={[s.tab, tab === 'active' && s.tabActive]}
            onPress={() => setTab('active')}
            activeOpacity={0.7}
          >
            <Text style={[s.tabText, tab === 'active' && s.tabTextActive]}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.tab, tab === 'past' && s.tabActive]}
            onPress={() => setTab('past')}
            activeOpacity={0.7}
          >
            <Text style={[s.tabText, tab === 'past' && s.tabTextActive]}>Past</Text>
          </TouchableOpacity>
        </View>

        {/* Request List */}
        <View style={s.list}>
          {requests.map((item) => (
            <RequestCard key={item.id} item={item} />
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Styles                                    */
/* -------------------------------------------------------------------------- */

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.colors.background,
  },
  body: {
    padding: 16,
    gap: 16,
  },

  /* Section Header */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: T.borderRadius.sm,
    backgroundColor: T.colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: T.colors.textPrimary,
  },
  sectionSub: {
    fontSize: 12,
    color: T.colors.textMuted,
    marginTop: 1,
  },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: T.borderRadius.sm,
    backgroundColor: T.colors.cardBackground,
    borderWidth: 1,
    borderColor: T.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Tabs */
  tabs: {
    flexDirection: 'row',
    backgroundColor: T.colors.cardBackground,
    borderRadius: T.borderRadius.sm,
    borderWidth: 1,
    borderColor: T.colors.border,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: T.borderRadius.sm - 2,
  },
  tabActive: {
    backgroundColor: T.colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: T.colors.textMuted,
  },
  tabTextActive: {
    color: T.colors.textWhite,
  },

  /* List */
  list: {
    gap: 12,
  },
});
