import { Image, Pressable, StyleSheet, Text } from 'react-native'
import { useRouter } from 'expo-router'
import { resolveImageUrl } from '../../lib/tina'

// ? means optional (caller may omit it), | null means TinaCMS may return null for empty fields
type PostCardProps = {
    slug: string
    title: string
    cover?: string | null
    description?: string | null
}

export default function PostCard({ slug, title, cover, description }: PostCardProps) {
    // useRouter gives us router.push() for navigating to a new screen
    const router = useRouter()
    // convert relative TinaCMS path (e.g. /uploads/foo.jpg) to a full URL, or undefined if missing
    const imageUrl = resolveImageUrl(cover)

    return (
        // Pressable is the React Native tap target — equivalent to <a> or <button> on web
        <Pressable
            onPress={() => router.push(`/blog/${slug}`)}
            className="mb-8 w-72"
        >
            {/* network images need { uri: url }, local files use require() — ternary picks between them */}
            <Image
                source={imageUrl ? { uri: imageUrl } : require('../../assets/icon.png')}
                style={styles.cover}
                resizeMode="cover"
                accessibilityLabel={title}
            />
            <Text className="mt-2 text-left text-xl font-bold text-white">
                {title}
            </Text>
            {/* only render description if it exists — {condition ? <x /> : null} is JSX conditional rendering */}
            {description ? (
                <Text className="mt-1 text-sm text-gray-300" numberOfLines={2}>
                    {description}
                </Text>
            ) : null}
        </Pressable>
    )
}

// StyleSheet.create is React Native's CSS — values are density-independent pixels, not px
const styles = StyleSheet.create({
    cover: {
        width: 288,   // same as Tailwind w-72 (72 * 4 = 288)
        height: 288,
        backgroundColor: '#27272a',  // shows while image loads
    },
})
