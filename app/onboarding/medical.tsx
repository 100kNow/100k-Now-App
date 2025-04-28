import { View, StyleSheet, Image, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { auth, db } from '../../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';


export default function MedicalHistory() {
    const router = useRouter();
    const [answers, setAnswers] = useState({
        diagnosed: '',
        familyHistory: '',
        symptoms: '',
        pregnancy: ''
    });

    const handleAnswer = (question: string, value: string) => {
        setAnswers(prev => ({ ...prev, [question]: value }));
    };
    const handleSubmit = async () => {
        const user = auth.currentUser;
      
        if (!user) {
          Alert.alert("Error", "You must be logged in.");
          return;
        }
      
        try {
          await updateDoc(doc(db, "users", user.uid), {
            medicalHistory: answers
          });
          router.push("./assessment");
        } catch (error) {
          console.error("Failed to submit:", error);
          Alert.alert("Error", "Failed to save medical history.");
        }
      };
      

    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Image
                    source={require("../../assets/images/whitelogo.png")}
                    style={styles.logo}
                />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Medical History</Text>

                <View style={styles.questionContainer}>
                    <Text style={styles.label}>Have you ever been diagnosed with breast cancer?</Text>
                    <View style={styles.toggleGroup}>
                        <TouchableOpacity
                            style={[styles.toggleButton, answers.diagnosed === 'Yes' && styles.activeToggle]}
                            onPress={() => handleAnswer('diagnosed', 'Yes')}
                        >
                            <Ionicons 
                                name={answers.diagnosed === 'Yes' ? 'checkmark-circle' : 'ellipse-outline'} 
                                size={20} 
                                color={answers.diagnosed === 'Yes' ? '#FFF' : '#C85383'} 
                            />
                            <Text style={[styles.toggleText, answers.diagnosed === 'Yes' && styles.activeToggleText]}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.toggleButton, answers.diagnosed === 'No' && styles.activeToggle]}
                            onPress={() => handleAnswer('diagnosed', 'No')}
                        >
                            <Ionicons 
                                name={answers.diagnosed === 'No' ? 'checkmark-circle' : 'ellipse-outline'} 
                                size={20} 
                                color={answers.diagnosed === 'No' ? '#FFF' : '#C85383'} 
                            />
                            <Text style={[styles.toggleText, answers.diagnosed === 'No' && styles.activeToggleText]}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Repeat similar structure for other questions */}

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleSubmit}
                    activeOpacity={0.9}
                >
                    <Text style={styles.buttonText}>Continue</Text>
                    <Ionicons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    top: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: 200,
        backgroundColor: "#C85383",
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
        fontFamily: 'Inter-Bold',
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
        fontFamily: 'Inter-SemiBold',
    },
    toggleGroup: {
        flexDirection: 'row',
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
        fontFamily: 'Inter-Medium',
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
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'Inter-Bold',
        fontSize: 16,
    },
});