/*
This is the root of the entire app, equivalent to _app.js in Next.js
*/

import "../global.css";
import { Tabs } from "expo-router";
import { useFonts } from "expo-font";
import { AudioProvider } from "../components/AudioContext";

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        'CourierPrime-Regular': require('../assets/fonts/CourierPrime-Regular.ttf'),
        'CourierPrime-Bold': require('../assets/fonts/CourierPrime-Bold.ttf'),
        'CourierPrime-Italic': require('../assets/fonts/CourierPrime-Italic.ttf'),
        'CourierPrime-BoldItalic': require('../assets/fonts/CourierPrime-BoldItalic.ttf'),
    })

    // don't render until fonts are loaded — local files load in milliseconds
    if (!fontsLoaded) return null

    return (
        <AudioProvider>
            <Tabs
                screenOptions={{
                    tabBarStyle: { backgroundColor: "#0a0a0a", borderTopColor: "#27272a" },
                    tabBarActiveTintColor: "#ffffff",
                    tabBarInactiveTintColor: "#52525b",
                    headerStyle: { backgroundColor: "#0a0a0a" },
                    headerTintColor: "#ffffff",
                    headerShadowVisible: false,
                }}
            >
                <Tabs.Screen name="index" options={{ title: "Now Playing" }} />
                <Tabs.Screen name="connect" options={{ title: "Connect" }} />
            </Tabs>
        </AudioProvider>
    );
}
