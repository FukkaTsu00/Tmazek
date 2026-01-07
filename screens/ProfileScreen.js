import React from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  ScrollView, Alert, StatusBar, Dimensions 
} from 'react-native';
import { auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        
        {/* ENHANCED HEADER WITH GRADIENT BACKGROUND */}
        <LinearGradient colors={['#251a14', '#0F0F0F']} style={styles.header}>
          <View style={styles.avatarGlow}>
            <LinearGradient colors={[colors.primary, '#ff7e5f']} style={styles.avatar}>
              <Text style={styles.avatarText}>{userInitial}</Text>
            </LinearGradient>
          </View>
          
          <Text style={styles.username}>{user?.email?.split('@')[0]}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          
          <TouchableOpacity style={styles.editBtn}>
            <LinearGradient 
              colors={['#1A1A1A', '#121212']} 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 1}} 
              style={styles.editBtnGradient}
            >
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>

        {/* ACCOUNT SECTION CARD */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Account</Text>
          <ProfileOption icon="person-outline" title="Username" value={user?.email?.split('@')[0]} />
          <ProfileOption icon="mail-outline" title="Email" value={user?.email} />
          <ProfileOption icon="star-outline" title="Subscription" value="Sunset Premium" highlight />
        </View>

        {/* SETTINGS SECTION CARD */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Settings</Text>
          <ProfileOption icon="notifications-outline" title="Notifications" />
          <ProfileOption icon="lock-closed-outline" title="Privacy & Security" />
          <ProfileOption icon="cloud-download-outline" title="Storage & Cache" />
          <ProfileOption icon="help-circle-outline" title="Support Center" isLast />
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Ionicons name="log-out" size={20} color="#FF5252" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.version}>v1.0.4 • Sunset Orange Mobile</Text>
      </ScrollView>
    </View>
  );
}

const ProfileOption = ({ icon, title, value, highlight, isLast }) => (
  <TouchableOpacity style={[styles.optionRow, isLast && { borderBottomWidth: 0 }]}>
    <View style={styles.iconContainer}>
      <Ionicons name={icon} size={20} color={highlight ? colors.primary : '#888'} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.optionTitle}>{title}</Text>
      {value && <Text style={[styles.optionValue, highlight && { color: colors.primary }]}>{value}</Text>}
    </View>
    <Ionicons name="chevron-forward" size={16} color="#333" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  header: { 
    alignItems: 'center', 
    paddingTop: 80, 
    paddingBottom: 40, 
    borderBottomLeftRadius: 40, 
    borderBottomRightRadius: 40 
  },
  avatarGlow: {
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 15
  },
  avatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  avatarText: { color: 'white', fontSize: 40, fontWeight: '900' },
  username: { color: 'white', fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  email: { color: '#666', fontSize: 14, marginTop: 4, fontWeight: '500' },
  
  editBtn: { marginTop: 20, borderRadius: 25, overflow: 'hidden' },
  editBtnGradient: { 
    paddingHorizontal: 30, 
    paddingVertical: 12, 
    borderWidth: 1, 
    borderColor: '#333' 
  },
  editBtnText: { color: 'white', fontSize: 14, fontWeight: '700' },

  card: { 
    backgroundColor: '#151515', 
    marginHorizontal: 20, 
    marginTop: 25, 
    borderRadius: 24, 
    padding: 20,
    borderWidth: 1,
    borderColor: '#222'
  },
  sectionLabel: { 
    color: '#444', 
    fontSize: 12, 
    fontWeight: '900', 
    letterSpacing: 1.5, 
    marginBottom: 15, 
    textTransform: 'uppercase' 
  },

  optionRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#1A1A1A' 
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  optionTitle: { color: 'white', fontSize: 16, fontWeight: '600' },
  optionValue: { color: '#666', fontSize: 13, marginTop: 2 },

  signOutBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 40,
    marginHorizontal: 20,
    height: 60,
    borderRadius: 20, 
    backgroundColor: '#1A1010',
    borderWidth: 1,
    borderColor: '#3D1515'
  },
  signOutText: { color: '#FF5252', fontWeight: '800', fontSize: 16, marginLeft: 10 },
  version: { color: '#333', textAlign: 'center', marginTop: 25, fontSize: 12, fontWeight: '600' }
});