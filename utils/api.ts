import { Platform } from 'react-native'

// Production API, used when nothing else is configured.
const PRODUCTION_API = 'https://api.wxdu.org'

// Resolve the API base URL at call time.
//
// Priority order:
//   1. Web build served from a wxdu domain -> the matching api. subdomain
//        wxdu.art -> https://api.wxdu.art
//        wxdu.org -> https://api.wxdu.org   (works after the .org migration, no rebuild)
//   2. EXPO_PUBLIC_API_URL (set in .env, e.g. to point at a staging server)
//   3. The production API
//
// Native apps (iOS/Android) have no page address, so only steps 2 and 3 apply there.
export function getApiBase(): string {
    // `window.location` only exists in a browser, so check the platform first.
    // Without this check the code would crash on a phone.
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const match = window.location.hostname.match(/(?:^|\.)wxdu\.(art|org)$/)
        if (match) {
            return `https://api.wxdu.${match[1]}`
        }
    }
    // Expo replaces `process.env.EXPO_PUBLIC_*` with the real value at build time.
    // `||` (not `??`) so an empty string in .env also falls back to production.
    return process.env.EXPO_PUBLIC_API_URL || PRODUCTION_API
}

// How long a single API call may hang before we give up on it.
//
// `fetch` has no timeout of its own: if a connection stalls, the promise never
// settles and anything awaiting it waits forever. Bounding it turns an invisible
// hang into an error the UI can show.
const DEFAULT_TIMEOUT_MS = 15000

// An Error that also carries the HTTP status and/or a short code.
// TypeScript's built-in `Error` has no `status` field, so we extend it to add one.
// The `?` makes a field optional: a timeout has a `code` but no `status`, and
// a bad HTTP response has a `status` but no `code`.
export class ApiError extends Error {
    status?: number
    code?: string

    constructor(message: string, extra: { status?: number; code?: string } = {}) {
        super(message)
        this.name = 'ApiError'
        this.status = extra.status
        this.code = extra.code
    }
}

// Same as fetch's own options, plus a timeout. `RequestInit` is the built-in type
// for the second argument of `fetch` (method, headers, body, signal, ...).
type ApiFetchOptions = RequestInit & { timeoutMs?: number }

// Wrapper around fetch for all API calls:
//   - prepends the base URL
//   - throws an ApiError on non-2xx responses (with .status so callers can handle 429 etc.)
//   - throws an ApiError with code 'ETIMEDOUT' if the request takes too long
//   - returns the parsed JSON
// Pass `timeoutMs` to override the default; pass `signal` to cancel it yourself
// (both work together, whichever fires first wins).
//
// `<T = unknown>` is a generic: the caller says what shape the JSON has, e.g.
//   const track = await apiFetch<Track>('/api/now-playing')
// and `track` is then typed as Track. TypeScript can't check what the server
// really sends, so this is a promise from you, not a guarantee.
export async function apiFetch<T = unknown>(
    path: string,
    options: ApiFetchOptions = {}
): Promise<T> {
    const { timeoutMs = DEFAULT_TIMEOUT_MS, signal, ...rest } = options

    // We hand fetch our own controller so that EITHER the timer OR the caller can abort.
    const controller = new AbortController()
    const abortFromCaller = () => controller.abort()
    if (signal) {
        if (signal.aborted) controller.abort()
        else signal.addEventListener('abort', abortFromCaller, { once: true })
    }
    const timer = setTimeout(() => controller.abort(), timeoutMs)

    try {
        const res = await fetch(`${getApiBase()}${path}`, { ...rest, signal: controller.signal })
        if (!res.ok) {
            throw new ApiError(`API ${path} returned ${res.status}`, { status: res.status })
        }
        // Read the body as text first, because `res.json()` throws on an empty body
        // (e.g. a 204 No Content reply to a POST) even though the request succeeded.
        // An empty body comes back as `undefined`; the `as T` cast hides that from
        // TypeScript, so only rely on the result when you know the endpoint sends JSON.
        const text = await res.text()
        return (text ? JSON.parse(text) : undefined) as T
    } catch (err) {
        // Tell our own timeout apart from a caller-initiated cancel, so a screen that
        // cancels on unmount doesn't report an error to the user.
        // (In `catch`, `err` is `unknown`, so we have to check it before using it.)
        if (err instanceof Error && err.name === 'AbortError' && !signal?.aborted) {
            throw new ApiError(`API ${path} timed out after ${timeoutMs}ms`, { code: 'ETIMEDOUT' })
        }
        throw err
    } finally {
        // Always runs, success or failure: stop the timer and detach the listener.
        clearTimeout(timer)
        if (signal) signal.removeEventListener('abort', abortFromCaller)
    }
}
