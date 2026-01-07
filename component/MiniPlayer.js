import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayer } from '../context/PlayerContext';
import { colors } from '../theme/colors';
import { BlurView } from 'expo-blur'; // Ensure expo-blur is installed

const { width } = Dimensions.get('window');

export default function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlay, stopTrack, progressPercent } = usePlayer();

  if (!currentTrack) return null;

  return (
    <View style={styles.outerContainer}>
      <BlurView intensity={80} tint="dark" style={styles.container}>
        {/* Glowing Progress Bar */}
        <View style={styles.progressBackground}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>

        <View style={styles.content}>
          <Image source={{ uri: currentTrack.image }} style={styles.img} />
          
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <View style={styles.artistRow}>
              {isPlaying && <View style={styles.liveDot} />}
              <Text style={styles.artist} numberOfLines={1}>
                {currentTrack.artist}
              </Text>
            </View>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity onPress={togglePlay} style={styles.playBtn}>
              <Ionicons 
                name={isPlaying ? "pause" : "play"} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={stopTrack} style={styles.closeBtn}>
              <Ionicons name="close-outline" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    // We remove the absolute 'bottom: 90' which was causing the float-up
    position: 'absolute',
    bottom: 0, 
    width: '100%',
    paddingBottom: 10, // Adjust this based on your TabBar height
    paddingHorizontal: 10,
    zIndex: 999,
  },
  container: {
    backgroundColor: 'rgba(20, 20, 20, 0.9)', // Slightly more solid for visibility
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 20,
  },
  progressBackground: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressFill: {
    height: 3,
    backgroundColor: colors.primary,
    // Creating a glow effect for the progress bar
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  img: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: -0.2,
  },
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  artist: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playBtn: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  closeBtn: {
    marginLeft: 10,
    padding: 5,
  }
});