import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Text, View } from 'react-native'
import { queryTina } from '../../lib/tina'
import { ArchiveEdge, StructuredItem, groupEventsByWeek, generateStructuredData } from '../../lib/organizeArchive'
import EventCard from '../../components/archive/EventCard'

//ask for how many total archive events there are
const COUNT_QUERY = `{ archiveConnection { totalCount } }`

//asks for the actual events
const EVENTS_QUERY = `
    query getArchiveEvents($count: Float) {
        archiveConnection(sort: "published", last: $count) {
            edges {
                node {
                    id
                    title
                    cover
                    published
                    _sys { filename }
                }
            }
        }
    }
`

export default function ArchiveScreen() {
    const [items, setItems] = useState<StructuredItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchEvents() {
            try {
                const countData = await queryTina<{  //asks for count
                    archiveConnection: { totalCount: number }  //specifies that the type is a number
                }>(COUNT_QUERY)

                const total = countData.archiveConnection.totalCount

                const data = await queryTina<{  //uses count to ask for all events
                    archiveConnection: { edges: ArchiveEdge[] }
                }>(EVENTS_QUERY, { count: total })

                const grouped = groupEventsByWeek(data.archiveConnection.edges)   //groups by weeks
                const structured = generateStructuredData(grouped)  //alternating heading/events pattern
                setItems(structured)
            } catch (err) {
                console.error('Archive fetch failed:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchEvents()
    }, [])

    function renderItem({ item }: { item: StructuredItem}) {
        if (item.type === 'heading') {
            return (
                <Text className="mt-6 mb-2 text-xl font-bold text-white">
                    Week of {item.weekStartDate}
                </Text>
            )
        }

        // nested horizontal list inside the main vertical list
        return(
            <FlatList
                horizontal
                data={item.weekEvents}
                keyExtractor={event => event.id}
                renderItem={({ item: event }) => (
                    <EventCard
                        slug={event._sys.filename}
                        title={event.title}
                        cover={event.cover}
                        published={event.published}
                    />
                )}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}
            />
        )
    }
    
    // show spinner on every render until loading becomes false
    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-black">
                <ActivityIndicator color="white" />
            </View>
        )
    }

    return(
        <FlatList
            className="flex-1 bg-black"
            contentContainerStyle={{ padding: 16 }}
            data={items}
            keyExtractor={item => `${item.type}-${item.weekStartDate}`}
            renderItem={renderItem}
            ListHeaderComponent={
                <Text className="mb-6 text-4xl font-bold text-white">ARCHIVE</Text>
            }
        />
    )
}