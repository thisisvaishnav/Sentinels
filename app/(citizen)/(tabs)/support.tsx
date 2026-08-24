import { AppColors } from "@/constants/colors";
import CitizenLayout from "@/src/components/citizen/CitizenLayout";
import FAQAccordion from "@/src/components/citizen/FAQAccordion";
import SupportSection from "@/src/components/citizen/SupportSection";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const FAQ_ITEMS = [
  {
    question: "How do I update my household information?",
    answer:
      "You can update your household information by navigating to the Home tab and tapping 'View Details' on your household card. From there, you can edit your profile and submit changes for verification.",
  },
  {
    question: "How long does scheme approval take?",
    answer:
      "Scheme approval times vary by category. Most applications are processed within 7-15 working days. You can track your application status from the Progress tab.",
  },
  {
    question: "What documents are required for scheme application?",
    answer:
      "Commonly required documents include Aadhaar card, income certificate, caste certificate (if applicable), and bank passbook. Specific requirements vary by scheme.",
  },
  {
    question: "How do I contact a enumerator in my area?",
    answer:
      "You can reach your local enumerator through the support helpline or by raising a support ticket. The system will connect you with the nearest available enumerator.",
  },
];

export default function SupportScreen() {
  return (
    <CitizenLayout title="Support Center">
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.searchSection}>
          <View style={styles.searchInputWrap}>
            <Ionicons name="search-outline" size={18} color={AppColors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for help topics..."
              placeholderTextColor={AppColors.textMuted}
            />
          </View>
        </View>

        <View style={styles.urgentCard}>
          <View style={styles.urgentIcon}>
            <Ionicons name="call-outline" size={20} color={AppColors.danger} />
          </View>
          <View style={styles.urgentCopy}>
            <Text style={styles.urgentTitle}>Urgent Assistance</Text>
            <Text style={styles.urgentText}>
              For emergencies, call our 24/7 helpline
            </Text>
            <Text style={styles.urgentNumber}>1800-XXX-XXXX</Text>
          </View>
        </View>

        <SupportSection title="GIS Tools" icon="map-outline">
          <Text style={styles.sectionContent}>
            Access mapping tools to locate nearby government offices, health centers, and
            educational institutions in your area.
          </Text>
        </SupportSection>

        <SupportSection title="Survey Protocols" icon="clipboard-outline">
          <Text style={styles.sectionContent}>
            Learn about ongoing community surveys, how to participate, and what data is
            being collected for village development planning.
          </Text>
        </SupportSection>

        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          <FAQAccordion items={FAQ_ITEMS} />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </CitizenLayout>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: 20,
    gap: 18,
  },
  searchSection: {
    gap: 4,
  },
  searchInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.bgInput,
    borderWidth: 1,
    borderColor: AppColors.borderInput,
    borderRadius: 0,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: AppColors.textPrimary,
  },
  urgentCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: AppColors.dangerBg,
    borderWidth: 1,
    borderColor: AppColors.danger,
    borderRadius: 0,
    padding: 16,
  },
  urgentIcon: {
    width: 40,
    height: 40,
    borderRadius: 0,
    backgroundColor: AppColors.bgCard,
    alignItems: "center",
    justifyContent: "center",
  },
  urgentCopy: {
    flex: 1,
  },
  urgentTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: AppColors.dangerText,
  },
  urgentText: {
    fontSize: 12,
    color: AppColors.dangerText,
    marginTop: 2,
  },
  urgentNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: AppColors.danger,
    marginTop: 4,
  },
  sectionContent: {
    fontSize: 13,
    color: AppColors.textSecondary,
    lineHeight: 20,
  },
  faqSection: {
    gap: 12,
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: AppColors.textPrimary,
  },
  bottomSpacer: {
    height: 24,
  },
});
