import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AdminLayout from '@/src/components/admin/AdminLayout';
import SectionHeader from '@/src/components/admin/SectionHeader';
import SurveyStatCard from '@/src/components/admin/survey/SurveyStatCard';
import SurveyFilters from '@/src/components/admin/survey/SurveyFilters';
import SurveyTaskCard from '@/src/components/admin/survey/SurveyTaskCard';
import CreateTaskModal from '@/src/components/admin/survey/CreateTaskModal';
import ReassignModal from '@/src/components/admin/survey/ReassignModal';
import { COLORS } from '@/constants/adminTheme';
import { SurveyTask, SurveyEnumerator } from '@/src/types/admin';
import {
  surveyStats,
  zones,
  surveyTypes,
  enumerators,
  INITIAL_SURVEYS,
} from '@/src/data/surveyMockData';

export default function SurveyManagementScreen() {
  const [search, setSearch] = useState('');
  const [zoneFilter, setZoneFilter] = useState('All Zones');
  const [staffFilter, setStaffFilter] = useState('All Staff');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [surveys, setSurveys] = useState<SurveyTask[]>(INITIAL_SURVEYS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);

  const enumeratorNames = useMemo(() => enumerators.map((e) => e.name), []);

  /* Filtering */
  const filtered = useMemo(() => {
    let result = surveys;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.zone.toLowerCase().includes(q) ||
          s.surveyType.toLowerCase().includes(q) ||
          (s.enumeratorName && s.enumeratorName.toLowerCase().includes(q)),
      );
    }

    if (zoneFilter !== 'All Zones') {
      result = result.filter((s) => s.zone === zoneFilter);
    }

    if (staffFilter !== 'All Staff') {
      result = result.filter((s) => s.enumeratorName === staffFilter);
    }

    if (statusFilter !== 'All Status') {
      const statusMap: Record<string, string> = {
        Completed: 'completed',
        'In Progress': 'in_progress',
        Pending: 'pending',
      };
      result = result.filter((s) => s.status === statusMap[statusFilter]);
    }

    return result;
  }, [surveys, search, zoneFilter, staffFilter, statusFilter]);

  /* Stats (from current data) */
  const stats = useMemo(() => {
    const completed = surveys.filter((s) => s.status === 'completed').length;
    const inProgress = surveys.filter((s) => s.status === 'in_progress').length;
    const pending = surveys.filter((s) => s.status === 'pending').length;
    return { completed, inProgress, pending };
  }, [surveys]);

  /* Handlers */
  const handleTrackProgress = useCallback((survey: SurveyTask) => {
    Alert.alert(
      'Track Progress',
      `${survey.zone}\n${survey.completedHouseholds}/${survey.totalHouseholds} households (${survey.progress}%)`,
    );
  }, []);

  const handleAssign = useCallback((survey: SurveyTask) => {
    setSelectedSurveyId(survey.id);
    setShowReassignModal(true);
  }, []);

  const handleReassign = useCallback((survey: SurveyTask) => {
    setSelectedSurveyId(survey.id);
    setShowReassignModal(true);
  }, []);

  const handleCreateTask = useCallback(
    (task: Omit<SurveyTask, 'id' | 'surveyId'>) => {
      const newTask: SurveyTask = {
        ...task,
        id: `ST-${String(surveys.length + 1).padStart(3, '0')}`,
        surveyId: `SV-2026-${String(surveys.length + 48).padStart(3, '0')}`,
      };
      setSurveys((prev) => [newTask, ...prev]);
    },
    [surveys.length],
  );

  const handleReassignConfirm = useCallback(
    (enumerator: SurveyEnumerator) => {
      if (!selectedSurveyId) return;
      setSurveys((prev) =>
        prev.map((s) =>
          s.id === selectedSurveyId
            ? { ...s, enumeratorId: enumerator.id, enumeratorName: enumerator.name }
            : s,
        ),
      );
      setShowReassignModal(false);
      setSelectedSurveyId(null);
    },
    [selectedSurveyId],
  );

  return (
    <AdminLayout>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* Page title */}
        <Text style={styles.pageTitle}>Survey Management</Text>
        <Text style={styles.pageSubtitle}>
          Track and manage survey tasks across all zones
        </Text>

        {/* Stat cards */}
        <View style={styles.statsRow}>
          <SurveyStatCard label="Completed" value={stats.completed} status="completed" />
          <SurveyStatCard label="In Progress" value={stats.inProgress} status="in_progress" />
          <SurveyStatCard label="Pending" value={stats.pending} status="pending" />
        </View>

        {/* Filters */}
        <SurveyFilters
          zones={zones}
          staff={enumeratorNames}
          statusFilter={statusFilter}
          onZoneChange={setZoneFilter}
          onStaffChange={setStaffFilter}
          onStatusChange={setStatusFilter}
        />

        {/* Search + New Task */}
        <View style={styles.searchRow}>
          <View style={styles.searchInput}>
            <Ionicons name="search-outline" size={16} color={COLORS.textMuted} />
            <TextInput
              style={styles.searchTextInput}
              placeholder="Search surveys..."
              placeholderTextColor={COLORS.textMuted}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity
            style={styles.newTaskBtn}
            activeOpacity={0.6}
            onPress={() => setShowCreateModal(true)}
          >
            <Ionicons name="add" size={18} color={COLORS.textOnPrimary} />
            <Text style={styles.newTaskBtnText}>New Task</Text>
          </TouchableOpacity>
        </View>

        {/* Task list */}
        <SectionHeader title={`Survey Tasks (${filtered.length})`} />
        <View style={styles.taskList}>
          {filtered.length > 0 ? (
            filtered.map((survey) => (
              <SurveyTaskCard
                key={survey.id}
                survey={survey}
                onTrackProgress={handleTrackProgress}
                onAssign={handleAssign}
                onReassign={handleReassign}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No surveys found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your filters or create a new task.
              </Text>
            </View>
          )}
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modals */}
      <CreateTaskModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateTask}
        zones={zones}
        surveyTypes={surveyTypes}
        enumeratorNames={enumeratorNames}
      />

      <ReassignModal
        visible={showReassignModal}
        enumerators={enumerators}
        currentEnumeratorId={
          surveys.find((s) => s.id === selectedSurveyId)?.enumeratorId
        }
        onConfirm={handleReassignConfirm}
        onCancel={() => {
          setShowReassignModal(false);
          setSelectedSurveyId(null);
        }}
      />
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  pageSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    height: 40,
    gap: 6,
  },
  searchTextInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  newTaskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 40,
  },
  newTaskBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textOnPrimary,
  },
  taskList: {
    gap: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  emptySubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
