import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Text, View } from 'react-native'
import { queryTina } from '../../lib/tina'
import PostCard from '../../components/blog/PostCard'

// shape of a single blog post returned by TinaCMS
type BlogPost = {
    id: string
    title: string
    cover: string | null
    published: string
    description: string | null
    _sys: { filename: string }
}

// step 1: ask TinaCMS how many posts exist so we can fetch all of them in step 2
const COUNT_QUERY = `{ blogConnection { totalCount } }`

// step 2: fetch all posts — $count is a variable filled in at call time
const POSTS_QUERY = `
    query getBlogPosts($count: Float) {
        blogConnection(sort: "published", last: $count) {
            edges {
                node {
                    id
                    title
                    cover
                    published
                    description
                    _sys { filename }
                }
            }
        }
    }
`

export default function BlogScreen() {
    // posts holds the array of fetched blog posts, starts empty
    const [posts, setPosts] = useState<BlogPost[]>([])
    // loading controls whether we show a spinner or the list
    const [loading, setLoading] = useState(true)

    
    // useEffect with [] runs once when the screen first mounts — like componentDidMount
    useEffect(() => {
        async function fetchPosts() {
            try {
                // step 1: get the total count
                const countData = await queryTina<{
                    blogConnection: { totalCount: number }
                }>(COUNT_QUERY)

                const total = countData.blogConnection.totalCount

                // step 2: fetch that many posts, sorted by published date
                const data = await queryTina<{
                    blogConnection: { edges: { node: BlogPost }[] }
                }>(POSTS_QUERY, { count: total })

                // unwrap edges → nodes and store in state
                setPosts(data.blogConnection.edges.map(e => e.node))
            } catch (err) {
                console.error('Blog fetch failed:', err)
            } finally {
                // finally always runs — clears the spinner whether fetch succeeded or failed
                setLoading(false)
            }
        }               

        fetchPosts()
    }, [])

    
    // show a spinner while waiting for data
    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-black">
                <ActivityIndicator color="white" />
            </View>
        )
    }

    return (
        // FlatList is preferred over ScrollView + .map() for lists — it only renders visible items
        <FlatList
            className="flex-1 bg-black"
            contentContainerStyle={{ padding: 16 }}
            data={posts}
            keyExtractor={item => item.id}
            // _sys.filename is the slug (e.g. "baby-goat" from baby-goat.md)
            renderItem={({ item }) => (
                <PostCard
                    slug={item._sys.filename}
                    title={item.title}
                    cover={item.cover}
                    description={item.description}
                />
            )}
            ListHeaderComponent={
                <Text className="mb-6 text-4xl font-bold text-white">WXDU PRESS</Text>
            }
            // load more posts as user scrolls near the bottom
            onEndReached={() => {/* pagination can go here later */}}
            onEndReachedThreshold={0.3}
        />
    )
}