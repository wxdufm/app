/*
1. Fetches the current playlist from the API every 3 seconds
2. Shows the DJ name and show title at the top
3. Shows the current track: Album art, song info, play button
4. Show a recently played label then the list of past tracks
*/

import { useState, useEffect, useMemo } from 'react'
import { ScrollView, Text, View } from 'react-native'
import NowPlayingHeader from '../components/listenpage/NowPlayingHeader'
import NowPlaying from '../components/listenpage/NowPlaying'
import LastPlayed from '../components/listenpage/LastPlayed'

const API_BASE = 'https://api.wxdu.art'

export default function NowPlayingScreen() {
    const [currentPlaylist, setCurrentPlaylist] = useState<any>({})
    const [modalTrack, setModalTrack] = useState<{ song: string; artist: string; album: string } | null>(null)

    // fetch logic
    useEffect(() => {
        async function fetchCurrentPlaylist() {
            try {
                const response = await fetch(`${API_BASE}/api/playlists/current`)
                const data = await response.json()

                const tracks = Array.isArray(data.tracks)
                    ? data.tracks.filter((t: any) => t.artist !== '*****')
                    : []

                // active show with history — use as-is, no extra calls
                if (tracks.length > 1) {
                    setCurrentPlaylist(data)
                    return
                }

                // show just started (0–1 tracks) — pull recent history from previous shows
                // so Recently Played doesn't go blank at every show transition
                const recentRes = await fetch(`${API_BASE}/api/playlists/recent?limit=4`)
                const recentShows = await recentRes.json()

                const now = Math.floor(Date.now() / 1000)
                const prevShows = recentShows.filter(
                    (s: any) => s.starttime <= now && s.ID !== data.show?.ID
                )

                let historyTracks: any[] = []
                for (const show of prevShows) {
                    const showRes = await fetch(`${API_BASE}/api/playlists/${show.ID}`)
                    const showData = await showRes.json()
                    const t = Array.isArray(showData.tracks)
                        ? showData.tracks.filter((t: any) => t.artist !== '*****')
                        : []
                    historyTracks = [...historyTracks, ...t]
                    if (historyTracks.length >= 10) break
                }

                // sort descending to isolate the 10 most recent, then flip to ascending —
                // the app uses .reverse()[0] to get the current track so ascending is required
                historyTracks.sort((a, b) => Date.parse(b.songstart || '') - Date.parse(a.songstart || ''))
                historyTracks = historyTracks.slice(0, 10)
                historyTracks.sort((a, b) => Date.parse(a.songstart || '') - Date.parse(b.songstart || ''))

                setCurrentPlaylist({ ...data, tracks: [...historyTracks, ...tracks] })
            } catch (error) {
                console.error('Failed to fetch playlist:', error)
            }
        }

        fetchCurrentPlaylist()
        const interval = setInterval(fetchCurrentPlaylist, 3000)
        return () => clearInterval(interval)
    }, [])

    // since NowPlaying shows most recent and LastPlayed shows all tracks including current, we need to give LastPlayed a modified version of the playlist
    const historyPlaylist = useMemo(() => {
        if (!Array.isArray(currentPlaylist.tracks) || currentPlaylist.tracks.length <= 1) {
            return { ...currentPlaylist, tracks: [] }
        }
        return { ...currentPlaylist, tracks: currentPlaylist.tracks.slice(0, -1) }  // removes the last item
    }, [currentPlaylist])  // only recalculates when currentPlaylist changes.

    // the JSX
    return (
        <>
            <ScrollView className="flex-1 bg-black">
                <View className="px-4 pt-4 pb-2">
                    <NowPlayingHeader currentPlaylist={currentPlaylist} />
                </View>
                <View className="px-4 mt-2">
                    <NowPlaying
                        currentPlaylist={currentPlaylist}
                        onPress={(song: string, artist: string, album: string) => setModalTrack({ song, artist, album })}
                    />
                </View>
                <View className="px-4 mt-6">
                    <Text className="text-white text-sm font-courier-bold uppercase tracking-widest mb-2">
                        Recently Played
                    </Text>
                    <LastPlayed
                        currentPlaylist={historyPlaylist}
                        onSongPress={(song: string, artist: string, album: string) => setModalTrack({ song, artist, album })}
                    />
                </View>
            </ScrollView>
        </>
    )
}