import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { Input } from "react-native-elements";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Please enter email and password");
      return;
    }
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Login successful!");
      router.push("../user/dashboard");
    } catch (err: any) {
      Alert.alert("Login failed", err.message ?? "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* make inputs escape the keyboard */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 60 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* header */}
          <View style={styles.top}>
            <Image
              source={require("../../assets/images/whitelogo.png")}
              style={styles.logo}
            />
          </View>

          {/* title */}
          <Text style={styles.title}>Sign In</Text>

          {/* form */}
          <View style={styles.form}>
            <Text style={styles.label}>Email Address</Text>
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#C9C7C5"
              inputStyle={styles.inputText}
              inputContainerStyle={styles.inputContainer}
              containerStyle={styles.inputOuter}
              leftIcon={{
                type: "font-awesome",
                name: "envelope",
                color: "#C85383",
                size: 20,
              }}
            />

            <Text style={styles.label}>Password</Text>
            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#C9C7C5"
              inputStyle={styles.inputText}
              inputContainerStyle={styles.inputContainer}
              containerStyle={styles.inputOuter}
              leftIcon={{
                type: "font-awesome",
                name: "lock",
                color: "#C85383",
                size: 24,
              }}
              rightIcon={{
                type: "font-awesome",
                name: showPassword ? "eye-slash" : "eye",
                color: "#C85383",
                onPress: () => setShowPassword((p) => !p),
              }}
            />

            <TouchableOpacity
              style={[styles.button, isLoading && { opacity: 0.6 }]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* links */}
          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={() => router.push("./forgotPassword")}
          >
            <Text style={styles.forgot}>Forgot your password?</Text>
          </TouchableOpacity>

          <Text style={styles.bottomText}>
            Don&apos;t have an account?
            <Text
              style={styles.signUp}
              onPress={() => router.push("../Signup/signup")}
            >
              {" "}
              Sign Up.
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/* ---------- styles (unchanged) ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FADEEA" },

  top: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 280,
    backgroundColor: "#C85383",
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  logo: { width: 100, height: 100, marginTop: 50 },

  title: {
    fontSize: 30,
    fontWeight: "900",
    marginTop: 30,
    textAlign: "center",
    color: "#C85383",
  },

  form: { paddingHorizontal: 10, marginTop: 30 },

  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#C85383",
    marginLeft: 20,
    fontWeight: "bold",
  },
  inputOuter: { marginBottom: 0 },
  inputContainer: {
    width: "100%",
    height: 49,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 12,
    borderBottomWidth: 0,
    elevation: 3,
    paddingLeft: 20,
  },
  inputText: { color: "#000", fontSize: 16 },

  button: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "80%",
    height: 60,
    borderRadius: 1000,
    backgroundColor: "#C85383",
    marginTop: 20,
  },
  buttonText: { fontSize: 16, color: "#fff", fontWeight: "bold" },

  forgot: {
    color: "#C85383",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  bottomText: {
    marginTop: 20,
    width: "100%",
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  signUp: { fontSize: 16, color: "#C85383" },
});
