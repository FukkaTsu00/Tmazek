import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAlbumDetails } from '../services/Deezer';
import { usePlayer } from '../context/PlayerContext';

export default function AlbumDetailsScreen({ route }) {
  const { albumId } = route.params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { playTrack } = usePlayer();

  useEffect(() => {
    getAlbumDetails(albumId).then(res => {
      setData(res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [albumId]);

  // Helper function to format the song correctly for the Global Player
  const handlePlay = (track) => {
    playTrack({
      ...track,
      // If the track doesn't have an image, use the album cover we already loaded
      image: track.image || data?.info?.cover_medium || data?.info?.cover_xl,
      artist: track.artist?.name || data?.info?.artist?.name || 'Unknown Artist'
    });
  };

  if (loading || !data) {
    return (
      <View style={styles.darkContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.tracks || []}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 160 }} // Space for MiniPlayer
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Image source={{ uri: data?.info?.cover_xl }} style={styles.albumArt} />
            <Text style={styles.albumName}>{String(data?.info?.title || '')}</Text>
            
            <View style={styles.artistRow}>
              {data?.info?.artist?.picture_small && (
                <Image source={{ uri: data.info.artist.picture_small }} style={styles.miniImg} />
              )}
              <Text style={styles.artistName}>
                {data?.info?.artist?.name ? String(data.info.artist.name) : 'Unknown Artist'}
              </Text>
            </View>
            
            <Text style={styles.meta}>
              Album • {data?.info?.release_date ? data.info.release_date.split('-')[0] : ''}
            </Text>

            <View style={styles.controls}>
              {/* Main Play Button for first track */}
              <TouchableOpacity 
                style={styles.mainPlay} 
                onPress={() => data?.tracks?.[0] && handlePlay(data.tracks[0])}
              >
                <Ionicons name="play" size={28} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        renderItem={({ item, index }) => (
          <TouchableOpacity 
            style={styles.trackItem} 
            onPress={() => handlePlay(item)} // Use the helper here
          >
            <Text style={styles.index}>{index + 1}</Text>
            <View style={styles.trackBody}>
              <Text style={styles.trackTitle} numberOfLines={1}>{String(item.title)}</Text>
              <Text style={styles.artistSub}>
                {item.artist?.name ? String(item.artist.name) : 'Various Artists'}
              </Text>
            </View>
            <Ionicons name="ellipsis-vertical" size={18} color="#b3b3b3" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  darkContainer: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, alignItems: 'flex-start' },
  albumArt: { width: 260, height: 260, alignSelf: 'center', marginTop: 10, borderRadius: 4 },
  albumName: { color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 20 },
  artistRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  miniImg: { width: 24, height: 24, borderRadius: 12, marginRight: 8 },
  artistName: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  meta: { color: '#b3b3b3', fontSize: 13, marginTop: 8 },
  controls: { flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: 20 },
  mainPlay: { 
    marginLeft: 'auto', backgroundColor: '#1DB954', 
    width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center',
    elevation: 5, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5
  },
  trackItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  index: { color: '#b3b3b3', width: 25, fontSize: 14 },
  trackBody: { flex: 1, marginLeft: 10 },
  trackTitle: { color: 'white', fontSize: 16, fontWeight: '500' },
  artistSub: { color: '#b3b3b3', fontSize: 13, marginTop: 2 }
});