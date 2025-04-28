import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '@/components/TopBar';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';


const Profile = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login/login'); // Update this path to your actual login screen
    } catch (error) {
      console.error("Logout failed:", error);
      Alert.alert("Logout Failed", "Please try again.");
    }
  };
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  if (loading || !userData) {
    return <ActivityIndicator style={{ marginTop: 100 }} size="large" color="#C85383" />;
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 0, backgroundColor: '#C85383' }} edges={['top']}>
        <TopBar title="User Profile" />
      </SafeAreaView>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.card}>
          <Image source={require('../../assets/images/whitelogo.png')} style={styles.avatar} />
          <Text style={styles.name}>{userData.username}</Text>
          <Text style={styles.email}>{userData.email}</Text>
          <Text style={styles.phone}>Age: {userData.age}</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Medical History</Text>
          {Object.entries(userData.medicalHistory || {}).map(([key, value]) => (
            <Text key={key} style={styles.infoText}>{`${key}: ${value}`}</Text>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Professional History</Text>
          {Object.entries(userData.professionalHistory || {}).map(([key, value]) => (
            <Text key={key} style={styles.infoText}>{`${key}: ${value}`}</Text>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Current Medication</Text>
          <Text style={styles.infoText}>On Medication: {userData.currentMedication?.isOnMedication}</Text>
          {userData.currentMedication?.medications?.map((med: string, index: number) => (
            <Text key={index} style={styles.infoText}>• {med}</Text>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF1F6' },
  card: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 12 },
  name: { fontSize: 22, fontWeight: '700', color: '#C85383' },
  email: { fontSize: 14, color: '#888', marginTop: 4 },
  phone: { fontSize: 14, color: '#888', marginTop: 2 },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#C85383' },
  infoText: { fontSize: 14, color: '#555', marginBottom: 6 },
  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: '#C85383',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
