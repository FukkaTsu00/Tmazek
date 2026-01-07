import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  ScrollView, Alert, StatusBar, ActivityIndicator 
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    if (isFocused) {
      setUser(auth.currentUser);
    }
  }, [isFocused]);

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const displayName = user.displayName || user.email?.split('@')[0];
  const userInitial = displayName.charAt(0).toUpperCase();

  // Helper for "Coming Soon" features
  const showComingSoon = (feature) => {
    Alert.alert("Coming Soon", `${feature} will be available in the next update!`);
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => signOut(auth) }
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        
        {/* PROFILE HEADER */}
        <LinearGradient colors={['#2c1a12', '#0F0F0F']} style={styles.header}>
          <View style={styles.avatarGlow}>
            <LinearGradient colors={[colors.primary, '#ff7e5f']} style={styles.avatar}>
               <Text style={styles.avatarText}>{userInitial}</Text>
            </LinearGradient>
          </View>
          
          <Text style={styles.username}>{displayName}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>FREE PLAN</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.editBtn} 
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* FEATURE SECTION 1: ACCOUNT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <MenuOption icon="star-outline" title="Upgrade to Premium" onPress={() => showComingSoon("Premium Plans")} color={colors.primary} />
          <MenuOption icon="time-outline" title="Listening History" onPress={() => showComingSoon("History")} />
          <MenuOption icon="download-outline" title="Downloads" onPress={() => showComingSoon("Offline Mode")} />
        </View>

        {/* FEATURE SECTION 2: SOCIAL & SETTINGS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings & Social</Text>
          <MenuOption icon="people-outline" title="Find Friends" onPress={() => showComingSoon("Social Search")} />
          <MenuOption icon="notifications-outline" title="Notifications" onPress={() => showComingSoon("Notification Settings")} />
          <MenuOption icon="settings-outline" title="App Settings" onPress={() => showComingSoon("Advanced Settings")} />
          <MenuOption icon="help-circle-outline" title="Support" onPress={() => showComingSoon("Customer Support")} />
        </View>

        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color="#FF5252" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
        
      </ScrollView>
    </View>
  );
}

// Reusable Menu Component
const MenuOption = ({ icon, title, onPress, color = "#fff" }) => (
  <TouchableOpacity style={styles.optionRow} onPress={onPress}>
    <View style={styles.optionLeft}>
      <Ionicons name={icon} size={22} color={color === "#fff" ? "#888" : color} />
      <Text style={[styles.optionText, { color }]}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color="#333" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  header: { alignItems: 'center', paddingTop: 80, paddingBottom: 30, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  avatarGlow: { shadowColor: colors.primary, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10, marginBottom: 15 },
  avatar: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: 'white', fontSize: 36, fontWeight: '900' },
  username: { color: 'white', fontSize: 24, fontWeight: '900' },
  badge: { backgroundColor: '#222', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 8 },
  badgeText: { color: '#888', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  editBtn: { marginTop: 20, backgroundColor: '#1A1A1A', paddingHorizontal: 25, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#333' },
  editBtnText: { color: 'white', fontSize: 13, fontWeight: '700' },
  
  section: { marginTop: 25, paddingHorizontal: 20 },
  sectionTitle: { color: '#444', fontSize: 12, fontWeight: '900', textTransform: 'uppercase', marginBottom: 10, marginLeft: 5 },
  optionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#121212', padding: 16, borderRadius: 15, marginBottom: 8 },
  optionLeft: { flexDirection: 'row', alignItems: 'center' },
  optionText: { marginLeft: 15, fontSize: 15, fontWeight: '600' },

  signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30, height: 60, marginHorizontal: 20, borderRadius: 20, backgroundColor: '#1A0B0B', marginBottom: 20 },
  signOutText: { color: '#FF5252', fontWeight: '800', marginLeft: 10 }
});