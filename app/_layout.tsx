/*
This is the root of the entire app, equivalent to _app.js in Next.js
*/

import "../global.css";
import { Tabs } from "expo-router";
import { useFonts } from "expo-font";
import { BitcountGridSingle_400Regular, BitcountGridSingle_700Bold } from "@expo-google-fonts/bitcount-grid-single";
import { AudioProvider } from "../components/AudioContext";
import AnimatedBackgroundShader from "../components/AnimatedBackgroundShader";

/**
 * Root layout for all pages: loads fonts, shares the audio player, and places
 * the Now Playing and Connect tabs over the animated background.
 */
export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        'CourierPrime-Regular': require('../assets/fonts/CourierPrime-Regular.ttf'),
        'CourierPrime-Bold': require('../assets/fonts/CourierPrime-Bold.ttf'),
        'CourierPrime-Italic': require('../assets/fonts/CourierPrime-Italic.ttf'),
        'CourierPrime-BoldItalic': require('../assets/fonts/CourierPrime-BoldItalic.ttf'),
        'BitcountGridSingle-Regular': BitcountGridSingle_400Regular,
        'BitcountGridSingle-Bold': BitcountGridSingle_700Bold,
    })

    // don't render until fonts are loaded — local files load in milliseconds
    if (!fontsLoaded) return null

    return (
        // Keep one audio player above the tabs so navigation does not interrupt the stream.
        <AudioProvider>
            <AnimatedBackgroundShader />
            <Tabs
                screenOptions={{
                    tabBarStyle: { backgroundColor: "#0a0a0a", borderTopColor: "#27272a" },
                    tabBarActiveTintColor: "#ffffff",
                    tabBarInactiveTintColor: "#52525b",
                    headerStyle: { backgroundColor: "#0a0a0a" },
                    headerTintColor: "#ffffff",
                    headerShadowVisible: false,
                    sceneStyle: { backgroundColor: "transparent" },
                }}
            >
                <Tabs.Screen name="index" options={{ title: "Now Playing" }} />
                <Tabs.Screen name="connect" options={{ title: "Connect" }} />
            </Tabs>
        </AudioProvider>
    );
}
