import { useState, useEffect } from 'react'
import { View, Text, Image, Pressable } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

const API_BASE = 'https://api.wxdu.art'

interface Track {
    artist: string
    song: string
    album: string
    starttime: number
    cover_url: string | null
}

export default function IpodWidget() {
    const [tracks, setTracks] = useState<Track[]>([])
    const [current, setCurrent] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/recenttracks`)
                if (!res.ok) throw new Error()
                const data: Track[] = await res.json()
                setTracks(data.slice(0, 5))
            } catch {
            } finally {
                setLoading(false)
            }
        }

        fetchTracks()
        const id = setInterval(fetchTracks, 30_000)
        return () => clearInterval(id)
    }, [])

    useEffect(() => {
        if (tracks.length <= 1) return
        const id = setInterval(() => setCurrent(i => (i + 1) % tracks.length), 6000)
        return () => clearInterval(id)
    }, [tracks.length])

    const prev = () => setCurrent(i => (i - 1 + tracks.length) % tracks.length)
    const next = () => setCurrent(i => (i + 1) % tracks.length)

    const formatTime = (unixSeconds: number) =>
        new Date(unixSeconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const track = tracks[current]
    const coverSource = track?.cover_url
        ? { uri: `${API_BASE}${track.cover_url}` }
        : require('../../assets/CD_1_Filler.jpg')

    return (
        <View className="w-full">
            <Text className="text-white text-2xl text-center mb-2">Recently Played</Text>

            <View style={{ width: '100%', aspectRatio: 891 / 340 }}>
                <Image
                    source={require('../../assets/ipod.png')}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="stretch"
                />

                {/* Screen area */}
                <View
                    className="absolute bg-black overflow-hidden"
                    style={{ top: '10%', left: '5%', width: '56%', height: '78%' }}
                >
                    {loading ? (
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-zinc-400" style={{ fontSize: 9 }}>loading...</Text>
                        </View>
                    ) : !track ? (
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-zinc-400" style={{ fontSize: 9 }}>no playlist</Text>
                        </View>
                    ) : (
                        <View className="flex-1 flex-row">
                            {/* Album art — alignSelf stretch fills the row height, aspectRatio keeps it square */}
                            <Image
                                source={coverSource}
                                style={{ alignSelf: 'stretch', aspectRatio: 1 }}
                                resizeMode="contain"
                            />
                            {/* Song info */}
                            <View className="flex-1 flex-col items-center justify-between px-1 py-1">
                                <View className="flex-1 items-center justify-center w-full">
                                    <Text
                                        className="font-bold text-center w-full"
                                        style={{ fontSize: 11, color: '#e0ff05', lineHeight: 14 }}
                                        numberOfLines={2}
                                    >
                                        {track.song}
                                    </Text>
                                    <Text
                                        className="text-white text-center w-full"
                                        style={{ fontSize: 11, lineHeight: 14 }}
                                        numberOfLines={2}
                                    >
                                        {track.artist}
                                    </Text>
                                </View>
                                <Text className="text-zinc-400 text-center w-full" style={{ fontSize: 9 }}>
                                    {formatTime(track.starttime)} · {current + 1}/{tracks.length}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Prev button */}
                <Pressable
                    onPress={prev}
                    className="absolute items-center justify-center"
                    style={{ top: '25%', left: '0%', width: '5%', height: '50%' }}
                >
                    <FontAwesome name="chevron-left" size={16} color="#a1a1aa" />
                </Pressable>

                {/* Next button */}
                <Pressable
                    onPress={next}
                    className="absolute items-center justify-center"
                    style={{ top: '25%', left: '61%', width: '5%', height: '50%' }}
                >
                    <FontAwesome name="chevron-right" size={16} color="#a1a1aa" />
                </Pressable>
            </View>
        </View>
    )
}
