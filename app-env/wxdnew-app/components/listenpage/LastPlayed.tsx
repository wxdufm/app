import { View } from 'react-native'
import SongRow from './SongRow'

export default function LastPlayed({ currentPlaylist = {} }: any) {
    const tracks = Array.isArray(currentPlaylist.tracks)
        ? [...currentPlaylist.tracks].reverse()
        : []

    return (
        <View className="w-full max-w-[360px] mx-auto">
            <View className="w-full max-w-sm self-center">
                {tracks.map((item, i) => (
                    <SongRow
                        key={i}
                        song={item.song}
                        artist={item.artist}
                        album={item.album}
                        songStart={item.songstart}
                        apiBaseUrl="https://api.wxdu.art"
                    />
                ))}
            </View>
        </View>
    )
}
