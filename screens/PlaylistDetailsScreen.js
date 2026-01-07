import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, Image, TouchableOpacity, 
  StyleSheet, StatusBar, Dimensions 
} from 'react-native';
import { db, auth } from '../firebase/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { usePlayer } from '../context/PlayerContext';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function PlaylistDetailsScreen({ route, navigation }) {
  const [playlist, setPlaylist] = useState(null);
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const { playlistId } = route.params;

  useEffect(() => {
    const docRef = doc(db, 'users', auth.currentUser.uid, 'playlists', playlistId);
    const unsubscribe = onSnapshot(docRef, (d) => {
      if (d.exists()) setPlaylist(d.data());
    });
    return () => unsubscribe();
  }, [playlistId]);

  if (!playlist) return null;

  const isLikedSongs = playlistId === 'liked_songs';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" transparent />
      
      <FlatList 
        data={playlist.songs || []}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View>
            {/* ENHANCED HEADER SECTION */}
            <LinearGradient
              colors={isLikedSongs ? [colors.primary, '#633971', '#0F0F0F'] : ['#252525', '#1A1A1A', '#0F0F0F']}
              style={styles.header}
            >
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="chevron-back" size={28} color="white" />
              </TouchableOpacity>

              <View style={styles.artContainer}>
                <LinearGradient
                  colors={isLikedSongs ? ['#A569BD', colors.primary] : ['#444', '#222']}
                  style={styles.artPlaceholder}
                >
                  <Ionicons name={isLikedSongs ? "heart" : "musical-notes"} size={64} color="white" />
                </LinearGradient>
              </View>

              <Text style={styles.headerTitle}>{playlist.name}</Text>
              <Text style={styles.subtitle}>{playlist.songs?.length || 0} Tracks • Created for You</Text>

              <View style={styles.actionRow}>
                <TouchableOpacity 
                  style={styles.playAllBtn}
                  onPress={() => playlist.songs?.[0] && playTrack(playlist.songs[0])}
                >
                  <Ionicons name="play" size={24} color="white" />
                  <Text style={styles.playAllText}>PLAY ALL</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.addBtn} 
                  onPress={() => navigation.navigate('SearchTab')}
                >
                  <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        )}
        renderItem={({item}) => {
          const isActive = currentTrack?.id === item.id;
          return (
            <TouchableOpacity 
              style={[styles.trackCard, isActive && styles.activeCard]} 
              onPress={() => {
                if (item.preview) {
                  playTrack(item);
                } else {
                  alert("Playback unavailable for this track.");
                }
              }}
            >
              <Image source={{uri: item.image}} style={styles.trackImg} />
              <View style={styles.songInfo}>
                <Text style={[styles.songTitle, isActive && { color: colors.primary }]} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.songArtist} numberOfLines={1}>{item.artist}</Text>
              </View>

              {isActive && isPlaying ? (
                <Ionicons name="stats-chart" size={18} color={colors.primary} style={{marginRight: 10}} />
              ) : (
                <Ionicons name="play-circle-outline" size={24} color="#444" style={{marginRight: 10}} />
              )}
              
              <TouchableOpacity>
                <Ionicons name="ellipsis-vertical" size={18} color="#333" />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="musical-notes-outline" size={80} color="#222" />
            <Text style={styles.emptyText}>This playlist is empty</Text>
            <TouchableOpacity 
              style={styles.emptyAddBtn}
              onPress={() => navigation.navigate('SearchTab')}
            >
              <Text style={styles.emptyAddText}>Find Songs</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20 },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
  
  artContainer: {
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  artPlaceholder: { 
    width: 180, 
    height: 180, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  
  headerTitle: { color: 'white', fontSize: 32, fontWeight: '900', marginTop: 20, letterSpacing: -1 },
  subtitle: { color: '#aaa', fontSize: 14, marginTop: 5, fontWeight: '500' },
  
  actionRow: { flexDirection: 'row', alignItems: 'center', marginTop: 25 },
  playAllBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.primary, 
    paddingHorizontal: 30, 
    paddingVertical: 12, 
    borderRadius: 30,
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5
  },
  playAllText: { color: 'white', marginLeft: 10, fontWeight: '900', letterSpacing: 1 },
  addBtn: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginLeft: 15
  },

  trackCard: { 
    flexDirection: 'row', 
    padding: 12, 
    alignItems: 'center', 
    backgroundColor: '#151515', 
    marginHorizontal: 16, 
    borderRadius: 16, 
    marginBottom: 8 
  },
  activeCard: { backgroundColor: '#1C1612', borderWidth: 1, borderColor: colors.primary + '30' },
  trackImg: { width: 50, height: 50, borderRadius: 10, marginRight: 15 },
  songInfo: { flex: 1 },
  songTitle: { color: 'white', fontWeight: '700', fontSize: 16 },
  songArtist: { color: '#666', fontSize: 13, marginTop: 2 },

  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#444', fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  emptyAddBtn: { marginTop: 15, borderBottomWidth: 1, borderBottomColor: colors.primary },
  emptyAddText: { color: colors.primary, fontSize: 16, fontWeight: '600' }
});