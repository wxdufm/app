import { Image, Pressable, StyleSheet, Text } from 'react-native'
import { useRouter } from 'expo-router'
import { resolveImageUrl } from '../../lib/tina'

type EventCardProps = {
    slug: string
    title: string
    cover?: string | null
    published?: string | null
}

// published comes in as an ISO string like "2026-04-06T04:00:00.000Z"
// use UTC methods to avoid timezone shifting the date by a day
function formatDate(published: string): string {
    const date = new Date(published)
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')  // months are 0-indexed, +1 fixes that
    const day = String(date.getUTCDate()).padStart(2, '0')          // padStart ensures "05" not "5"
    return `${month}/${day}`
}

export default function EventCard({ slug, title, cover, published }: EventCardProps) {
    // useRouter gives us router.push() for navigating to a new screen
    const router = useRouter()
    // convert relative TinaCMS path to a full URL, or undefined if missing
    const imageUrl = resolveImageUrl(cover)

    return (
        <Pressable
            onPress={() => router.push(`/archive/${slug}`)}
            className="mb-5 w-72"
        >
            {/* network images need { uri: url }, local files use require() */}
            <Image
                source={imageUrl ? { uri: imageUrl } : require('../../assets/icon.png')}
                style={styles.cover}
                resizeMode="cover"
                accessibilityLabel={title}
            />
            {/* only show date if it exists — formatDate handles the UTC parsing */}
            {published ? (
                <Text className="mt-2 text-left text-2xl font-extrabold text-white">
                    {formatDate(published)}
                </Text>
            ) : null}
            <Text className="mt-1 text-left text-xl font-bold text-white">
                {title}
            </Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    cover: {
        width: 288,
        height: 288,
        backgroundColor: '#27272a',
    },
})
