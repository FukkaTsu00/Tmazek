import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const user = auth.currentUser;
  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => signOut(auth) }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userInitial}</Text>
        </View>
        <Text style={styles.username}>{user?.email?.split('@')[0]}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Account</Text>
        <ProfileOption icon="person-outline" title="Username" value={user?.email?.split('@')[0]} />
        <ProfileOption icon="mail-outline" title="Email" value={user?.email} />
        <ProfileOption icon="star-outline" title="Plan" value="Free" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Settings</Text>
        <ProfileOption icon="notifications-outline" title="Notifications" />
        <ProfileOption icon="lock-closed-outline" title="Privacy & Security" />
        <ProfileOption icon="help-circle-outline" title="Support" />
      </View>

      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={20} color="#ff4444" />
        <Text style={styles.signOutText}>Log out</Text>
      </TouchableOpacity>
      
      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const ProfileOption = ({ icon, title, value }) => (
  <TouchableOpacity style={styles.optionRow}>
    <Ionicons name={icon} size={22} color="#b3b3b3" style={{ width: 30 }} />
    <View style={{ flex: 1 }}>
      <Text style={styles.optionTitle}>{title}</Text>
      {value && <Text style={styles.optionValue}>{value}</Text>}
    </View>
    <Ionicons name="chevron-forward" size={18} color="#444" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { alignItems: 'center', paddingVertical: 40, borderBottomWidth: 1, borderBottomColor: '#282828' },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#1DB954', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarText: { color: 'white', fontSize: 36, fontWeight: 'bold' },
  username: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  email: { color: '#b3b3b3', fontSize: 14, marginTop: 4 },
  editBtn: { marginTop: 20, paddingHorizontal: 25, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#555' },
  editBtnText: { color: 'white', fontSize: 14, fontWeight: '600' },
  section: { marginTop: 25, paddingHorizontal: 20 },
  sectionLabel: { color: '#1DB954', fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase' },
  optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 0.5, borderBottomColor: '#282828' },
  optionTitle: { color: 'white', fontSize: 16 },
  optionValue: { color: '#666', fontSize: 13, marginTop: 2 },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 30, padding: 15, borderRadius: 12, backgroundColor: '#1e1e1e' },
  signOutText: { color: '#ff4444', fontWeight: 'bold', fontSize: 16, marginLeft: 10 },
  version: { color: '#444', textAlign: 'center', marginBottom: 40, fontSize: 12 }
});