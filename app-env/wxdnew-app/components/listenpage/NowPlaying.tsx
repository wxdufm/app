import { useState, useEffect } from 'react'
import { View, Text, Image } from 'react-native'
import StreamButton from '../audioplayers/StreamButton'

const API_BASE = 'https://api.wxdu.art'
const FILLER = 'https://wxdu.org/CD_1_Filler.jpg'

export default function NowPlaying({ currentPlaylist = {} }: any) {
    const reverseTrack = Array.isArray(currentPlaylist.tracks)
        ? [...currentPlaylist.tracks].reverse()
        : []
    const track = reverseTrack?.[0] || {}

    const song = track.song || ''
    const artist = track.artist || ''
    const album = track.album || ''

    const [cover, setCover] = useState(FILLER)

    useEffect(() => {
        if (!artist && !album) return
        fetch(`${API_BASE}/api/charts/cover?artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}`)
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(data => setCover(data.coverUrl || FILLER))
            .catch(() => {})
    }, [track])

    return (
        <View className="w-full max-w-[320px] mx-auto">
            <Image
                source={{ uri: cover }}
                resizeMode="cover"
                className="w-full rounded-sm"
                style={{ aspectRatio: 1 }}
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
