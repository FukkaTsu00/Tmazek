import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, FlatList, 
  Image, TouchableOpacity, ActivityIndicator, StatusBar 
} from 'react-native';
import { getDeezerHomeData } from '../services/Deezer';
import { usePlayer } from '../context/PlayerContext';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../firebase/firebase';
import { colors } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }) {
  const [data, setData] = useState({ songs: [], artists: [], albums: [] });
  const [loading, setLoading] = useState(true);
  const { playTrack, isPlaying, currentTrack } = usePlayer();

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      const homeData = await getDeezerHomeData();
      setData(homeData);
    } catch (error) {
      console.error("Failed to load home data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        
        {/* CLEANED PREMIUM HEADER */}
        <LinearGradient colors={['#251a14', '#0F0F0F']} style={styles.headerBackground}>
          <View style={styles.headerSection}>
            <View>
              <Text style={styles.welcomeText}>Good {getTimeOfDay()}</Text>
              <Text style={styles.userName}>{auth.currentUser?.displayName || 'User'}</Text>
            </View>
            
            {/* The Unified Profile Style */}
            <TouchableOpacity 
              onPress={() => navigation.navigate('ProfileTab')} 
              style={styles.profileGlowContainer}
            >
              <LinearGradient 
                colors={[colors.primary, '#ff7e5f']} 
                style={styles.profileCircle}
              >
                <Text style={styles.profileLetter}>
                  {(auth.currentUser?.displayName || 'U').charAt(0).toUpperCase()} 
                    </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer}>
            {['Playlists', 'Podcasts', 'Moods', 'New Hits', 'Discover'].map((chip) => (
              <TouchableOpacity key={chip} style={styles.chip}>
                <Text style={styles.chipText}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </LinearGradient>

        {/* 1. TOP ARTISTS */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { marginLeft: 20 }]}>Your Favorites</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={data.artists}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.artistCard}
                onPress={() => navigation.navigate('ArtistDetails', { artistId: item.id, artistName: item.name })}
              >
                <Image source={{ uri: item.image }} style={styles.artistImage} />
                <Text style={styles.artistName} numberOfLines={1}>{item.name}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingLeft: 20 }}
          />
        </View>

        {/* 2. FEATURED ALBUMS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New for You</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={data.albums}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.albumCard}
                onPress={() => navigation.navigate('AlbumDetails', { albumId: item.id, albumName: item.title })}
              >
                <Image source={{ uri: item.image }} style={styles.albumImage} />
                <Text style={styles.albumTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.albumArtist} numberOfLines={1}>{item.artist?.name || 'Artist'}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingLeft: 20 }}
          />
        </View>

        {/* 3. TRENDING SONGS */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { marginLeft: 20 }]}>Trending Now</Text>
          <View style={styles.songsList}>
            {data.songs.map((item) => {
              const isActive = currentTrack?.id === item.id;
              return (
                <TouchableOpacity 
                  key={item.id.toString()} 
                  style={[styles.songRow, isActive && styles.activeSongRow]} 
                  onPress={() => playTrack(item)}
                >
                  <Image source={{ uri: item.image }} style={styles.songImage} />
                  <View style={styles.songInfo}>
                    <Text style={[styles.songTitle, isActive && { color: colors.primary }]} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.songSubtitle}>{item.artist}</Text>
                  </View>
                  {isActive && isPlaying ? (
                    <Ionicons name="stats-chart" size={18} color={colors.primary} />
                  ) : (
                    <Ionicons name="play-circle" size={28} color="#333" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  contentContainer: { paddingBottom: 140 }, // Space for MiniPlayer
  centered: { flex: 1, backgroundColor: '#0F0F0F', justifyContent: 'center', alignItems: 'center' },

  // Updated Header Styles
  headerBackground: { paddingTop: 60, paddingBottom: 25 },
  headerSection: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 25 
  },
  welcomeText: { color: '#888', fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  userName: { color: 'white', fontSize: 28, fontWeight: '900', marginTop: 2, letterSpacing: -0.5 },
  
  profileGlowContainer: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  profileCircle: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  profileLetter: { color: 'white', fontWeight: '900', fontSize: 18 },

  chipsContainer: { marginTop: 25, paddingLeft: 20 },
  chip: { 
    backgroundColor: '#1A1A1A', 
    paddingHorizontal: 18, 
    paddingVertical: 10, 
    borderRadius: 25, 
    marginRight: 10, 
    borderWidth: 1, 
    borderColor: '#333' 
  },
  chipText: { color: 'white', fontSize: 13, fontWeight: '700' },

  section: { marginTop: 35 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  sectionTitle: { color: 'white', fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  seeAll: { color: colors.primary, fontSize: 13, fontWeight: '800' },

  artistCard: { marginRight: 20, alignItems: 'center', width: 85 },
  artistImage: { width: 85, height: 85, borderRadius: 45, marginBottom: 10, borderWidth: 3, borderColor: '#151515' },
  artistName: { color: '#888', fontSize: 12, fontWeight: '700', textAlign: 'center' },

  albumCard: { marginRight: 18, width: 160 },
  albumImage: { width: 160, height: 160, borderRadius: 20, marginBottom: 12 },
  albumTitle: { color: 'white', fontSize: 15, fontWeight: '700' },
  albumArtist: { color: '#666', fontSize: 13, marginTop: 4 },

  songsList: { paddingHorizontal: 20 },
  songRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 18, marginBottom: 10, backgroundColor: '#151515' },
  activeSongRow: { backgroundColor: '#1C1612', borderWidth: 1, borderColor: colors.primary + '40' },
  songImage: { width: 52, height: 52, borderRadius: 12 },
  songInfo: { flex: 1, marginLeft: 15 },
  songTitle: { color: 'white', fontSize: 16, fontWeight: '700' },
  songSubtitle: { color: '#666', fontSize: 13, marginTop: 4 },
});