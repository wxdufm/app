import { View, Text } from 'react-native'
import SongRow from './SongRow'

export default function LastPlayed({ currentPlaylist = {}, onSongPress }: any) {
    const tracks = Array.isArray(currentPlaylist.tracks)
        ? [...currentPlaylist.tracks].reverse()
        : []

    // group consecutive tracks that share the same showID
    type Group = { showID: number; djname: string | null; showtitle: string | null; tracks: any[] }
    const groups: Group[] = []
    for (const track of tracks) {
        const last = groups[groups.length - 1]
        if (last && last.showID === track.showID) {
            last.tracks.push(track)
        } else {
            groups.push({
                showID: track.showID,
                djname: track._djname || null,
                showtitle: track._showtitle || null,
                tracks: [track],
            })
        }
    }

    return (
        <View className="w-full max-w-[360px] mx-auto">
            <View className="w-full max-w-sm self-center">
                {groups.map((group, gi) => (
                    <View key={gi}>
                        <Text className="text-zinc-500 text-xs font-courier uppercase tracking-widest mt-4 mb-1">
                            {group.djname ?? 'Unknown DJ'}{group.showtitle ? ` — ${group.showtitle}` : ''}
                        </Text>
                        {group.tracks.map((item, i) => (
                            <SongRow
                                key={i}
                                song={item.song}
                                artist={item.artist}
                                album={item.album}
                                songStart={item.songstart}
                                apiBaseUrl="https://api.wxdu.art"
                                onPress={onSongPress ? () => onSongPress(item.song ?? '', item.artist ?? '', item.album ?? '') : undefined}
                            />
                        ))}
                    </View>
                ))}
            </View>
        </View>
    )
}
