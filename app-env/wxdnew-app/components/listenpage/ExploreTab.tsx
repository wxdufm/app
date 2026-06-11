import { useState, useEffect } from 'react'
import { View, Text, Pressable, FlatList } from 'react-native'
import ExploreSong from './ExploreSong'

const API_BASE = 'https://api.wxdu.art'
const FILLER = 'https://wxdu.org/CD_1_Filler.jpg'

const RANGES = [
    { label: 'Last 1 day', value: 1 },
    { label: 'Last 7 days', value: 7 },
    { label: 'Last 30 days', value: 30 },
    { label: 'Last year', value: 365 },
]

async function getCovers(album, artist) {
    const res = await fetch(`${API_BASE}/api/charts/cover?artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}`)
    if (!res.ok) throw new Error(`Cover search failed: ${res.status}`)
    const cover = await res.json()
    return cover.coverUrl
}

export default function ExploreTab() {
    const [songs, setSongs] = useState([])
    const [range, setRange] = useState(7)

    async function fetchSongs(range) {
        try {
            const res = await fetch(`${API_BASE}/api/charts?range=${encodeURIComponent(range)}`)
            if (!res.ok) throw new Error(`Charts fetch failed: ${res.status}`)
            const raw = await res.json()
            const items = Array.isArray(raw) ? raw : []
            const withCover = await Promise.all(items.map(async item => {
                try {
                    const r = await getCovers(item.album, item.artist)
                    return { ...item, cover: r || FILLER }
                } catch {
                    return { ...item, cover: FILLER }
                }
            }))
            setSongs(withCover)
        } catch (err) {
            console.error('fetchSongs error', err)
            setSongs([])
        }
    }

    useEffect(() => {
        const ac = new AbortController()
        fetchSongs(range)
        return () => ac.abort()
    }, [range])

    return (
        <View className="w-full">
            <Text className="text-2xl font-light text-white text-center mb-4">Explore New Music</Text>

            {/* <select><option> → row of Pressable buttons
                React Native has no native <select> element */}
            <View className="flex-row justify-center gap-2 mb-4 flex-wrap">
                {RANGES.map(opt => (
                    <Pressable
                        key={opt.value}
                        onPress={() => setRange(opt.value)}
                        className={`px-3 py-1 rounded border ${range === opt.value ? 'border-white bg-white/10' : 'border-gray-600'}`}
                    >
                        <Text className="text-white text-sm">{opt.label}</Text>
                    </Pressable>
                ))}
            </View>

            {/* grid grid-cols-3 → FlatList with numColumns={3}
                FlatList virtualizes long lists automatically — better than .map() for performance */}
            <FlatList
                data={songs}
                keyExtractor={(_, i) => String(i)}
                numColumns={3}
                columnWrapperStyle={{ justifyContent: 'center', gap: 8 }}
                renderItem={({ item }) => <ExploreSong rank={item.rank} info={item} />}
                scrollEnabled={false}
            />
        </View>
    )
}
