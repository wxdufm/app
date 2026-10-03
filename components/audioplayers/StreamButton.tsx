import { Pressable, View, Text } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useAudio } from '../AudioContext'

/** Starts or stops the shared live stream and displays its connection and playback state. */
export default function StreamButton() {
    // Playback belongs to the provider, so multiple buttons control the same live stream.
    const { isPlaying, isLoading, togglePlayPause } = useAudio()

    return (
        <Pressable
            onPress={togglePlayPause}
            disabled={isLoading}
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
                {isLoading ? 'connecting...' : isPlaying ? 'pause' : 'stream here'}
            </Text>
        </Pressable>
    )
}
