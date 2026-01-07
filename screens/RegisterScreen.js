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
import { colors } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(null); // Tracks which input is focused

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
      navigation.navigate("Login");
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Dynamic Background Gradient */}
      <LinearGradient colors={['#1e140f', '#0F0F0F']} style={StyleSheet.absoluteFill} />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Ionicons name="musical-notes" size={42} color="white" />
            </View>
            <Text style={styles.appTitle}>TuneDive</Text>
            <Text style={styles.subtitle}>Join the community and start your journey</Text>
          </View>

          <View style={styles.form}>
            {/* Email Input */}
            <View style={[styles.inputWrapper, isFocused === 'email' && styles.focusedWrapper]}>
              <Ionicons name="mail-outline" size={20} color={isFocused === 'email' ? colors.primary : '#666'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#555"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => setIsFocused('email')}
                onBlur={() => setIsFocused(null)}
              />
            </View>

            {/* Password Input */}
            <View style={[styles.inputWrapper, isFocused === 'pass' && styles.focusedWrapper]}>
              <Ionicons name="lock-closed-outline" size={20} color={isFocused === 'pass' ? colors.primary : '#666'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#555"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                onFocus={() => setIsFocused('pass')}
                onBlur={() => setIsFocused(null)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Input */}
            <View style={[styles.inputWrapper, isFocused === 'confirm' && styles.focusedWrapper]}>
              <Ionicons name="shield-checkmark-outline" size={20} color={isFocused === 'confirm' ? colors.primary : '#666'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#555"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                onFocus={() => setIsFocused('confirm')}
                onBlur={() => setIsFocused(null)}
              />
            </View>

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={register} 
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <LinearGradient 
                  colors={[colors.primary, '#ff7e5f']} 
                  start={{x: 0, y: 0}} 
                  end={{x: 1, y: 0}}
                  style={styles.btnGradient}
                >
                  <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
                  <Ionicons name="arrow-forward" size={18} color="white" style={{marginLeft: 10}} />
                </LinearGradient>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  keyboardView: { flex: 1, justifyContent: "center", paddingHorizontal: 30 },
  header: { marginBottom: 50, alignItems: 'center' },
  logoCircle: { 
    width: 80, height: 80, borderRadius: 40, 
    backgroundColor: colors.primary, justifyContent: 'center', 
    alignItems: 'center', marginBottom: 20,
    shadowColor: colors.primary, shadowOpacity: 0.5, shadowRadius: 15, elevation: 10
  },
  appTitle: { color: 'white', fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  subtitle: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 8, paddingHorizontal: 20 },
  
  form: { marginBottom: 20 },
  inputWrapper: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: '#151515', 
    borderRadius: 15, 
    marginBottom: 15, 
    paddingHorizontal: 20, 
    height: 65,
    borderWidth: 1,
    borderColor: '#222'
  },
  focusedWrapper: {
    borderColor: colors.primary,
    backgroundColor: '#1A1614',
  },
  inputIcon: { marginRight: 15 },
  input: { flex: 1, color: 'white', fontSize: 16 },

  button: { 
    height: 60, 
    borderRadius: 15, 
    marginTop: 15,
    overflow: 'hidden',
    shadowColor: colors.primary, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5
  },
  btnGradient: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: 'white', fontSize: 15, fontWeight: "900", letterSpacing: 1 },

  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  footerText: { color: '#666', fontSize: 14 },
  link: { color: colors.primary, fontWeight: "800", fontSize: 14, marginLeft: 8 },
});