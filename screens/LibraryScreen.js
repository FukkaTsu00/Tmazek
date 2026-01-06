import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import { db, auth } from '../firebase/firebase';
import { collection, query, onSnapshot, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function LibraryScreen({ navigation }) {
  const [playlists, setPlaylists] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [playlistName, setPlaylistName] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'users', auth.currentUser.uid, 'playlists'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (s) => {
      let list = s.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (a.id === 'liked_songs' ? -1 : 1));
      setPlaylists(list);
    });
  }, []);

  // SIMPLE CREATE LOGIC
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
      <View style={styles.headerRow}>
        <Text style={styles.title}>Library</Text>
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={32} color="#1DB954" />
        </TouchableOpacity>
      </View>

      <FlatList 
        data={playlists}
        renderItem={({item}) => (
          <TouchableOpacity 
            style={styles.row} 
            onPress={() => navigation.navigate('PlaylistDetails', { 
              playlistId: item.id, 
              playlistName: item.name 
            })}
          >
            <View style={[styles.icon, item.id === 'liked_songs' && {backgroundColor: '#450af5'}]}>
              <Ionicons name={item.id === 'liked_songs' ? "heart" : "musical-notes"} size={24} color="white" />
            </View>
            <View>
              <Text style={{color: 'white', marginLeft: 15, fontSize: 18, fontWeight: 'bold'}}>{item.name}</Text>
              <Text style={{color: '#b3b3b3', marginLeft: 15, fontSize: 14}}>{item.songs?.length || 0} songs</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* SIMPLE POPUP FOR NEW PLAYLIST */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Give your playlist a name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="My Playlist #1" 
              placeholderTextColor="#666"
              value={playlistName}
              onChangeText={setPlaylistName}
              autoFocus
            />
            <View style={styles.btnRow}>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text style={{color: 'white', marginRight: 30}}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreate}>
                <Text style={{color: '#1DB954', fontWeight: 'bold'}}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingTop: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20 },
  title: { color: 'white', fontSize: 30, fontWeight: 'bold', margin: 20 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  icon: { width: 55, height: 55, backgroundColor: '#282828', justifyContent: 'center', alignItems: 'center', borderRadius: 4 },
  
  // Modal Styles
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', alignItems: 'center' },
  modalTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { borderBottomWidth: 1, borderBottomColor: '#1DB954', width: '100%', color: 'white', fontSize: 24, textAlign: 'center', marginBottom: 30, paddingBottom: 10 },
  btnRow: { flexDirection: 'row' }
});