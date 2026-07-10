import { useState } from 'react'
import { View, Text, Pressable, Linking, ActivityIndicator } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { getSpotifyAlbumUrl } from '../../utils/spotify'

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

function searchUrl(id: string, artist: string, song: string): string {
    const q = encodeURIComponent(`${artist} ${song}`)
    switch (id) {
        case 'apple':      return `https://music.apple.com/search?term=${q}&types=albums`
        case 'youtube':    return `https://music.youtube.com/search?q=${q}`
        case 'soundcloud': return `https://soundcloud.com/search?q=${q}`
        case 'bandcamp':   return `https://bandcamp.com/search?q=${q}`
        default:           return ''
    }
}

export default function StreamingLinksSection({ artist, song }: Props) {
    const [spotifyLoading, setSpotifyLoading] = useState(false)

    if (!artist || !song) return null

    async function handlePress(id: string) {
        if (id === 'spotify') {
            setSpotifyLoading(true)
            const url = await getSpotifyAlbumUrl(artist!, song!)
            setSpotifyLoading(false)
            Linking.openURL(url)
        } else {
            Linking.openURL(searchUrl(id, artist!, song!))
        }
    }

    return (
        <View className="mt-4 rounded-2xl bg-white/40 p-4">
            <Text className="mb-3 text-xs font-bold uppercase tracking-widest text-white">
                Add it to your library
            </Text>
            <View className="flex-row flex-wrap gap-2">
                {SERVICES.map(service => (
                    <Pressable
                        key={service.id}
                        onPress={() => handlePress(service.id)}
                        disabled={service.id === 'spotify' && spotifyLoading}
                        className="mb-1 flex-row items-center gap-2 rounded-lg px-3 py-2"
                        style={[{ backgroundColor: service.color }, { width: '48%' }]}
                    >
                        {service.id === 'spotify' && spotifyLoading
                            ? <ActivityIndicator size="small" color="white" />
                            : <FontAwesome name={service.icon} size={16} color="white" />
                        }
                        <Text className="text-sm font-semibold text-white">{service.label}</Text>
                    </Pressable>
                ))}
            </View>
        </View>
    )
}
