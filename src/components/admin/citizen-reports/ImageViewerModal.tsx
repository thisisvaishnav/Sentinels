import React from 'react';
import { View, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface ImageViewerModalProps {
  visible: boolean;
  imageUri?: string;
  onClose: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ImageViewerModal({
  visible,
  imageUri,
  onClose,
}: ImageViewerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        {/* Close button */}
        <TouchableOpacity style={styles.closeBtn} activeOpacity={0.7} onPress={onClose}>
          <Ionicons name="close" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Image placeholder */}
        <View style={styles.imageContainer}>
          {imageUri ? (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera" size={48} color={ENUMERATOR_THEME.colors.accent} />
            </View>
          ) : (
            <View style={styles.noImage}>
              <Ionicons name="image-outline" size={48} color={ENUMERATOR_THEME.colors.textMuted} />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  imageContainer: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImage: {
    width: '100%',
    height: '100%',
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
