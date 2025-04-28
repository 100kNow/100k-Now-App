// app/selfCheck/selfCheck.tsx   (or your current path)

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Alert, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { Ionicons }              from '@expo/vector-icons';
import { SafeAreaView }          from 'react-native-safe-area-context';
import TopBar                    from '@/components/TopBar';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth }              from '../../firebaseConfig';   // 👈 make sure path is right
import { useRouter }             from 'expo-router';
/* ------------------------------------------------------------------ */
/*  Questions                                                         */
/* ------------------------------------------------------------------ */
const yesNoQuestions = [
  'Have you noticed any changes in the shape or size of your breasts?',
  'Do you feel any unusual lumps or thickened areas?',
  'Did you see any skin changes (dimpling, redness, puckering)?',
  'Did you notice any nipple discharge (fluid, blood, etc.)?',
];
const openQuestion = 'If you noticed anything unusual, describe it here:';

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export default function SelfCheck() {
  const [answers, setAnswers] = useState<boolean[]>(Array(yesNoQuestions.length).fill(null));
  const [notes,   setNotes]   = useState('');
  const [busy,    setBusy]    = useState(false);
const router = useRouter();
  /* ----- handlers -------------------------------------------------- */
  const handleAnswer = (idx: number, value: boolean) =>
    setAnswers(prev => { const n=[...prev]; n[idx]=value; return n; });

  const handleSubmit = async () => {
    /* simple front-end validation */
    if (answers.some(answer => answer === null)) {
      Alert.alert('Completion Required', 'Please answer all Yes/No questions before submitting.');
      return;
    }

    const riskCount   = answers.filter(a => a).length;
    const riskMessage = riskCount >= 3
      ? 'We recommend consulting a healthcare professional immediately.'
      : 'Continue regular self-checks and monitor any changes.';

    /* ---------------- fireStore write ----------------- */
    try {
      setBusy(true);

      await addDoc(collection(db, 'selfChecks'), {
        uid        : auth.currentUser?.uid ?? null,
        answers,
        notes,
        riskCount,
        createdAt  : serverTimestamp(),
      });

      /* show the result */
      Alert.alert(
        `Risk Assessment: ${riskCount >= 3 ? 'High' : 'Low'}`,
        riskMessage,
      );

      // (optional) wipe form
      setAnswers(Array(yesNoQuestions.length).fill(null));
      setNotes('');
    } catch (err: any) {
      console.error('selfCheck write failed:', err);
      Alert.alert('Error', err.message || 'Could not save data – please try again.');
    } finally {
      setBusy(false);
    }
  };

  /* ---------------- UI --------------------------------------------- */
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}
    >
      <View style={styles.topbar}>
        <Ionicons
          name="chevron-back"
          size={24}
          color="#fff"
          onPress={() => router.back()}
        />
        <Text style={styles.topbarTitle}>Self-Check</Text>
        <View style={{ width: 24 }} />
      </View>


      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          {yesNoQuestions.map((q, i) => (
            <View key={i} style={styles.questionCard}>
              <Text style={styles.questionNumber}>Question {i + 1}</Text>
              <Text style={styles.questionText}>{q}</Text>

              <View style={styles.buttonGroup}>
                {/* YES button */}
                <TouchableOpacity
                  style={[
                    styles.answerButton,
                    answers[i] === true  && styles.selectedYes,
                    answers[i] === false && styles.unselected,
                  ]}
                  onPress={() => handleAnswer(i, true)}
                >
                  <Ionicons
                    name={answers[i] === true ? 'checkmark-circle' : 'ellipse-outline'}
                    size={24}
                    color={answers[i] === true ? '#4CAF50' : '#666'}
                  />
                  <Text style={styles.answerText}>Yes</Text>
                </TouchableOpacity>

                {/* NO button */}
                <TouchableOpacity
                  style={[
                    styles.answerButton,
                    answers[i] === false && styles.selectedNo,
                    answers[i] === true  && styles.unselected,
                  ]}
                  onPress={() => handleAnswer(i, false)}
                >
                  <Ionicons
                    name={answers[i] === false ? 'close-circle' : 'ellipse-outline'}
                    size={24}
                    color={answers[i] === false ? '#F44336' : '#666'}
                  />
                  <Text style={styles.answerText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* free-text notes */}
          <View style={styles.notesCard}>
            <Text style={styles.notesTitle}>{openQuestion}</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Describe any observations…"
              placeholderTextColor="#999"
              multiline
              maxLength={500}
              value={notes}
              onChangeText={setNotes}
            />
            <Text style={styles.charCount}>{notes.length}/500</Text>
          </View>

          {/* submit */}
          <TouchableOpacity
            style={[styles.submitButton, busy && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={busy}
            activeOpacity={0.9}
          >
            {busy
              ? <ActivityIndicator color="#fff" />
              : <>
                  <Text style={styles.submitText}>Submit &amp; Get Risk</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </>
            }
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}



const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFF',
  },
  topbar: {
    backgroundColor: "#C85383",
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topbarTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#C85383",
    marginBottom: 6,
    marginTop: 15,
  },
  header: {
    backgroundColor: '#C85383',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 24,
    paddingVertical: 6,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  content: {
    padding: 24,
  },
  questionCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  questionNumber: {
    fontSize: 12,
    color: '#C85383',
    fontWeight: '600',
    marginBottom: 4,
  },
  questionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  answerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#EEE',
  },
  selectedYes: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  selectedNo: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  unselected: {
    opacity: 0.6,
  },
  answerText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  notesCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  notesTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    fontWeight: '600',
  },
  notesInput: {
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 16,
    height: 120,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#C85383',
    padding: 18,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});