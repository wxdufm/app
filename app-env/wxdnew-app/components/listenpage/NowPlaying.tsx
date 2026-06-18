import { useState, useEffect } from 'react'
import { View, Text, Image, Pressable, type ImageSourcePropType } from 'react-native'
import StreamButton from '../audioplayers/StreamButton'
import StreamingLinksSection from './StreamingLinksSection'

const API_BASE = 'https://api.wxdu.art'
const FILLER = require('../../assets/CD_1_Filler.jpg') as ImageSourcePropType

export default function NowPlaying({ currentPlaylist = {}, onPress }: any) {
    const reverseTrack = Array.isArray(currentPlaylist.tracks)
        ? [...currentPlaylist.tracks].reverse()
        : []
    const track = reverseTrack?.[0] || {}

    const song = track.song || ''
    const artist = track.artist || ''
    const album = track.album || ''

    const [cover, setCover] = useState<string | null>(null)

    useEffect(() => {
        setCover(null)
        if (!artist && !album) return
        fetch(`${API_BASE}/api/releases?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(album)}`)
            .then(r => r.ok ? r.json() : Promise.reject())
            .then((data: Array<{ cover_url?: string | null }>) => {
                const path = data?.[0]?.cover_url
                if (path) setCover(`${API_BASE}${path}`)
            })
            .catch(() => {})
    }, [artist, album])

    return (
        <View className="w-full mx-auto">
            <Image
                source={cover ? { uri: cover } : FILLER}
                resizeMode="cover"
                className="w-full rounded-sm"
                style={{ aspectRatio: 1, maxHeight: 350, alignSelf: 'center' }}
            />
            <Pressable
                onPress={() => onPress?.(song, artist, album)}
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
                <Text className="mt-4 text-xl text-white font-courier">Song: {song}</Text>
                <Text className="text-white font-courier-italic">Artist: {artist}</Text>
                <Text className="text-lg text-gray-300 mt-1 font-courier">Album: {album}</Text>
            </Pressable>
            <View className="items-center mt-4">
                <View className="w-full max-w-sm">
                    <StreamButton />
                </View>
            </View>
            <StreamingLinksSection artist={artist} song={song} />
        </View>
    )
}
