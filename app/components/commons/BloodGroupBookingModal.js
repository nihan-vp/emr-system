import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BLOOD_GROUPS } from '../../constants/medical';
import { getMedicalModalTheme } from '../../constants/tableTheme';

const { width } = Dimensions.get('window');

export default function BloodGroupBookingModal({ visible, onClose, onBook, theme }) {
  const modalTheme = getMedicalModalTheme(theme);
  const [selected, setSelected] = useState(null);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: modalTheme.surface, borderColor: modalTheme.shellBorder }]}>  
          <LinearGradient colors={modalTheme.headerColors} style={styles.header}>
            <Text style={[styles.headerText, { color: modalTheme.headerText }]}>Book Blood Group</Text>
          </LinearGradient>
          <ScrollView contentContainerStyle={styles.scroll}>
            {BLOOD_GROUPS.map((bg) => (
              <TouchableOpacity
                key={bg}
                style={[
                  styles.bloodOption,
                  selected === bg && { backgroundColor: modalTheme.chipBg, borderColor: theme.primary }
                ]}
                onPress={() => setSelected(bg)}
                activeOpacity={0.8}
              >
                <Text style={[styles.bloodText, { color: selected === bg ? theme.primary : theme.text }]}>{bg}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.btn, { backgroundColor: theme.inputBg }]} onPress={onClose}>
              <Text style={{ color: theme.text }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: theme.primary }]}
              onPress={() => selected && onBook(selected)}
              disabled={!selected}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Book</Text>
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
    backgroundColor: 'rgba(2,6,23,0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modal: {
    width: width - 32,
    borderRadius: 24,
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  header: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  scroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 16,
  },
  bloodOption: {
    minWidth: 80,
    margin: 8,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#f0fdfa',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  bloodText: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#e0f2fe',
    backgroundColor: '#f8fafc',
  },
  btn: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
});
