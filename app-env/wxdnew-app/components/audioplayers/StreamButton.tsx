import { Pressable, View, Text } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useAudio } from '../AudioContext'

export default function StreamButton() {
    const { isPlaying, togglePlayPause } = useAudio()

    return (
        <Pressable
            onPress={togglePlayPause}
            className="flex-row items-center gap-4 bg-red-700 px-8 py-4 w-full"
        >
            {/* icon container — same classes as the website */}
            <View className="h-8 w-8 items-center justify-center rounded-sm bg-white/20">
                {/* FontAwesome takes name, size, and color as props directly
                    instead of className — icons aren't text nodes in React Native */}
                <FontAwesome
                    name={isPlaying ? 'pause' : 'play'}
                    size={18}
                    color="white"
                />
            </View>

            {/* Text replaces <span> — same classes as the website */}
            <Text className="text-white text-xl tracking-widest">
                {isPlaying ? 'pause' : 'stream here'}
            </Text>
        </Pressable>
    )
}
