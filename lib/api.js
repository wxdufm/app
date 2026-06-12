// base URL for the external API server (set in .env.local for dev, Cloudflare Pages env vars for prod)
const BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.wxdu.art";

// wrapper around fetch for all external API calls — prepends the base URL,
// throws on non-2xx responses (with .status attached so callers can handle 429 etc.), returns parsed JSON
export async function apiFetch(path, options) {
    const res = await fetch(`${BASE}${path}`, options);
    if (!res.ok) {
        const err = new Error(`API ${path} returned ${res.status}`);
        err.status = res.status;
        throw err;
    }
    return res.json();
}
