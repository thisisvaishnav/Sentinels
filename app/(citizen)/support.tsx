import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

import FAQAccordion from '@/src/components/citizen/FAQAccordion';
import SupportSection from '@/src/components/citizen/SupportSection';

const T = CITIZEN_THEME;
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001';

const FAQ_ITEMS = [
  {
    question: 'How do I update my household information?',
    answer:
      'You can update your household information by navigating to the Home tab and tapping \'View Details\' on your household card. From there, you can edit your profile and submit changes for verification.',
  },
  {
    question: 'How long does scheme approval take?',
    answer:
      'Scheme approval times vary by category. Most applications are processed within 7-15 working days. You can track your application status from the Progress tab.',
  },
  {
    question: 'What documents are required for scheme application?',
    answer:
      'Commonly required documents include Aadhaar card, income certificate, caste certificate (if applicable), and bank passbook. Specific requirements vary by scheme.',
  },
  {
    question: 'How do I contact a enumerator in my area?',
    answer:
      'You can reach your local enumerator through the support helpline or by raising a support ticket. The system will connect you with the nearest available enumerator.',
  },
];

/* -------------------------------------------------------------------------- */
/*                              Section Header                                 */
/* -------------------------------------------------------------------------- */

function SectionHeader({ title, subtitle, iconName }: { title: string; subtitle: string; iconName: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={s.sectionHeader}>
      <View style={s.sectionLeft}>
        <View style={s.sectionIconWrap}>
          <Ionicons name={iconName} size={20} color={T.colors.accent} />
        </View>
        <View>
          <Text style={s.sectionTitle}>{title}</Text>
          <Text style={s.sectionSub}>{subtitle}</Text>
        </View>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Main Screen                                    */
/* -------------------------------------------------------------------------- */

export default function CitizenSupportScreen() {
  const router = useRouter();
  const { open: openDrawer } = useCitizenDrawer();
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

  if (loading) {
    return (
      <SafeAreaView style={s.container}>
        <EnumeratorHeader profile={profile} onOpenDrawer={openDrawer} />
        <View style={s.centered}>
          <ActivityIndicator size="large" color={T.colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container}>
      <EnumeratorHeader profile={profile} onOpenDrawer={openDrawer} />

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <SectionHeader
          title="Support & Help"
          subtitle="Get assistance with your account and services"
          iconName="headset-outline"
        />

        {/* Search */}
        <View style={s.searchInputWrap}>
          <Ionicons name="search-outline" size={18} color={T.colors.textMuted} />
          <TextInput
            style={s.searchInput}
            placeholder="Search for help topics..."
            placeholderTextColor={T.colors.textMuted}
          />
        </View>

        {/* Urgent Card */}
        <View style={s.urgentCard}>
          <View style={s.urgentIcon}>
            <Ionicons name="call-outline" size={20} color={T.colors.danger} />
          </View>
          <View style={s.urgentCopy}>
            <Text style={s.urgentTitle}>Urgent Assistance</Text>
            <Text style={s.urgentText}>
              For emergencies, call our 24/7 helpline
            </Text>
            <Text style={s.urgentNumber}>1800-XXX-XXXX</Text>
          </View>
        </View>

        {/* GIS Tools */}
        <SupportSection title="GIS Tools" icon="map-outline">
          <Text style={s.sectionContent}>
            Access mapping tools to locate nearby government offices, health centers, and
            educational institutions in your area.
          </Text>
        </SupportSection>

        {/* Survey Protocols */}
        <SupportSection title="Survey Protocols" icon="clipboard-outline">
          <Text style={s.sectionContent}>
            Learn about ongoing community surveys, how to participate, and what data is
            being collected for village development planning.
          </Text>
        </SupportSection>

        {/* FAQ */}
        <View style={s.faqSection}>
          <Text style={s.faqTitle}>Frequently Asked Questions</Text>
          <FAQAccordion items={FAQ_ITEMS} />
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

  /* Search */
  searchInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.colors.inputBackground,
    borderWidth: 1,
    borderColor: T.colors.borderSubtle,
    borderRadius: T.borderRadius.sm,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: T.colors.textPrimary,
  },

  /* Urgent Card */
  urgentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: T.colors.dangerBg,
    borderWidth: 1,
    borderColor: T.colors.dangerBorder,
    borderRadius: T.borderRadius.lg,
    padding: 16,
  },
  urgentIcon: {
    width: 40,
    height: 40,
    borderRadius: T.borderRadius.sm,
    backgroundColor: T.colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  urgentCopy: {
    flex: 1,
  },
  urgentTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: T.colors.dangerText,
  },
  urgentText: {
    fontSize: 12,
    color: T.colors.dangerText,
    marginTop: 2,
  },
  urgentNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: T.colors.danger,
    marginTop: 4,
  },

  /* Section Content */
  sectionContent: {
    fontSize: 13,
    color: T.colors.textSecondary,
    lineHeight: 20,
  },

  /* FAQ */
  faqSection: {
    gap: 12,
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: T.colors.textPrimary,
  },
});
