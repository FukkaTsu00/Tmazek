import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { colors } from '../theme/colors';

// SCREENS
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import LibraryScreen from '../screens/LibraryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import PlaylistDetailsScreen from '../screens/PlaylistDetailsScreen';
import AlbumDetailsScreen from '../screens/AlbumDetailsScreen'; // Added
import ArtistDetailsScreen from '../screens/ArtistDetailsScreen'; // Added
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MiniPlayer from '../component/MiniPlayer';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// --- STACK DEFINITIONS ---

// 1. Home Stack (Handles Album/Artist details from Home)
const HomeStack = createNativeStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="AlbumDetails" component={AlbumDetailsScreen} />
      <HomeStack.Screen name="ArtistDetails" component={ArtistDetailsScreen} />
    </HomeStack.Navigator>
  );
}

// 2. Search Stack (Handles Album/Artist details from Search)
const SearchStack = createNativeStackNavigator();
function SearchStackScreen() {
  return (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name="SearchMain" component={SearchScreen} />
      <SearchStack.Screen name="AlbumDetails" component={AlbumDetailsScreen} />
      <SearchStack.Screen name="ArtistDetails" component={ArtistDetailsScreen} />
    </SearchStack.Navigator>
  );
}

// 3. Library Stack
const LibStack = createNativeStackNavigator();
function LibraryStackScreen() {
  return (
    <LibStack.Navigator screenOptions={{ headerShown: false }}>
      <LibStack.Screen name="LibraryMain" component={LibraryScreen} />
      <LibStack.Screen name="PlaylistDetails" component={PlaylistDetailsScreen} />
    </LibStack.Navigator>
  );
}

// 4. Profile Stack
const ProfStack = createNativeStackNavigator();
function ProfileStackScreen() {
  return (
    <ProfStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfStack.Screen name="EditProfile" component={EditProfileScreen} />
    </ProfStack.Navigator>
  );
}

// --- MAIN TAB NAVIGATOR ---

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 90 : 70;

function MainTabs() {
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: '#888',
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
        })}
      >
        <Tab.Screen name="HomeTab" component={HomeStackScreen} options={{ title: 'Home' }} />
        <Tab.Screen name="SearchTab" component={SearchStackScreen} options={{ title: 'Search' }} />
        <Tab.Screen name="LibraryTab" component={LibraryStackScreen} options={{ title: 'Library' }} />
        <Tab.Screen name="ProfileTab" component={ProfileStackScreen} options={{ title: 'Profile' }} />
      </Tab.Navigator>

      <View style={[styles.playerFloating, { bottom: TAB_BAR_HEIGHT + 5 }]}>
        <MiniPlayer />
      </View>
    </View>
  );
}

// --- ROOT NAVIGATOR ---

export default function AppNavigator() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="MainApp" component={MainTabs} />
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
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  playerFloating: { position: 'absolute', left: 8, right: 8, zIndex: 9999 },
});