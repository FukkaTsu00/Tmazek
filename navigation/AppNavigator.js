import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { colors } from '../theme/colors';

// Screens
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import LibraryScreen from '../screens/LibraryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ArtistDetailsScreen from '../screens/ArtistDetailsScreen';
import AlbumDetailsScreen from '../screens/AlbumDetailsScreen';
import PlaylistDetailsScreen from '../screens/PlaylistDetailsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MiniPlayer from '../component/MiniPlayer';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 90 : 70;

const stackOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: 'bold' },
};

const SharedScreens = (Stack) => [
  <Stack.Screen key="Artist" name="ArtistDetails" component={ArtistDetailsScreen} options={({ route }) => ({ title: route.params.artistName })} />,
  <Stack.Screen key="Album" name="AlbumDetails" component={AlbumDetailsScreen} options={({ route }) => ({ title: route.params.albumName })} />,
  <Stack.Screen key="Playlist" name="PlaylistDetails" component={PlaylistDetailsScreen} options={({ route }) => ({ title: route.params.playlistName })} />,
];

function HomeStack({ navigation }) {
  const userInitial = auth.currentUser?.email?.charAt(0).toUpperCase() || 'U';
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen} 
        options={{ 
          headerTitle: "Home",
          headerLeft: () => (
            <TouchableOpacity style={styles.headerIconLeft} onPress={() => navigation.navigate('ProfileTab')}>
              <View style={styles.profileCircle}><Text style={styles.profileLetter}>{userInitial}</Text></View>
            </TouchableOpacity>
          ),
        }} 
      />
      {SharedScreens(Stack)}
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="SearchMain" component={SearchScreen} options={{ headerShown: false }} />
      {SharedScreens(Stack)}
    </Stack.Navigator>
  );
}

function LibraryStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="LibraryMain" component={LibraryScreen} options={{ title: 'Your Library' }} />
      {SharedScreens(Stack)}
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tab.Navigator screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { 
          height: TAB_BAR_HEIGHT,
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
        },
        tabBarBackground: () => (
          <BlurView tint="dark" intensity={95} style={StyleSheet.absoluteFill} />
        ),
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'SearchTab') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'LibraryTab') iconName = focused ? 'library' : 'library-outline';
          else if (route.name === 'ProfileTab') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}>
        <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
        <Tab.Screen name="SearchTab" component={SearchStack} options={{ title: 'Search' }} />
        <Tab.Screen name="LibraryTab" component={LibraryStack} options={{ title: 'Library' }} />
        <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Profile' }} />
      </Tab.Navigator>

      <View style={[styles.playerFloating, { bottom: TAB_BAR_HEIGHT + 5 }]}>
        <MiniPlayer />
      </View>
    </View>
  );
}

export default function AppNavigator() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); });
  }, []);

  if (loading) return <View style={styles.centered}><ActivityIndicator color={colors.primary} /></View>;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="App" component={MainTabs} />
      ) : (
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', backgroundColor: '#000' },
  playerFloating: { position: 'absolute', left: 8, right: 8, zIndex: 9999 },
  headerIconLeft: { marginLeft: 15 },
  profileCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  profileLetter: { color: 'white', fontSize: 14, fontWeight: 'bold' },
});