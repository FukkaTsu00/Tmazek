import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayer } from '../context/PlayerContext';

export default function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlay, stopTrack, progressPercent } = usePlayer();

  // If currentTrack is null (set by stopTrack), the player hides automatically
  if (!currentTrack) return null;

  return (
    <View style={styles.container}>
      {/* Progress Bar Line */}
      <View style={styles.progressBackground}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>

      <View style={styles.content}>
        <Image source={{ uri: currentTrack.image }} style={styles.img} />
        
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist}</Text>
        </View>

        <View style={styles.controls}>
          {/* Play / Pause Toggle */}
          <TouchableOpacity onPress={togglePlay} style={styles.iconBtn}>
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={26} 
              color="white" 
            />
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity onPress={stopTrack} style={styles.iconBtn}>
            <Ionicons name="close" size={24} color="#b3b3b3" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#282828',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 10, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  progressBackground: {
    height: 2,
    backgroundColor: '#444',
  },
  progressFill: {
    height: 2,
    backgroundColor: '#1DB954',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  img: {
    width: 42,
    height: 42,
    borderRadius: 4,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  artist: {
    color: '#b3b3b3',
    fontSize: 12,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  }
});