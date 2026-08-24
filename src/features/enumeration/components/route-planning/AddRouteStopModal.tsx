import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';
import { ZoneHouseholdItem } from '../../types';
import { RouteFilterCategory } from '../../types/routeTypes';

interface AddRouteStopModalProps {
  visible: boolean;
  onClose: () => void;
  eligibleHouseholds: ZoneHouseholdItem[];
  existingStopIds: Set<string>;
  onAddHousehold: (household: ZoneHouseholdItem) => void;
}

export const AddRouteStopModal: React.FC<AddRouteStopModalProps> = ({
  visible,
  onClose,
  eligibleHouseholds,
  existingStopIds,
  onAddHousehold,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RouteFilterCategory>('All Eligible');

  const categories: RouteFilterCategory[] = [
    'All Eligible',
    'High Priority',
    'Pending',
    'Needs Verification',
    'Urgent Needs',
  ];

  const filteredList = eligibleHouseholds.filter((h) => {
    // Search query match
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      const matches =
        h.householdId.toLowerCase().includes(query) ||
        h.headName.toLowerCase().includes(query) ||
        h.locality.toLowerCase().includes(query) ||
        (h.address && h.address.toLowerCase().includes(query));
      if (!matches) return false;
    }

    // Category filter match
    if (selectedCategory === 'High Priority' && h.priority !== 'High') return false;
    if (selectedCategory === 'Pending' && h.status !== 'Pending') return false;
    if (
      selectedCategory === 'Needs Verification' &&
      h.status !== 'Needs Verification' &&
      h.verificationStatus !== 'Needs Verification'
    ) {
      return false;
    }
    if (
      selectedCategory === 'Urgent Needs' &&
      (!h.needs || h.needs.length === 0 || h.needs.includes('No Current Requirement'))
    ) {
      return false;
    }

    return true;
  });

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.modalHeader}>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.modalSub}>ROUTE EXPANSION</Text>
            <Text style={styles.modalTitle}>Add Stop to Route</Text>
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={24} color={ENUMERATOR_THEME.colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Search Input Box */}
        <View style={styles.searchBoxWrap}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search-outline" size={18} color={ENUMERATOR_THEME.colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by ID, name, area or address..."
              placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color={ENUMERATOR_THEME.colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Horizontally Scrollable Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipActiveText]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Household List */}
        <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
          {filteredList.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={36} color={ENUMERATOR_THEME.colors.textMuted} />
              <Text style={styles.emptyTitle}>No matching households found</Text>
              <Text style={styles.emptySub}>
                Try adjusting your search query or filter category.
              </Text>
            </View>
          ) : (
            filteredList.map((h) => {
              const isAlreadyAdded = existingStopIds.has(h.householdId);
              return (
                <View key={h.id} style={[styles.itemCard, isAlreadyAdded && styles.itemAddedCard]}>
                  <View style={styles.itemMain}>
                    <Text style={styles.itemId}>{h.householdId}</Text>
                    <Text style={styles.itemName}>{h.headName}</Text>
                    <Text style={styles.itemAddress}>
                      {h.locality} · {h.address || 'No address listed'}
                    </Text>

                    <View style={styles.itemBadgesRow}>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{h.status}</Text>
                      </View>
                      {h.priority === 'High' && (
                        <View style={[styles.badge, styles.highBadge]}>
                          <Text style={styles.highBadgeText}>High Priority</Text>
                        </View>
                      )}
                      <Text style={styles.membersCount}>{h.members} members</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.addBtn,
                      isAlreadyAdded ? styles.addBtnAdded : styles.addBtnActive,
                    ]}
                    disabled={isAlreadyAdded}
                    onPress={() => {
                      onAddHousehold(h);
                      onClose();
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={isAlreadyAdded ? 'checkmark-circle' : 'add-circle-outline'}
                      size={18}
                      color={ENUMERATOR_THEME.colors.textWhite}
                    />
                    <Text style={styles.addBtnText}>
                      {isAlreadyAdded ? 'In Route' : 'Add Stop'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
  },
  headerTitleWrap: {
    gap: 2,
  },
  modalSub: {
    fontSize: 9,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
    letterSpacing: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBoxWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  filterChipActive: {
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    borderColor: ENUMERATOR_THEME.colors.accent,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  filterChipActiveText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontWeight: '700',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  emptySub: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textMuted,
    textAlign: 'center',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    padding: 14,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 12,
  },
  itemAddedCard: {
    backgroundColor: '#F9FAFB',
    opacity: 0.7,
  },
  itemMain: {
    flex: 1,
    gap: 3,
  },
  itemId: {
    fontSize: 11,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  itemAddress: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  itemBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  badge: {
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  highBadge: {
    backgroundColor: '#FEF2F2',
  },
  highBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.danger,
  },
  membersCount: {
    fontSize: 10,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    gap: 4,
  },
  addBtnActive: {
    backgroundColor: ENUMERATOR_THEME.colors.accent,
  },
  addBtnAdded: {
    backgroundColor: ENUMERATOR_THEME.colors.success,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textWhite,
  },
});
