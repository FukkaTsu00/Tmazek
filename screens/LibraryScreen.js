import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  Modal, TextInput, StatusBar, KeyboardAvoidingView, Platform 
} from 'react-native';
import { db, auth } from '../firebase/firebase';
import { collection, query, onSnapshot, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function LibraryScreen({ navigation }) {
  const [playlists, setPlaylists] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [playlistName, setPlaylistName] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'users', auth.currentUser.uid, 'playlists'), 
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (s) => {
      let list = s.docs.map(d => ({ id: d.id, ...d.data() }));
      // Ensure "Liked Songs" is always at the top
      list.sort((a, b) => (a.id === 'liked_songs' ? -1 : 1));
      setPlaylists(list);
    });
  }, []);

  const handleCreate = async () => {
    if (playlistName.trim() === '') return;
    try {
      await addDoc(collection(db, 'users', auth.currentUser.uid, 'playlists'), {
        name: playlistName,
        songs: [],
        createdAt: serverTimestamp(),
      });
      setPlaylistName('');
      setIsModalVisible(false);
    } catch (e) {
      console.error("Error creating playlist", e);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* HEADER AREA */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Library</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setIsModalVisible(true)}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList 
        data={playlists}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isLikedSongs = item.id === 'liked_songs';
          return (
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => navigation.navigate('PlaylistDetails', { 
                playlistId: item.id, 
                playlistName: item.name 
              })}
            >
              <LinearGradient
                colors={isLikedSongs ? [colors.primary, '#8e44ad'] : ['#1E1E1E', '#121212']}
                style={styles.cardArt}
              >
                <Ionicons 
                  name={isLikedSongs ? "heart" : "musical-notes"} 
                  size={32} 
                  color="white" 
                />
              </LinearGradient>
              <Text style={styles.playlistName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.songCount}>{item.songs?.length || 0} tracks</Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* ENHANCED CREATE MODAL */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.modalBg}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>New Playlist</Text>
            
            <TextInput 
              style={styles.input} 
              placeholder="Give it a name..." 
              placeholderTextColor="#666"
              value={playlistName}
              onChangeText={setPlaylistName}
              autoFocus
              selectionColor={colors.primary}
            />

            <View style={styles.btnRow}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.cancelBtn]} 
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalBtn, styles.createBtn]} 
                onPress={handleCreate}
              >
                <Text style={styles.createText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingTop: 60, 
    paddingHorizontal: 20,
    marginBottom: 20
  },
  title: { color: 'white', fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  addButton: { 
    width: 40, height: 40, borderRadius: 20, 
    backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' 
  },

  // Grid Styles
  listContent: { paddingHorizontal: 15, paddingBottom: 120 },
  columnWrapper: { justifyContent: 'space-between' },
  card: { width: '47%', marginBottom: 20 },
  cardArt: { 
    aspectRatio: 1, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5
  },
  playlistName: { color: 'white', fontSize: 16, fontWeight: '700' },
  songCount: { color: '#666', fontSize: 13, marginTop: 2 },

  // Modal Styles
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalContent: { 
    backgroundColor: '#161616', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: 30, 
    alignItems: 'center' 
  },
  modalHandle: { width: 40, height: 4, backgroundColor: '#333', borderRadius: 2, marginBottom: 20 },
  modalTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 25 },
  input: { 
    width: '100%', 
    backgroundColor: '#222', 
    borderRadius: 12, 
    padding: 18, 
    color: 'white', 
    fontSize: 18, 
    marginBottom: 25 
  },
  btnRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  modalBtn: { flex: 0.47, height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  cancelBtn: { backgroundColor: '#222' },
  createBtn: { backgroundColor: colors.primary },
  cancelText: { color: 'white', fontWeight: '600' },
  createText: { color: 'white', fontWeight: 'bold' }
});