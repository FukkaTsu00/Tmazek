import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getArtistDetails } from '../services/Deezer';
import { usePlayer } from '../context/PlayerContext';

export default function ArtistDetailsScreen({ route }) {
  const { artistId, artistName } = route.params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { playTrack } = usePlayer();

  useEffect(() => {
    getArtistDetails(artistId).then(res => {
      setData(res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [artistId]);

  // Helper to ensure the track object has the required fields for the MiniPlayer
  const handlePlay = (track) => {
    playTrack({
      ...track,
      // Map Deezer's nested album cover to the 'image' field the player uses
      image: track.album?.cover_medium || track.image || data?.info?.picture_medium,
      artist: track.artist?.name || String(artistName)
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
        // Extra padding at bottom so the last song isn't covered by the bar
        contentContainerStyle={{ paddingBottom: 160 }}
        ListHeaderComponent={() => (
          <View>
            <Image source={{ uri: data?.info?.picture_xl }} style={styles.banner} />
            <View style={styles.overlay}>
              <Text style={styles.artistTitle}>{String(artistName)}</Text>
              <TouchableOpacity 
                style={styles.playBtn} 
                onPress={() => data?.tracks?.[0] && handlePlay(data.tracks[0])}
              >
                <Ionicons name="play" size={28} color="black" />
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionTitle}>Popular Tracks</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.trackRow} onPress={() => handlePlay(item)}>
            <Image source={{ uri: item.album?.cover_small }} style={styles.trackImg} />
            <View style={styles.trackInfo}>
              <Text style={styles.trackTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.trackMeta}>
                {item.artist?.name ? item.artist.name : String(artistName)}
              </Text>
            </View>
            <Ionicons name="ellipsis-horizontal" size={20} color="#b3b3b3" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  darkContainer: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
  banner: { width: '100%', height: 300 },
  overlay: { 
    position: 'absolute', top: 0, left: 0, right: 0, height: 300, 
    backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end', padding: 20 
  },
  artistTitle: { color: 'white', fontSize: 42, fontWeight: 'bold' },
  playBtn: { 
    position: 'absolute', right: 20, bottom: -28, backgroundColor: '#1DB954', 
    width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center',
    elevation: 8, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5
  },
  sectionTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', margin: 20, marginTop: 45 },
  trackRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 18 },
  trackImg: { width: 48, height: 48, borderRadius: 4 },
  trackInfo: { flex: 1, marginLeft: 15 },
  trackTitle: { color: 'white', fontSize: 16, fontWeight: '500' },
  trackMeta: { color: '#b3b3b3', fontSize: 13, marginTop: 2 }
});