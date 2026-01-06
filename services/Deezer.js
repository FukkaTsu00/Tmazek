import axios from 'axios';

const BASE_URL = 'https://api.deezer.com';

/**
 * 1. MULTI-SEARCH: Fetches Tracks, Artists, and Albums simultaneously
 * used by SearchScreen.js
 */
export const searchDeezer = async (query, type = 'All') => {
  try {
    // If a specific type is selected, we change the endpoint to filter results
    let url = `https://api.deezer.com/search?q=${query}`;
    
    if (type === 'Artists') url = `https://api.deezer.com/search/artist?q=${query}`;
    if (type === 'Albums') url = `https://api.deezer.com/search/album?q=${query}`;

    const response = await fetch(url);
    const json = await response.json();

    return json.data.map(item => ({
      id: item.id.toString(),
      title: item.title || item.name,
      artist: item.artist?.name || item.name,
      image: item.album?.cover_medium || item.picture_medium || item.cover_medium,
      preview: item.preview,
      type: item.type === 'track' ? 'Tracks' : item.type === 'artist' ? 'Artists' : 'Albums',
      artistId: item.artist?.id || item.id
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * 2. HOME DATA: Fetches trending content
 * used by HomeScreen.js
 */
export const getDeezerHomeData = async () => {
  try {
    // Deezer Editorial Chart is great for "Trending" content
    const response = await axios.get(`${BASE_URL}/chart/0`);
    
    return {
      songs: response.data.tracks.data.map(item => ({
        id: item.id,
        title: item.title,
        artist: item.artist.name,
        image: item.album.cover_medium,
        preview: item.preview
      })),
      artists: response.data.artists.data.map(item => ({
        id: item.id,
        name: item.name,
        image: item.picture_medium
      })),
      albums: response.data.albums.data.map(item => ({
        id: item.id,
        title: item.title,
        image: item.cover_medium
      }))
    };
  } catch (error) {
    console.error("Home Data API Error:", error);
    return { artists: [], albums: [], songs: [] };
  }
};

/**
 * 3. ARTIST DETAILS: Fetches artist info + their top tracks
 * used by ArtistDetailsScreen.js
 */
export const getArtistDetails = async (artistId) => {
  try {
    const [artistRes, tracksRes] = await Promise.all([
      axios.get(`${BASE_URL}/artist/${artistId}`),
      axios.get(`${BASE_URL}/artist/${artistId}/top?limit=20`)
    ]);

    return {
      info: artistRes.data,
      tracks: tracksRes.data.data.map(track => ({
        ...track,
        // Ensure image format matches what the PlayerContext expects
        image: track.album.cover_medium 
      }))
    };
  } catch (error) {
    console.error("Artist API Error:", error);
    return null;
  }
};

/**
 * 4. ALBUM DETAILS: Fetches album info + all tracks in that album
 * used by AlbumDetailsScreen.js
 */
export const getAlbumDetails = async (albumId) => {
  try {
    const response = await axios.get(`${BASE_URL}/album/${albumId}`);
    
    // Map tracks to include the album cover (since track objects in album calls often omit it)
    const albumCover = response.data.cover_medium;
    const formattedTracks = response.data.tracks.data.map(track => ({
      ...track,
      image: albumCover // Attach the album cover to each track for the player
    }));

    return {
      info: response.data,
      tracks: formattedTracks
    };
  } catch (error) {
    console.error("Album API Error:", error);
    return null;
  }
};