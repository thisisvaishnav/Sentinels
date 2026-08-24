import { AppColors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type CitizenLayoutProps = {
  children: React.ReactNode;
  title?: string;
  headerRight?: React.ReactNode;
  showBack?: boolean;
};

export default function CitizenLayout({
  children,
  title,
  headerRight,
  showBack = false,
}: CitizenLayoutProps) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {(title || showBack || headerRight) && (
        <View style={styles.header}>
          {showBack && (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color={AppColors.textPrimary}
              />
            </TouchableOpacity>
          )}
          {title && <Text style={styles.headerTitle}>{title}</Text>}
          {headerRight && <View style={styles.headerRight}>{headerRight}</View>}
        </View>
      )}
      <View style={styles.body}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.bgMain,
    marginTop: -30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
    backgroundColor: AppColors.bgCard,
  },
  backBtn: {
    padding: 6,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    color: AppColors.textPrimary,
    fontSize: 22,
    fontWeight: "700",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  body: {
    flex: 1,
  },
});
