import { useState, useEffect } from 'react'
import { ScrollView, View } from 'react-native'
import NowPlayingHeader from '../../components/listenpage/NowPlayingHeader'
import PlayTabs from '../../components/listenpage/PlayTabs'
import ExploreTab from '../../components/listenpage/ExploreTab'

export default function ListenScreen() {
    const [currentPlaylist, setCurrentPlaylist] = useState({})

    async function fetchCurrentPlaylist() {
        try {
            const response = await fetch('https://api.wxdu.art/api/playlists/current')
            const data = await response.json()
            setCurrentPlaylist(data)
        } catch (error) {
            console.error('Failed to fetch current-playlist data:', error)
        }
    }

    useEffect(() => {
        fetchCurrentPlaylist()
        const interval = setInterval(() => {
            fetchCurrentPlaylist()
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <ScrollView className="flex-1 bg-black pb-2">
            <NowPlayingHeader currentPlaylist={currentPlaylist} />
            <View className="flex-col gap-8 px-4">
                <View className="w-full max-w-[360px] self-center">
                    <PlayTabs currentPlaylist={currentPlaylist} />
                </View>
                <View className="border-t border-gray-700 pt-8">
                    <ExploreTab />
                </View>
            </View>
        </ScrollView>
    )
}
