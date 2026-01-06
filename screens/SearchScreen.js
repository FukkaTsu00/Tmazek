import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, FlatList, 
  Image, TouchableOpacity, ActivityIndicator, Keyboard, ScrollView, Modal, Pressable 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { searchDeezer } from '../services/Deezer'; 
import { usePlayer } from '../context/PlayerContext';
import { db, auth } from '../firebase/firebase';
import { doc, updateDoc, arrayUnion, collection, getDocs, query } from 'firebase/firestore';

const CATEGORIES = ['All', 'Tracks', 'Artists', 'Albums'];

export default function SearchScreen({ navigation }) {
  const [queryStr, setQueryStr] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { playTrack } = usePlayer();

  const [showPicker, setShowPicker] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [trackToAdd, setTrackToAdd] = useState(null);

  const handleSearch = async (category = selectedCategory) => {
    if (!queryStr.trim()) return;
    Keyboard.dismiss();
    setLoading(true);
    const data = await searchDeezer(queryStr, category);
    setResults(data || []);
    setLoading(false);
  };

  const openPicker = async (track) => {
    setTrackToAdd(track);
    const q = query(collection(db, 'users', auth.currentUser.uid, 'playlists'));
    const snap = await getDocs(q);
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(p => p.id !== 'liked_songs');
    setUserPlaylists(list);
    setShowPicker(true);
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      // CRITICAL FIX: Ensure all data (especially preview) is saved
      const songData = {
        id: trackToAdd.id,
        title: trackToAdd.title,
        artist: trackToAdd.artist,
        image: trackToAdd.image,
        preview: trackToAdd.preview, 
      };

      await updateDoc(doc(db, 'users', auth.currentUser.uid, 'playlists', playlistId), {
        songs: arrayUnion(songData)
      });
      setShowPicker(false);
    } catch (error) {
      console.error("Error adding to playlist", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput 
          style={styles.input} 
          placeholder="Search for music..." 
          value={queryStr} 
          onChangeText={setQueryStr} 
          onSubmitEditing={() => handleSearch()}
          placeholderTextColor="#666"
        />
      </View>

      {/* Categories */}
      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.filterBtn, selectedCategory === cat && styles.activeFilter]}
              onPress={() => { setSelectedCategory(cat); if (queryStr.trim()) handleSearch(cat); }}
            >
              <Text style={styles.filterText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results List */}
      {loading ? (
        <ActivityIndicator size="large" color="#1DB954" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={results}
          contentContainerStyle={{ paddingBottom: 160 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.resultItem} 
              onPress={() => {
                if (item.type === 'Tracks') playTrack(item);
                else if (item.type === 'Artists') navigation.navigate('ArtistDetails', { artistId: item.id, artistName: item.title });
                else if (item.type === 'Albums') navigation.navigate('AlbumDetails', { albumId: item.id, albumName: item.title });
              }}
            >
              <Image source={{ uri: item.image }} style={[styles.img, item.type === 'Artists' && {borderRadius: 30}]} />
              <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.type === 'Artists' ? 'Artist' : item.artist}</Text>
              </View>
              {item.type === 'Tracks' && (
                <TouchableOpacity onPress={() => openPicker(item)} style={{ padding: 10 }}>
                  <Ionicons name="add-circle-outline" size={26} color="#b3b3b3" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          )}
        />
      )}

      {/* REDESIGNED PLAYLIST PICKER (Bottom Sheet Style) */}
      <Modal visible={showPicker} transparent animationType="slide" onRequestClose={() => setShowPicker(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowPicker(false)}>
          <View style={styles.bottomSheet}>
            <View style={styles.dragHandle} />
            <Text style={styles.modalTitle}>Add to playlist</Text>
            
            <TouchableOpacity 
              style={styles.newPlaylistBtn}
              onPress={() => { setShowPicker(false); navigation.navigate('LibraryTab'); }}
            >
              <View style={styles.iconCircle}>
                <Ionicons name="add" size={24} color="white" />
              </View>
              <Text style={styles.newPlaylistText}>New playlist</Text>
            </TouchableOpacity>

            <FlatList
              data={userPlaylists}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.playlistItem} onPress={() => handleAddToPlaylist(item.id)}>
                  <View style={styles.playlistIcon}>
                    <Ionicons name="musical-notes" size={20} color="#b3b3b3" />
                  </View>
                  <Text style={styles.playlistName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  searchBox: { flexDirection: 'row', backgroundColor: '#fff', margin: 16, padding: 10, borderRadius: 8, alignItems: 'center' },
  input: { flex: 1, marginLeft: 10, color: '#000' },
  filterWrapper: { marginBottom: 10, paddingLeft: 16 },
  filterBtn: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: '#282828', marginRight: 10 },
  activeFilter: { backgroundColor: '#1DB954' },
  filterText: { color: '#fff', fontWeight: 'bold' },
  resultItem: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  img: { width: 55, height: 55, borderRadius: 4 },
  info: { flex: 1, marginLeft: 15 },
  title: { color: '#fff', fontWeight: 'bold' },
  subtitle: { color: '#b3b3b3' },
  
  /* Modal & Bottom Sheet Styles */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  bottomSheet: { 
    backgroundColor: '#282828', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    paddingHorizontal: 20, 
    paddingBottom: 40,
    maxHeight: '70%'
  },
  dragHandle: { 
    width: 40, height: 5, backgroundColor: '#555', 
    borderRadius: 2.5, alignSelf: 'center', marginVertical: 12 
  },
  modalTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  newPlaylistBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconCircle: { 
    width: 50, height: 50, backgroundColor: '#333', 
    borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginRight: 15 
  },
  newPlaylistText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  playlistItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  playlistIcon: { 
    width: 50, height: 50, backgroundColor: '#333', 
    borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginRight: 15 
  },
  playlistName: { color: 'white', fontSize: 16, fontWeight: '500' }
});