import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
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
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={selected}
              onValueChange={(itemValue) => setSelected(itemValue)}
              style={[
                styles.picker,
                { color: theme.text, backgroundColor: theme.inputBg, borderColor: theme.primary }
              ]}
              dropdownIconColor={theme.primary}
            >
              <Picker.Item label="Select Blood Group" value={null} color="#888" />
              {BLOOD_GROUPS.map((bg) => (
                <Picker.Item key={bg.value} label={bg.label} value={bg.value} color={theme.text} />
              ))}
            </Picker>
          </View>
          <View style={styles.actionsSingle}>
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
  dropdownContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: 56,
    borderRadius: 14,
    borderWidth: 2,
    fontSize: 18,
    marginBottom: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0fdfa',
  },
  actionsSingle: {
    flexDirection: 'row',
    justifyContent: 'center',
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
