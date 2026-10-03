import { LogBox } from "react-native";

LogBox.ignoreLogs(["SafeAreaView has been deprecated"]);

// Expo Router loads app/_layout.tsx and the file-based screens; App.tsx is unused here.
require("expo-router/entry");
