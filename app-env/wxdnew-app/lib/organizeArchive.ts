// Shape of a single archive event from TinaCMS
export type ArchiveNode = {
    id: string
    title: string
    cover: string | null
    published: string
    _sys: { filename: string }
}

// Shape of a single edge from the GraphQL response
export type ArchiveEdge = {
    node: ArchiveNode
}

// The two kinds of items in the flattened structured list
type WeekHeading = { type: 'heading'; weekStartDate: string }
type WeekEvents  = { type: 'events';  weekStartDate: string; weekEvents: ArchiveNode[] }

export type StructuredItem = WeekHeading | WeekEvents

// Groups a flat list of archive edges into a dictionary keyed by week-start date
export function groupEventsByWeek(events: ArchiveEdge[]): Record<string, ArchiveNode[]> {
    const grouped: Record<string, ArchiveNode[]> = {}

    events.forEach(({ node }) => {
        const eventDate = new Date(node.published)
        const weekStart = new Date(
            eventDate.getFullYear(),
            eventDate.getMonth(),
            eventDate.getDate() - eventDate.getDay()
        )
        const key = weekStart.toISOString().split('T')[0]
        if (!grouped[key]) grouped[key] = []
        grouped[key].push(node)
    })

    return grouped
}

// Flattens the week dictionary into an alternating list of headings and event rows for FlatList
export function generateStructuredData(grouped: Record<string, ArchiveNode[]>): StructuredItem[] {
    const result: StructuredItem[] = []

    for (const weekStartDate of Object.keys(grouped)) {
        result.push({ type: 'heading', weekStartDate })
        result.push({ type: 'events', weekStartDate, weekEvents: grouped[weekStartDate] })
    }

    return result
}


