// URLs read from .env — fall back to localhost if not set
const TINA_URL = process.env.EXPO_PUBLIC_TINA_URL ?? 'http://localhost:4001/graphql'
const SITE_URL = process.env.EXPO_PUBLIC_SITE_URL ?? 'https://wxdu.org'

// Generic GraphQL fetch wrapper for TinaCMS — T is the expected shape of json.data
export async function queryTina<T = unknown>(
    query: string,
    variables?: Record<string, unknown>
): Promise<T> {
    // GraphQL always uses POST with a JSON body containing the query string
    const res = await fetch(TINA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
    })

    if (!res.ok) {
        throw new Error(`TinaCMS query failed: ${res.status}`)
    }

    const json = await res.json()

    // GraphQL can return errors even on a 200 OK response (when it's "partially" correct)
    if (json.errors) {
        throw new Error(json.errors[0]?.message ?? 'GraphQL error')
    }

    return json.data as T
}

// TinaCMS stores cover images as relative paths (e.g. /uploads/foo.jpg) — prepend site URL to make them absolute
export function resolveImageUrl(path: string | null | undefined): string | undefined {
    if (!path) return undefined
    if (path.startsWith('http')) return path
    return `${SITE_URL}${path}`
}
