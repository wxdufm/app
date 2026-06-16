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

export default function NowPlayingScreen() {
    const [currentPlaylist, setCurrentPlaylist] = useState<any>({})
    const [modalTrack, setModalTrack] = useState<{ song: string; artist: string; album: string } | null>(null)

    // fetch logic
    useEffect(() => {
        async function fetchCurrentPlaylist() {
            try {
                const response = await fetch('https://api.wxdu.art/api/playlists/current')
                const data = await response.json()
                setCurrentPlaylist(data)
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