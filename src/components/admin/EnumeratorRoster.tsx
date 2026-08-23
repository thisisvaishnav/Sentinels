import React, { useState, useMemo } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/adminTheme';
import { EnumeratorRosterItem } from '@/src/types/admin';
import EnumeratorRow from './EnumeratorRow';

interface EnumeratorRosterProps {
  enumerators: EnumeratorRosterItem[];
  totalCount: number;
  onViewAllPress?: () => void;
  onEnumeratorPress?: (enumerator: EnumeratorRosterItem) => void;
}

export default function EnumeratorRoster({
  enumerators,
  totalCount,
  onViewAllPress,
  onEnumeratorPress,
}: EnumeratorRosterProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return enumerators;
    const q = search.toLowerCase();
    return enumerators.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.employeeId.toLowerCase().includes(q) ||
        e.ward.toLowerCase().includes(q),
    );
  }, [search, enumerators]);

  return (
    <View style={styles.card}>
      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={16} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search enumerators by name or ID..."
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Enumerator rows */}
      {filtered.map((enumerator) => (
        <EnumeratorRow
          key={enumerator.id}
          enumerator={enumerator}
          onPress={onEnumeratorPress}
        />
      ))}

      {filtered.length === 0 && (
        <Text style={styles.emptyText}>No enumerators match your search.</Text>
      )}

      {/* Divider */}
      <View style={styles.divider} />

      {/* View All */}
      <Pressable
        style={({ pressed }) => [styles.viewAllBtn, pressed && { opacity: 0.6 }]}
        onPress={onViewAllPress}
      >
        <Text style={styles.viewAllText}>View All {totalCount} Staff</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 14,
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D5D2DF',
    paddingHorizontal: 10,
    height: 38,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingVertical: 20,
  },
  viewAllBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
