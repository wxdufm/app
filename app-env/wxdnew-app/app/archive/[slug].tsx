import { useEffect, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { queryTina, resolveImageUrl } from '../../lib/tina'

// shape of the data we expect back from TinaCMS for a single archive event
type ArchiveEvent = {
    title: string
    cover: string | null
    published: string | null
    description: any  // rich-text AST — same JSON tree format as blog body
}

const EVENT_QUERY = `
    query getArchiveEvent($relativePath: String!) {
        archive(relativePath: $relativePath) {
            title
            cover
            published
            description
        }
    }
`

// same recursive tree-walker as the blog screen — TinaCMS returns description as a JSON tree, not a string
function extractText(node: any): string {
    if (typeof node?.text === 'string') return node.text
    if (Array.isArray(node?.children)) {
        return node.children.map(extractText).join(' ')
    }
    return ''
}

export default function ArchiveEventScreen() {
    // reads the slug from the URL — e.g. /archive/my-event gives slug = "my-event"
    const { slug } = useLocalSearchParams<{ slug: string }>()

    const [event, setEvent] = useState<ArchiveEvent | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchEvent() {
            try {
                // slug + ".md" matches the filename in content/archive/
                const data = await queryTina<{ archive: ArchiveEvent }>(
                    EVENT_QUERY,
                    { relativePath: `${slug}.md` }
                )
                setEvent(data.archive)
            } catch (err) {
                console.error('Archive event fetch failed', err)
            } finally {
                setLoading(false)
            }
        }
        fetchEvent()
    }, [slug])

    //show spinner while fetch is in progress
    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-black">
                <ActivityIndicator color="white" />
            </View>
        )
    }

    // show error state if TinaCMS returned nothing
    if (!event) {
        return (
            <View className="flex-1 items-center justify-center bg-black">
                <Text className="text-white">Event not found.</Text>
            </View>
        )
    }

    const imageUrl = resolveImageUrl(event.cover)
    const bodyText = extractText(event.description)  // description is the rich-text body in archive

    // ScrollView lets the whole page scroll as one block — unlike FlatList which is for repeating lists
    return (
        <ScrollView className="flex-1 bg-black" contentContainerStyle={{ padding: 16 }}>
            {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.cover} resizeMode="cover" />
            ) : null}
            <Text className="mt-4 text-3xl font-bold text-white">{event.title}</Text>
            {event.published ? (
                <Text className="mt-1 text-sm text-gray-400">
                    {new Date(event.published).toLocaleDateString()}
                </Text>
            ) : null}
            {bodyText ? (
                <Text className="mt-4 text-base leading-6 text-white">{bodyText}</Text>
            ) : null}
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    cover: {
        width: '100%',
        height: 240,
        backgroundColor: '#27272a',
    },
})