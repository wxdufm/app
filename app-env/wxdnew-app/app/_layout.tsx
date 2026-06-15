/*
This is the root of the entire app, equivalent to _app.js in Next.js
*/

import "../global.css";
import { Tabs } from "expo-router";
import { AudioProvider } from "../components/AudioContext";

export default function RootLayout() {
    return (
        <AudioProvider>
            <Tabs>
                <Tabs.Screen name="index" options={{ title: "Home" }} />
                <Tabs.Screen name="listen/index" options={{ title: "Listen" }} />
                <Tabs.Screen name="blog" options={{ title: "Blog" }} />
                <Tabs.Screen name="charts/index" options={{ title: "Charts" }} />
                <Tabs.Screen name="archive" options={{ title: "Archive" }} />
            </Tabs>
        </AudioProvider>
    );
}