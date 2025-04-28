 // app/login/ForgotPassword.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons }   from '@expo/vector-icons';
import { useRouter }  from 'expo-router';

import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebaseConfig';   // ← adjust path

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [busy,  setBusy]  = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Enter e-mail', 'Please type the e-mail you registered with.');
      return;
    }

    try {
      setBusy(true);
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert(
        'Check your mail',
        'We’ve sent you a link to reset your password.',
        [{ text: 'OK', onPress: () => router.back() }],
      );
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        'Error',
        err.message || 'Could not send reset link. Make sure the e-mail is correct.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.top}>
          <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', left: 20, top: 50 }}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <Text style={styles.topTitle}>Reset Password</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Registered E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="john@example.com"
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity
            style={[styles.button, busy && { opacity: 0.6 }]}
            onPress={handleReset}
            disabled={busy}
          >
            {busy
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Send Reset Link</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ─── styles ─────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FADEEA' },

  top: {
    height: 200, backgroundColor: '#C85383',
    borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
    justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 30,
  },
  topTitle: { fontSize: 28, color: '#fff', fontWeight: '900' },

  form: { padding: 24 },
  label: {
    fontSize: 14, fontWeight: 'bold', color: '#C85383', marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    fontSize: 15, color: '#333', marginBottom: 20, elevation: 2,
  },
  button: {
    backgroundColor: '#C85383', padding: 15, borderRadius: 30,
    alignItems: 'center', elevation: 2,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
