import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import SongAlbumCover from "./SongAlbumCover";
import StreamingLinksSection from "./StreamingLinksSection";

// Cycles in this fixed order (palindrome, so the transition from the last row back to
// the first stays smooth instead of jumping).
const ROW_COLORS = [
  "#2d253b",
  "#3c344a",
  "#562c34",
  "#723844",
  "#9f494c",
  "#a95846",
  "#ab7254",
  "#a95846",
  "#9f494c",
  "#723844",
  "#562c34",
  "#3c344a",
  "#2d253b",
];

type SongStart = string | number | Date | null | undefined;

type SongRowProps = {
  song?: string | null;
  artist?: string | null;
  album?: string | null;
  songStart?: SongStart;
  apiBaseUrl?: string;
  onPress?: () => void;
  index?: number;
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
  index = 0,
}: SongRowProps) {
  const playedAt = formatTime(songStart);
  const [modalVisible, setModalVisible] = useState(false);
  const backgroundColor = ROW_COLORS[index % ROW_COLORS.length];

  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={{ backgroundColor }}
        className="flex-row items-center gap-4 rounded-2xl px-3 py-3 mb-2 active:opacity-60"
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

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/80"
          onPress={() => setModalVisible(false)}
        >
          <Pressable onPress={() => {}} className="rounded-t-3xl bg-zinc-900 p-6">
            <View className="mb-1 h-1 w-12 self-center rounded-full bg-zinc-600" />
            <Text className="mt-4 text-xl text-white font-courier" numberOfLines={2}>
              {song}
            </Text>
            <Text className="text-zinc-400 font-courier-italic">
              {artist}
            </Text>
            {album ? (
              <Text className="text-sm text-zinc-500 font-courier">
                {album}
              </Text>
            ) : null}
            <StreamingLinksSection artist={artist} song={song} />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
