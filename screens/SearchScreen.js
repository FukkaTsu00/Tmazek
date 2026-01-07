import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, FlatList, 
  Image, TouchableOpacity, ActivityIndicator, Keyboard, ScrollView, Modal, Pressable, Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { searchDeezer } from '../services/Deezer'; 
import { usePlayer } from '../context/PlayerContext';
import { db, auth } from '../firebase/firebase';
import { doc, updateDoc, arrayUnion, collection, getDocs, query } from 'firebase/firestore';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');
const CATEGORIES = ['All', 'Tracks', 'Artists', 'Albums'];
const GENRES = [
  { id: 1, name: 'Pop', color: '#FF416C' },
  { id: 2, name: 'Hip-Hop', color: '#8A23BE' },
  { id: 3, name: 'Rock', color: '#F27121' },
  { id: 4, name: 'Electronic', color: '#00B4DB' },
  { id: 5, name: 'Jazz', color: '#3a7bd5' },
  { id: 6, name: 'Focus', color: '#11998e' },
];

export default function SearchScreen({ navigation }) {
  const [queryStr, setQueryStr] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { playTrack, currentTrack } = usePlayer();

  const [showPicker, setShowPicker] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [trackToAdd, setTrackToAdd] = useState(null);

  const handleSearch = async (category = selectedCategory) => {
    if (!queryStr.trim()) return;
    Keyboard.dismiss();
    setLoading(true);
    try {
      const data = await searchDeezer(queryStr, category);
      setResults(data || []);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  const openPicker = async (track) => {
    setTrackToAdd(track);
    const q = collection(db, 'users', auth.currentUser.uid, 'playlists');
    const snap = await getDocs(q);
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(p => p.id !== 'liked_songs');
    setUserPlaylists(list);
    setShowPicker(true);
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
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
      <View style={styles.searchHeader}>
        <Text style={styles.screenTitle}>Search</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput 
            style={styles.input} 
            placeholder="What do you want to listen to?" 
            placeholderTextColor="#666"
            value={queryStr} 
            onChangeText={(text) => {
              setQueryStr(text);
              if (text === '') setResults([]);
            }} 
            onSubmitEditing={() => handleSearch()}
            clearButtonMode="while-editing"
            returnKeyType="search"
          />
        </View>

        {queryStr.length > 0 && (
          <View style={styles.categoriesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity 
                  key={cat} 
                  style={[styles.categoryChip, selectedCategory === cat && styles.activeCategory]}
                  onPress={() => { setSelectedCategory(cat); handleSearch(cat); }}
                >
                  <Text style={[styles.categoryText, selectedCategory === cat && styles.activeCategoryText]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          contentContainerStyle={{ paddingBottom: 140 }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isPlaying = currentTrack?.id === item.id;
            return (
              <TouchableOpacity 
                style={[styles.resultItem, isPlaying && styles.activeResult]} 
                onPress={() => {
                  if (item.type === 'Tracks' || item.type === 'track') playTrack(item);
                  else if (item.type === 'Artists' || item.type === 'artist') navigation.navigate('ArtistDetails', { artistId: item.id, artistName: item.title });
                  else if (item.type === 'Albums' || item.type === 'album') navigation.navigate('AlbumDetails', { albumId: item.id, albumName: item.title });
                }}
              >
                <Image source={{ uri: item.image }} style={[styles.resultImage, (item.type === 'Artists' || item.type === 'artist') && styles.artistImage]} />
                <View style={styles.resultInfo}>
                  <Text style={[styles.resultTitle, isPlaying && { color: colors.primary }]} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.resultMeta}>{item.type} • {item.artist?.name || item.artist || 'Explore'}</Text>
                </View>
                {item.type === 'track' || item.type === 'Tracks' ? (
                  <TouchableOpacity onPress={() => openPicker(item)} style={styles.moreBtn}>
                    <Ionicons name="add-circle-outline" size={24} color="#444" />
                  </TouchableOpacity>
                ) : (
                  <Ionicons name="chevron-forward" size={20} color="#333" />
                )}
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.exploreContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.exploreTitle}>Browse All</Text>
          <View style={styles.genreGrid}>
            {GENRES.map((genre) => (
              <TouchableOpacity 
                key={genre.id} 
                style={[styles.genreCard, { backgroundColor: genre.color }]}
                onPress={() => { setQueryStr(genre.name); handleSearch(); }}
              >
                <Text style={styles.genreName}>{genre.name}</Text>
                <Ionicons name="musical-note" size={50} color="rgba(255,255,255,0.2)" style={styles.genreIcon} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* MODAL (Same as Library but matching Search UI) */}
      <Modal visible={showPicker} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowPicker(false)}>
          <View style={styles.bottomSheet}>
            <View style={styles.dragHandle} />
            <Text style={styles.modalTitle}>Add to playlist</Text>
            <FlatList
              data={userPlaylists}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.playlistItem} onPress={() => handleAddToPlaylist(item.id)}>
                  <LinearGradient colors={['#333', '#111']} style={styles.playlistIcon}>
                    <Ionicons name="musical-notes" size={20} color={colors.primary} />
                  </LinearGradient>
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
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  screenTitle: { color: 'white', fontSize: 32, fontWeight: '900', marginHorizontal: 20, marginBottom: 20 },
  searchHeader: { paddingTop: 10 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: { marginRight: 10 },
  input: { flex: 1, color: '#000', fontSize: 16, fontWeight: '600' },
  
  categoriesContainer: { marginTop: 20, paddingLeft: 20, marginBottom: 10 },
  categoryChip: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1A1A1A', marginRight: 10 },
  activeCategory: { backgroundColor: colors.primary },
  categoryText: { color: 'white', fontWeight: 'bold', fontSize: 13 },

  resultItem: { flexDirection: 'row', alignItems: 'center', padding: 12, marginHorizontal: 16, borderRadius: 12, marginBottom: 5 },
  activeResult: { backgroundColor: '#1C1612' },
  resultImage: { width: 55, height: 55, borderRadius: 6 },
  artistImage: { borderRadius: 30 },
  resultInfo: { flex: 1, marginLeft: 15 },
  resultTitle: { color: 'white', fontSize: 16, fontWeight: '700' },
  resultMeta: { color: '#666', fontSize: 12, marginTop: 4, textTransform: 'capitalize' },
  moreBtn: { padding: 5 },

  exploreContainer: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120 },
  exploreTitle: { color: 'white', fontSize: 18, fontWeight: '900', marginBottom: 20 },
  genreGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  genreCard: { width: (width - 50) / 2, height: 100, borderRadius: 12, padding: 15, marginBottom: 15, overflow: 'hidden' },
  genreName: { color: 'white', fontSize: 18, fontWeight: '900' },
  genreIcon: { position: 'absolute', right: -10, bottom: -10, transform: [{ rotate: '25deg' }] },

  loadingContainer: { flex: 1, justifyContent: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: '#161616', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, maxHeight: '70%' },
  dragHandle: { width: 40, height: 4, backgroundColor: '#333', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 25 },
  playlistItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, backgroundColor: '#1F1F1F', padding: 12, borderRadius: 15 },
  playlistIcon: { width: 45, height: 45, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  playlistName: { color: 'white', fontSize: 16, fontWeight: '600' }
});