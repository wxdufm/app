
/*
1. Fetches the current playlist from the API every 3 seconds
2. Shows the DJ name and show title at the top
3. Shows the current track: Album art, song info, play button
4. Show a recently played label then the list of past tracks
*/

import { useState, useEffect, useMemo } from 'react'
import { ScrollView, Text, View } from 'react-native'
import CurrentSongHeader from '../components/listenpage/CurrentSongHeader'
import LastPlayed from '../components/listenpage/LastPlayed'
import StreamingLinksSection from '../components/listenpage/StreamingLinksSection'
import { apiFetch } from '@/utils/api'

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

/**
 * Now Playing page: polls the station playlist every three seconds and shows
 * the current show and song, streaming links, and recently played tracks.
 */
export default function NowPlayingScreen() {
    const [currentPlaylist, setCurrentPlaylist] = useState<any>({})

    // Poll while this screen is mounted and cancel in-flight requests when it unmounts
    useEffect(() => {
        const controller = new AbortController()

        async function fetchCurrentPlaylist() {
            try {
                // always fetch current show first — its show/dj fields drive the header
                const currentData : any = await apiFetch('/api/playlists/current', { signal: controller.signal })

                const currentShow = currentData.show || null
                const currentDj = currentData.dj || null
                let allTracks = tagTracks(currentData.tracks, currentShow)

                // pull from previous shows until we have 10 tracks total
                if (allTracks.length < 10) {
                    const recentShows : any = await apiFetch('/api/playlists/recent?limit=4', { signal: controller.signal })
                    const now = Math.floor(Date.now() / 1000)
                    // Show start times use Unix seconds; exclude future shows and the current one.
                    const prevShows = recentShows.filter(
                        (s: any) => s.starttime <= now && s.ID !== currentShow?.ID
                    )

                    for (const show of prevShows) {
                        const showData : any = await apiFetch(`/api/playlists/${show.ID}`, { signal: controller.signal })
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
                if (controller.signal.aborted) return
                console.error('Failed to fetch playlist:', error)
            }
        }

        // Wait for each run to finish, then sleep 3s, then go again.
        async function poll() {
            while (!controller.signal.aborted) {
                await fetchCurrentPlaylist()
                await new Promise(resolve => setTimeout(resolve, 3000))
            }
        }

        poll()
        return () => { controller.abort() }
    }, [])

    // Tracks are oldest first: omit the final track because the header already displays it.
    const historyPlaylist = useMemo(() => {
        if (!Array.isArray(currentPlaylist.tracks) || currentPlaylist.tracks.length <= 1) {
            return { ...currentPlaylist, tracks: [] }
        }
        return { ...currentPlaylist, tracks: currentPlaylist.tracks.slice(0, -1) }  // removes the last item
    }, [currentPlaylist])  // only recalculates when currentPlaylist changes.

    const reverseTracks = Array.isArray(currentPlaylist.tracks)
        ? [...currentPlaylist.tracks].reverse()
        : []
    const currentTrack = reverseTracks[0] || {}

    return (
        <>
            <ScrollView className="flex-1">
                <View className="px-4 pt-4">
                    <CurrentSongHeader currentPlaylist={currentPlaylist} />
                    <StreamingLinksSection artist={currentTrack.artist} song={currentTrack.song} />
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
