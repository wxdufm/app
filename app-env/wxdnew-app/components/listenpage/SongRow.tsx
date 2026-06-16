import { Pressable, Text, View } from "react-native";

import SongAlbumCover from "./SongAlbumCover";

type SongStart = string | number | Date | null | undefined;

type SongRowProps = {
  song?: string | null;
  artist?: string | null;
  album?: string | null;
  songStart?: SongStart;
  apiBaseUrl?: string;
  onPress?: () => void;
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
  onPress,
}: SongRowProps) {
  const playedAt = formatTime(songStart);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      className="flex-row items-center gap-4 border-b border-zinc-800 py-3"
    >
      <SongAlbumCover artist={artist} album={album} apiBaseUrl={apiBaseUrl} />

      <Text className="w-16 shrink-0 text-center text-sm text-zinc-400 font-courier">
        {playedAt ? `Played at ${playedAt}` : "Played"}
      </Text>

      <View className="min-w-0 flex-1">
        <Text numberOfLines={1} className="text-white font-courier">
          {song}
        </Text>
        <Text numberOfLines={1} className="text-sm text-zinc-300 font-courier-italic">
          {artist}
        </Text>
        <Text numberOfLines={1} className="text-xs text-zinc-500 font-courier">
          {album}
        </Text>
      </View>
    </Pressable>
  );
}
