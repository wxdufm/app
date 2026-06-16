import { Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = {
    visible: boolean
    song: string
    artist: string
    album: string
    onClose: () => void
}

export default function SongDetailModal({ visible, song, artist, album, onClose }: Props) {
    const insets = useSafeAreaInsets()

    const q = encodeURIComponent(`${artist} ${song}`)
    const albumQ = encodeURIComponent(`${artist} ${album}`)

    const streamingServices = [
        { label: 'Spotify',       color: '#1DB954', url: `https://open.spotify.com/search/${q}` },
        { label: 'Apple Music',   color: '#FC3C44', url: `https://music.apple.com/us/search?term=${q}` },
        { label: 'YouTube Music', color: '#FF0000', url: `https://music.youtube.com/search?q=${q}` },
        { label: 'Bandcamp',      color: '#1DA0C3', url: `https://bandcamp.com/search?q=${q}` },
        { label: 'SoundCloud',    color: '#FF5500', url: `https://soundcloud.com/search?q=${q}` },
    ]

    const moreInfoLinks = [
        { label: 'Discogs',   color: '#27272a', url: `https://www.discogs.com/search/?q=${albumQ}&type=release` },
        { label: 'Wikipedia', color: '#3f3f46', url: `https://en.wikipedia.org/wiki/${encodeURIComponent(artist)}` },
    ]

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                {/* semi-transparent backdrop — tapping closes the sheet */}
                <Pressable
                    style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.6)' }]}
                    onPress={onClose}
                />

                <View style={{ backgroundColor: '#09090b', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: insets.bottom + 16 }}>
                    {/* drag handle */}
                    <View className="w-10 h-1 bg-zinc-600 self-center rounded-full mt-3 mb-5" />

                    <ScrollView className="px-5" bounces={false}>
                        {/* track info */}
                        <Text className="text-white text-2xl font-courier-bold mb-1" numberOfLines={2}>{song}</Text>
                        <Text className="text-zinc-300 text-lg font-courier-italic mb-1" numberOfLines={1}>{artist}</Text>
                        <Text className="text-zinc-500 font-courier mb-6" numberOfLines={1}>{album}</Text>

                        {/* streaming service search buttons — 2-column grid */}
                        <Text className="text-white text-xs font-courier-bold uppercase tracking-widest mb-3">
                            Add to your library
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                            {streamingServices.map(s => (
                                <Pressable
                                    key={s.label}
                                    onPress={() => Linking.openURL(s.url)}
                                    style={({ pressed }) => ({ width: '48%', backgroundColor: s.color, opacity: pressed ? 0.8 : 1 })}
                                    className="items-center py-3 rounded-xl"
                                >
                                    <Text className="text-white text-sm font-courier-bold">{s.label}</Text>
                                </Pressable>
                            ))}
                        </View>

                        {/* more info links */}
                        <Text className="text-white text-xs font-courier-bold uppercase tracking-widest mb-3">
                            More Info
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                            {moreInfoLinks.map(l => (
                                <Pressable
                                    key={l.label}
                                    onPress={() => Linking.openURL(l.url)}
                                    style={({ pressed }) => ({ flex: 1, backgroundColor: l.color, opacity: pressed ? 0.7 : 1 })}
                                    className="items-center py-3 rounded-xl border border-zinc-700"
                                >
                                    <Text className="text-white text-sm font-courier-bold">{l.label}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}
