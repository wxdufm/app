import { useEffect, useState } from "react";
import { Image, View, StyleSheet, type ImageSourcePropType } from "react-native";

const fallbackCover = require("../../assets/CD_1_Filler.jpg");

type SongAlbumCoverProps = {
  artist?: string | null;
  album?: string | null;
  apiBaseUrl?: string;
  fallbackSource?: ImageSourcePropType;
};

/** Looks up a release's artwork and shows a small album cover with a local fallback image. */
export default function SongAlbumCover({
  artist,
  album,
  apiBaseUrl,
  fallbackSource = fallbackCover,
}: SongAlbumCoverProps) {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  useEffect(() => {
    // Clear the previous artwork while looking up a different release.
    setCoverUrl(null);

    if (!artist || !album || !apiBaseUrl) return;

    const url =
      `${apiBaseUrl}/api/releases` +
      `?artist=${encodeURIComponent(artist)}` +
      `&title=${encodeURIComponent(album)}`;

    fetch(url)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: Array<{ cover_url?: string | null }>) => {
        const path = data?.[0]?.cover_url;
        // Release artwork paths are relative to the station API host.
        if (path) setCoverUrl(`${apiBaseUrl}${path}`);
      })
      .catch(() => {});
  }, [artist, album, apiBaseUrl]);

  return (
    <View style={styles.cover}>
      {/* Keep the fallback underneath remote artwork during loading or image failures. */}
      <Image source={fallbackSource} style={styles.absoluteFill} resizeMode="cover" />
      {coverUrl && (
        <Image
          source={{ uri: coverUrl }}
          style={styles.absoluteFill}
          resizeMode="cover"
          onError={() => setCoverUrl(null)}
          accessibilityLabel={`${artist || "Unknown artist"} - ${album || "Unknown album"}`}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    width: 64,
    height: 64,
    borderRadius: 4,
    flexShrink: 0,
    overflow: 'hidden',
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 64,
    height: 64,
  },
});
