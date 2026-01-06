import React, { createContext, useState, useContext } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  
  // Initialize expo-audio player
  const player = useAudioPlayer();
  const status = useAudioPlayerStatus(player);

  const playTrack = (track) => {
    // Defensive check to prevent crashes on empty URLs
    if (!track?.preview) {
      console.warn("This track has no preview URL");
      return;
    }

    setCurrentTrack(track);
    
    try {
      // Load the new source and play
      player.replace(track.preview);
      player.play();
    } catch (err) {
      console.error("Playback error:", err);
    }
  };

  const togglePlay = () => {
    if (!currentTrack) return;
    player.playing ? player.pause() : player.play();
  };

  // FIXED: stopTrack function
  const stopTrack = () => {
    // Just pause and clear the UI state. 
    // Do NOT call replace(null) as it causes a Casting Error in expo-audio.
    player.pause();
    setCurrentTrack(null); 
  };

  const progressPercent = status.duration > 0 
    ? (status.currentTime / status.duration) * 100 
    : 0;

  return (
    <PlayerContext.Provider value={{ 
      currentTrack, 
      playTrack, 
      stopTrack, 
      isPlaying: player.playing, 
      togglePlay,
      progressPercent 
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);