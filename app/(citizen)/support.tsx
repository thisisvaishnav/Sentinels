import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
    question: 'How do I register my household?',
    answer:
      'Go to the Home tab and tap "View Household". If you haven\'t registered yet, you\'ll see a registration form. Fill in your details, capture GPS location, and submit.',
  },
  {
    question: 'How do I update my household information?',
    answer:
      'Currently, you can request updates by contacting our support team. We are working on a self-service edit feature coming soon.',
  },
  {
    question: 'What documents do I need?',
    answer:
      'Keep your Aadhaar card, ration card, and bank passbook handy. These help verify your household details and scheme eligibility.',
  },
  {
    question: 'How do I apply for government schemes?',
    answer:
      'Navigate to the "Find Schemes" section from the dashboard. Browse available schemes, check eligibility, and apply directly through the app.',
  },
  {
    question: 'How do I track my application status?',
    answer:
      'Use the "Track Requests" option on your dashboard to view the real-time status of your scheme applications and household registration.',
  },
  {
    question: 'Who is my local enumerator?',
    answer:
      'Your local enumerator is assigned to your ward area. You can reach them through the helpline or they may visit your household during survey rounds.',
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
/*                              Contact Card                                   */
/* -------------------------------------------------------------------------- */

function ContactCard({ icon, iconColor, iconBg, title, subtitle, onPress }: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
}) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper style={s.contactCard} onPress={onPress} activeOpacity={0.7}>
      <View style={[s.contactIconWrap, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
      </View>
      <View style={s.contactTextWrap}>
        <Text style={s.contactTitle}>{title}</Text>
        <Text style={s.contactSub}>{subtitle}</Text>
      </View>
      {onPress && <Ionicons name="chevron-forward" size={18} color={T.colors.textMuted} />}
    </Wrapper>
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

        {/* Emergency Helplines */}
        <View style={s.helplineSection}>
          <Text style={s.helplineSectionTitle}>Emergency Helplines</Text>

          <ContactCard
            icon="phone"
            iconColor={T.colors.danger}
            iconBg={T.colors.dangerBg}
            title="Emergency Services"
            subtitle="112 (Police / Fire / Ambulance)"
            onPress={() => Linking.openURL('tel:112')}
          />

          <ContactCard
            icon="phone"
            iconColor={T.colors.warning}
            iconBg={T.colors.warningBg}
            title="Women Helpline"
            subtitle="181 (24/7 Women in Distress)"
            onPress={() => Linking.openURL('tel:181')}
          />

          <ContactCard
            icon="phone"
            iconColor={T.colors.success}
            iconBg={T.colors.successBg}
            title="Lokvision Citizen Support"
            subtitle="1800-180-5678 (Toll Free)"
            onPress={() => Linking.openURL('tel:18001805678')}
          />
        </View>

        {/* Quick Actions */}
        <View style={s.quickSection}>
          <Text style={s.helplineSectionTitle}>Quick Help</Text>

          <ContactCard
            icon="file-document-outline"
            iconColor={T.colors.accent}
            iconBg={T.colors.accentSubtle}
            title="Report an Issue"
            subtitle="Something wrong with your household data?"
            onPress={() => {}}
          />

          <ContactCard
            icon="email-outline"
            iconColor={T.colors.accent}
            iconBg={T.colors.accentSubtle}
            title="Email Support"
            subtitle="support@lokvision.gov.in"
            onPress={() => Linking.openURL('mailto:support@lokvision.gov.in')}
          />

          <ContactCard
            icon="map-marker-radius-outline"
            iconColor={T.colors.accent}
            iconBg={T.colors.accentSubtle}
            title="Find Nearest Office"
            subtitle="Locate district welfare office"
            onPress={() => {}}
          />
        </View>

        {/* About Section */}
        <SupportSection title="About Lokvision" icon="information-circle-outline">
          <Text style={s.sectionContent}>
            Lokvision is a citizen-centric platform for household registration, welfare scheme
            discovery, and community development planning. Your data helps improve public
            services in your area.
          </Text>
        </SupportSection>

        {/* Data Privacy */}
        <SupportSection title="Data Privacy & Security" icon="shield-checkmark-outline">
          <Text style={s.sectionContent}>
            Your household data is encrypted and stored securely. It is only used for
            government welfare purposes and is never shared with third parties without
            your consent.
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
    borderRadius: T.borderRadius.md,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: T.colors.textPrimary,
  },

  /* Helpline Section */
  helplineSection: {
    gap: 10,
  },
  helplineSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: T.colors.textPrimary,
    marginBottom: 2,
  },

  /* Contact Card */
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: T.colors.cardBackground,
    borderRadius: T.borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: T.colors.border,
  },
  contactIconWrap: {
    width: 40,
    height: 40,
    borderRadius: T.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactTextWrap: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: T.colors.textPrimary,
  },
  contactSub: {
    fontSize: 12,
    color: T.colors.textSecondary,
    marginTop: 1,
  },

  /* Quick Section */
  quickSection: {
    gap: 10,
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
