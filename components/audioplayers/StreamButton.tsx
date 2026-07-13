import { Pressable, View, Text } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useAudio } from '../AudioContext'

export default function StreamButton() {
    const { isPlaying, isLoading, togglePlayPause } = useAudio()

    return (
        <Pressable
            onPress={togglePlayPause}
            disabled={isLoading}
            className="flex-row items-center gap-4 bg-red-700 px-8 py-4 w-full rounded-lg"
        >
            <View className="h-8 w-8 items-center justify-center rounded-sm bg-white/20">
                <FontAwesome
                    name={isPlaying ? 'pause' : 'play'}
                    size={18}
                    color="white"
                />
            </View>
            <Text className="text-white text-xl tracking-widest font-courier">
                {isLoading ? 'connecting...' : isPlaying ? 'pause' : 'stream here'}
            </Text>
        </Pressable>
    )
}
