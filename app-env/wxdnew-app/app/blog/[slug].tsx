import { useEffect, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { queryTina, resolveImageUrl } from '../../lib/tina'

// shape of the data we expect back from TinaCMS for a single blog post
type BlogPost = {
    title: string
    author: string | null
    cover: string | null
    published: string | null
    description: string | null
    body: any
}

// asks TinaCMS for one blog post by its file path — $relativePath is filled in at call time
const POST_QUERY = `
    query getBlogPost($relativePath: String!) {
        blog(relativePath: $relativePath) {
            title
            author
            cover
            published
            description
            body
        }
    }
`

// TinaCMS returns body as a JSON tree, not a plain string — this walks the tree and pulls out all the raw text
// a node is either a leaf (has a .text property) or a branch (has a .children array of more nodes)
function extractText(node: any): string {
    if (typeof node?.text === 'string') return node.text
    if (Array.isArray(node?.children)) {
        return node.children.map(extractText).join(' ')
    }
    return ''
}

export default function BlogPostScreen() {
    // reads the slug from the URL — e.g. /blog/baby-goat gives slug = "baby-goat"
    const { slug } = useLocalSearchParams<{ slug: string }>()

    // post holds the fetched blog post, null until the fetch completes
    const [post, setPost] = useState<BlogPost | null>(null)
    // loading controls whether we show a spinner or the content
    const [loading, setLoading] = useState(true)

    // runs once when the screen mounts, and again if the slug in the URL ever changes
    useEffect(() => {
        async function fetchPost() {
            try {
                // TinaCMS identifies files by their path — slug + ".md" matches the filename in content/blog/
                const data = await queryTina<{ blog: BlogPost }>(
                    POST_QUERY,
                    { relativePath: `${slug}.md` }
                )
                setPost(data.blog)
            } catch (err) {
                console.error('Blog post fetch failed:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchPost()
    }, [slug])

    // show spinner while the fetch is in progress
    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-black">
                <ActivityIndicator color="white" />
            </View>
        )
    }

    // show an error state if TinaCMS returned nothing (bad slug, deleted post, etc.)
    if (!post) {
        return (
            <View className="flex-1 items-center justify-center bg-black">
                <Text className="text-white">Post not found.</Text>
            </View>
        )
    }

    // prepare the two values that need transformation before rendering
    const imageUrl = resolveImageUrl(post.cover)   // converts TinaCMS relative path → full URL
    const bodyText = extractText(post.body)         // flattens the JSON tree → plain string

    // ScrollView lets the whole page scroll as one block — unlike FlatList which is for repeating lists
    return (
        <ScrollView className="flex-1 bg-black" contentContainerStyle={{ padding: 16 }}>
            {/* only render the image if a cover exists */}
            {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.cover} resizeMode="cover" />
            ) : null}
            <Text className="mt-4 text-3xl font-bold text-white">{post.title}</Text>
            {/* optional fields — only render if TinaCMS has a value for them */}
            {post.author ? (
                <Text className="mt-1 text-sm text-gray-400">by {post.author}</Text>
            ) : null}
            {post.published ? (
                // toLocaleDateString() converts ISO timestamp to a readable date like "4/6/2026"
                <Text className="mt-1 text-sm text-gray-400">
                    {new Date(post.published).toLocaleDateString()}
                </Text>
            ) : null}
            {post.description ? (
                <Text className="mt-3 text-base text-gray-300">{post.description}</Text>
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