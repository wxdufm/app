import { useEffect, useState } from 'react'
import { Image, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'

type Props = {
    visible: boolean
    song: string
    artist: string
    album: string
    onClose: () => void
}

// Each service carries its own icon renderer so the loop stays clean
type ServiceEntry = {
    label: string
    color: string
    url: string
    renderIcon: () => React.ReactNode
}

export default function SongDetailModal({ visible, song, artist, album, onClose }: Props) {
    const insets = useSafeAreaInsets()
    const [cover, setCover] = useState<string | null>(null)

    // fetch album art whenever the modal opens with a new track
    useEffect(() => {
        if (!visible || !artist || !album) {
            setCover(null)
            return
        }
        fetch(`https://api.wxdu.art/api/charts/cover?artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}`)
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(data => setCover(data.coverUrl || null))
            .catch(() => setCover(null))
    }, [visible, artist, album])

    const q = encodeURIComponent(`${artist} ${song}`)
    const albumQ = encodeURIComponent(`${artist} ${album}`)

    const streamingServices: ServiceEntry[] = [
        {
            label: 'Spotify',
            color: '#1DB954',
            url: `https://open.spotify.com/search/${q}`,
            renderIcon: () => <FontAwesome name="spotify" size={20} color="white" />,
        },
        {
            label: 'Apple Music',
            color: '#FC3C44',
            url: `https://music.apple.com/us/search?term=${q}`,
            renderIcon: () => <FontAwesome name="apple" size={20} color="white" />,
        },
        {
            label: 'YouTube Music',
            color: '#FF0000',
            url: `https://music.youtube.com/search?q=${q}`,
            renderIcon: () => <FontAwesome name="youtube" size={20} color="white" />,
        },
        {
            label: 'Bandcamp',
            color: '#1DA0C3',
            url: `https://bandcamp.com/search?q=${q}`,
            renderIcon: () => <FontAwesome name="bandcamp" size={20} color="white" />,
        },
        {
            label: 'SoundCloud',
            color: '#FF5500',
            url: `https://soundcloud.com/search?q=${q}`,
            renderIcon: () => <FontAwesome name="soundcloud" size={20} color="white" />,
        },
    ]

    const moreInfoLinks: ServiceEntry[] = [
        {
            label: 'Discogs',
            color: '#27272a',
            url: `https://www.discogs.com/search/?q=${albumQ}&type=release`,
            renderIcon: () => <MaterialCommunityIcons name="record-circle" size={20} color="white" />,
        },
        {
            label: 'Wikipedia',
            color: '#3f3f46',
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(artist)}`,
            renderIcon: () => <FontAwesome name="wikipedia-w" size={20} color="white" />,
        },
    ]

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                {/* tapping the dark area behind the sheet closes it */}
                <Pressable style={[StyleSheet.absoluteFillObject, styles.backdrop]} onPress={onClose} />

                <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
                    {/* drag handle */}
                    <View style={styles.handle} />

                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                    >
                        {/* album art */}
                        <Image
                            source={cover ? { uri: cover } : require('../assets/CD_1_Filler.jpg')}
                            style={styles.artwork}
                            resizeMode="cover"
                        />

                        {/* track info */}
                        <Text style={styles.songTitle} numberOfLines={2}>{song}</Text>
                        <Text style={styles.artist} numberOfLines={1}>{artist}</Text>
                        <Text style={styles.album} numberOfLines={1}>{album}</Text>

                        {/* streaming links */}
                        <Text style={styles.sectionHeader}>Add to your library</Text>
                        <View style={styles.grid}>
                            {streamingServices.map(s => (
                                <Pressable
                                    key={s.label}
                                    onPress={() => Linking.openURL(s.url)}
                                    style={({ pressed }) => [
                                        styles.serviceButton,
                                        { backgroundColor: s.color, opacity: pressed ? 0.8 : 1 },
                                    ]}
                                >
                                    {s.renderIcon()}
                                    <Text style={styles.serviceLabel} numberOfLines={1}>{s.label}</Text>
                                </Pressable>
                            ))}
                        </View>

                        {/* more info links */}
                        <Text style={styles.sectionHeader}>More Info</Text>
                        <View style={styles.row}>
                            {moreInfoLinks.map(l => (
                                <Pressable
                                    key={l.label}
                                    onPress={() => Linking.openURL(l.url)}
                                    style={({ pressed }) => [
                                        styles.infoButton,
                                        { backgroundColor: l.color, opacity: pressed ? 0.7 : 1 },
                                    ]}
                                >
                                    {l.renderIcon()}
                                    <Text style={styles.serviceLabel}>{l.label}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    sheet: {
        backgroundColor: '#09090b',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '92%',
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#52525b',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
    artwork: {
        width: 200,
        height: 200,
        borderRadius: 12,
        alignSelf: 'center',
        marginBottom: 20,
    },
    songTitle: {
        color: 'white',
        fontSize: 22,
        fontFamily: 'CourierPrime-Bold',
        marginBottom: 4,
    },
    artist: {
        color: '#d4d4d8',
        fontSize: 18,
        fontFamily: 'CourierPrime-Italic',
        marginBottom: 4,
    },
    album: {
        color: '#71717a',
        fontFamily: 'CourierPrime-Regular',
        marginBottom: 24,
    },
    sectionHeader: {
        color: 'white',
        fontSize: 11,
        fontFamily: 'CourierPrime-Bold',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 12,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 24,
    },
    serviceButton: {
        width: '48%',
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    infoButton: {
        flex: 1,
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: '#3f3f46',
    },
    row: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 8,
    },
    serviceLabel: {
        color: 'white',
        fontFamily: 'CourierPrime-Bold',
        fontSize: 14,
        flex: 1,
    },
})
