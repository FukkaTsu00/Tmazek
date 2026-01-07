import React, { useEffect, useState } from 'react';
import { 
  View, Text, Image, StyleSheet, FlatList, 
  TouchableOpacity, ActivityIndicator, StatusBar, ImageBackground, Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getArtistDetails } from '../services/Deezer';
import { usePlayer } from '../context/PlayerContext';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function ArtistDetailsScreen({ route, navigation }) {
  const { artistId, artistName } = route.params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  useEffect(() => {
    getArtistDetails(artistId).then(res => {
      setData(res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [artistId]);

  const handlePlay = (track) => {
    playTrack({
      ...track,
      image: track.album?.cover_medium || track.image || data?.info?.picture_medium,
      artist: track.artist?.name || String(artistName)
    });
  };

  if (loading || !data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <FlatList
        data={data?.tracks || []}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View>
            {/* CINEMATIC ARTIST BANNER */}
            <ImageBackground source={{ uri: data?.info?.picture_xl }} style={styles.banner}>
              <LinearGradient
                colors={['rgba(15,15,15,0.2)', 'rgba(15,15,15,0.6)', '#0F0F0F']}
                style={styles.gradient}
              />
              
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
              >
                <View style={styles.backCircle}>
                  <Ionicons name="chevron-back" size={24} color="white" />
                </View>
              </TouchableOpacity>

              <View style={styles.bannerContent}>
                <Text style={styles.artistTitle} numberOfLines={1}>{String(artistName)}</Text>
                <View style={styles.statsRow}>
                  <Ionicons name="people" size={16} color={colors.primary} />
                  <Text style={styles.fanCount}>
                    {data?.info?.nb_fan ? data.info.nb_fan.toLocaleString() : '0'} fans
                  </Text>
                </View>
              </View>
            </ImageBackground>

            {/* FLOATING ACTION BAR */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.secondaryBtn}>
                <Text style={styles.followText}>Follow</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.mainPlayBtn}
                onPress={() => data?.tracks?.[0] && handlePlay(data.tracks[0])}
              >
                <Ionicons name="play" size={32} color="white" style={{ marginLeft: 4 }} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryBtn}>
                <Ionicons name="shuffle" size={22} color="white" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Popular Tracks</Text>
          </View>
        )}
        renderItem={({ item, index }) => {
          const isActive = currentTrack?.id === item.id;
          return (
            <TouchableOpacity 
              style={[styles.trackCard, isActive && styles.activeCard]} 
              onPress={() => handlePlay(item)}
            >
              <Image source={{ uri: item.album?.cover_small }} style={styles.trackImg} />
              
              <View style={styles.trackInfo}>
                <Text style={[styles.trackTitle, isActive && { color: colors.primary }]} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.trackAlbumText}>{item.album?.title}</Text>
              </View>

              {isActive && isPlaying ? (
                 <Ionicons name="stats-chart" size={16} color={colors.primary} style={{ marginRight: 15 }} />
              ) : (
                <Text style={styles.durationText}>
                   {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
                </Text>
              )}
              
              <TouchableOpacity style={styles.menuIcon}>
                <Ionicons name="ellipsis-vertical" size={18} color="#444" />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  loadingContainer: { flex: 1, backgroundColor: '#0F0F0F', justifyContent: 'center', alignItems: 'center' },
  
  // Banner Styles
  banner: { width: '100%', height: 380, justifyContent: 'flex-end' },
  gradient: { ...StyleSheet.absoluteFillObject },
  backButton: { position: 'absolute', top: 60, left: 20, zIndex: 10 },
  backCircle: { 
    width: 40, height: 40, borderRadius: 20, 
    backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' 
  },
  bannerContent: { paddingHorizontal: 20, paddingBottom: 45 },
  artistTitle: { 
    color: 'white', fontSize: 48, fontWeight: '900', 
    letterSpacing: -1.5, marginBottom: 5 
  },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  fanCount: { color: colors.primary, marginLeft: 8, fontSize: 14, fontWeight: '600' },

  // Action Row
  actionRow: { 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', 
    marginTop: -35, marginBottom: 10 
  },
  mainPlayBtn: { 
    backgroundColor: colors.primary, width: 70, height: 70, borderRadius: 35, 
    justifyContent: 'center', alignItems: 'center', marginHorizontal: 25,
    shadowColor: colors.primary, shadowOpacity: 0.5, shadowRadius: 15, elevation: 12
  },
  secondaryBtn: { 
    width: 90, height: 44, borderRadius: 22, backgroundColor: '#181818', 
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#333' 
  },
  followText: { color: 'white', fontWeight: 'bold', fontSize: 13 },

  sectionTitle: { 
    color: 'white', fontSize: 22, fontWeight: 'bold', 
    marginHorizontal: 20, marginTop: 30, marginBottom: 15 
  },

  // Track Card Styles
  trackCard: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: '#141414', marginHorizontal: 16, 
    marginBottom: 8, padding: 10, borderRadius: 12,
  },
  activeCard: { backgroundColor: '#1C1612', borderWidth: 1, borderColor: colors.primary + '30' },
  trackImg: { width: 48, height: 48, borderRadius: 8 },
  trackInfo: { flex: 1, marginLeft: 15 },
  trackTitle: { color: 'white', fontSize: 15, fontWeight: '600', marginBottom: 3 },
  trackAlbumText: { color: '#666', fontSize: 12 },
  durationText: { color: '#444', fontSize: 12, marginRight: 15 },
  menuIcon: { padding: 4 }
});