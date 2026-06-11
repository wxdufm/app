import { Platform, StyleSheet, Text, View } from "react-native";

import SongAlbumCover from "./SongAlbumCover";

type SongStart = string | number | Date | null | undefined;

type SongRowProps = {
  song?: string | null;
  artist?: string | null;
  album?: string | null;
  songStart?: SongStart;
  apiBaseUrl?: string;
};

function formatTime(value: SongStart) {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
  });
}

export default function SongRow({
  song,
  artist,
  album,
  songStart,
  apiBaseUrl,
}: SongRowProps) {
  const playedAt = formatTime(songStart);

  return (
    <View className="flex-row items-center gap-4 border-b border-zinc-800 py-3">
      <SongAlbumCover artist={artist} album={album} apiBaseUrl={apiBaseUrl} />

      <Text className="w-16 shrink-0 text-center text-sm text-zinc-400">
        {playedAt ? `Played at ${playedAt}` : "Played"}
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
