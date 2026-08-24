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

import CategoryTabs from '@/src/components/citizen/CategoryTabs';
import SchemeCard from '@/src/components/citizen/SchemeCard';

const T = CITIZEN_THEME;
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001';

const CATEGORIES = ['All', 'Education', 'Health', 'Housing', 'Agriculture', 'Employment'];

type SampleScheme = {
  id: string;
  title: string;
  description: string;
  category: string;
  benefitAmount?: string;
  status: 'Active' | 'Closing Soon' | 'Closed';
  eligible: boolean;
};

const SAMPLE_SCHEMES: SampleScheme[] = [
  {
    id: '1',
    title: 'PM Kisan Samman Nidhi',
    description: 'Direct income support of Rs. 6,000 per year to small and marginal farmer families.',
    category: 'Agriculture',
    benefitAmount: 'Rs. 6,000/year',
    status: 'Active',
    eligible: true,
  },
  {
    id: '2',
    title: 'Ayushman Bharat Health Card',
    description: 'Health coverage up to Rs. 5 lakhs per family per year for secondary and tertiary hospitalization.',
    category: 'Health',
    benefitAmount: 'Up to Rs. 5,00,000',
    status: 'Active',
    eligible: true,
  },
  {
    id: '3',
    title: 'PM Awas Yojana - Rural',
    description: 'Financial assistance for construction of pucca houses with basic amenities to rural households.',
    category: 'Housing',
    benefitAmount: 'Rs. 1,20,000',
    status: 'Closing Soon',
    eligible: false,
  },
  {
    id: '4',
    title: 'National Scholarship Portal',
    description: 'Scholarships for meritorious students from economically weaker sections pursuing higher education.',
    category: 'Education',
    benefitAmount: 'Varies',
    status: 'Active',
    eligible: true,
  },
  {
    id: '5',
    title: 'MGNREGA Job Card',
    description: 'Guaranteed 100 days of wage employment per year to rural households whose adult members volunteer.',
    category: 'Employment',
    benefitAmount: 'Daily Wage',
    status: 'Active',
    eligible: true,
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

export default function CitizenSchemesScreen() {
  const router = useRouter();
  const { open: openDrawer } = useCitizenDrawer();
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
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

  const filteredSchemes =
    activeCategory === 'All'
      ? SAMPLE_SCHEMES
      : SAMPLE_SCHEMES.filter((s) => s.category === activeCategory);

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
          title="Government Schemes"
          subtitle={`${filteredSchemes.length} scheme${filteredSchemes.length !== 1 ? 's' : ''} available`}
          iconName="newspaper-outline"
        />

        <View style={s.tabsSection}>
          <CategoryTabs
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />
        </View>

        <View style={s.schemesList}>
          {filteredSchemes.length === 0 ? (
            <View style={s.emptyState}>
              <Ionicons name="folder-open-outline" size={40} color={T.colors.textMuted} />
              <Text style={s.emptyText}>No schemes in this category</Text>
            </View>
          ) : (
            filteredSchemes.map((scheme) => (
              <SchemeCard
                key={scheme.id}
                title={scheme.title}
                description={scheme.description}
                category={scheme.category}
                benefitAmount={scheme.benefitAmount}
                status={scheme.status}
                eligible={scheme.eligible}
                onPress={() => router.push({ pathname: '/(citizen)/scheme-detail', params: { schemeId: scheme.id } })}
              />
            ))
          )}
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

  /* Tabs */
  tabsSection: {
    gap: 4,
  },

  /* Schemes List */
  schemesList: {
    gap: 12,
  },

  /* Empty */
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: T.colors.cardBackground,
    borderWidth: 1,
    borderColor: T.colors.border,
    borderRadius: T.borderRadius.lg,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: T.colors.textMuted,
  },
});
