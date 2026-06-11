import { Text, View } from "react-native";

export default function NowPlayingHeader({ currentPlaylist = {} }) {
  const show = currentPlaylist.show || {};

  const djname = show.djname || "";
  const title = show.title || "";

  return (
    <View className="items-center">
      <Text className="text-base text-center text-gray-300 tracking-wide">
        Current Show
      </Text>

      <Text className="text-5xl text-center font-light leading-tight text-white">
        DJ: {djname}
      </Text>

      <Text className="mt-1 text-2xl text-center text-gray-300">
        Show: {title}
      </Text>
    </View>
  );
}