import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebase/firebase";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const register = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Missing Info", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak Password", "Password should be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Account created! You can now log in.");
      navigation.navigate("Login"); // Send user to login after registration
    } catch (err) {
      let msg = err.message;
      if (err.code === 'auth/email-already-in-use') msg = "That email is already in use.";
      if (err.code === 'auth/invalid-email') msg = "The email address is invalid.";
      if (err.code === 'auth/weak-password') msg = "Password is too weak.";
      Alert.alert("Registration Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Create Account.</Text>
            <Text style={styles.subtitle}>Join us and start tracking your shows.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#64748b"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#64748b"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#94a3b8" 
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#64748b"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </View>

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={register} 
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#020617" /> : <Text style={styles.buttonText}>Sign Up</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}> Login</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },
  keyboardView: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  header: { marginBottom: 40 },
  title: { fontSize: 32, fontWeight: "800", color: "#f8fafc", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#94a3b8" },
  form: { marginBottom: 24 },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#1e293b", borderRadius: 12, marginBottom: 16, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: "#334155" },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: "#f8fafc", fontSize: 16, height: "100%" },
  button: { backgroundColor: "#22c55e", height: 56, borderRadius: 12, justifyContent: "center", alignItems: "center", marginTop: 10 },
  buttonDisabled: { backgroundColor: "#166534", opacity: 0.7 },
  buttonText: { color: "#020617", fontSize: 16, fontWeight: "bold" },
  footer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 20 },
  footerText: { color: "#94a3b8", fontSize: 14 },
  link: { color: "#22c55e", fontWeight: "bold", fontSize: 14, marginLeft: 4 },
});
