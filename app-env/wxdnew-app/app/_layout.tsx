/*
This is the root of the entire app, equivalent to _app.js in Next.js
*/

import "../global.css";
import { Tabs } from "expo-router";

export default function RootLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{ title: "Home" }} />
            <Tabs.Screen name="listen/index" options={{ title: "Listen" }} />
            <Tabs.Screen name="blog/index" options={{ title: "Blog" }} />
            <Tabs.Screen name="charts/index" options={{ title: "Charts" }} />
            <Tabs.Screen name="archive/index" options={{ title: "Archive" }} />
        </Tabs>
    );
}