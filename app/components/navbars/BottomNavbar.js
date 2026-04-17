import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Home, FlaskConical, User } from 'lucide-react-native';

export default function BottomNavbar({ navigation, active }) {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={[styles.navItem, active === 'dashboard' && styles.activeNavItem]}
        onPress={() => navigation.navigate('DashboardScreen')}
      >
        <Home size={22} color={active === 'dashboard' ? '#fff' : '#7c3aed'} />
        <Text style={[styles.navText, active === 'dashboard' && styles.activeNavText]}>Dashboard</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, active === 'lab' && styles.activeNavItem]}
        onPress={() => navigation.navigate('Lab')}
      >
        <FlaskConical size={22} color={active === 'lab' ? '#fff' : '#7c3aed'} />
        <Text style={[styles.navText, active === 'lab' && styles.activeNavText]}>Lab</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, active === 'upload' && styles.activeNavItem]}
        onPress={() => navigation.navigate('UploadResultsScreen')}
      >
        <User size={22} color={active === 'upload' ? '#fff' : '#7c3aed'} />
        <Text style={[styles.navText, active === 'upload' && styles.activeNavText]}>Upload</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#ede9fe',
    // borderTopWidth: 1, // Removed to eliminate thick line
    // borderTopColor: '#ddd6fe', // Removed to eliminate thick line
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    zIndex: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  navText: {
    fontSize: 12,
    color: '#7c3aed',
    marginTop: 2,
  },
  activeNavItem: {
    backgroundColor: '#7c3aed',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  activeNavText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
