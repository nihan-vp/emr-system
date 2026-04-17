import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import BottomNavbar from '../../components/navbars/BottomNavbar';
import { fetchClinicState, replaceClinicCollection } from '../../utils/clinicApi';
import { attachLabReportToPatients, extractLabOrders } from '../../utils/lab';

const formatDate = (value) => {
  const parsed = value ? new Date(value) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) {
    return 'Unknown date';
  }

  return parsed.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function UploadResultsScreen({ navigation, route }) {
  const routeOrder = route?.params?.order || null;
  const [patients, setPatients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrderKey, setSelectedOrderKey] = useState(
    routeOrder ? `${routeOrder.patientId}-${routeOrder.rxId}-${routeOrder.investigationId}` : null
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);

    try {
      const clinicState = await fetchClinicState();
      const nextPatients = clinicState?.patients || [];
      const nextOrders = extractLabOrders(nextPatients);
      setPatients(nextPatients);
      setOrders(nextOrders);
    } catch (_error) {
      Alert.alert('Load Failed', 'Could not load lab requests from MongoDB.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const selectedOrder = useMemo(() => {
    if (!selectedOrderKey) {
      return null;
    }

    return orders.find((item) => `${item.patientId}-${item.rxId}-${item.investigationId}` === selectedOrderKey) || null;
  }, [orders, selectedOrderKey]);

  const pendingOrders = orders.filter((item) => item.status === 'pending');

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets?.[0];
      if (asset) {
        setSelectedFile(asset);
      }
    } catch (_error) {
      Alert.alert('File Error', 'Could not open the file picker.');
    }
  };

  const handleUpload = async () => {
    if (!selectedOrder) {
      Alert.alert('Select Test', 'Choose a lab request before uploading the report.');
      return;
    }

    if (!selectedFile) {
      Alert.alert('Choose File', 'Select a report file first.');
      return;
    }

    setSaving(true);

    try {
      const fileBase64 = await FileSystem.readAsStringAsync(selectedFile.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const report = {
        fileName: selectedFile.name || 'Lab Report',
        mimeType: selectedFile.mimeType || 'application/octet-stream',
        uri: selectedFile.uri || '',
        size: selectedFile.size ?? null,
        base64: fileBase64,
        dataUri: `data:${selectedFile.mimeType || 'application/octet-stream'};base64,${fileBase64}`,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'lab',
      };

      const updatedPatients = attachLabReportToPatients(patients, selectedOrder, report);
      await replaceClinicCollection('patients', updatedPatients);
      setPatients(updatedPatients);
      setOrders(extractLabOrders(updatedPatients));
      setSelectedFile(null);
      Alert.alert('Uploaded', 'Lab report uploaded successfully for doctor review.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Lab'),
        },
      ]);
    } catch (_error) {
      Alert.alert('Upload Failed', 'Could not upload the lab report to MongoDB.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.title}>Upload Results Requested by Doctor</Text>
        <Text style={styles.subtitle}>
          Select a pending lab test and attach the report so the doctor can review it.
        </Text>

        {loading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator color="#7c3aed" />
            <Text style={styles.stateText}>Loading pending lab requests...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Pending Requests</Text>
            {pendingOrders.length > 0 ? pendingOrders.map((order) => {
              const orderKey = `${order.patientId}-${order.rxId}-${order.investigationId}`;
              const isSelected = selectedOrderKey === orderKey;

              return (
                <TouchableOpacity
                  key={orderKey}
                  style={[styles.orderCard, isSelected && styles.orderCardSelected]}
                  onPress={() => setSelectedOrderKey(orderKey)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.orderPatient}>{order.patientName}</Text>
                  <Text style={styles.orderTest}>{order.investigationName}</Text>
                  <Text style={styles.orderMeta}>
                    Diagnosis: {order.diagnosis || 'General diagnosis'}
                  </Text>
                  <Text style={styles.orderMeta}>Requested: {formatDate(order.rxDate)}</Text>
                </TouchableOpacity>
              );
            }) : (
              <View style={styles.stateCard}>
                <Text style={styles.stateText}>No pending lab requests found.</Text>
              </View>
            )}

            <Text style={styles.sectionTitle}>Selected Upload</Text>
            <View style={styles.uploadCard}>
              {selectedOrder ? (
                <>
                  <Text style={styles.selectedLabel}>Patient</Text>
                  <Text style={styles.selectedValue}>{selectedOrder.patientName}</Text>
                  <Text style={styles.selectedLabel}>Lab Test</Text>
                  <Text style={styles.selectedValue}>{selectedOrder.investigationName}</Text>
                  <Text style={styles.selectedLabel}>Doctor Notes</Text>
                  <Text style={styles.selectedMuted}>{selectedOrder.diagnosis || 'No diagnosis provided'}</Text>
                </>
              ) : (
                <Text style={styles.selectedMuted}>Choose a request from the list above.</Text>
              )}

              <TouchableOpacity style={styles.uploadBtn} onPress={handlePickDocument}>
                <Text style={styles.uploadBtnText}>Choose File</Text>
              </TouchableOpacity>

              {selectedFile && (
                <Text style={styles.fileName}>
                  Selected: {selectedFile.name}
                </Text>
              )}

              <TouchableOpacity
                style={[styles.saveBtn, (!selectedOrder || !selectedFile || saving) && styles.saveBtnDisabled]}
                onPress={handleUpload}
                disabled={!selectedOrder || !selectedFile || saving}
              >
                <Text style={styles.saveBtnText}>{saving ? 'Uploading...' : 'Upload For Doctor'}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      <BottomNavbar navigation={navigation} active="upload" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f3ff',
  },
  body: {
    padding: 24,
    paddingBottom: 96,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7c3aed',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 22,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4c1d95',
    marginBottom: 10,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9d5ff',
    marginBottom: 12,
  },
  orderCardSelected: {
    borderColor: '#7c3aed',
    backgroundColor: '#faf5ff',
  },
  orderPatient: {
    fontSize: 16,
    fontWeight: '700',
    color: '#312e81',
    marginBottom: 6,
  },
  orderTest: {
    fontSize: 15,
    fontWeight: '700',
    color: '#5b21b6',
    marginBottom: 4,
  },
  orderMeta: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 2,
  },
  uploadCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e9d5ff',
    padding: 18,
    marginTop: 4,
  },
  selectedLabel: {
    fontSize: 12,
    color: '#7c3aed',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginTop: 10,
    marginBottom: 4,
  },
  selectedValue: {
    fontSize: 16,
    color: '#312e81',
    fontWeight: '700',
  },
  selectedMuted: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginTop: 2,
  },
  uploadBtn: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 24,
    marginBottom: 10,
    alignItems: 'center',
  },
  uploadBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fileName: {
    marginTop: 6,
    color: '#4b5563',
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stateCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e9d5ff',
    padding: 22,
    alignItems: 'center',
    gap: 10,
  },
  stateText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});
