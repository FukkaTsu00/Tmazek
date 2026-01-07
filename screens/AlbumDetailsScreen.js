import React, { useEffect, useState } from 'react';
import { 
  View, Text, Image, StyleSheet, FlatList, 
  TouchableOpacity, ActivityIndicator, StatusBar, ImageBackground, Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; 
import { getAlbumDetails } from '../services/Deezer';
import { usePlayer } from '../context/PlayerContext';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function AlbumDetailsScreen({ route, navigation }) {
  const { albumId } = route.params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  useEffect(() => {
    getAlbumDetails(albumId).then(res => {
      setData(res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [albumId]);

  const handlePlay = (track) => {
    playTrack({
      ...track,
      image: track.image || data?.info?.cover_medium || data?.info?.cover_xl,
      artist: track.artist?.name || data?.info?.artist?.name || 'Unknown Artist'
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
            <ImageBackground 
              source={{ uri: data?.info?.cover_xl }} 
              style={styles.heroImage}
              blurRadius={15}
            >
              <LinearGradient
                colors={['rgba(15,15,15,0.4)', 'rgba(15,15,15,0.8)', '#0F0F0F']}
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

              <View style={styles.heroContent}>
                <View style={styles.artShadow}>
                  <Image source={{ uri: data?.info?.cover_xl }} style={styles.mainArt} />
                </View>
                <Text style={styles.albumTitle} numberOfLines={2}>{data?.info?.title}</Text>
                
                <View style={styles.infoBadgeRow}>
                  <Text style={styles.artistNameHighlight}>{data?.info?.artist?.name}</Text>
                  <View style={styles.badgeSeparator} />
                  <Text style={styles.yearText}>{data?.info?.release_date?.split('-')[0]}</Text>
                </View>
              </View>
            </ImageBackground>

            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.circleBtn}>
                <Ionicons name="heart-outline" size={22} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.playLarge}
                onPress={() => data?.tracks?.[0] && handlePlay(data.tracks[0])}
              >
                <Ionicons name="play" size={32} color="white" style={{marginLeft: 4}} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.circleBtn}>
                <Ionicons name="repeat-outline" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        renderItem={({ item, index }) => {
          const isActive = currentTrack?.id === item.id;
          return (
            <TouchableOpacity 
              style={[styles.trackCard, isActive && styles.activeCard]} 
              onPress={() => handlePlay(item)}
            >
              <View style={styles.trackIndexBox}>
                {isActive && isPlaying ? (
                   <Ionicons name="volume-medium" size={16} color={colors.primary} />
                ) : (
                  <Text style={[styles.indexText, isActive && { color: colors.primary }]}>
                    {index + 1}
                  </Text>
                )}
              </View>
              
              <View style={styles.trackInfo}>
                <Text style={[styles.trackTitle, isActive && { color: colors.primary }]} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.trackArtist}>{item.artist?.name || data?.info?.artist?.name}</Text>
              </View>

              <Text style={styles.durationText}>
                {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
              </Text>
              
              <TouchableOpacity style={styles.itemMenu}>
                <Ionicons name="ellipsis-horizontal" size={18} color="#444" />
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
  
  heroImage: { width: '100%', height: 460, justifyContent: 'flex-end' },
  gradient: { ...StyleSheet.absoluteFillObject },
  
  backButton: { position: 'absolute', top: 60, left: 20, zIndex: 10 },
  backCircle: { 
    width: 40, height: 40, borderRadius: 20, 
    backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' 
  },
  
  heroContent: { alignItems: 'center', paddingBottom: 40 },
  artShadow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  mainArt: { width: 220, height: 220, borderRadius: 12 },
  
  albumTitle: { 
    color: 'white', fontSize: 28, fontWeight: '900', 
    textAlign: 'center', paddingHorizontal: 30, marginTop: 25,
    letterSpacing: -0.5
  },
  infoBadgeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  artistNameHighlight: { color: colors.primary, fontWeight: '700', fontSize: 16 },
  badgeSeparator: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#444', marginHorizontal: 12 },
  yearText: { color: '#888', fontSize: 14, fontWeight: '500' },

  actionContainer: { 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', 
    marginTop: -35, marginBottom: 25 
  },
  playLarge: { 
    backgroundColor: colors.primary, width: 70, height: 70, borderRadius: 35, 
    justifyContent: 'center', alignItems: 'center', marginHorizontal: 25,
    shadowColor: colors.primary, shadowOpacity: 0.6, shadowRadius: 15, elevation: 12
  },
  circleBtn: { 
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#181818', 
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#252525' 
  },

  trackCard: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: '#141414', marginHorizontal: 16, 
    marginBottom: 8, padding: 14, borderRadius: 12,
  },
  activeCard: { backgroundColor: '#1C1612', borderWidth: 1, borderColor: colors.primary + '30' },
  trackIndexBox: { width: 30, alignItems: 'center' },
  indexText: { color: '#444', fontWeight: 'bold', fontSize: 13 },
  trackInfo: { flex: 1, marginLeft: 12 },
  trackTitle: { color: 'white', fontSize: 15, fontWeight: '600' },
  trackArtist: { color: '#777', fontSize: 12, marginTop: 3 },
  durationText: { color: '#555', fontSize: 12, marginRight: 10, fontWeight: '500' },
  itemMenu: { padding: 4 }
});