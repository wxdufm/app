import { scheduleBuilder } from "../../lib/schedule/scheduleBuilder"

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" })
    }

    try {
        const scheduleCarrier = await scheduleBuilder()
        // cache for 1 hour — schedule changes infrequently
        res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400")
        res.setHeader("Access-Control-Allow-Origin", "*")
        return res.status(200).json(scheduleCarrier)
    } catch (err) {
        return res.status(500).json({ error: "Failed to load schedule" })
    }
}
