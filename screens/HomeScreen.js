import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Good Vibes</Text>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Featured Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Playlists</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {["Chill Beats", "Top Hits", "Workout", "Indie Mix"].map((playlist, idx) => (
              <View key={idx} style={styles.playlistCard}>
                <View style={styles.playlistImage} />
                <Text style={styles.playlistName}>{playlist}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Recommended Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Songs</Text>
          {["Song A", "Song B", "Song C", "Song D"].map((song, idx) => (
            <View key={idx} style={styles.songRow}>
              <View style={styles.songThumbnail} />
              <Text style={styles.songName}>{song}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", paddingTop: Platform.OS === "android" ? 25 : 0 },
  headerContainer: { paddingHorizontal: 16, paddingBottom: 10 },
  header: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  content: { paddingBottom: 20 },
  section: { marginTop: 20, paddingHorizontal: 16 },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "600", marginBottom: 10 },
  playlistCard: { width: 120, marginRight: 12 },
  playlistImage: { backgroundColor: "#1DB954", height: 120, borderRadius: 8 },
  playlistName: { color: "#fff", marginTop: 6, fontWeight: "500", textAlign: "center" },
  songRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  songThumbnail: { backgroundColor: "#1DB954", width: 50, height: 50, borderRadius: 6, marginRight: 12 },
  songName: { color: "#fff", fontSize: 16 },
});
