import { View, Text, Pressable, Linking } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

type Props = {
    artist?: string | null
    song?: string | null
}

const SERVICES = [
    { id: 'spotify',    label: 'Spotify',       icon: 'spotify'      as const, color: '#1DB954' },
    { id: 'apple',      label: 'Apple Music',   icon: 'apple'        as const, color: '#FC3C44' },
    { id: 'youtube',    label: 'YouTube Music', icon: 'youtube-play' as const, color: '#FF0000' },
    { id: 'soundcloud', label: 'SoundCloud',    icon: 'soundcloud'   as const, color: '#FF5500' },
    { id: 'bandcamp',   label: 'Bandcamp',      icon: 'bandcamp'     as const, color: '#1DA0C3' },
]

function serviceUrl(id: string, q: string): string {
    const encoded = encodeURIComponent(q)
    switch (id) {
        case 'spotify':    return `https://open.spotify.com/search/${encoded}`
        case 'apple':      return `https://music.apple.com/search?term=${encoded}`
        case 'youtube':    return `https://music.youtube.com/search?q=${encoded}`
        case 'soundcloud': return `https://soundcloud.com/search?q=${encoded}`
        case 'bandcamp':   return `https://bandcamp.com/search?q=${encoded}`
        default:           return ''
    }
}

export default function StreamingLinksSection({ artist, song }: Props) {
    const query = [artist, song].filter(Boolean).join(' ')
    if (!query) return null

    return (
        <View className="mt-4 rounded-2xl bg-white/10 p-4">
            <Text className="mb-3 text-xs font-bold uppercase tracking-widest text-white">
                Add it to your library
            </Text>
            <View className="flex-row flex-wrap gap-2">
                {SERVICES.map(service => (
                    <Pressable
                        key={service.id}
                        onPress={() => Linking.openURL(serviceUrl(service.id, query))}
                        className="mb-1 flex-row items-center gap-2 rounded-lg px-3 py-2"
                        style={[{ backgroundColor: service.color }, { width: '48%' }]}
                    >
                        <FontAwesome name={service.icon} size={16} color="white" />
                        <Text className="text-sm font-semibold text-white">{service.label}</Text>
                    </Pressable>
                ))}
            </View>
        </View>
    )
}
