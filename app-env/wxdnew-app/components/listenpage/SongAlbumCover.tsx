import { useEffect, useState } from "react";
import { Image, StyleSheet, type ImageSourcePropType } from "react-native";

const fallbackCover = require("../../assets/CD_1_Filler.jpg");

type SongAlbumCoverProps = {
  artist?: string | null;
  album?: string | null;
  apiBaseUrl?: string;
  fallbackSource?: ImageSourcePropType;
};

export default function SongAlbumCover({
  artist,
  album,
  apiBaseUrl,
  fallbackSource = fallbackCover,
}: SongAlbumCoverProps) {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  useEffect(() => {
    setCoverUrl(null);

    if (!artist || !album || !apiBaseUrl) return;

    const url =
      `${apiBaseUrl}/api/charts/cover` +
      `?artist=${encodeURIComponent(artist)}` +
      `&album=${encodeURIComponent(album)}`;

    fetch(url)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: { coverUrl?: string | null }) => {
        if (data.coverUrl) setCoverUrl(data.coverUrl);
      })
      .catch(() => {});
  }, [artist, album, apiBaseUrl]);

  return (
    <Image
      source={coverUrl ? { uri: coverUrl } : fallbackSource}
      accessibilityLabel={`${artist || "Unknown artist"} - ${album || "Unknown album"}`}
      resizeMode="cover"
      style={styles.cover}
    />
  );
}

const styles = StyleSheet.create({
  cover: {
    width: 64,
    height: 64,
    borderRadius: 4,
    flexShrink: 0,
  },
});
