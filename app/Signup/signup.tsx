// app/Signup/signup.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  Alert, ActivityIndicator, KeyboardAvoidingView,
  ScrollView, Platform,
} from 'react-native';
import { Input } from 'react-native-elements';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export default function Signup() {
  /* -------------- state -------------- */
  const [showPassword, setShowPassword]    = useState(false);
  const [email,  setEmail]                 = useState('');
  const [username, setUsername]            = useState('');
  const [age,    setAge]                   = useState('');
  const [password, setPassword]            = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy,   setBusy]                  = useState(false);
  const router = useRouter();

  /* -------------- signup -------------- */
  const handleSignup = async () => {
    if (!email || !password || !confirmPassword || !age) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    try {
      setBusy(true);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid, email: cred.user.email,
        username, age, createdAt: new Date(),
      });
      Alert.alert('Success', 'Account created successfully!');
      router.push('../onboarding/medical');
    } catch (err: any) {
      Alert.alert('Signup Failed', err.message ?? 'Unknown error');
    } finally {
      setBusy(false);
    }
  };

  /* -------------- UI -------------- */
  return (
    <View style={styles.container}>
      {/* ── fixed header ─────────────────────────────── */}
      <View style={styles.top}>
        <Image source={require('../../assets/images/whitelogo.png')} style={styles.logo} />
      </View>
      <Text style={styles.title}>Sign&nbsp;Up&nbsp;For&nbsp;Free</Text>

      {/* ── only this part scrolls / avoids keyboard ── */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* form */}
          <View style={styles.form}>
            {/* Email */}
            <Text style={styles.label}>Email Address</Text>
            <Input
              placeholder="Email"
              leftIcon={{ type: 'font-awesome', name: 'envelope', color: '#C85383', size: 20 }}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#C9C7C5"
              inputStyle={styles.inputText}
              inputContainerStyle={styles.inputContainer}
              containerStyle={styles.inputOuter}
            />

            {/* Username */}
            <Text style={styles.label}>Username</Text>
            <Input
              placeholder="Username"
              leftIcon={{ type: 'font-awesome', name: 'user', color: '#C85383', size: 20 }}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholderTextColor="#C9C7C5"
              inputStyle={styles.inputText}
              inputContainerStyle={styles.inputContainer}
              containerStyle={styles.inputOuter}
            />

            {/* Age */}
            <Text style={styles.label}>Age</Text>
            <Input
              placeholder="Age"
              leftIcon={{ type: 'font-awesome', name: 'user', color: '#C85383', size: 20 }}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              placeholderTextColor="#C9C7C5"
              inputStyle={styles.inputText}
              inputContainerStyle={styles.inputContainer}
              containerStyle={styles.inputOuter}
            />

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <Input
              placeholder="Password"
              secureTextEntry={!showPassword}
              leftIcon={{ type: 'font-awesome', name: 'lock', color: '#C85383', size: 24 }}
              rightIcon={{
                type : 'font-awesome',
                name : showPassword ? 'eye-slash' : 'eye',
                color: '#C85383',
                onPress: () => setShowPassword(p => !p),
              }}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              placeholderTextColor="#C9C7C5"
              inputStyle={styles.inputText}
              inputContainerStyle={styles.inputContainer}
              containerStyle={styles.inputOuter}
            />

            {/* Confirm password */}
            <Text style={styles.label}>Confirm Password</Text>
            <Input
              placeholder="Confirm Password"
              secureTextEntry={!showPassword}
              leftIcon={{ type: 'font-awesome', name: 'lock', color: '#C85383', size: 24 }}
              rightIcon={{
                type : 'font-awesome',
                name : showPassword ? 'eye-slash' : 'eye',
                color: '#C85383',
                onPress: () => setShowPassword(p => !p),
              }}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
              placeholderTextColor="#C9C7C5"
              inputStyle={styles.inputText}
              inputContainerStyle={styles.inputContainer}
              containerStyle={styles.inputOuter}
            />

            {/* Submit */}
            <TouchableOpacity
              style={[styles.button, busy && { opacity: 0.6 }]}
              onPress={handleSignup}
              disabled={busy}
            >
              {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign&nbsp;Up</Text>}
            </TouchableOpacity>
          </View>

          {/* link under the form – scrolls with it */}
          <Text style={styles.bottomText}>
            Already have an account?
            <Text onPress={() => router.push('../login/login')} style={styles.signInButton}>
              {' '}Sign&nbsp;In.
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/* ---------------- styles (unchanged) ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FADEEA' },

  top: {
    justifyContent: 'center', alignItems: 'center',
    width: '100%', height: 230, backgroundColor: '#C85383',
    borderBottomLeftRadius: 100, borderBottomRightRadius: 100,
  },
  logo:  { width: 100, height: 100, marginTop: 50 },
  title: { fontSize: 30, fontWeight: '900', marginTop: 30,
           textAlign: 'center', color: '#C85383' },

  form: { paddingHorizontal: 10, marginTop: 30 },

  label: { fontSize: 14, marginBottom: 5, color: '#C85383',
           marginLeft: 20, fontWeight: 'bold' },
  inputOuter: { marginBottom: 0 },
  inputContainer: {
    width: '100%', height: 49, backgroundColor: '#fff',
    borderRadius: 25, paddingHorizontal: 12,
    borderBottomWidth: 0, elevation: 3, paddingLeft: 20,
  },
  inputText: { color: '#000', fontSize: 16 },

  button: {
    alignItems: 'center', alignSelf: 'center',
    width: '80%', height: 60, marginTop: 10,
    borderRadius: 1000, backgroundColor: '#C85383',
    justifyContent: 'center',
  },
  buttonText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },

  bottomText: {
    marginTop: 20, textAlign: 'center', fontSize: 16,
    fontWeight: 'bold', color: '#fff',
  },
  signInButton: { color: '#C85383', fontSize: 16 },
});
