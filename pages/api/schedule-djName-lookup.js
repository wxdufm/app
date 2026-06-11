import { lookupDjNamesFromIDs } from "lib/schedule/djName-lookup"

// receives body-only array of IDs

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end()
    try {
        // keep backward compatibility with either raw idGrid or full carrier payloads
        const idGrid = Array.isArray(req.body)
            ? req.body
            : req.body?.idGrid ?? req.body?.scheduleCarrier?.[4]
        const fullNameGridBackup = Array.isArray(req.body)
            ? null
            : req.body?.fullNameGridBackup ?? req.body?.scheduleCarrier?.[3] ?? null

        if (!Array.isArray(idGrid)) {
            return res.status(400).json({ error: "Invalid payload. Provide an ID grid array." })
        }

        // wrapper now passes canonical scheduleCarrier into shared lib
        const scheduleCarrier = [[], [], [], [], idGrid]
        const resultCarrier = await lookupDjNamesFromIDs(scheduleCarrier, fullNameGridBackup)
        res.status(200).json({
            djNameGrid: resultCarrier[3],
            scheduleCarrier: resultCarrier,
        })
    } catch (err) {
        res.status(500).json({ error: "DJ Name lookup failed"})
    }
}
