import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { getDeezerHomeData } from '../services/Deezer';
import { usePlayer } from '../context/PlayerContext';

export default function HomeScreen({ navigation }) {
  const [data, setData] = useState({ songs: [], artists: [], albums: [] });
  const [loading, setLoading] = useState(true);
  const { playTrack } = usePlayer();

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      const homeData = await getDeezerHomeData();
      setData(homeData);
    } catch (error) {
      console.error("Failed to load home data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* 1. TOP ARTISTS - HORIZONTAL */}
      <Text style={styles.sectionTitle}>Top Artists</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data.artists}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.artistCard}
            onPress={() => navigation.navigate('ArtistDetails', { 
              artistId: item.id, 
              artistName: item.name 
            })}
          >
            <Image source={{ uri: item.image }} style={styles.artistImage} />
            <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* 2. FEATURED ALBUMS - HORIZONTAL */}
      <Text style={styles.sectionTitle}>Featured Albums</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data.albums}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('AlbumDetails', { 
              albumId: item.id, 
              albumName: item.title 
            })}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      {/* 3. TRENDING SONGS - VERTICAL LIST AT THE BOTTOM */}
      <Text style={styles.sectionTitle}>Trending Songs</Text>
      <View style={styles.listContainer}>
        {data.songs.map((item) => (
          <TouchableOpacity 
            key={item.id.toString()} 
            style={styles.songRow} 
            onPress={() => playTrack(item)}
          >
            <Image source={{ uri: item.image }} style={styles.songImage} />
            <View style={styles.songInfo}>
              <Text style={styles.songTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.songSubtitle} numberOfLines={1}>{item.artist}</Text>
            </View>
            <TouchableOpacity onPress={() => playTrack(item)} style={styles.playIconHolder}>
               <Image 
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/0/375.png' }} 
                  style={{ width: 20, height: 20, tintColor: '#1DB954' }} 
               />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  contentContainer: {
    paddingBottom: 160,
  },
  centered: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 15,
    marginTop: 25,
    marginBottom: 15,
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#1e1e1e',
    padding: 10,
    borderRadius: 10,
  },
  songImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },
  songInfo: {
    flex: 1,
    marginLeft: 15,
  },
  songTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  songSubtitle: {
    color: '#b3b3b3',
    fontSize: 13,
    marginTop: 4,
  },
  playIconHolder: {
    padding: 5,
  },
  card: {
    width: 140,
    marginLeft: 15,
    marginBottom: 10,
  },
  cardImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
  },
  artistCard: {
    width: 120,
    marginLeft: 15,
    alignItems: 'center',
  },
  artistImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 8,
  },
  cardTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
});