import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';

import AdminLayout from '@/src/components/admin/AdminLayout';
import SectionHeader from '@/src/components/admin/SectionHeader';
import ReportStats from '@/src/components/admin/citizen-reports/ReportStats';
import ReportSearch from '@/src/components/admin/citizen-reports/ReportSearch';
import ReportFilters from '@/src/components/admin/citizen-reports/ReportFilters';
import CitizenReportCard from '@/src/components/admin/citizen-reports/CitizenReportCard';
import EmptyReports from '@/src/components/admin/citizen-reports/EmptyReports';
import AssignReportModal from '@/src/components/admin/citizen-reports/AssignReportModal';
import ReassignReportModal from '@/src/components/admin/citizen-reports/ReassignReportModal';
import UpdateStatusModal from '@/src/components/admin/citizen-reports/UpdateStatusModal';
import VerificationModal from '@/src/components/admin/citizen-reports/VerificationModal';
import ImageViewerModal from '@/src/components/admin/citizen-reports/ImageViewerModal';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import { CitizenReport, ReportStatus, ReportPriority } from '@/src/types/admin';
import {
  INITIAL_REPORTS,
  reportZones,
  reportEnumerators,
  categoryLabels,
  statusLabels,
  priorityLabels,
} from '@/src/data/citizenReportMockData';

interface FilterState {
  zone: string;
  enumerator: string;
  priority: string;
  category: string;
  status: string;
}

const INITIAL_FILTERS: FilterState = {
  zone: 'All Zones',
  enumerator: 'All Enumerators',
  priority: 'All Priorities',
  category: 'All Categories',
  status: 'All Statuses',
};

