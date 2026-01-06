import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { db, auth } from '../firebase/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { usePlayer } from '../context/PlayerContext';
import { Ionicons } from '@expo/vector-icons';

export default function PlaylistDetailsScreen({ route, navigation }) {
  const [playlist, setPlaylist] = useState(null);
  const { playTrack } = usePlayer();
  const { playlistId } = route.params;

  useEffect(() => {
    const docRef = doc(db, 'users', auth.currentUser.uid, 'playlists', playlistId);
    const unsubscribe = onSnapshot(docRef, (d) => {
      if (d.exists()) setPlaylist(d.data());
    });
    return () => unsubscribe();
  }, [playlistId]);

  if (!playlist) return null;

  return (
    <View style={styles.container}>
      <FlatList 
        data={playlist.songs || []}
        contentContainerStyle={{ paddingBottom: 160 }}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <View style={[styles.artPlaceholder, playlistId === 'liked_songs' && {backgroundColor: '#450af5'}]}>
               <Ionicons name={playlistId === 'liked_songs' ? "heart" : "musical-notes"} size={60} color="white" />
            </View>
            <Text style={styles.headerTitle}>{playlist.name}</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('SearchTab')}>
              <Ionicons name="add-circle" size={20} color="#1DB954" />
              <Text style={styles.addBtnText}>ADD SONGS</Text>
            </TouchableOpacity>
          </View>
        )}
        renderItem={({item}) => (
          <TouchableOpacity 
            style={styles.row} 
            onPress={() => {
              if (item.preview) {
                playTrack(item);
              } else {
                alert("Playback unavailable for this track.");
              }
            }}
          >
            <Image source={{uri: item.image}} style={styles.img} />
            <View style={styles.songInfo}>
              <Text style={styles.songTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.songArtist} numberOfLines={1}>{item.artist}</Text>
            </View>
            <Ionicons name="play-circle" size={24} color="#1DB954" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { alignItems: 'center', paddingVertical: 40 },
  artPlaceholder: { width: 160, height: 160, backgroundColor: '#282828', justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  headerTitle: { color: 'white', fontSize: 28, fontWeight: 'bold', marginTop: 20 },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#333', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, marginTop: 15 },
  addBtnText: { color: 'white', marginLeft: 8, fontWeight: 'bold' },
  row: { flexDirection: 'row', padding: 15, alignItems: 'center' },
  img: { width: 50, height: 50, borderRadius: 4, marginRight: 15 },
  songInfo: { flex: 1 },
  songTitle: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  songArtist: { color: '#b3b3b3', fontSize: 14 }
});