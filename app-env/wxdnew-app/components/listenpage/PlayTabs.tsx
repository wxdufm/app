import { useState } from "react";
import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";

import NowPlaying from "./NowPlaying";
import LastPlayed from "./LastPlayed";

export default function PlayTabs({ currentPlaylist = {} }) {
  const [activeTab, setActiveTab] = useState("nowplaying");
  const { height } = useWindowDimensions();

  function renderTab() {
    if (activeTab === "nowplaying") {
      return <NowPlaying currentPlaylist={currentPlaylist} />;
    }

    if (activeTab === "lastplayed") {
      return <LastPlayed currentPlaylist={currentPlaylist} />;
    }

    return null;
  }

  const nowPlayingSelected = activeTab === "nowplaying";
  const lastPlayedSelected = activeTab === "lastplayed";

  return (
    <View className="w-full max-w-[360px] self-center">
      <View accessibilityRole="tablist" className="flex-row justify-center">
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: nowPlayingSelected }}
          onPress={() => setActiveTab("nowplaying")}
          className={
            nowPlayingSelected
              ? "border-b-2 border-blue-400 px-4 py-2"
              : "px-4 py-2"
          }
        >
          <Text
            className={
              nowPlayingSelected
                ? "text-lg text-white"
                : "text-lg text-gray-300"
            }
          >
            Now Playing
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: lastPlayedSelected }}
          onPress={() => setActiveTab("lastplayed")}
          className={
            lastPlayedSelected
              ? "border-b-2 border-blue-400 px-4 py-2"
              : "px-4 py-2"
          }
        >
          <Text
            className={
              lastPlayedSelected
                ? "text-lg text-white"
                : "text-lg text-gray-300"
            }
          >
            Last Played
          </Text>
        </Pressable>
      </View>

      <ScrollView style={{ maxHeight: height * 0.6 }}>
        {renderTab()}
      </ScrollView>
    </View>
  );
}