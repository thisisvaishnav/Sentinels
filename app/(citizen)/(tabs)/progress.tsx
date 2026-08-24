import { AppColors } from "@/constants/colors";
import CitizenLayout from "@/src/components/citizen/CitizenLayout";
import SegmentedControl from "@/src/components/citizen/SegmentedControl";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const STATUS_OPTIONS = ["All", "Pending", "Completed"];

type SampleRequest = {
  id: string;
  title: string;
  status: "Pending" | "Completed";
  date: string;
  description: string;
};

const SAMPLE_REQUESTS: SampleRequest[] = [
  {
    id: "1",
    title: "Water Supply Repair",
    status: "Pending",
    date: "Oct 12, 2023",
    description: "Request for pipe repair in ward 5 locality.",
  },
  {
    id: "2",
    title: "Road Pothole Fix",
    status: "Completed",
    date: "Oct 08, 2023",
    description: "Pothole near school entrance has been filled.",
  },
  {
    id: "3",
    title: "Street Light Installation",
    status: "Completed",
    date: "Sep 28, 2023",
    description: "New street light installed at main crossing.",
  },
];

export default function ProgressScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(0);

  const filteredRequests = SAMPLE_REQUESTS.filter((req) => {
    const matchesSearch =
      searchQuery.length === 0 ||
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === 0 ||
      (selectedStatus === 1 && req.status === "Pending") ||
      (selectedStatus === 2 && req.status === "Completed");
    return matchesSearch && matchesStatus;
  });

  return (
    <CitizenLayout title="Daily Progress">
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.searchSection}>
          <Text style={styles.searchLabel}>Search by Mobile or Household ID</Text>
          <View style={styles.searchRow}>
            <View style={styles.searchInputWrap}>
              <Ionicons name="search-outline" size={18} color={AppColors.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Enter mobile number or household ID"
                placeholderTextColor={AppColors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity style={styles.searchBtn} activeOpacity={0.8}>
              <Ionicons name="search" size={18} color={AppColors.textWhite} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>Request Status</Text>
          <SegmentedControl
            options={STATUS_OPTIONS}
            selectedIndex={selectedStatus}
            onSelect={setSelectedStatus}
          />
        </View>

        <View style={styles.resultsSection}>
          <Text style={styles.resultCount}>
            {filteredRequests.length} request{filteredRequests.length !== 1 ? "s" : ""} found
          </Text>
          {filteredRequests.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="folder-open-outline" size={40} color={AppColors.textMuted} />
              <Text style={styles.emptyText}>No requests match your search</Text>
            </View>
          ) : (
            filteredRequests.map((req) => (
              <View key={req.id} style={styles.requestCard}>
                <View style={styles.requestHeader}>
                  <View style={styles.requestIconWrap}>
                    <Ionicons
                      name={req.status === "Completed" ? "checkmark-circle-outline" : "time-outline"}
                      size={18}
                      color={req.status === "Completed" ? AppColors.success : AppColors.warning}
                    />
                  </View>
                  <View style={styles.requestCopy}>
                    <Text style={styles.requestTitle}>{req.title}</Text>
                    <Text style={styles.requestDate}>{req.date}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      req.status === "Completed" ? styles.statusCompleted : styles.statusPending,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        req.status === "Completed" ? styles.statusTextCompleted : styles.statusTextPending,
                      ]}
                    >
                      {req.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.requestDesc}>{req.description}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </CitizenLayout>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: 20,
    gap: 20,
  },
  searchSection: {
    gap: 10,
  },
  searchLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.textPrimary,
  },
  searchRow: {
    flexDirection: "row",
    gap: 10,
  },
  searchInputWrap: {
    flex: 1,
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
  searchBtn: {
    width: 44,
    height: 44,
    borderRadius: 0,
    backgroundColor: AppColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  statusSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: AppColors.textPrimary,
  },
  resultsSection: {
    gap: 12,
  },
  resultCount: {
    fontSize: 13,
    color: AppColors.textMuted,
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: AppColors.bgCard,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 0,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: AppColors.textMuted,
  },
  requestCard: {
    backgroundColor: AppColors.bgCard,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 0,
    padding: 14,
    gap: 10,
  },
  requestHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  requestIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 0,
    backgroundColor: AppColors.bgSubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  requestCopy: {
    flex: 1,
  },
  requestTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: AppColors.textPrimary,
  },
  requestDate: {
    fontSize: 11,
    color: AppColors.textMuted,
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 0,
  },
  statusPending: {
    backgroundColor: AppColors.warningBg,
  },
  statusCompleted: {
    backgroundColor: AppColors.successBg,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusTextPending: {
    color: AppColors.warningText,
  },
  statusTextCompleted: {
    color: AppColors.successText,
  },
  requestDesc: {
    fontSize: 13,
    color: AppColors.textSecondary,
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 24,
  },
});
