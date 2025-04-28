// app/booking/bookExpert.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function BookExpert() {
  const router = useRouter();

  /* ---------------- state ---------------- */
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [showDone, setShowDone] = useState(false);

  /* ---------------- submit ---------------- */
  const handleSubmit = async () => {
    if (!name || !contact || !reason) {
      Alert.alert(
        "Missing information",
        "Please fill in Name, Contact and Reason."
      );
      return;
    }
    try {
      setBusy(true);
      await addDoc(collection(db, "expertBookings"), {
        name,
        contact,
        reason,
        notes,
        submittedAt: new Date(),
      });
      setShowDone(true);
      setName("");
      setContact("");
      setReason("");
      setNotes("");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Please try again.");
    } finally {
      setBusy(false);
    }
  };

  /* ---------------- render ---------------- */
  return (
    <View style={styles.container}>
      {/* ─── top bar ─────────────────────────────────────────── */}
      <View style={styles.topbar}>
        <Ionicons
          name="chevron-back"
          size={24}
          color="#fff"
          onPress={() => router.back()}
        />
        <Text style={styles.topbarTitle}>Request Expert Booking</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* ─── keyboard-aware scroll area ─────────────────────── */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* form ------------------------------------------------ */}
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={styles.input}
              placeholderTextColor="#999"
            placeholder="Enter full name"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Phone or Email</Text>
          <TextInput
            style={styles.input}
              placeholderTextColor="#999"
            placeholder="Enter contact info"
            value={contact}
            onChangeText={setContact}
          />

          <Text style={styles.label}>Reason for Booking</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={reason}
              dropdownIconColor="#C85383" 
              onValueChange={setReason}
              style={styles.picker}
            >
              <Picker.Item label="Select reason" value="" color="#999"  />
              <Picker.Item label="Suspicious lump or change" value="lump"  color="#999" />
              <Picker.Item
              
                label="Routine self-check support"
                value="self-check"
              />
              <Picker.Item label="Follow-up consultation" value="follow-up"  color="#999" />
              <Picker.Item label="Worried about symptoms" value="symptoms" color="#999"  />
              <Picker.Item label="Other reason" value="other" color="#999"  />
            </Picker>
          </View>

          <Text style={styles.label}>Additional Notes</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Optional details…"
              placeholderTextColor="#999"
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          <TouchableOpacity
            style={[styles.button, busy && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={busy}
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Submit Request</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ─── success modal ───────────────────────────────────── */}
      <Modal
        visible={showDone}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDone(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Ionicons name="checkmark-circle" size={64} color="#3CB371" />
            <Text style={styles.modalTitle}>Booking received!</Text>
            <Text style={styles.modalText}>
              Our customer-support team will contact you shortly to finalize the
              details. Thank you.
            </Text>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => setShowDone(false)}
            >
              <Text style={styles.modalBtnText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ---------------- styles ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FADEEA" },

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
  // In your TextInput components, add explicit text color:
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    elevation: 2,
    color: "#333", // Ensure this exists
    // Add Android-specific text alignment
    textAlignVertical: "top", // For multiline alignment
  },
  pickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
  },
  picker: { 
    width: '100%',
    color: '#333', // Add text color for picker
  },

  button: {
    backgroundColor: "#C85383",
    padding: 15,
    borderRadius: 30,
    marginTop: 30,
    alignItems: "center",
    elevation: 2,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "700", color: "#333", marginTop: 10 },
  modalText: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginVertical: 15,
  },
  modalBtn: {
    backgroundColor: "#C85383",
    borderRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  modalBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
