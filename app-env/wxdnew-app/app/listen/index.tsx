<<<<<<< HEAD
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
=======
import { useCallback, useEffect, useState } from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";

import ExploreTab from "../../components/listenpage/ExploreTab";
import NowPlayingHeader from "../../components/listenpage/NowPlayingHeader";
import PlayTabs from "../../components/listenpage/PlayTabs";

const apiBaseUrl = "https://api.wxdu.art";

type CurrentPlaylist = {
    show?: {
        djname?: string | null;
        title?: string | null;
    } | null;
    tracks?: Array<{
        song?: string | null;
        artist?: string | null;
        album?: string | null;
        songstart?: string | null;
        songStart?: string | null;
    }> | null;
};

export default function ListenScreen() {
    const [currentPlaylist, setCurrentPlaylist] = useState<CurrentPlaylist>({});
    const { width } = useWindowDimensions();
    const isWide = width >= 768;

    const fetchCurrentPlaylist = useCallback(async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/api/playlists/current`);

            if (!response.ok) {
                throw new Error(`Current playlist fetch failed: ${response.status}`);
            }

            const data = await response.json();

            setCurrentPlaylist(data);
        } catch (error) {
            console.error("Failed to fetch current-playlist data:", error);
        }
    }, []);

    useEffect(() => {
        fetchCurrentPlaylist();

        const interval = setInterval(() => {
            fetchCurrentPlaylist();
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchCurrentPlaylist]);

    return (
        <ScrollView
            className="flex-1 bg-black"
            contentContainerStyle={{
                paddingBottom: 8,
                paddingHorizontal: 16,
                paddingTop: 16,
            }}
        >
            <NowPlayingHeader currentPlaylist={currentPlaylist} />

            <View className={isWide ? "mt-8 flex-row gap-8" : "mt-8 gap-8"}>
                <View className={isWide ? "w-2/5 items-center" : "items-center"}>
                    <View className="w-full max-w-[360px]">
                        <PlayTabs
                            currentPlaylist={currentPlaylist}
                            apiBaseUrl={apiBaseUrl}
                        />
                    </View>
                </View>

                <View
                    className={
                        isWide
                            ? "w-3/5 items-center border-l border-gray-700 pl-8"
                            : "items-center"
                    }
                >
                    <ExploreTab apiBaseUrl={apiBaseUrl} />
                </View>
            </View>
        </ScrollView>
    );
>>>>>>> 604d9b8 (converted the last 4 components of listen page into react-native)
}
