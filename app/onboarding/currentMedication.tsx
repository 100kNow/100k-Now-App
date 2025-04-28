import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../../firebaseConfig';
import { updateDoc, doc } from 'firebase/firestore';

export default function CurrentMedicationScreen() {
  const router = useRouter();
  const [isOnMeds, setIsOnMeds] = useState('');
  const [selectedMeds, setSelectedMeds] = useState<string[]>([]);

  const commonMeds = [
    'Tamoxifen',
    'Letrozole',
    'Anastrozole',
    'Exemestane',
    'Herceptin',
    'Other',
  ];

  const toggleMed = (med: string) => {
    if (selectedMeds.includes(med)) {
      setSelectedMeds(selectedMeds.filter(m => m !== med));
    } else {
      setSelectedMeds([...selectedMeds, med]);
    }
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) return Alert.alert("Error", "No user logged in.");

    try {
      await updateDoc(doc(db, "users", user.uid), {
        currentMedication: {
          isOnMedication: isOnMeds,
          medications: selectedMeds,
        }
      });
      router.push('../user/dashboard');
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save medication data.");
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
        <Text style={styles.title}>Current Medication</Text>

        <Text style={styles.label}>Are you currently on any medication?</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleButton, isOnMeds === 'Yes' && styles.activeToggle]}
            onPress={() => setIsOnMeds('Yes')}
          >
            <Text style={[styles.toggleText, isOnMeds === 'Yes' && styles.activeToggleText]}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, isOnMeds === 'No' && styles.activeToggle]}
            onPress={() => setIsOnMeds('No')}
          >
            <Text style={[styles.toggleText, isOnMeds === 'No' && styles.activeToggleText]}>No</Text>
          </TouchableOpacity>
        </View>

        {isOnMeds === 'Yes' && (
          <View style={styles.medsList}>
            <Text style={styles.label}>Select any medication you're currently using:</Text>
            <View style={styles.medsGrid}>
              {commonMeds.map(med => (
                <TouchableOpacity
                  key={med}
                  style={[styles.medButton, selectedMeds.includes(med) && styles.selectedMed]}
                  onPress={() => toggleMed(med)}
                >
                  <Ionicons 
                    name={selectedMeds.includes(med) ? "checkbox-outline" : "square-outline"} 
                    size={24} 
                    color={selectedMeds.includes(med) ? "#C85383" : "#666"} 
                  />
                  <Text style={[styles.medText, selectedMeds.includes(med) && styles.selectedMedText]}>{med}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

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
    backgroundColor: '#FFF',
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
  label: {
    fontSize: 16,
    marginBottom: 16,
    color: '#444',
    fontFamily: 'Inter-SemiBold',
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
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
  medsList: {
    marginBottom: 24,
  },
  medsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  medButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
    gap: 12,
  },
  selectedMed: {
    backgroundColor: '#FFF0F5',
    borderWidth: 1,
    borderColor: '#C85383',
  },
  medText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
  selectedMedText: {
    color: '#C85383',
    fontFamily: 'Inter-SemiBold',
  },
  button: {
    marginTop: 24,
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
