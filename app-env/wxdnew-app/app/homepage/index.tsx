import { View, ScrollView } from "react-native";
import CDLink from "../../components/homepage/CDLink";
import StreamButton from "../../components/audioplayers/StreamButton";
import IpodWidget from "../../components/homepage/IpodWidget";
import TodaySchedule from "../../components/homepage/TodaySchedule";

export default function HomeScreen() {
    return (
        <ScrollView className="flex-1 bg-black">
            <StreamButton />
            <View className="px-4 py-4">
                <IpodWidget />
            </View>
            <View className="px-4 py-4">
                <TodaySchedule />
            </View>
            <View className="flex-row justify-around py-6 px-4">
                <CDLink
                    imageSource={require('../../assets/CD_1_Filler.jpg')}
                    label="blog posts"
                    href="/blog"
                />
                <CDLink
                    imageSource={require('../../assets/CD_2_Filler.jpg')}
                    label="programming"
                    href="/archive"
                />
                <CDLink
                    imageSource={require('../../assets/CD_3_Filler.jpg')}
                    label="about"
                    href="/about"
                />
            </View>
        </ScrollView>
    );
}
