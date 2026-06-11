import { Platform, StyleSheet, Text, View } from "react-native";

import SongAlbumCover from "./SongAlbumCover";

export default function SongRow({ song, artist, album, songStart }) {
  function formatTime(iso) {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <View className="flex-row items-center gap-4 border-b border-zinc-800 py-3">
      <SongAlbumCover artist={artist} album={album} />

      <Text className="w-16 shrink-0 text-center text-sm text-zinc-400">
        Played at {formatTime(songStart)}
      </Text>

      <View className="min-w-0 flex-1">
        <Text numberOfLines={1} style={styles.mono} className="text-white">
          {song}
        </Text>
        <Text
          numberOfLines={1}
          style={[styles.mono, styles.italic]}
          className="text-sm text-zinc-300"
        >
          {artist}
        </Text>
        <Text numberOfLines={1} style={styles.mono} className="text-xs text-zinc-500">
          {album}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mono: {
    fontFamily: Platform.select({
      ios: "Courier",
      android: "monospace",
      default: "monospace",
    }),
  },
  italic: {
    fontStyle: "italic",
  },
});