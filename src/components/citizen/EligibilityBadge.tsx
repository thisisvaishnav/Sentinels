import { AppColors } from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type EligibilityBadgeProps = {
  eligible: boolean;
};

export default function EligibilityBadge({ eligible }: EligibilityBadgeProps) {
  return (
    <View style={[styles.badge, eligible ? styles.eligible : styles.checkEligibility]}>
      <Text style={[styles.text, eligible ? styles.textEligible : styles.textCheck]}>
        {eligible ? "Eligible" : "Check Eligibility"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 0,
    alignSelf: "flex-start",
  },
  eligible: {
    backgroundColor: AppColors.successBg,
  },
  checkEligibility: {
    backgroundColor: AppColors.warningBg,
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
  },
  textEligible: {
    color: AppColors.successText,
  },
  textCheck: {
    color: AppColors.warningText,
  },
});
