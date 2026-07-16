import { View, Text } from 'react-native'
import SongRow from './SongRow'

function formatTime(value: string | null | undefined) {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function LastPlayed({ currentPlaylist = {}, onSongPress }: any) {
    const tracks = Array.isArray(currentPlaylist.tracks)
        ? [...currentPlaylist.tracks].reverse()
        : []

    // group consecutive tracks by DJ name + show title —
    // grouping by showID would split recurring DJs with the same show name into duplicate headers
    type Group = { djname: string | null; showtitle: string | null; tracks: any[] }
    const groups: Group[] = []
    for (const track of tracks) {
        const last = groups[groups.length - 1]
        const sameLabel =
            last &&
            last.djname === (track._djname || null) &&
            last.showtitle === (track._showtitle || null)
        if (sameLabel) {
            last.tracks.push(track)
        } else {
            groups.push({
                djname: track._djname || null,
                showtitle: track._showtitle || null,
                tracks: [track],
            })
        }
    }

    // increments only for actual songs, so the SongRow color cycle skips over PSA slots
    // instead of burning a color on a row that never shows it
    let songIndex = 0

    return (
        <View className="w-full max-w-[360px] mx-auto">
            <View className="w-full max-w-sm self-center">
                {groups.map((group, gi) => (
                    <View key={gi}>
                        <View className="w-full rounded-lg mt-4 mb-1 px-3 py-1" style={{ backgroundColor: '#140858' }}>
                            <Text className="text-white text-xs font-courier uppercase tracking-widest">
                                {group.djname ?? 'Unknown DJ'}{group.showtitle ? ` — ${group.showtitle}` : ''}
                            </Text>
                        </View>
                        {group.tracks.map((item, i) => {
                            if (item.album?.toUpperCase().startsWith('PSA')) {
                                return (
                                    <View key={i} className="flex-row items-center gap-3 rounded-2xl bg-black/90 px-3 py-3 mb-2">
                                        <View className="px-2 py-0.5 rounded bg-zinc-800">
                                            <Text className="text-zinc-400 text-xs font-courier-bold uppercase tracking-widest">PSA</Text>
                                        </View>
                                        {formatTime(item.songstart) ? (
                                            <Text className="w-16 shrink-0 text-center text-sm text-zinc-400 font-courier">{formatTime(item.songstart)}</Text>
                                        ) : null}
                                        <Text className="text-zinc-400 text-sm font-courier flex-1" numberOfLines={1}>{item.artist}</Text>
                                    </View>
                                )
                            }
                            return (
                                <SongRow
                                    key={i}
                                    index={songIndex++}
                                    song={item.song}
                                    artist={item.artist}
                                    album={item.album}
                                    songStart={item.songstart}
                                    apiBaseUrl="https://api.wxdu.art"
                                    onPress={onSongPress ? () => onSongPress(item.song ?? '', item.artist ?? '', item.album ?? '') : undefined}
                                />
                            )
                        })}
                    </View>
                ))}
            </View>
        </View>
    )
}
