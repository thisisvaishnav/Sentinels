import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { CITIZEN_THEME } from '@/src/features/enumeration/theme';

const T = CITIZEN_THEME;

/* -------------------------------------------------------------------------- */
/*                                  Types                                     */
/* -------------------------------------------------------------------------- */

type SchemeDetail = {
  id: string;
  title: string;
  description: string;
  category: string;
  benefitAmount?: string;
  status: 'Active' | 'Closing Soon' | 'Closed';
  eligible: boolean;
  fullDescription: string;
  eligibilityCriteria: string[];
  benefits: string[];
  documentsRequired: string[];
  applicationSteps: string[];
  deadline: string;
  websiteUrl: string;
};

/* -------------------------------------------------------------------------- */
/*                                Mock Data                                   */
/* -------------------------------------------------------------------------- */

const SCHEME_DETAILS: Record<string, SchemeDetail> = {
  '1': {
    id: '1',
    title: 'PM Kisan Samman Nidhi',
    description: 'Direct income support of Rs. 6,000 per year to small and marginal farmer families.',
    category: 'Agriculture',
    benefitAmount: 'Rs. 6,000/year',
    status: 'Active',
    eligible: true,
    fullDescription:
      'PM-KISAN is a Central Sector scheme launched on 24th February 2019. Under this scheme, income support of Rs. 6,000 per year is provided to all farmer families subject to certain exclusions. The amount is disbursed in three equal instalments of Rs. 2,000 each directly into the bank accounts of the beneficiaries through Direct Benefit Transfer (DBT) mode.',
    eligibilityCriteria: [
      'Small and marginal farmer families',
      'Must own cultivable land',
      'Subject to exclusions for institutional landholders, former/current constitutional post holders, former/current Ministers, etc.',
    ],
    benefits: [
      'Rs. 6,000 per year in three instalments of Rs. 2,000 each',
      'Direct bank transfer — no middlemen',
      'Covers all farming families regardless of land size (subject to exclusions)',
    ],
    documentsRequired: [
      'Aadhaar Card',
      'Bank account details (linked to Aadhaar)',
      'Land records / Khatauni',
    ],
    applicationSteps: [
      'Visit the PM-KISAN portal or nearest Common Service Centre (CSC)',
      'Fill in Aadhaar, bank account, and land details',
      'Submit the application',
      'Application is verified by the State/UT government',
      'Benefit is credited directly to the bank account',
    ],
    deadline: 'No deadline — Open year-round',
    websiteUrl: 'https://pmkisan.gov.in',
  },
  '2': {
    id: '2',
    title: 'Ayushman Bharat Health Card',
    description: 'Health coverage up to Rs. 5 lakhs per family per year for secondary and tertiary hospitalization.',
    category: 'Health',
    benefitAmount: 'Up to Rs. 5,00,000',
    status: 'Active',
    eligible: true,
    fullDescription:
      'Ayushman Bharat – Pradhan Mantri Jan Arogya Yojana (AB-PMJAY) provides health cover of up to Rs. 5 lakhs per family per year for secondary and tertiary care hospitalisation to over 10 crore poor and vulnerable families. The scheme covers benefits packages including surgery, medical, and day-care treatments.',
    eligibilityCriteria: [
      'Families identified as per SECC 2011 data',
      'No cap on family size or age',
      'Both rural and urban families covered',
    ],
    benefits: [
      'Rs. 5 lakh health cover per family per year',
      'Covers pre and post hospitalisation expenses',
      'No restriction on family size, age, or gender',
      'Cashless and paperless treatment at empanelled hospitals',
    ],
    documentsRequired: [
      'Aadhaar Card or any government-issued photo ID',
      'Ration card or SECC identification',
    ],
    applicationSteps: [
      'Check eligibility at hospitals.pmjay.gov.in',
      'Visit nearest empanelled hospital or Common Service Centre',
      'Get verified using Aadhaar or ration card',
      'Receive Ayushman Bharat Health Card',
    ],
    deadline: 'No deadline — Open year-round',
    websiteUrl: 'https://www.pmjay.gov.in',
  },
  '3': {
    id: '3',
    title: 'PM Awas Yojana - Rural',
    description: 'Financial assistance for construction of pucca houses with basic amenities to rural households.',
    category: 'Housing',
    benefitAmount: 'Rs. 1,20,000',
    status: 'Closing Soon',
    eligible: false,
    fullDescription:
      'Pradhan Mantri Awaas Yojana – Gramin (PMAY-G) aims at providing a pucca house with basic amenities to all houseless and households living in kutcha and dilapidated houses by the target year. The beneficiary gets financial assistance for construction of a house with all basic amenities.',
    eligibilityCriteria: [
      'Houseless families or families living in kutcha/dilapidated houses',
      'Must belong to SC/ST, freed bonded labourers, or other weaker sections',
      'Family income must be below Rs. 3 lakh per annum',
    ],
    benefits: [
      'Rs. 1,20,000 assistance in plain areas',
      'Rs. 1,30,000 assistance in hilly/difficult areas',
      'Additional Rs. 12,000 for toilet construction',
      'Converged with MGNREGA for labour assistance',
    ],
    documentsRequired: [
      'Aadhaar Card',
      'Bank account details',
      'BPL/SECC certificate',
      'Land records (if available)',
    ],
    applicationSteps: [
      'Apply through Gram Panchayat or Block office',
      'Get verified under SECC 2011 deprivation criteria',
      'After approval, construction begins in phases',
      'Three instalments released based on construction stages',
    ],
    deadline: 'Closing Soon — Apply before Dec 2024',
    websiteUrl: 'https://pmayg.nic.in',
  },
  '4': {
    id: '4',
    title: 'National Scholarship Portal',
    description: 'Scholarships for meritorious students from economically weaker sections pursuing higher education.',
    category: 'Education',
    benefitAmount: 'Varies',
    status: 'Active',
    eligible: true,
    fullDescription:
      'National Scholarship Portal (NSP) is a one-stop solution through which various scholarship schemes offered by the Central Government, State Governments, and Union Territory Administrations are facilitated. It covers pre-matric, post-matric, and higher education scholarships.',
    eligibilityCriteria: [
      'Students from SC/ST/OBC/Minority communities',
      'Must be enrolled in a recognised educational institution',
      'Family income criteria vary by scheme',
    ],
    benefits: [
      'Tuition fee and non-tuition fee coverage',
      'Monthly maintenance allowance',
      'Book grants and stationery allowance',
      'Scholarships for technical and professional courses',
    ],
    documentsRequired: [
      'Aadhaar Card',
      'Previous year marksheet',
      'Income certificate',
      'Caste certificate (if applicable)',
      'Bank account details (linked to student)',
    ],
    applicationSteps: [
      'Register on scholarships.gov.in',
      'Fill in personal, academic, and bank details',
      'Upload required documents',
      'Submit application before the deadline',
      'Track status online',
    ],
    deadline: 'Varies by scheme — typically Oct–Dec each year',
    websiteUrl: 'https://scholarships.gov.in',
  },
  '5': {
    id: '5',
    title: 'MGNREGA Job Card',
    description: 'Guaranteed 100 days of wage employment per year to rural households whose adult members volunteer.',
    category: 'Employment',
    benefitAmount: 'Daily Wage',
    status: 'Active',
    eligible: true,
    fullDescription:
      'Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) guarantees 100 days of wage employment in a financial year to every rural household whose adult members volunteer to do unskilled manual work. This is a legal right — the government must provide work within 15 days of application.',
    eligibilityCriteria: [
      'Any adult member of a rural household',
      'Must apply for work voluntarily',
      'Must be willing to do unskilled manual work',
    ],
    benefits: [
      'Guaranteed 100 days of employment per household per year',
      'Unemployment allowance if work is not provided within 15 days',
      'Wages credited directly to bank/post office account',
      'Average daily wage varies by state (Rs. 250–350+)',
    ],
    documentsRequired: [
      'Address proof / residence certificate',
      'Bank account details',
      'Aadhaar Card',
    ],
    applicationSteps: [
      'Apply to Gram Panchayat or Programme Officer',
      'Receive Job Card with a unique ID',
      'Demand work at least 15 days before the desired start date',
      'Work is assigned and wages paid after completion',
    ],
    deadline: 'No deadline — Open year-round',
    websiteUrl: 'https://nrega.nic.in',
  },
};

