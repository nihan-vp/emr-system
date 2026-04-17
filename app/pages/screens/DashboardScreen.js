import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomNavbar from '../../components/navbars/BottomNavbar';

export default function DashboardScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>This is the main dashboard screen. Customize with widgets and summaries as needed.</Text>
      <BottomNavbar navigation={navigation} active="dashboard" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f3ff',
    padding: 24,
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
  },
});
