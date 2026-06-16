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

type ServiceEntry = {
    label: string
    color: string
    url: string
    renderIcon: () => React.ReactNode
}

// ─── sub-components ──────────────────────────────────────────────────────────

// Icon on left, label fills remaining space — used in the streaming 2-column grid
function ServiceButton({ entry }: { entry: ServiceEntry }) {
    return (
        <Pressable
            onPress={() => Linking.openURL(entry.url)}
            style={({ pressed }) => [
                styles.serviceButton,
                { backgroundColor: entry.color, opacity: pressed ? 0.8 : 1 },
            ]}
        >
            {entry.renderIcon()}
            <Text style={styles.serviceLabel} numberOfLines={1}>{entry.label}</Text>
        </Pressable>
    )
}

// Icon + label centered together — used in the More Info row
function InfoButton({ entry }: { entry: ServiceEntry }) {
    return (
        <Pressable
            onPress={() => Linking.openURL(entry.url)}
            style={({ pressed }) => [
                styles.infoButton,
                { backgroundColor: entry.color, opacity: pressed ? 0.8 : 1 },
            ]}
        >
            {entry.renderIcon()}
            <Text style={styles.infoLabel}>{entry.label}</Text>
        </Pressable>
    )
}

// ─── main component ───────────────────────────────────────────────────────────

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
            renderIcon: () => <FontAwesome name="spotify" size={22} color="white" />,
        },
        {
            label: 'Apple Music',
            color: '#FC3C44',
            url: `https://music.apple.com/us/search?term=${q}`,
            renderIcon: () => <FontAwesome name="apple" size={22} color="white" />,
        },
        {
            label: 'YouTube Music',
            color: '#FF0000',
            url: `https://music.youtube.com/search?q=${q}`,
            renderIcon: () => <FontAwesome name="youtube" size={22} color="white" />,
        },
        {
            label: 'Bandcamp',
            color: '#1DA0C3',
            url: `https://bandcamp.com/search?q=${q}`,
            renderIcon: () => <FontAwesome name="bandcamp" size={22} color="white" />,
        },
        {
            label: 'SoundCloud',
            color: '#FF5500',
            url: `https://soundcloud.com/search?q=${q}`,
            renderIcon: () => <FontAwesome name="soundcloud" size={22} color="white" />,
        },
    ]

    const moreInfoLinks: ServiceEntry[] = [
        {
            label: 'Discogs',
            color: '#F5A623',  // amber — evokes vinyl/records
            url: `https://www.discogs.com/search/?q=${albumQ}&type=release`,
            renderIcon: () => <MaterialCommunityIcons name="record-circle" size={22} color="white" />,
        },
        {
            label: 'Wikipedia',
            color: '#4A6FA5',  // slate blue — Wikipedia's link colour
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(artist)}`,
            renderIcon: () => <FontAwesome name="wikipedia-w" size={22} color="white" />,
        },
    ]

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                {/* tapping the dark area behind the sheet closes it */}
                <Pressable style={[StyleSheet.absoluteFillObject, styles.backdrop]} onPress={onClose} />

                <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
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
                        <Text style={styles.albumText} numberOfLines={1}>{album}</Text>

                        {/* streaming links — explicit left column (3) + right column (2) */}
                        <Text style={styles.sectionHeader}>Add to your library</Text>
                        <View style={styles.twoColumns}>
                            <View style={styles.column}>
                                {streamingServices.slice(0, 3).map(s => (
                                    <ServiceButton key={s.label} entry={s} />
                                ))}
                            </View>
                            <View style={styles.column}>
                                {streamingServices.slice(3).map(s => (
                                    <ServiceButton key={s.label} entry={s} />
                                ))}
                            </View>
                        </View>

                        {/* more info — two buttons side by side, icon+label centered within each */}
                        <Text style={styles.sectionHeader}>More Info</Text>
                        <View style={styles.infoRow}>
                            {moreInfoLinks.map(l => (
                                <InfoButton key={l.label} entry={l} />
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}

// ─── styles ───────────────────────────────────────────────────────────────────

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
    albumText: {
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
    // two equal-width columns sitting side by side
    twoColumns: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 24,
    },
    // each column stacks its buttons vertically
    column: {
        flex: 1,
        gap: 10,
    },
    // streaming button: icon left, label fills remaining width
    serviceButton: {
        borderRadius: 10,
        paddingVertical: 18,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    serviceLabel: {
        color: 'white',
        fontFamily: 'CourierPrime-Bold',
        fontSize: 15,
        flex: 1,  // fills remaining space so the icon stays pinned left
    },
    // more info row: two buttons side by side, each fills half the row
    infoRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 8,
    },
    // info button: icon + label centered together within the button
    infoButton: {
        flex: 1,
        borderRadius: 10,
        paddingVertical: 18,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',  // groups icon + label as a unit in the middle
        gap: 10,
    },
    infoLabel: {
        color: 'white',
        fontFamily: 'CourierPrime-Bold',
        fontSize: 15,
        // no flex: 1 — sizes to content so justifyContent: center can do its job
    },
})
