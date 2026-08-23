import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

export interface DuplicateHouseholdInfo {
  existingId: string;
  address: string;
  similarity: 'High' | 'Medium' | 'Low';
}

interface Props {
  duplicateInfo: DuplicateHouseholdInfo | null;
  onReviewExisting?: () => void;
  onContinueAnyway?: () => void;
}

export function DuplicateWarningCard({
  duplicateInfo,
  onReviewExisting,
  onContinueAnyway,
}: Props) {
  if (!duplicateInfo) {
    return null;
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Ionicons name="warning" size={22} color="#D97706" />
        <View style={styles.titleWrap}>
          <Text style={styles.title}>Possible Existing Household</Text>
          <Text style={styles.similarityBadge}>{duplicateInfo.similarity} Similarity</Text>
        </View>
      </View>

      <View style={styles.detailBox}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Existing ID:</Text>
          <Text style={styles.detailValue}>{duplicateInfo.existingId}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Address:</Text>
          <Text style={styles.detailValue}>{duplicateInfo.address}</Text>
        </View>
      </View>

      <Text style={styles.hint}>
        A household with matching contact or location records already exists in this zone.
      </Text>

      <View style={styles.actionRow}>
        {onReviewExisting && (
          <TouchableOpacity style={styles.reviewBtn} onPress={onReviewExisting} activeOpacity={0.8}>
            <Text style={styles.reviewBtnText}>Review Existing</Text>
          </TouchableOpacity>
        )}
        {onContinueAnyway && (
          <TouchableOpacity style={styles.continueBtn} onPress={onContinueAnyway} activeOpacity={0.8}>
            <Text style={styles.continueBtnText}>Continue Anyway</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFBEB',
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FCD34D',
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#92400E',
  },
  similarityBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
  },
  detailBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 12,
    color: '#B45309',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 12,
    color: '#78350F',
    fontWeight: '700',
  },
  hint: {
    fontSize: 11,
    color: '#B45309',
    lineHeight: 15,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  reviewBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D97706',
    height: 38,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  continueBtn: {
    flex: 1,
    backgroundColor: '#D97706',
    height: 38,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