export default function CitizenReportsScreen() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [reports, setReports] = useState<CitizenReport[]>(INITIAL_REPORTS);

  // Modal states
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);

  const enumeratorNames = useMemo(
    () => ['All Enumerators', ...reportEnumerators.map((e) => e.name)],
    [],
  );

  const zoneOptions = useMemo(() => ['All Zones', ...reportZones], []);

  const priorityOptions = useMemo(
    () => ['All Priorities', ...Object.values(priorityLabels)],
    [],
  );

  const categoryOptions = useMemo(
    () => ['All Categories', ...Object.values(categoryLabels)],
    [],
  );

  const statusOptions = useMemo(
    () => ['All Statuses', ...Object.values(statusLabels)],
    [],
  );

  const handleFilterChange = useCallback((key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const filtered = useMemo(() => {
    let result = reports;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.citizenName.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.area.toLowerCase().includes(q) ||
          categoryLabels[r.category].toLowerCase().includes(q),
      );
    }

    if (filters.zone !== 'All Zones') {
      result = result.filter((r) => r.zone === filters.zone);
    }

    if (filters.enumerator !== 'All Enumerators') {
      result = result.filter((r) => r.enumeratorName === filters.enumerator);
    }

    if (filters.priority !== 'All Priorities') {
      const priorityKey = Object.entries(priorityLabels).find(
        ([, v]) => v === filters.priority,
      )?.[0];
      if (priorityKey) {
        result = result.filter((r) => r.priority === priorityKey);
      }
    }

    if (filters.category !== 'All Categories') {
      const categoryKey = Object.entries(categoryLabels).find(
        ([, v]) => v === filters.category,
      )?.[0];
      if (categoryKey) {
        result = result.filter((r) => r.category === categoryKey);
      }
    }

    if (filters.status !== 'All Statuses') {
      const statusKey = Object.entries(statusLabels).find(
        ([, v]) => v === filters.status,
      )?.[0];
      if (statusKey) {
        result = result.filter((r) => r.status === statusKey);
      }
    }

    return result;
  }, [reports, search, filters]);

  const stats = useMemo(() => {
    const total = reports.length;
    const pendingVerification = reports.filter(
      (r) => r.status === 'pending_verification',
    ).length;
    const underInvestigation = reports.filter(
      (r) => r.status === 'under_investigation',
    ).length;
    const resolved = reports.filter(
      (r) => r.status === 'resolved' || r.status === 'closed',
    ).length;
    return { total, pendingVerification, underInvestigation, resolved };
  }, [reports]);

  // Handlers
  const handleAssign = useCallback((report: CitizenReport) => {
    setSelectedReport(report);
    setShowAssignModal(true);
  }, []);

  const handleReassign = useCallback((report: CitizenReport) => {
    setSelectedReport(report);
    setShowReassignModal(true);
  }, []);

  const handleUpdateStatus = useCallback((report: CitizenReport) => {
    setSelectedReport(report);
    setShowUpdateStatusModal(true);
  }, []);

  const handleVerify = useCallback((report: CitizenReport) => {
    setSelectedReport(report);
    setShowVerificationModal(true);
  }, []);

  const handleViewImage = useCallback((report: CitizenReport) => {
    setSelectedReport(report);
    setShowImageViewer(true);
  }, []);

  const handleAssignConfirm = useCallback(
    (enumeratorId: string, enumeratorName: string, priority: ReportPriority) => {
      if (!selectedReport) return;
      setReports((prev) =>
        prev.map((r) =>
          r.id === selectedReport.id
            ? {
                ...r,
                status: 'assigned' as ReportStatus,
                enumeratorId,
                enumeratorName,
                assignedDate: new Date().toISOString().split('T')[0],
                priority,
              }
            : r,
        ),
      );
      setShowAssignModal(false);
      setSelectedReport(null);
    },
    [selectedReport],
  );

  const handleReassignConfirm = useCallback(
    (enumeratorId: string, enumeratorName: string) => {
      if (!selectedReport) return;
      setReports((prev) =>
        prev.map((r) =>
          r.id === selectedReport.id
            ? { ...r, enumeratorId, enumeratorName }
            : r,
        ),
      );
      setShowReassignModal(false);
      setSelectedReport(null);
    },
    [selectedReport],
  );

  const handleUpdateStatusConfirm = useCallback(
    (status: ReportStatus) => {
      if (!selectedReport) return;
      setReports((prev) =>
        prev.map((r) =>
          r.id === selectedReport.id
            ? { ...r, status, lastUpdated: new Date().toISOString().split('T')[0] }
            : r,
        ),
      );
      setShowUpdateStatusModal(false);
      setSelectedReport(null);
    },
    [selectedReport],
  );

  const handleVerifyConfirm = useCallback(
    (notes: string) => {
      if (!selectedReport) return;
      setReports((prev) =>
        prev.map((r) =>
          r.id === selectedReport.id
            ? {
                ...r,
                status: 'verified' as ReportStatus,
                verificationNotes: notes,
                lastUpdated: new Date().toISOString().split('T')[0],
              }
            : r,
        ),
      );
      setShowVerificationModal(false);
      setSelectedReport(null);
    },
    [selectedReport],
  );

  const handleRejectConfirm = useCallback(
    (reason: string) => {
      if (!selectedReport) return;
      setReports((prev) =>
        prev.map((r) =>
          r.id === selectedReport.id
            ? {
                ...r,
                status: 'rejected' as ReportStatus,
                verificationNotes: reason,
                lastUpdated: new Date().toISOString().split('T')[0],
              }
            : r,
        ),
      );
      setShowVerificationModal(false);
      setSelectedReport(null);
    },
    [selectedReport],
  );

  return (
    <AdminLayout>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* Page title */}
        <Text style={styles.pageTitle}>Citizen Reports</Text>
        <Text style={styles.pageSubtitle}>
          Track and manage citizen complaints across all zones
        </Text>

        {/* Stats */}
        <ReportStats
          total={stats.total}
          pendingVerification={stats.pendingVerification}
          underInvestigation={stats.underInvestigation}
          resolved={stats.resolved}
        />

        {/* Search */}
        <ReportSearch value={search} onChangeText={setSearch} />

        {/* Filters */}
        <ReportFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          zoneOptions={zoneOptions}
          enumeratorOptions={enumeratorNames}
          priorityOptions={priorityOptions}
          categoryOptions={categoryOptions}
          statusOptions={statusOptions}
        />

        {/* Report list */}
        <SectionHeader title={`Incoming Reports (${filtered.length})`} />
        <View style={styles.reportList}>
          {filtered.length > 0 ? (
            filtered.map((report) => (
              <CitizenReportCard
                key={report.id}
                report={report}
                onAssign={handleAssign}
                onReassign={handleReassign}
                onUpdateStatus={handleUpdateStatus}
                onVerify={handleVerify}
                onViewImage={handleViewImage}
              />
            ))
          ) : (
            <EmptyReports />
          )}
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modals */}
      <AssignReportModal
        visible={showAssignModal}
        report={selectedReport}
        enumerators={reportEnumerators}
        onAssign={handleAssignConfirm}
        onCancel={() => {
          setShowAssignModal(false);
          setSelectedReport(null);
        }}
      />

      <ReassignReportModal
        visible={showReassignModal}
        report={selectedReport}
        enumerators={reportEnumerators}
        onConfirm={handleReassignConfirm}
        onCancel={() => {
          setShowReassignModal(false);
          setSelectedReport(null);
        }}
      />

      <UpdateStatusModal
        visible={showUpdateStatusModal}
        report={selectedReport}
        onConfirm={handleUpdateStatusConfirm}
        onCancel={() => {
          setShowUpdateStatusModal(false);
          setSelectedReport(null);
        }}
      />

      <VerificationModal
        visible={showVerificationModal}
        report={selectedReport}
        onVerify={handleVerifyConfirm}
        onReject={handleRejectConfirm}
        onCancel={() => {
          setShowVerificationModal(false);
          setSelectedReport(null);
        }}
      />

      <ImageViewerModal
        visible={showImageViewer}
        imageUri={selectedReport?.imageUri}
        onClose={() => {
          setShowImageViewer(false);
          setSelectedReport(null);
        }}
      />
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.background,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
    marginBottom: 2,
  },
  pageSubtitle: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textSecondary,
    marginBottom: 16,
  },
  reportList: {
    gap: 10,
  },
});
