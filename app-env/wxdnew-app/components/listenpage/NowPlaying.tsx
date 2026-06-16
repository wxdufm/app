import { useState, useEffect } from 'react'
import { View, Text, Image, type ImageSourcePropType } from 'react-native'
import StreamButton from '../audioplayers/StreamButton'

const API_BASE = 'https://api.wxdu.art'
const FILLER = require('../../assets/CD_1_Filler.jpg') as ImageSourcePropType

export default function NowPlaying({ currentPlaylist = {} }: any) {
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
            <Text className="mt-4 text-xl text-white">Song: {song}</Text>
            <Text className="text-white">Artist: {artist}</Text>
            <Text className="text-lg text-gray-300 mt-1">Album: {album}</Text>
            <View className="items-center">
                <View className="w-full max-w-sm">
                    <StreamButton />
                </View>
            </View>
        </View>
    )
}
