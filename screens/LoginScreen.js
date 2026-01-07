import { signInWithEmailAndPassword } from "firebase/auth";
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
import { auth } from "../firebase/firebase";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null); // Tracks focus for UI glow

  const login = async () => {
    if (!email || !password) {
      Alert.alert("Missing Info", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Firebase auth state listener usually handles navigation automatically
    } catch (err) {
      let msg = "Something went wrong. Please try again.";
      if (err.code === 'auth/user-not-found') msg = "No account found with this email.";
      if (err.code === 'auth/wrong-password') msg = "Incorrect password.";
      if (err.code === 'auth/invalid-email') msg = "Invalid email address.";
      Alert.alert("Login Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Background Depth */}
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
            <Text style={styles.subtitle}>Your music is waiting for you.</Text>
          </View>

          <View style={styles.form}>
            {/* Email Field */}
            <View style={[
              styles.inputWrapper, 
              focusedInput === 'email' && styles.focusedWrapper
            ]}>
              <Ionicons 
                name="mail-outline" 
                size={20} 
                color={focusedInput === 'email' ? colors.primary : '#666'} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#555"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            {/* Password Field */}
            <View style={[
              styles.inputWrapper, 
              focusedInput === 'pass' && styles.focusedWrapper
            ]}>
              <Ionicons 
                name="lock-closed-outline" 
                size={20} 
                color={focusedInput === 'pass' ? colors.primary : '#666'} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#555"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                onFocus={() => setFocusedInput('pass')}
                onBlur={() => setFocusedInput(null)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotPasswordBtn}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={login}
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
                  <Text style={styles.buttonText}>SIGN IN</Text>
                  <Ionicons name="chevron-forward" size={18} color="white" style={{marginLeft: 5}} />
                </LinearGradient>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.link}>Sign Up</Text>
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
  subtitle: { fontSize: 15, color: '#888', textAlign: 'center', marginTop: 8 },
  
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

  forgotPasswordBtn: { alignSelf: 'center', marginBottom: 25 },
  forgotPasswordText: { color: '#666', fontSize: 13, fontWeight: '600' },

  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  footerText: { color: '#666', fontSize: 14 },
  link: { color: colors.primary, fontWeight: "800", fontSize: 14, marginLeft: 8 },
});