/*
This is the root of the entire app, equivalent to _app.js in Next.js
*/

import "../global.css";
import { Tabs } from "expo-router";
import { AudioProvider } from "../components/AudioContext";

export default function RootLayout() {
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