/* -------------------------------------------------------------------------- */
/*                              Section Header                                 */
/* -------------------------------------------------------------------------- */

function SectionHeader({ title, iconName }: { title: string; iconName: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={s.sectionHeader}>
      <View style={s.sectionLeft}>
        <View style={s.sectionIconWrap}>
          <Ionicons name={iconName} size={18} color={T.colors.accent} />
        </View>
        <Text style={s.sectionTitle}>{title}</Text>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Bullet List                                    */
/* -------------------------------------------------------------------------- */

function BulletList({ items }: { items: string[] }) {
  return (
    <View style={s.bulletList}>
      {items.map((item, i) => (
        <View key={i} style={s.bulletRow}>
          <View style={s.bulletDot} />
          <Text style={s.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                            Step List                                       */
/* -------------------------------------------------------------------------- */

function StepList({ steps }: { steps: string[] }) {
  return (
    <View style={s.stepList}>
      {steps.map((step, i) => (
        <View key={i} style={s.stepRow}>
          <View style={s.stepNumber}>
            <Text style={s.stepNumberText}>{i + 1}</Text>
          </View>
          <Text style={s.stepText}>{step}</Text>
        </View>
      ))}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Main Screen                                    */
/* -------------------------------------------------------------------------- */

export default function SchemeDetailScreen() {
  const router = useRouter();
  const { schemeId } = useLocalSearchParams<{ schemeId: string }>();

  const scheme = SCHEME_DETAILS[schemeId || ''];

  if (!scheme) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color={T.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Scheme Details</Text>
        </View>
        <View style={s.centered}>
          <Ionicons name="alert-circle-outline" size={48} color={T.colors.textMuted} />
          <Text style={s.emptyText}>Scheme not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={s.backLink}>
            <Text style={s.backLinkText}>Go back to schemes</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusColor =
    scheme.status === 'Active'
      ? T.colors.success
      : scheme.status === 'Closing Soon'
      ? T.colors.warning
      : T.colors.textMuted;

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Scheme Details</Text>
      </View>

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        {/* Title Card */}
        <View style={s.titleCard}>
          <View style={s.titleTop}>
            <View style={s.categoryChip}>
              <Text style={s.categoryText}>{scheme.category}</Text>
            </View>
            <View style={[s.statusDot, { backgroundColor: statusColor }]} />
          </View>
          <Text style={s.schemeTitle}>{scheme.title}</Text>
          <Text style={s.schemeSubtitle}>{scheme.description}</Text>

          {scheme.benefitAmount && (
            <View style={s.benefitRow}>
              <Ionicons name="cash-outline" size={16} color={T.colors.success} />
              <Text style={s.benefitText}>{scheme.benefitAmount}</Text>
            </View>
          )}

          <View style={s.statusRow}>
            <View style={[s.statusBadge, { backgroundColor: statusColor + '18' }]}>
              <Text style={[s.statusText, { color: statusColor }]}>{scheme.status}</Text>
            </View>
            {scheme.eligible !== undefined && (
              <View style={[s.eligBadge, { backgroundColor: scheme.eligible ? T.colors.successBg : T.colors.dangerBg }]}>
                <Ionicons
                  name={scheme.eligible ? 'checkmark-circle-outline' : 'close-circle-outline'}
                  size={14}
                  color={scheme.eligible ? T.colors.success : T.colors.danger}
                />
                <Text style={[s.eligText, { color: scheme.eligible ? T.colors.successText : T.colors.dangerText }]}>
                  {scheme.eligible ? 'You may be eligible' : 'Not eligible'}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* About */}
        <View style={s.card}>
          <SectionHeader title="About This Scheme" iconName="information-circle-outline" />
          <Text style={s.bodyText}>{scheme.fullDescription}</Text>
        </View>

        {/* Benefits */}
        <View style={s.card}>
          <SectionHeader title="Benefits" iconName="gift-outline" />
          <BulletList items={scheme.benefits} />
        </View>

        {/* Eligibility */}
        <View style={s.card}>
          <SectionHeader title="Eligibility Criteria" iconName="checkmark-done-outline" />
          <BulletList items={scheme.eligibilityCriteria} />
        </View>

        {/* Documents Required */}
        <View style={s.card}>
          <SectionHeader title="Documents Required" iconName="document-text-outline" />
          <BulletList items={scheme.documentsRequired} />
        </View>

        {/* Application Steps */}
        <View style={s.card}>
          <SectionHeader title="How to Apply" iconName="list-outline" />
          <StepList steps={scheme.applicationSteps} />
        </View>

        {/* Deadline */}
        <View style={s.card}>
          <SectionHeader title="Deadline" iconName="time-outline" />
          <Text style={s.bodyText}>{scheme.deadline}</Text>
        </View>

        {/* Apply Button */}
        {scheme.status !== 'Closed' && (
          <TouchableOpacity
            style={s.applyBtn}
            onPress={() => router.push({ pathname: '/(citizen)/scheme-application', params: { schemeId: scheme.id } })}
            activeOpacity={0.8}
          >
            <Text style={s.applyText}>Apply for This Scheme</Text>
            <Ionicons name="arrow-forward" size={18} color={T.colors.textWhite} />
          </TouchableOpacity>
        )}

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: T.colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: T.colors.border,
  },
  backBtn: {
    padding: 6,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: T.colors.textPrimary,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: T.colors.textMuted,
  },
  backLink: {
    marginTop: 8,
  },
  backLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: T.colors.accent,
  },
  body: {
    padding: 16,
    gap: 16,
  },

  /* Title Card */
  titleCard: {
    backgroundColor: T.colors.cardBackground,
    borderWidth: 1,
    borderColor: T.colors.border,
    borderRadius: T.borderRadius.lg,
    padding: 18,
    gap: 10,
  },
  titleTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: T.colors.accentSubtle,
    borderRadius: T.borderRadius.sm,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: T.colors.accent,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  schemeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: T.colors.textPrimary,
    lineHeight: 28,
  },
  schemeSubtitle: {
    fontSize: 14,
    color: T.colors.textSecondary,
    lineHeight: 20,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: T.colors.successBg,
    padding: 10,
    borderRadius: T.borderRadius.sm,
  },
  benefitText: {
    fontSize: 15,
    fontWeight: '700',
    color: T.colors.successText,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: T.borderRadius.sm,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  eligBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: T.borderRadius.sm,
  },
  eligText: {
    fontSize: 12,
    fontWeight: '600',
  },

  /* Card */
  card: {
    backgroundColor: T.colors.cardBackground,
    borderWidth: 1,
    borderColor: T.colors.border,
    borderRadius: T.borderRadius.lg,
    padding: 18,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionIconWrap: {
    width: 32,
    height: 32,
    borderRadius: T.borderRadius.sm,
    backgroundColor: T.colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: T.colors.textPrimary,
  },
  bodyText: {
    fontSize: 14,
    color: T.colors.textSecondary,
    lineHeight: 22,
  },

  /* Bullet List */
  bulletList: {
    gap: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: T.colors.accent,
    marginTop: 7,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: T.colors.textSecondary,
    lineHeight: 20,
  },

  /* Step List */
  stepList: {
    gap: 10,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: T.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: T.colors.textWhite,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: T.colors.textSecondary,
    lineHeight: 20,
    paddingTop: 2,
  },

  /* Apply Button */
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: T.colors.accent,
    borderRadius: T.borderRadius.sm,
    paddingVertical: 16,
  },
  applyText: {
    fontSize: 16,
    fontWeight: '700',
    color: T.colors.textWhite,
  },
});
