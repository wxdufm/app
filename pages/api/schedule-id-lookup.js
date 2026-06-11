// schedule ID lookup wrapper route:
// accepts scheduleBuilder-parity inputs and delegates to lib/schedule/id-lookup

/*
structure of scheduleCarrier, of which [3] and [2] are passed into this function

[0] headerRow = fullArray[0]   (1 row, 8 columns)
[1] hourColumn = fullArray.map(row => row[0]).slice(1)   (rotates hour column into 1 row, 24 columns)
[2] specialtyShowIndices = []   (marks indexes of all specialty shows relative to [3], 24x7)
[3] djNameOnlyArray = [] (starts out as fullNameOnlyArray but gets overwritten)     (24 rows, 7 columns)
[4] idGrid     (same dimensions as [3] but with MySQL ids)
*/

import { lookupIDsfromFullNames } from "lib/schedule/id-lookup";

// validates grid shape so lookup code can assume a 2D matrix of cells
function is2DArray(value) {
    return Array.isArray(value) && value.every((row) => Array.isArray(row));
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    try {
        let fullNameGrid;
        let specialtyShowIndices;

        // parity mode A: body is directly the fullNameGrid matrix (mostly here for safety or if stuff messes up)
        if (Array.isArray(req.body)) {
            fullNameGrid = req.body;
            specialtyShowIndices = [];
        } else if (req.body && typeof req.body === "object") {
            // parity mode B: body includes both arguments used by scheduleBuilder (default!)
            fullNameGrid = req.body.fullNameGrid;
            specialtyShowIndices = Array.isArray(req.body.specialtyShowIndices)
                ? req.body.specialtyShowIndices
                : [];
        }

        // guardrails: make sure 24x7 part, scheduleCarrier[3], with full names exists
        if (!is2DArray(fullNameGrid)) {
            return res.status(400).json({
                error: "Invalid payload. Provide a 2D fullNameGrid array.",
            });
        }

        // guardrails: makes sure specialty shows index is good to go
        if (!Array.isArray(specialtyShowIndices)) {
            return res.status(400).json({
                error: "Invalid payload. specialtyShowIndices must be an array.",
            });
        }

        // build full scheduleCarrier so wrapper and lib share one canonical contract
        const scheduleCarrier = [
            [],
            [],
            specialtyShowIndices,
            fullNameGrid,
            [],
        ];

        // delegate all lookup semantics and fallback markers to the shared lib function
        const resultCarrier = await lookupIDsfromFullNames(scheduleCarrier);
        return res.status(200).json({
            idGrid: resultCarrier[4],
            specialtyShowIndices: resultCarrier[2],
            scheduleCarrier: resultCarrier,
        });
    } catch (err) {
        return res.status(500).json({ error: "ID lookup failed" });
    }
}
