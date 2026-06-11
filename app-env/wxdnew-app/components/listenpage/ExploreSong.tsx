import { View, Text, Image, Pressable } from 'react-native'

export default function ExploreSong({ rank = '', info = {} as any }) {
    const cover = info.cover || 'https://wxdu.org/CD_1_Filler.jpg'

    return (
        // hover:scale-125, cursor-pointer, select-none, focus-visible removed
        // those are web-only — use Pressable's onPress for tap behavior later
        <Pressable className="w-full max-w-[180px] bg-black p-3 rounded border border-gray-700 items-center">
            <Text className="text-2xl font-medium mb-2 text-white">{rank}</Text>
            <Image
                source={{ uri: cover }}
                className="w-36 h-36 mb-3 rounded"
                style={{ resizeMode: 'cover' }}
            />
            <View className="items-center">
                <Text className="font-semibold text-sm text-center text-white" numberOfLines={1}>
                    {info.song || 'Unknown title'}
                </Text>
                <Text className="text-gray-300 text-sm text-center" numberOfLines={1}>
                    {info.artist || 'Unknown artist'}
                </Text>
                <Text className="text-gray-400 text-sm text-center" numberOfLines={1}>
                    {info.album || 'Unknown album'}
                </Text>
            </View>
        </Pressable>
    )
}
