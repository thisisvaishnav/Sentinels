import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

import { CITIZEN_THEME } from '@/src/features/enumeration/theme';

const T = CITIZEN_THEME;

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type ProblemCategory = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

/* -------------------------------------------------------------------------- */
/*                                  Data                                      */
/* -------------------------------------------------------------------------- */

const PROBLEM_CATEGORIES: ProblemCategory[] = [
  { id: 'infrastructure', label: 'Infrastructure', icon: 'construct-outline', color: '#DC2626' },
  { id: 'health', label: 'Health', icon: 'medkit-outline', color: '#059669' },
  { id: 'education', label: 'Education', icon: 'school-outline', color: '#2563EB' },
  { id: 'safety', label: 'Public Safety', icon: 'shield-checkmark-outline', color: '#D97706' },
  { id: 'sanitation', label: 'Sanitation', icon: 'water-outline', color: '#7C3AED' },
  { id: 'electricity', label: 'Electricity', icon: 'flash-outline', color: '#EA580C' },
  { id: 'corruption', label: 'Corruption', icon: 'alert-circle-outline', color: '#BE123C' },
  { id: 'other', label: 'Other', icon: 'ellipsis-horizontal-outline', color: '#64748B' },
];

const PRIORITY_OPTIONS = [
  { id: 'low', label: 'Low', color: T.colors.success },
  { id: 'medium', label: 'Medium', color: T.colors.warning },
  { id: 'high', label: 'High', color: T.colors.danger },
] as const;

/* -------------------------------------------------------------------------- */
/*                              Section Card                                   */
/* -------------------------------------------------------------------------- */

