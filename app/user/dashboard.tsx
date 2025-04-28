import React, { useState, useEffect }  from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, Linking, TouchableWithoutFeedback  } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Input } from "react-native-elements";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from 'react-native-safe-area-context';
import CommunityPopup from '@/components/CommunityPopup'; // adjust path if needed
import { auth } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";




const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUsername(userSnap.data().username || "User"); // fallback if username missing
        }
      }
    });
  
    return unsubscribe; // Clean up the listener
  }, []);
  

  const router = useRouter();
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
const user = auth.currentUser;
const email = user?.email;

  const openLink = (url: string) => {
    Linking.openURL(url);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
         
      <View style={styles.top}>

        <View style={styles.topRow}>
            
          <View style={styles.headerLeft}>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.timeText}>
                {new Date().toLocaleDateString()} •{" "}
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>

            <View style={styles.profileContainer}>
              <TouchableOpacity style={styles.profilePlaceholder} onPress={() => router.push("./profile")}>
                <Ionicons name="person" size={32} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.username}>Hi, {username}</Text>
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => router.push("/modal/notifications")}
              >
                <Ionicons name="notifications-outline" size={24} color="#fff" />
                <View style={styles.notificationBadge} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
       
      </View>
     
      <Image
        source={require("../../assets/images/homepag.png")}
        style={styles.display}
      />

      <View style={styles.card}>
        <Text style={styles.cardText}>
          Join our community and connect with women who understand your journey.
        </Text>
        <View style={styles.communityContainer}>
          <TouchableOpacity style={styles.communityButton} onPress={() => setModalVisible(true)} >
            <Text style={styles.communityButtonText} >Join Us</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.quickActions}>
{[
  { label: "Scan", icon: "scan-outline" as const },
  { label: "Book Expert", icon: "person-circle-outline" as const },
  { label: "Self-Check Guide", icon: "body-outline" as const },
  { label: "Appointments", icon: "calendar-outline" as const },
  { label: "History", icon: "time-outline" as const },
].map((item, index) => (
  <TouchableOpacity
    key={index}
    style={styles.actionButton}
    onPress={() => {
      if (item.label === "Scan") {
        setShowComingSoon(true);
      } else {
        // Handle navigation here for others
      }
      if (item.label === "Book Expert") {
        router.push("../booking/bookExpert");
      }
      if (item.label === "Self-Check Guide") {
        router.push("../selfCheck/selfCheck");
      }if (item.label === "Appointments") {
        router.push("../booking/Appointment");
      }if (item.label === "History") {
        router.push("../booking/bookingHistory");
      }
    }}
  >
    <View style={styles.iconWrapper}>
      <Ionicons name={item.icon} size={24} color="#fff" />
    </View>
    <Text style={styles.actionLabel}>{item.label}</Text>
  </TouchableOpacity>
))}

      </View>
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose a Community</Text>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => openLink('https://chat.whatsapp.com/your-group')}>
              <Text style={styles.linkText}>Join WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => openLink('https://discord.gg/your-discord')}>
              <Text style={styles.linkText}>Join Discord</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => openLink('https://facebook.com/groups/your-group')}>
              <Text style={styles.linkText}>Join Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
  visible={showComingSoon}
  transparent
  animationType="fade"
  onRequestClose={() => setShowComingSoon(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>
      <Text style={styles.modalText}>🚧 Scan feature coming soon!</Text>
      <TouchableOpacity style={styles.closeButton} onPress={() => setShowComingSoon(false)}>
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
<Modal
  visible={showWelcomeModal}
  transparent
  animationType="fade"
  onRequestClose={() => setShowWelcomeModal(false)}
>
  <TouchableWithoutFeedback onPress={() => setShowWelcomeModal(false)}>
    <View style={styles.modalOverlay}>
      <TouchableWithoutFeedback>
        <View style={styles.welcomeBox}>
          {/* Added icon decoration */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>👋</Text>
          </View>

          <Text style={styles.modalTitle}>Welcome, {username}!</Text>
          
          <Text style={styles.modalText}>
            Thank you for joining our health community! 🏥✨
            {"\n\n"}
            Get ready to:
            {"\n"}
            ✅ Track medical appointments
            {"\n"}
            ✅ Access self-check guides
            {"\n"}
            ✅ Connect with health professionals
            {"\n\n"}
            Let's embark on your wellness journey together!
          </Text>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowWelcomeModal(false)}
            activeOpacity={0.8}
          >
            <Text style={styles.closeText}>Get Started</Text>
            {/* Add arrow icon if desired */}
            {/* <MaterialIcons name="arrow-forward" size={20} color="white" /> */}
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
</Modal>


      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("../user/StoryFeedback")}
      >
        <Text style={styles.buttonText}>Share Your Story</Text>
      </TouchableOpacity>
      <ScrollView>
<View style={styles.calendarContainer}>
      <Calendar
        // Initially visible month
        current={new Date().toISOString().split("T")[0]}
        // Handler which gets executed on day press
        onDayPress={(day: { dateString: string }) => {
          console.log("Selected day", day);
        }}        markedDates={{
          "2025-05-10": {
            selected: true,
            marked: true,
            selectedColor: "#C85383",
          },
        }}
        theme={{
          selectedDayBackgroundColor: "#C85383",
          todayTextColor: "#C85383",
          arrowColor: "#C85383",
        }}
      />
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    zIndex: 1,
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  
  top: {
    zIndex: 1,
    width: "100%",
    height: 160,
    backgroundColor: "#C85383",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 20,
    padding: 18,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flex: 1,
  },
  welcomeContainer: {
    marginBottom: 1,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },

  timeText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    justifyContent: "space-between",
    width: "100%",
  },
  profilePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  username: {
    fontSize: 21,
    color: "#fff",
    fontWeight: "900",
    flex: 1,
  },
  notificationButton: {
    padding: 8,
    position: "relative",
    marginLeft: 10,
  },
  notificationBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF5252",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    margin: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 16,
    color: "#444",
    fontFamily: "Inter-SemiBold",
  },
  display: {
    width: "100%",
    height: 250,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
    zIndex: 0,
    position: "absolute",
    top: 110,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    height: 90,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 100,
    paddingTop: 40,
    alignContent: "center",
    justifyContent: "center",
    marginBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginHorizontal: 20,
  },
  cardText: {
    width: "68%",
    fontSize: 13,
    color: "#333",
    marginBottom: 0,
    fontWeight: "bold",
  },
  communityButton: {
    backgroundColor: "#C85383",
    height: 40,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginTop: 0,
    marginBottom: 50,
  },
  communityButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  communityContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: -40,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 10,
  },

  actionButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#C85383",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  actionLabel: {
    marginTop: 6,
    fontSize: 12,
    color: "#333",
    fontWeight: "600",
  },
  button: {
    marginTop: 32,
    marginHorizontal: 20,
    backgroundColor: "#C85383",
    padding: 18,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  buttonText: {
    color: "#fff",
    fontFamily: "Inter-Bold",
    fontSize: 16,
  },
  calendarContainer: {
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 20,
  },


  modalContent: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
  },

  linkButton: {
    backgroundColor: '#FAE0EC',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  linkText: {
    color: '#C85383',
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 15,
  },
  cancelText: {
    color: '#999',
    fontSize: 14,
  }, modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  welcomeBox: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  iconContainer: {
    backgroundColor: '#e8f4ff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    fontSize: 32,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2A2A2A',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#5A5A5A',
    textAlign: 'center',
    marginBottom: 25,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  closeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  
});

export default Dashboard;
