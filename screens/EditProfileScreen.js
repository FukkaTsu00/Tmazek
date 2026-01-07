import React, { useState } from 'react';
import { 
  View, Text, TextInput, StyleSheet, TouchableOpacity, 
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView 
} from 'react-native';
import { auth } from '../firebase/firebase';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function EditProfileScreen({ navigation }) {
  const user = auth.currentUser;
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // 1. Update Display Name
      if (name.trim() !== user.displayName) {
        await updateProfile(user, { displayName: name.trim() });
      }

      // 2. Update Email
      if (email.trim() !== user.email) {
        await updateEmail(user, email.trim());
      }

      // 3. Update Password
      if (password.length > 0) {
        if (password.length < 6) throw new Error("Password must be 6+ characters");
        await updatePassword(user, password);
      }

      // 🔥 REFRESH THE USER OBJECT
      await user.reload(); 

      Alert.alert("Profile Updated", "Your changes have been saved instantly.", [
        { text: "Awesome", onPress: () => navigation.goBack() }
      ]);

    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        Alert.alert(
          "Security Action Required",
          "Changing email/password requires you to have logged in recently. Please log out and back in to verify it's you.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.content}>
          
          <View style={styles.avatarSection}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{user?.email?.charAt(0).toUpperCase()}</Text>
            </View>
            <TouchableOpacity onPress={() => Alert.alert("Coming Soon", "Image upload is coming in v2!")}>
              <Text style={styles.changePhotoText}>Edit Photo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>New Password</Text>
            <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" placeholderTextColor="#333" />
          </View>

          <TouchableOpacity onPress={handleSave} disabled={loading}>
            <LinearGradient colors={[colors.primary, '#ff7e5f']} style={styles.saveBtn}>
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.saveText}>Save Changes</Text>}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Discard Changes</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  content: { padding: 25 },
  avatarSection: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  avatarText: { color: 'white', fontSize: 30, fontWeight: 'bold' },
  changePhotoText: { color: colors.primary, marginTop: 10, fontWeight: 'bold' },
  inputBox: { marginBottom: 25 },
  label: { color: '#444', fontSize: 10, fontWeight: '900', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 },
  input: { backgroundColor: '#111', color: 'white', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#222' },
  saveBtn: { height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  saveText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  cancelBtn: { marginTop: 20, alignItems: 'center' },
  cancelText: { color: '#444', fontWeight: 'bold' }
});