function SectionCard({ title, icon, children }: { title: string; icon: keyof typeof MaterialCommunityIcons.glyphMap; children: React.ReactNode }) {
  return (
    <View style={s.card}>
      <View style={s.cardHeader}>
        <View style={s.cardIconWrap}>
          <MaterialCommunityIcons name={icon} size={20} color={T.colors.accent} />
        </View>
        <Text style={s.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Main Screen                                    */
/* -------------------------------------------------------------------------- */

export default function DiscussProblemScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const captureLocation = async () => {
    try {
      setLocationLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        Alert.alert('Location Permission', 'Location permission is required to report the problem location.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      Alert.alert('Location Captured', 'Your current location has been captured.');
    } catch {
      Alert.alert('Location Error', 'Unable to capture your current location. Please try again.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCategory || !title.trim() || !priority) {
      Alert.alert('Missing Fields', 'Please fill in the category, title, and priority.');
      return;
    }

    setSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    Alert.alert(
      'Problem Submitted',
      'Your issue has been reported successfully. You can track it from the Progress tab.',
      [{ text: 'OK', onPress: () => router.back() }],
    );

    setSubmitting(false);
  };

  const isFormValid = selectedCategory && title.trim() && priority;

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Discuss a Problem</Text>
      </View>

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Category Selection */}
        <SectionCard title="Category" icon="tag-outline">
          <Text style={s.sectionSubtitle}>What type of issue is this?</Text>
          <View style={s.categoryGrid}>
            {PROBLEM_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[s.categoryChip, isActive && { backgroundColor: cat.color + '18', borderColor: cat.color }]}
                  onPress={() => setSelectedCategory(isActive ? null : cat.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons name={cat.icon} size={20} color={isActive ? cat.color : T.colors.textMuted} />
                  <Text style={[s.categoryLabel, isActive && { color: cat.color, fontWeight: '700' }]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </SectionCard>

        {/* Problem Details */}
        <SectionCard title="Problem Details" icon="text-box-outline">
          <View style={s.inputWrapper}>
            <Text style={s.label}>TITLE</Text>
            <TextInput
              style={s.input}
              placeholder="Brief title of the problem"
              placeholderTextColor={T.colors.textMuted}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
            <Text style={s.charCount}>{title.length}/100</Text>
          </View>

          <View style={s.inputWrapper}>
            <Text style={s.label}>DESCRIPTION</Text>
            <TextInput
              style={[s.input, s.textArea]}
              placeholder="Describe the problem in detail — when it started, who is affected, any immediate risks..."
              placeholderTextColor={T.colors.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={s.charCount}>{description.length}/500</Text>
          </View>
        </SectionCard>

        {/* Priority */}
        <SectionCard title="Priority Level" icon="flag-outline">            <Text style={s.sectionSubtitle}>How urgent is this issue?</Text>
          <View style={s.priorityRow}>
            {PRIORITY_OPTIONS.map((opt) => {
              const isActive = priority === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[s.priorityChip, isActive && { backgroundColor: opt.color + '18', borderColor: opt.color }]}
                  onPress={() => setPriority(isActive ? null : opt.id)}
                  activeOpacity={0.7}
                >
                  <View style={[s.priorityDot, { backgroundColor: opt.color }]} />
                  <Text style={[s.priorityLabel, isActive && { color: opt.color, fontWeight: '700' }]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </SectionCard>

        {/* Location */}
        <SectionCard title="Location" icon="map-marker-outline">
          <TouchableOpacity style={s.locationBtn} onPress={captureLocation} disabled={locationLoading} activeOpacity={0.7}>
            {locationLoading ? (
              <ActivityIndicator color={T.colors.textWhite} />
            ) : location ? (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color={T.colors.textWhite} />
                <Text style={s.locationBtnText}>LOCATION CAPTURED</Text>
              </>
            ) : (
              <>
                <Ionicons name="locate-outline" size={20} color={T.colors.textWhite} />
                <Text style={s.locationBtnText}>USE MY LOCATION</Text>
              </>
            )}
          </TouchableOpacity>
          {location && (
            <View style={s.coordsBox}>
              <Text style={s.coordText}>Lat: {location.latitude.toFixed(6)}</Text>
              <Text style={s.coordText}>Lng: {location.longitude.toFixed(6)}</Text>
            </View>
          )}
          <Text style={s.locationHint}>
            Adding your location helps authorities respond faster to the issue.
          </Text>
        </SectionCard>

        {/* Recent Community Issues — Placeholder */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <View style={s.cardIconWrap}>
              <MaterialCommunityIcons name="forum-outline" size={20} color={T.colors.accent} />
            </View>
            <Text style={s.cardTitle}>Recent Community Issues</Text>
          </View>
          <View style={s.emptyState}>
            <Ionicons name="chatbubbles-outline" size={32} color={T.colors.textMuted} />
            <Text style={s.emptyText}>No recent issues in your area yet.</Text>
            <Text style={s.emptySubtext}>Be the first to report a problem!</Text>
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[s.submitBtn, !isFormValid && s.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!isFormValid || submitting}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color={T.colors.textWhite} />
          ) : (
            <>
              <Text style={s.submitText}>Submit Report</Text>
              <Ionicons name="send-outline" size={18} color={T.colors.textWhite} />
            </>
          )}
        </TouchableOpacity>

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
  body: {
    padding: 16,
    gap: 16,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardIconWrap: {
    width: 36,
    height: 36,
    borderRadius: T.borderRadius.sm,
    backgroundColor: T.colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: T.colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: T.colors.textMuted,
    marginTop: -4,
  },

  /* Category Grid */
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: T.borderRadius.sm,
    borderWidth: 1,
    borderColor: T.colors.border,
    backgroundColor: T.colors.inputBackground,
    minWidth: '47%',
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: T.colors.textSecondary,
  },

  /* Inputs */
  inputWrapper: {
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: T.colors.textMuted,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: T.colors.borderSubtle,
    backgroundColor: T.colors.inputBackground,
    borderRadius: T.borderRadius.sm,
    paddingHorizontal: 12,
    fontSize: 14,
    color: T.colors.textPrimary,
  },
  textArea: {
    height: 120,
    paddingTop: 12,
    paddingBottom: 12,
  },
  charCount: {
    fontSize: 11,
    color: T.colors.textMuted,
    textAlign: 'right',
  },

  /* Priority */
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: T.borderRadius.sm,
    borderWidth: 1,
    borderColor: T.colors.border,
    backgroundColor: T.colors.inputBackground,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: T.colors.textSecondary,
  },

  /* Location */
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: T.colors.accent,
    borderRadius: T.borderRadius.sm,
    paddingVertical: 14,
  },
  locationBtnText: {
    color: T.colors.textWhite,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  coordsBox: {
    backgroundColor: T.colors.subtleBackground,
    borderRadius: T.borderRadius.sm,
    padding: 10,
    alignItems: 'center',
  },
  coordText: {
    color: T.colors.textMuted,
    fontSize: 12,
    marginVertical: 1,
  },
  locationHint: {
    fontSize: 12,
    color: T.colors.textMuted,
    lineHeight: 16,
  },

  /* Empty State */
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 6,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: T.colors.textMuted,
  },
  emptySubtext: {
    fontSize: 12,
    color: T.colors.textMuted,
  },

  /* Submit */
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: T.colors.accent,
    borderRadius: T.borderRadius.sm,
    paddingVertical: 16,
  },
  submitBtnDisabled: {
    backgroundColor: T.colors.borderSubtle,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: T.colors.textWhite,
  },
});
