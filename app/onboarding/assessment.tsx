import { View, StyleSheet, Image, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { db, auth } from '../../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

export default function ProfessionalHistory() {
  const router = useRouter();
  const [answers, setAnswers] = useState({
    seenDoctor: '',
    hadScan: '',
    discussedExams: '',
    confidentChecks: ''
  });

  const handleAnswer = (question: string, value: string) => {
    setAnswers(prev => ({ ...prev, [question]: value }));
  };

  const handleSubmit = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        professionalHistory: answers,
      });
      router.push('./currentMedication');
    } catch (error) {
      console.error("Failed to submit:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const renderQuestion = (key: keyof typeof answers, label: string) => (
    <View style={styles.questionContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.toggleGroup}>
        {['Yes', 'No'].map(option => (
          <TouchableOpacity
            key={option}
            style={[styles.toggleButton, answers[key] === option && styles.activeToggle]}
            onPress={() => handleAnswer(key, option)}
          >
            <Ionicons
              name={answers[key] === option ? 'checkmark-circle' : 'ellipse-outline'}
              size={20}
              color={answers[key] === option ? '#FFF' : '#C85383'}
            />
            <Text style={[styles.toggleText, answers[key] === option && styles.activeToggleText]}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Image source={require('../../assets/images/whitelogo.png')} style={styles.logo} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Professional Care History</Text>

        {renderQuestion('seenDoctor', 'Have you ever seen a doctor about breast health?')}
        {renderQuestion('hadScan', 'Have you ever had a breast scan, ultrasound, or mammogram?')}
        {renderQuestion('discussedExams', 'Did a medical professional ever discuss breast self-exams with you?')}
        {renderQuestion('confidentChecks', 'Do you feel confident performing breast self-checks?')}

        <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={0.9}>
          <Text style={styles.buttonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  top: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 200,
    backgroundColor: '#C85383',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 40,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
  },
  logo: {
    width: 80,
    height: 80,
    marginTop: 20,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#2A2A2A',
    textAlign: 'center',
  },
  questionContainer: {
    marginBottom: 24,
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 16,
    color: '#444',
    fontWeight: '600',
  },
  toggleGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    gap: 8,
  },
  activeToggle: {
    backgroundColor: '#C85383',
  },
  toggleText: {
    fontSize: 16,
    color: '#666',
  },
  activeToggleText: {
    color: 'white',
  },
  button: {
    marginTop: 32,
    backgroundColor: '#C85383',
    padding: 18,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
