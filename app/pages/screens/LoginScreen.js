import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { Eye, EyeOff, Lock, Stethoscope, User } from 'lucide-react-native';
import { ROLE_OPTIONS, ROLE_ROUTES, validateRoleLogin } from '../../auth/roleAuth';
import SplashScreen from '../../components/loaders/SplashScreen';
import modernTheme from '../../constants/modernTheme';

/**
 * Root login: username, password, role picker.
 * On success uses navigation.replace(routeName) so the user cannot go "back" to login.
 */
export default function LoginScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(ROLE_ROUTES.DOCTOR);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    // Show splash for 2.5s, then hide
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async () => {
    setError('');
    if (!username.trim() || !password) {
      setError('Please enter username and password.');
      return;
    }

    setLoading(true);
    // Short delay so loading state is visible (matches real auth UX)
    await new Promise((r) => setTimeout(r, 400));

    const result = validateRoleLogin(username, password, selectedRole);
    setLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    // replace() removes Login from the stack — prevents Android back to login
    navigation.replace(result.routeName);
  };

  if (showSplash) {
    return <SplashScreen theme={{ mode: 'dark', primary: modernTheme.colors.primary, text: '#fff', textDim: '#94a3b8' }} onFinish={() => setShowSplash(false)} />;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.root}>
        <LinearGradient colors={['#0f172a', '#134e4a', '#0f172a']} style={StyleSheet.absoluteFill} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.brandRow}>
              <View style={styles.brandIcon}>
                <Stethoscope size={36} color="#2dd4bf" />
              </View>
              <Text style={styles.brandTitle}>Clinic PPM</Text>
              <Text style={styles.brandSub}>Hospital & clinic workspace</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputWrap}>
                <User size={20} color="#64748b" />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. doctor"
                  placeholderTextColor="#64748b"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>

              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrap}>
                <Lock size={20} color="#64748b" />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#64748b"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity onPress={() => setShowPassword((s) => !s)} hitSlop={12}>
                  {showPassword ? <EyeOff size={20} color="#64748b" /> : <Eye size={20} color="#64748b" />}
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Role</Text>
              <View style={styles.pickerWrap}>
                <Picker
                  selectedValue={selectedRole}
                  onValueChange={(v) => setSelectedRole(v)}
                  enabled={!loading}
                  style={styles.picker}
                  itemStyle={Platform.OS === 'ios' ? styles.pickerItemIos : undefined}
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                  ))}
                </Picker>
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <TouchableOpacity
                style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#14b8a6', '#0d9488']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.loginGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.loginText}>Sign in</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <Text style={styles.hint}>
                Demo: role-specific username and password 1234 (see roleAuth.js).
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0f172a' },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingVertical: 48,
  },
  brandRow: { alignItems: 'center', marginBottom: 28 },
  brandIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(45,212,191,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(45,212,191,0.35)',
    marginBottom: 14,
  },
  brandTitle: { fontSize: 28, fontWeight: '800', color: '#f1f5f9' },
  brandSub: { marginTop: 6, fontSize: 15, color: '#94a3b8' },
  card: {
    backgroundColor: 'rgba(30,41,59,0.92)',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.2)',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 8,
    marginTop: 4,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.25)',
    paddingHorizontal: 14,
    marginBottom: 14,
    minHeight: 52,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#f1f5f9',
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
  },
  pickerWrap: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.25)',
    backgroundColor: 'rgba(15,23,42,0.6)',
    marginBottom: 14,
    overflow: 'hidden',
  },
  picker: { color: '#f1f5f9' },
  pickerItemIos: { color: '#f1f5f9' },
  error: {
    color: '#fca5a5',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '500',
  },
  loginBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 8 },
  loginBtnDisabled: { opacity: 0.85 },
  loginGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  hint: { marginTop: 16, fontSize: 12, color: '#64748b', textAlign: 'center', lineHeight: 18 },
});
