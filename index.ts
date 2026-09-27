import { LogBox } from "react-native";

LogBox.ignoreLogs(["SafeAreaView has been deprecated"]);

require("expo-router/entry");
