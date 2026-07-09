import { Text, View } from "react-native";

type CurrentPlaylist = {
  show?: {
    djname?: string | null;
    title?: string | null;
  } | null;
};

type NowPlayingHeaderProps = {
  currentPlaylist?: CurrentPlaylist;
};

export default function NowPlayingHeader({
  currentPlaylist = {},
}: NowPlayingHeaderProps) {
  const show = currentPlaylist.show || {};

  const djname = show.djname || "";
  const title = show.title || "";

  const isAuto = djname.toLowerCase() === "lunokhod 3";

  return (
    <View className="items-center">
      <Text className="text-base text-center text-gray-300 tracking-wide font-courier">
        Current Show
      </Text>

      <Text className="text-5xl text-center leading-tight text-white font-courier">
        {isAuto ? `AUTO: ${djname}` : `DJ: ${djname}`}
      </Text>

      <Text className="mt-1 text-2xl text-center text-gray-300 font-courier">
        Show: {title}
      </Text>
    </View>
  );
}
