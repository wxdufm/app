import { useEffect, useState } from 'react'
import { View, Text, Image, Pressable, Dimensions, type ImageSourcePropType } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Path, Rect, G } from 'react-native-svg'
import StreamButton from '../audioplayers/StreamButton'

const API_BASE = 'https://api.wxdu.art'
const FILLER = require('../../assets/CD_1_Filler.jpg') as ImageSourcePropType
const CD_ICON = require('../../assets/listenpage/cd-icon.png') as ImageSourcePropType
const STATIC_NOISE = require('../../assets/listenpage/static-noise.png') as ImageSourcePropType
const IMG_SIZE = Math.min(Dimensions.get('window').width - 64, 320)

const DEFAULT_DJ = 'Lunokhod 3'
const DEFAULT_SHOW = 'Playing the Hits'

type CurretnSongHeaderProps = {
    currentPlaylist?: any
    onPress?: (song: string, artist: string, album: string) => void
}

export default function CurretnSongHeader({ currentPlaylist = {}, onPress }: CurretnSongHeaderProps) {
    const show = currentPlaylist.show || {}
    const djname = show.djname || DEFAULT_DJ
    const showtitle = show.title || DEFAULT_SHOW
    const isAuto = djname.toLowerCase() === 'lunokhod 3'

    const reverseTracks = Array.isArray(currentPlaylist.tracks)
        ? [...currentPlaylist.tracks].reverse()
        : []
    const track = reverseTracks?.[0] || {}

    const song = track.song || ''
    const artist = track.artist || ''
    const album = track.album || ''

    const [cover, setCover] = useState<string | null>(null)

    useEffect(() => {
        if (!artist && !album) {
            setCover(null)
            return
        }
        fetch(`${API_BASE}/api/releases?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(album)}`)
            .then(r => (r.ok ? r.json() : Promise.reject()))
            .then((data: Array<{ cover_url?: string | null }>) => {
                const path = data?.[0]?.cover_url
                if (!path) {
                    setCover(null)
                    return
                }
                const url = `${API_BASE}${path}`
                Image.prefetch(url)
                    .then(() => setCover(url))
                    .catch(() => {})
            })
            .catch(() => {})
    }, [artist, album])

    return (
        <View>
            <View style={{ width: 280, height: 68, alignSelf: 'flex-start', marginBottom: -26, zIndex: 2 }}>
                <Svg width={280} height={68} viewBox="0 0 280 68">
                    <Rect x={16} y={0} width={213} height={46} rx={4} fill="#140858" />
                    <G transform="translate(0, 3.81)">
                        <Path
                            d="M15.637 1.83464C16.6682 -0.611549 20.1346 -0.611546 21.1658 1.83465L36.564 38.3617C37.3977 40.3392 35.9457 42.527 33.7996 42.527H3.00313C0.857039 40.3392 -0.594934 40.3392 0.238719 38.3617L15.637 1.83464Z"
                            fill="#140858"
                            //fill="#2d253b"
                        />
                    </G>
                    <G transform="translate(208, 0)">
                        <Path
                            d="M16.9338 1.83304C17.9658 -0.611016 21.4293 -0.611011 22.4612 1.83304L39.1557 41.3707C39.9908 43.3485 38.5388 45.5377 36.3919 45.5377H3.00307C0.856236 45.5377 -0.595742 43.3485 0.23935 41.3707L16.9338 1.83304Z"
                            fill="#15085D"
                            //fill="#2d253b"
                        />
                    </G>
                </Svg>
                <Image
                    source={CD_ICON}
                    resizeMode="contain"
                    style={{ position: 'absolute', left: 22, top: 4, width: 37, height: 35 }}
                />
                <Text
                    className="text-white font-bitcount-bold tracking-wide"
                    style={{ position: 'absolute', left: 66, top: 8, fontSize: 20 }}
                >
                    Current Show
                </Text>
            </View>

            <LinearGradient
                colors={['#130754', '#3516cf']}
                //colors={['#2d253b', '#502d2d']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="w-full self-center rounded-2xl overflow-hidden"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 2,
                    elevation: 6,
                }}
            >
                <View className="px-4 pt-6 pb-3">
                    <Text className="text-lg text-white font-bitcount-bold">
                        {isAuto ? `AUTO: ${djname}` : `DJ: ${djname}`}
                    </Text>
                    <Text className="text-lg text-white font-bitcount-bold">
                        Show: {showtitle}
                    </Text>
                </View>

               
                <View style={{ marginHorizontal: 10, marginBottom: 11, borderRadius: 5, overflow: 'hidden', backgroundColor: '#868df4' }}>
                    <Image
                        source={STATIC_NOISE}
                        resizeMode="repeat"
                        tintColor="#ffffff"
                        //tintColor="#ece1e2"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            opacity: 0.6,
                            transform: [{ scale: 2.7 }],
                        }}
                    />
                    <View>
                        <View className="items-center px-4 pt-4 pb-1">
                            <View style={{ width: IMG_SIZE }}>
                                <Image
                                    source={cover ? { uri: cover } : FILLER}
                                    resizeMode="cover"
                                    style={{ width: IMG_SIZE, height: IMG_SIZE, borderRadius: 4 }}
                                    onError={() => setCover(null)}
                                />

                                <Pressable
                                    onPress={() => onPress?.(song, artist, album)}
                                    style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, alignSelf: 'stretch' })}
                                >
                                    <Text className="mt-4 text-lg text-[#2b10ba] font-courier" style={{ flexWrap: 'wrap' }}>
                                        <Text className="font-courier-bold">Song:</Text> {song}
                                    </Text>
                                    <Text className="mt-1 text-lg text-[#2b10ba] font-courier" style={{ flexWrap: 'wrap' }}>
                                        <Text className="font-courier-bold">Artist:</Text> {artist}
                                    </Text>
                                    <Text className="mt-1 text-lg text-[#2b10ba] font-courier" style={{ flexWrap: 'wrap' }}>
                                        <Text className="font-courier-bold">Album:</Text> {album}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>

                        <View className="items-center px-4 pt-1 pb-4">
                            <StreamButton />
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </View>
    )
}
