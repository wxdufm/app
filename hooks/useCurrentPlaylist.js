import { useState, useEffect } from "react";
import { getCurrentPlaylist } from "@/lib/playlists";

// function to get the current playlist
export default function useCurrentPlaylist() {
  const [currentPlaylist, setCurrentPlaylist] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // fetching the playlist
    async function fetchPlaylist() {
      try {
        const data = await getCurrentPlaylist();
        setCurrentPlaylist(data);
      } catch (error) {
        console.error(
          "Failed to fetch current-playlist data:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPlaylist();

    const interval = setInterval(fetchPlaylist, 30000);

    return () => clearInterval(interval);
  }, []);

  return { currentPlaylist, loading };
}

