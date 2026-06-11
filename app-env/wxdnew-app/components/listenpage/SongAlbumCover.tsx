import { useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";

const fallbackCover = require("../../assets/CD_1_Filler.jpg");

export default function SongAlbumCover({ artist, album, apiBaseUrl }) {
  const [coverUrl, setCoverUrl] = useState(null);

  useEffect(() => {
    setCoverUrl(null);

    if (!artist || !album || !apiBaseUrl) return;

    const url =
      `${apiBaseUrl}/api/charts/cover` +
      `?artist=${encodeURIComponent(artist)}` +
      `&album=${encodeURIComponent(album)}`;

    fetch(url)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => {
        if (data.coverUrl) setCoverUrl(data.coverUrl);
      })
      .catch(() => {});
  }, [artist, album, apiBaseUrl]);

  return (
    <Image
      source={coverUrl ? { uri: coverUrl } : fallbackCover}
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