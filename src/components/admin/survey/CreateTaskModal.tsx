import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/adminTheme';
import { SurveyTask } from '@/src/types/admin';
import FormInput from '@/src/components/admin/FormInput';
import SelectField from '@/src/components/admin/SelectField';

interface CreateTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (task: Omit<SurveyTask, 'id' | 'surveyId'>) => void;
  zones: string[];
  surveyTypes: string[];
  enumeratorNames: string[];
}

export default function CreateTaskModal({
  visible,
  onClose,
  onCreate,
  zones,
  surveyTypes,
  enumeratorNames,
}: CreateTaskModalProps) {
  const [selectedType, setSelectedType] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedEnumerator, setSelectedEnumerator] = useState('');
  const [targetHouseholds, setTargetHouseholds] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');

  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showZonePicker, setShowZonePicker] = useState(false);
  const [showEnumeratorPicker, setShowEnumeratorPicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);

  const resetForm = () => {
    setSelectedType('');
    setSelectedZone('');
    setSelectedEnumerator('');
    setTargetHouseholds('');
    setStartDate('');
    setDueDate('');
    setSelectedPriority('');
  };

  const handleCreate = () => {
    if (!selectedType || !selectedZone || !targetHouseholds) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    const total = parseInt(targetHouseholds, 10);
    if (isNaN(total) || total <= 0) {
      Alert.alert('Invalid', 'Target households must be a positive number.');
      return;
    }

    onCreate({
      title: selectedZone,
      zone: selectedZone,
      surveyType: selectedType,
      enumeratorName: selectedEnumerator || undefined,
      totalHouseholds: total,
      completedHouseholds: 0,
      progress: 0,
      status: 'pending',
      startDate: startDate || new Date().toISOString().split('T')[0],
      dueDate: dueDate || '',
    });

    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.heading}>Create New Survey Task</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Survey Type */}
            <TouchableOpacity activeOpacity={0.7} onPress={() => setShowTypePicker(!showTypePicker)}>
              <SelectField
                label="Survey Type *"
                placeholder="Select type"
                value={selectedType}
                onPress={() => setShowTypePicker(!showTypePicker)}
              />
            </TouchableOpacity>
            {showTypePicker && (
              <View style={styles.pickerList}>
                {surveyTypes.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.pickerItem, selectedType === t && styles.pickerItemActive]}
                    onPress={() => { setSelectedType(t); setShowTypePicker(false); }}
                  >
                    <Text style={[styles.pickerText, selectedType === t && styles.pickerTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Zone */}
            <TouchableOpacity activeOpacity={0.7} onPress={() => setShowZonePicker(!showZonePicker)}>
              <SelectField
                label="Zone / Ward *"
                placeholder="Select zone"
                value={selectedZone}
                onPress={() => setShowZonePicker(!showZonePicker)}
              />
            </TouchableOpacity>
            {showZonePicker && (
              <View style={styles.pickerList}>
                {zones.map((z) => (
                  <TouchableOpacity
                    key={z}
                    style={[styles.pickerItem, selectedZone === z && styles.pickerItemActive]}
                    onPress={() => { setSelectedZone(z); setShowZonePicker(false); }}
                  >
                    <Text style={[styles.pickerText, selectedZone === z && styles.pickerTextActive]}>{z}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Enumerator */}
            <TouchableOpacity activeOpacity={0.7} onPress={() => setShowEnumeratorPicker(!showEnumeratorPicker)}>
              <SelectField
                label="Enumerator"
                placeholder="Select enumerator"
                value={selectedEnumerator}
                onPress={() => setShowEnumeratorPicker(!showEnumeratorPicker)}
              />
            </TouchableOpacity>
            {showEnumeratorPicker && (
              <View style={styles.pickerList}>
                <TouchableOpacity
                  style={[styles.pickerItem, !selectedEnumerator && styles.pickerItemActive]}
                  onPress={() => { setSelectedEnumerator(''); setShowEnumeratorPicker(false); }}
                >
                  <Text style={[styles.pickerText, !selectedEnumerator && styles.pickerTextActive]}>None</Text>
                </TouchableOpacity>
                {enumeratorNames.map((e) => (
                  <TouchableOpacity
                    key={e}
                    style={[styles.pickerItem, selectedEnumerator === e && styles.pickerItemActive]}
                    onPress={() => { setSelectedEnumerator(e); setShowEnumeratorPicker(false); }}
                  >
                    <Text style={[styles.pickerText, selectedEnumerator === e && styles.pickerTextActive]}>{e}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Target Households */}
            <FormInput
              label="Target Households *"
              placeholder="e.g. 250"
              value={targetHouseholds}
              onChangeText={setTargetHouseholds}
              keyboardType="numeric"
              required
            />

            {/* Dates row */}
            <View style={styles.row}>
              <View style={styles.rowItem}>
                <FormInput
                  label="Start Date"
                  placeholder="YYYY-MM-DD"
                  value={startDate}
                  onChangeText={setStartDate}
                />
              </View>
              <View style={styles.rowItem}>
                <FormInput
                  label="Due Date"
                  placeholder="YYYY-MM-DD"
                  value={dueDate}
                  onChangeText={setDueDate}
                />
              </View>
            </View>

            {/* Priority */}
            <TouchableOpacity activeOpacity={0.7} onPress={() => setShowPriorityPicker(!showPriorityPicker)}>
              <SelectField
                label="Priority"
                placeholder="Select priority"
                value={selectedPriority}
                onPress={() => setShowPriorityPicker(!showPriorityPicker)}
              />
            </TouchableOpacity>
            {showPriorityPicker && (
              <View style={styles.pickerList}>
                {['Low', 'Medium', 'High'].map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[styles.pickerItem, selectedPriority === p && styles.pickerItemActive]}
                    onPress={() => { setSelectedPriority(p); setShowPriorityPicker(false); }}
                  >
                    <Text style={[styles.pickerText, selectedPriority === p && styles.pickerTextActive]}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} activeOpacity={0.6} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.createBtn} activeOpacity={0.6} onPress={handleCreate}>
              <Text style={styles.createBtnText}>Create Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    padding: 16,
  },
  pickerList: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
    overflow: 'hidden',
  },
  pickerItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  pickerItemActive: {
    backgroundColor: COLORS.accentSoft,
  },
  pickerText: {
    fontSize: 12.5,
    color: COLORS.textPrimary,
  },
  pickerTextActive: {
    color: COLORS.accent,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowItem: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  createBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textOnPrimary,
  },
});
