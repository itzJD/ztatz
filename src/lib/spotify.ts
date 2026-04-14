import { auth } from "@/auth";

export const SPOTIFY_SCOPES = [
  "user-read-email",
  "user-read-private",
  "user-top-read",
  "user-read-recently-played",
  "user-library-read",
  "playlist-read-private",
  "playlist-read-collaborative",
].join(" ");

const BASE_URL = "https://api.spotify.com/v1";

async function fetchFromSpotify(endpoint: string) {
  const session = await auth();
  const accessToken = session?.accessToken;

  if (!accessToken) {
    throw new Error("No access token found");
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    next: { revalidate: 3600 } // Revalidate every hour
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Spotify access token expired or invalid");
    }
    throw new Error(`Spotify API error: ${response.statusText}`);
  }

  return response.json();
}

export async function getTopArtists(timeRange = "medium_term", limit = 20) {
  return fetchFromSpotify(`/me/top/artists?time_range=${timeRange}&limit=${limit}`);
}

export async function getTopTracks(timeRange = "medium_term", limit = 20) {
  return fetchFromSpotify(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`);
}

export async function getRecentlyPlayed(limit = 20) {
  return fetchFromSpotify(`/me/player/recently-played?limit=${limit}`);
}

export async function getLikedSongs(limit = 20) {
  return fetchFromSpotify(`/me/tracks?limit=${limit}`);
}

export async function getArtistDetails(id: string) {
  return fetchFromSpotify(`/artists/${id}`);
}

export async function getTrackDetails(id: string) {
  return fetchFromSpotify(`/tracks/${id}`);
}

export async function getArtistTopTracks(id: string) {
  return fetchFromSpotify(`/artists/${id}/top-tracks?market=from_token`);
}

export async function getArtistAlbums(id: string) {
  return fetchFromSpotify(`/artists/${id}/albums?include_groups=album,single&limit=10`);
}
