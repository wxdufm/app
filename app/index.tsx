
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

// attaches _djname and _showtitle to each track so LastPlayed can group by show
function tagTracks(tracks: any[], show: any): any[] {
    return Array.isArray(tracks)
        ? tracks
            .filter((t: any) => t.artist !== '*****')
            .map((t: any) => ({
                ...t,
                _djname: show?.djname || null,
                _showtitle: show?.title || null,
            }))
        : []
}

export default function NowPlayingScreen() {
    const [currentPlaylist, setCurrentPlaylist] = useState<any>({})

    // fetch logic
    useEffect(() => {
        async function fetchCurrentPlaylist() {
            try {
                // always fetch current show first — its show/dj fields drive the header
                const currentRes = await fetch(`${API_BASE}/api/playlists/current`)
                const currentData = await currentRes.json()

                const currentShow = currentData.show || null
                const currentDj = currentData.dj || null
                let allTracks = tagTracks(currentData.tracks, currentShow)

                // pull from previous shows until we have 10 tracks total
                if (allTracks.length < 10) {
                    const recentRes = await fetch(`${API_BASE}/api/playlists/recent?limit=4`)
                    const recentShows = await recentRes.json()
                    const now = Math.floor(Date.now() / 1000)
                    const prevShows = recentShows.filter(
                        (s: any) => s.starttime <= now && s.ID !== currentShow?.ID
                    )

                    for (const show of prevShows) {
                        const showRes = await fetch(`${API_BASE}/api/playlists/${show.ID}`)
                        const showData = await showRes.json()
                        allTracks = [...allTracks, ...tagTracks(showData.tracks, showData.show || show)]
                        if (allTracks.length >= 10) break
                    }
                }

                // sort descending to isolate the 10 most recent, then flip to ascending —
                // NowPlaying uses .reverse()[0] to get the current track, so ascending is required
                allTracks.sort((a: any, b: any) => Date.parse(b.songstart || '') - Date.parse(a.songstart || ''))
                allTracks = allTracks.slice(0, 10)
                allTracks.sort((a: any, b: any) => Date.parse(a.songstart || '') - Date.parse(b.songstart || ''))

                setCurrentPlaylist({ show: currentShow, dj: currentDj, tracks: allTracks })
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
                    />
                </View>
                <View className="px-4 mt-6">
                    <Text className="text-white text-sm font-courier-bold uppercase tracking-widest mb-2">
                        Recently Played
                    </Text>
                    <LastPlayed
                        currentPlaylist={historyPlaylist}
                    />
                </View>
            </ScrollView>
        </>
    )
}
