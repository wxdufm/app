import { useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import SongAlbumCover from "./SongAlbumCover";
import StreamingLinksSection from "./StreamingLinksSection";

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
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
        className="flex-row items-center gap-4 border-b border-zinc-800 py-3"
      >
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
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/60"
          onPress={() => setModalVisible(false)}
        >
          <Pressable onPress={() => {}} className="rounded-t-3xl bg-zinc-900 p-6">
            <View className="mb-1 h-1 w-12 self-center rounded-full bg-zinc-600" />
            <Text style={styles.mono} className="mt-4 text-xl text-white" numberOfLines={2}>
              {song}
            </Text>
            <Text style={[styles.mono, styles.italic]} className="text-zinc-400">
              {artist}
            </Text>
            {album ? (
              <Text style={styles.mono} className="text-sm text-zinc-500">
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
