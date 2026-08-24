import { AppColors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type DocumentUploadProps = {
  label: string;
  fileName?: string;
  onUpload?: () => void;
};

export default function DocumentUpload({
  label,
  fileName,
  onUpload,
}: DocumentUploadProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.uploadZone}
        onPress={onUpload}
        activeOpacity={0.7}
      >
        {fileName ? (
          <View style={styles.fileRow}>
            <Ionicons name="document-text-outline" size={20} color={AppColors.blue} />
            <View style={styles.fileCopy}>
              <Text style={styles.fileName}>{fileName}</Text>
              <Text style={styles.fileHint}>Tap to change</Text>
            </View>
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="cloud-upload-outline" size={28} color={AppColors.textMuted} />
            <Text style={styles.placeholderText}>Tap to upload document</Text>
            <Text style={styles.placeholderHint}>PDF, JPG, or PNG (max 5MB)</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.textPrimary,
  },
  uploadZone: {
    borderWidth: 1,
    borderColor: AppColors.borderInput,
    borderStyle: "dashed",
    borderRadius: 0,
    padding: 16,
    backgroundColor: AppColors.bgInput,
  },
  placeholder: {
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
  },
  placeholderText: {
    fontSize: 13,
    color: AppColors.textMuted,
    fontWeight: "500",
  },
  placeholderHint: {
    fontSize: 11,
    color: AppColors.textMuted,
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  fileCopy: {
    flex: 1,
  },
  fileName: {
    fontSize: 13,
    fontWeight: "600",
    color: AppColors.textPrimary,
  },
  fileHint: {
    fontSize: 11,
    color: AppColors.textMuted,
    marginTop: 1,
  },
});
