// app/booking/storyFeedback.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator, Modal,
} from 'react-native';
import { Input, CheckBox } from 'react-native-elements';
import { Ionicons }          from '@expo/vector-icons';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db }           from '../../firebaseConfig';
import TopBar                 from '@/components/TopBar';

export default function StoryFeedback() {
  /* ── state ───────────────────────────── */
  const [name,    setName]    = useState('');
  const [mail,    setMail]    = useState('');
  const [country, setCountry] = useState('');
  const [story,   setStory]   = useState('');
  const [share,   setShare]   = useState(true);
  const [busy,    setBusy]    = useState(false);
  const [done,    setDone]    = useState(false);

  /* ── submit ──────────────────────────── */
  const handleSubmit = async () => {
    if (!name.trim() || !story.trim() || !country.trim()) {
      alert('Please fill in Name, Country and your Story.');
      return;
    }
    try {
      setBusy(true);
      await addDoc(collection(db, 'userStories'), {
        uid        : auth.currentUser?.uid ?? null,
        name       : name.trim(),
        email      : mail.trim() || null,
        country    : country.trim(),
        story      : story.trim(),
        sharePublic: share,
        submittedAt: new Date(),
      });
      setDone(true);
      setName(''); setMail(''); setCountry(''); setStory(''); setShare(true);
    } catch (e: any) {
      console.error(e);
      alert(e.message ?? 'Could not submit – please try again.');
    } finally {
      setBusy(false);
    }
  };

  /* ── UI ──────────────────────────────── */
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <TopBar title="Share Your Story" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Name */}
        <Text style={styles.label}>Display name *</Text>
        <Input
          placeholder="Jane Doe"
          value={name}
          onChangeText={setName}
          {...inputProps}
        />

        {/* Email */}
        <Text style={styles.label}>Email (optional)</Text>
        <Input
          placeholder="jane@example.com"
          value={mail}
          onChangeText={setMail}
          keyboardType="email-address"
          autoCapitalize="none"
          {...inputProps}
        />

        {/* Country */}
        <Text style={styles.label}>Country *</Text>
        <Input
          placeholder="Europe"
          value={country}
          onChangeText={setCountry}
          {...inputProps}
        />

        {/* Story */}
        <Text style={styles.label}>Your story / feedback *</Text>
        <Input
          placeholder="Write anything you’d like to share…"
          value={story}
          onChangeText={setStory}
          multiline numberOfLines={6}
          inputStyle={[styles.inputText, { minHeight: 110, textAlignVertical: 'top' }]}
          inputContainerStyle={[styles.inputContainer, { minHeight: 120 }]}
          containerStyle={styles.inputOuter}
        />

        {/* Share toggle */}
        <CheckBox
          title="Allow my story to be shared publicly"
          checked={share}
          onPress={() => setShare(!share)}
          checkedColor="#C85383"
          containerStyle={styles.checkbox}
          textStyle={{ color: '#333', fontWeight: '500' }}
        />

        {/* Submit */}
        <TouchableOpacity
          style={[styles.button, busy && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={busy}
        >
          {busy
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>Submit</Text>}
        </TouchableOpacity>
      </ScrollView>

      {/* success modal */}
      <Modal transparent visible={done} animationType="fade"
             onRequestClose={() => setDone(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
            <Text style={styles.thanks}>Thank you!</Text>
            <Text style={styles.smallTxt}>
              Your story was received. Our team reviews each submission
              before publishing.
            </Text>
            <TouchableOpacity
              style={[styles.button, { width: '60%', marginTop: 10 }]}
              onPress={() => setDone(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

/* ── shared input props to reduce repetition ── */
const inputProps = {
  placeholderTextColor: '#C9C7C5',
  inputStyle          : { fontSize: 16, color: '#000' },
  inputContainerStyle : {
    backgroundColor: '#F9F9F9', borderRadius: 25,
    borderBottomWidth: 0, paddingHorizontal: 12, elevation: 3,
  },
  containerStyle: { marginBottom: 0 },
};

/* ── styles ── */
const styles = StyleSheet.create({
  flex   : { flex: 1, backgroundColor: '#fff' },
  scroll : { flexGrow: 1, padding: 20, paddingTop: 30 },

  inputOuter: { marginBottom: 20 }, // Added inputOuter style
  inputText: { fontSize: 16, color: '#000' }, // Added inputText style
  inputContainer: { backgroundColor: '#F9F9F9', borderRadius: 25, paddingHorizontal: 12, elevation: 3 }, // Added inputContainer style

  label  : { fontSize: 14, fontWeight: 'bold', color: '#C85383',
             marginLeft: 10, marginBottom: 5 },

  button : { alignSelf:'center', width:'90%', height:55, borderRadius:1000,
             backgroundColor:'#C85383', justifyContent:'center', alignItems:'center',
             marginTop: 20 },
  buttonText:{ color:'#fff', fontSize:16, fontWeight:'700' },

  checkbox:{ backgroundColor:'transparent', borderWidth:0, paddingLeft:0 },

  overlay:{ flex:1, backgroundColor:'rgba(0,0,0,0.5)',
            justifyContent:'center', alignItems:'center' },
  modalCard:{ width:'85%', backgroundColor:'#fff', borderRadius:16,
              padding:24, alignItems:'center' },
  thanks   :{ fontSize:22, fontWeight:'700', color:'#2A2A2A', marginTop:12 },
  smallTxt :{ fontSize:14, color:'#555', textAlign:'center', marginTop:8 },
});
