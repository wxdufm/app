import { apiFetch } from "../../lib/api";

// upstream endpoint on api.wxdu.art that includes show, dj, and tracks
const SOURCE_PATH = "/api/playlists/current";

// decode Buffer-like comments payloads from upstream into plain strings
function normaliseComments(rawComments) {
    // already a normal string
    if (typeof rawComments === "string") {
        const trimmed = rawComments.trim();
        return trimmed || null;
    }

    // Node Buffer object
    if (Buffer.isBuffer(rawComments)) {
        const decoded = rawComments.toString("utf8").trim();
        return decoded || null;
    }

    // Buffer-like object from JSON: { type: "Buffer", data: [...] }
    if (
        rawComments &&
        typeof rawComments === "object" &&
        rawComments.type === "Buffer" &&
        Array.isArray(rawComments.data)
    ) {
        const decoded = Buffer.from(rawComments.data).toString("utf8").trim();
        return decoded || null;
    }

    // unsupported shape
    return null;
}

// selects the currently playing track using time/order fallbacks
function pickCurrentTrack(tracks) {
    if (!Array.isArray(tracks) || tracks.length === 0) {
        return null;
    }

    // copy before sort so original payload is untouched
    const sorted = [...tracks].sort((a, b) => {
        const timeA = Date.parse(a?.songstart || "");
        const timeB = Date.parse(b?.songstart || "");

        // prefer valid songstart timestamps when present
        const hasTimeA = Number.isFinite(timeA);
        const hasTimeB = Number.isFinite(timeB);
        if (hasTimeA && hasTimeB && timeA !== timeB) {
            return timeA - timeB;
        }

        // fallback to numeric orderkey when timestamps are missing/equal
        const orderA = Number.isFinite(Number(a?.orderkey)) ? Number(a.orderkey) : -Infinity;
        const orderB = Number.isFinite(Number(b?.orderkey)) ? Number(b.orderkey) : -Infinity;
        if (orderA !== orderB) {
            return orderA - orderB;
        }

        // final stable fallback
        return 0;
    });

    // latest track is the final entry after ascending sort
    return sorted[sorted.length - 1] || null;
}

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // fetch current show payload via the shared API wrapper
        const payload = await apiFetch(SOURCE_PATH);

        // normalise incoming top-level objects
        const show = payload?.show || null;
        const dj = payload?.dj || null;
        const tracks = Array.isArray(payload?.tracks) ? payload.tracks : [];

        // select the most recent/current track
        const track = pickCurrentTrack(tracks);

        // no track means nothing to display yet; default info below
        if (!track) {
            return res.status(404).json({
                artist: null,
                song: null,
                album: null,
                label: null,
                dj: show?.djname || dj?.defdjname || null,
                comments: null,
                source: SOURCE_PATH,
                error: "No current track found"
            });
        }

        // build strict upstream-style response keys (song, not title)
        const result = {
            artist: track.artist || null,
            song: track.song || null,
            album: track.album || null,
            label: track.label || null,
            dj: show?.djname || dj?.defdjname || null,
            comments: normaliseComments(track.comments),
            source: SOURCE_PATH
        };

        // keep lightweight caching for repeated polling in the nav player
        res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=120");

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            artist: null,
            song: null,
            album: null,
            label: null,
            dj: null,
            comments: null,
            source: SOURCE_PATH,
            error: error.message
        });
    }
}
