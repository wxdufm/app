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

/** Displays the current show's DJ and title, labeling the automated DJ as AUTO. */
export default function NowPlayingHeader({
  currentPlaylist = {},
}: NowPlayingHeaderProps) {
  const show = currentPlaylist.show || {};

  const djname = show.djname || "";
  const title = show.title || "";

  // Lunokhod 3 is the station's automated DJ and receives the AUTO label.
  const isAuto = djname.toLowerCase() === "lunokhod 3";

  return (
    <View className="items-center rounded-2xl bg-black/40 px-4 py-3">
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
