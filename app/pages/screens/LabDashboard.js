import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomNavbar from '../../components/navbars/BottomNavbar';
import { CheckCircle2, FileText, FlaskConical, UploadCloud } from 'lucide-react-native';
import { fetchClinicState } from '../../utils/clinicApi';
import { extractLabOrders } from '../../utils/lab';

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

export default function LabDashboard({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadOrders = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
    }

    try {
      const clinicState = await fetchClinicState();
      const extractedOrders = extractLabOrders(clinicState?.patients || []);
      setOrders(extractedOrders);
      setError('');
    } catch (_error) {
      setError('Could not load lab orders from MongoDB.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();

    const unsubscribe = navigation.addListener('focus', () => {
      loadOrders({ silent: true });
    });

    return unsubscribe;
  }, [loadOrders, navigation]);

  const pendingOrders = orders.filter((item) => item.status === 'pending');
  const completedOrders = orders.filter((item) => item.status === 'completed');

  const renderOrderCard = (order) => {
    const hasReport = Boolean(order.report?.uploadedAt);

    return (
      <TouchableOpacity
        key={`${order.patientId}-${order.rxId}-${order.investigationId}`}
        style={styles.orderCard}
        onPress={() => navigation.navigate('UploadResultsScreen', { order })}
        activeOpacity={0.85}
      >
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderPatient}>{order.patientName}</Text>
            <Text style={styles.orderMeta}>
              ID: {order.patientId} {order.patientMobile ? `| ${order.patientMobile}` : ''}
            </Text>
          </View>
          <View style={[styles.statusChip, hasReport ? styles.statusDone : styles.statusPending]}>
            <Text style={[styles.statusText, hasReport ? styles.statusDoneText : styles.statusPendingText]}>
              {hasReport ? 'Completed' : 'Pending'}
            </Text>
          </View>
        </View>

        <Text style={styles.orderTest}>{order.investigationName}</Text>
        <Text style={styles.orderDetail}>
          Diagnosis: {order.diagnosis || 'General diagnosis'}
        </Text>
        <Text style={styles.orderDetail}>
          Requested: {formatDate(order.rxDate)}
        </Text>
        {hasReport ? (
          <Text style={styles.reportText}>
            Report uploaded: {order.report?.fileName || 'Attached file'} on {formatDate(order.report?.uploadedAt)}
          </Text>
        ) : (
          <Text style={styles.pendingText}>Waiting for lab technician upload.</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        <FlaskConical color="#7c3aed" size={26} style={{ marginRight: 10 }} />
        <Text style={styles.title}>Lab Dashboard</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadOrders({ silent: true }); }} />}
      >
        <Text style={styles.subtitle}>Tests & Results Queue</Text>
        <Text style={styles.hint}>
          Lab investigations requested by the doctor appear here automatically after the prescription is saved.
        </Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <UploadCloud color="#7c3aed" size={24} />
            <Text style={styles.summaryValue}>{pendingOrders.length}</Text>
            <Text style={styles.summaryLabel}>Pending Tests</Text>
          </View>
          <View style={styles.summaryCard}>
            <CheckCircle2 color="#059669" size={24} />
            <Text style={styles.summaryValue}>{completedOrders.length}</Text>
            <Text style={styles.summaryLabel}>Uploaded Reports</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('UploadResultsScreen')}>
          <UploadCloud color="#fff" size={20} style={{ marginRight: 8 }} />
          <Text style={styles.actionBtnText}>Upload Lab Results</Text>
        </TouchableOpacity>

        {loading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator color="#7c3aed" />
            <Text style={styles.stateText}>Loading lab queue...</Text>
          </View>
        ) : error ? (
          <View style={styles.stateCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.stateCard}>
            <FileText color="#a78bfa" size={30} />
            <Text style={styles.stateTitle}>No lab investigations yet</Text>
            <Text style={styles.stateText}>Doctor-added lab tests will appear here once prescriptions are saved.</Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Pending</Text>
            {pendingOrders.length > 0 ? pendingOrders.map(renderOrderCard) : (
              <View style={styles.emptySection}>
                <Text style={styles.emptySectionText}>No pending tests right now.</Text>
              </View>
            )}

            <Text style={styles.sectionTitle}>Completed</Text>
            {completedOrders.length > 0 ? completedOrders.map(renderOrderCard) : (
              <View style={styles.emptySection}>
                <Text style={styles.emptySectionText}>No uploaded reports yet.</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <BottomNavbar navigation={navigation} active="lab" />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f3ff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd6fe',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#5b21b6' },
  body: {
    padding: 24,
    paddingBottom: 100,
    backgroundColor: '#f5f3ff',
  },
  subtitle: { fontSize: 18, fontWeight: '600', color: '#4c1d95', marginBottom: 8 },
  hint: { fontSize: 15, color: '#64748b', lineHeight: 22, marginBottom: 18 },
  summaryRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#4c1d95',
    marginTop: 10,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignSelf: 'flex-start',
    marginBottom: 24,
    elevation: 1,
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4c1d95',
    marginBottom: 10,
    marginTop: 8,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9d5ff',
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  orderPatient: {
    fontSize: 16,
    fontWeight: '700',
    color: '#312e81',
  },
  orderMeta: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  orderTest: {
    fontSize: 15,
    fontWeight: '700',
    color: '#5b21b6',
    marginBottom: 6,
  },
  orderDetail: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 4,
  },
  statusChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusPending: {
    backgroundColor: '#fef3c7',
  },
  statusDone: {
    backgroundColor: '#dcfce7',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  statusPendingText: {
    color: '#92400e',
  },
  statusDoneText: {
    color: '#166534',
  },
  reportText: {
    marginTop: 8,
    fontSize: 12,
    color: '#166534',
    fontWeight: '600',
  },
  pendingText: {
    marginTop: 8,
    fontSize: 12,
    color: '#92400e',
    fontWeight: '600',
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
  stateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4c1d95',
  },
  stateText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#b91c1c',
    textAlign: 'center',
  },
  emptySection: {
    backgroundColor: '#ede9fe',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
  },
  emptySectionText: {
    fontSize: 13,
    color: '#6b21a8',
  },
});
