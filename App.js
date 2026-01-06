import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PlayerProvider } from './context/PlayerContext'; // Must match export
import AppNavigator from './navigation/AppNavigator'; // This is usually a default export

export default function App() {
  return (
    <PlayerProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </PlayerProvider>
  );
}