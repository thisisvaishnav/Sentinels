import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import CitizenLayout from "@/src/components/citizen/CitizenLayout";
import CategoryTabs from "@/src/components/citizen/CategoryTabs";
import PlaceholderFAB from "@/src/components/citizen/PlaceholderFAB";
import SchemeCard from "@/src/components/citizen/SchemeCard";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const CATEGORIES = ["All", "Education", "Health", "Housing", "Agriculture", "Employment"];

type SampleScheme = {
  id: string;
  title: string;
  description: string;
  category: string;
  benefitAmount?: string;
  status: "Active" | "Closing Soon" | "Closed";
  eligible: boolean;
};

const SAMPLE_SCHEMES: SampleScheme[] = [
  {
    id: "1",
    title: "PM Kisan Samman Nidhi",
    description: "Direct income support of Rs. 6,000 per year to small and marginal farmer families.",
    category: "Agriculture",
    benefitAmount: "Rs. 6,000/year",
    status: "Active",
    eligible: true,
  },
  {
    id: "2",
    title: "Ayushman Bharat Health Card",
    description: "Health coverage up to Rs. 5 lakhs per family per year for secondary and tertiary hospitalization.",
    category: "Health",
    benefitAmount: "Up to Rs. 5,00,000",
    status: "Active",
    eligible: true,
  },
  {
    id: "3",
    title: "PM Awas Yojana - Rural",
    description: "Financial assistance for construction of pucca houses with basic amenities to rural households.",
    category: "Housing",
    benefitAmount: "Rs. 1,20,000",
    status: "Closing Soon",
    eligible: false,
  },
  {
    id: "4",
    title: "National Scholarship Portal",
    description: "Scholarships for meritorious students from economically weaker sections pursuing higher education.",
    category: "Education",
    benefitAmount: "Varies",
    status: "Active",
    eligible: true,
  },
  {
    id: "5",
    title: "MGNREGA Job Card",
    description: "Guaranteed 100 days of wage employment per year to rural households whose adult members volunteer.",
    category: "Employment",
    benefitAmount: "Daily Wage",
    status: "Active",
    eligible: true,
  },
];

export default function SchemesScreen() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredSchemes =
    activeCategory === "All"
      ? SAMPLE_SCHEMES
      : SAMPLE_SCHEMES.filter((s) => s.category === activeCategory);

  return (
    <CitizenLayout title="Government Scheme Finder">
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.tabsSection}>
          <CategoryTabs
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />
        </View>

        <View style={styles.schemesSection}>
          <Text style={styles.resultCount}>
            {filteredSchemes.length} scheme{filteredSchemes.length !== 1 ? "s" : ""} available
          </Text>
          <View style={styles.schemesList}>
            {filteredSchemes.map((scheme) => (
              <SchemeCard
                key={scheme.id}
                title={scheme.title}
                description={scheme.description}
                category={scheme.category}
                benefitAmount={scheme.benefitAmount}
                status={scheme.status}
                eligible={scheme.eligible}
              />
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
      <PlaceholderFAB />
    </CitizenLayout>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: 20,
    gap: 18,
  },
  tabsSection: {
    gap: 4,
  },
  schemesSection: {
    gap: 12,
  },
  resultCount: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: "500",
  },
  schemesList: {
    gap: 12,
  },
  bottomSpacer: {
    height: 80,
  },
});
