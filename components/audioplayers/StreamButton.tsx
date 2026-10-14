import { Pressable, View, Text } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useAudio } from '../AudioContext'

export default function StreamButton() {
    const { isPlaying, isLoading, isStalled, togglePlayPause } = useAudio()

    return (
        <Pressable
            // stays enabled while connecting, so a slow connect can be cancelled
            onPress={togglePlayPause}
            className="flex-row items-center gap-4 px-8 py-4 w-full rounded-lg"
            style={{ backgroundColor: '#272065' }}
        >
            <View className="h-8 w-8 items-center justify-center rounded-sm bg-white/20">
                <FontAwesome
                    name={isPlaying ? 'pause' : 'play'}
                    size={18}
                    color="white"
                />
            </View>
            <Text className="text-white text-xl tracking-widest font-courier">
                {isStalled ? 'reconnecting...' : isLoading ? 'connecting...' : isPlaying ? 'pause' : 'stream here'}
            </Text>
        </Pressable>
    )
}
