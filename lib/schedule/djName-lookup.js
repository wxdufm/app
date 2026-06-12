// looks up dj names using IDs

/*
structure of scheduleCarrier, of which [3] and [2] are passed into this function

[0] headerRow = fullArray[0]   (1 row, 8 columns)
[1] hourColumn = fullArray.map(row => row[0]).slice(1)   (rotates hour column into 1 row, 24 columns)
[2] specialtyShowIndices = []   (marks indexes of all specialty shows relative to [3], 24x7)
[3] djNameOnlyArray = []   "working array: full names --> IDs --> dj names"     (24 rows, 7 columns)
[4] idGrid     (same dimensions as [3] but with MySQL ids)
*/

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.wxdu.art"
const OTTO_ID = 346
const OTTO_ALIAS = "Луноход 3"
const EMPTY_CELL_FALLBACK = "[EMPTY SCHEDULE CELL]"
const NAME_FALLBACK_PARSE_ERROR = "[COULD NOT PARSE FULL NAME]"

function parseIdCell(cell) {
    if (cell === undefined || cell === null) {
        return null
    }

    const value = String(cell).trim()
    if (!value || value.startsWith("[")) {
        return null
    }

    if (/^\d+$/.test(value)) {
        return Number(value)
    }

    return null
}

async function queryAllPresentIDs(queryStr) {
    if (!queryStr) {
        return []
    }

    const url = new URL(`/api/djs/${encodeURIComponent(queryStr)}`, API_BASE)
    const response = await fetch(url.toString())
    if (!response.ok) {
        throw new Error(`DJ name lookup failed: ${response.status}`)
    }

    const payload = await response.json()
    return Array.isArray(payload) ? payload : payload ? [payload] : []
}

function buildFirstLFromBackupCell(fullNameGridBackup, rowIndex, colIndex) {
    if (!Array.isArray(fullNameGridBackup)) {
        return null
    }

    const sourceCell = fullNameGridBackup?.[rowIndex]?.[colIndex]
    const sourceValue = String(sourceCell ?? "").trim()
    if (!sourceValue) {
        return null
    }

    // expects "Last, First" from schedule source; no bracket-tag stripping by request
    const parts = sourceValue.split(",")
    const lastName = parts[0]?.trim()
    const firstName = parts.slice(1).join(",").trim()
    if (!firstName || !lastName) {
        return null
    }

    const lastInitial = lastName[0]
    if (!lastInitial) {
        return null
    }

    return `${firstName} ${lastInitial}`
}

export async function lookupDjNamesFromIDs(scheduleCarrier, fullNameGridBackup = null) {
    const idArray = scheduleCarrier[4]
    if (!Array.isArray(idArray)) {
        throw new Error("scheduleCarrier[4] must be a 2D ID array")
    }

    // infer row width once so fallback rows still render a complete grid
    const expectedWidth = idArray.reduce((max, row) => {
        return Array.isArray(row) && row.length > max ? row.length : max
    }, 0)

    const uniqueIds = new Set()
    for (const row of idArray) {
        if (!Array.isArray(row)) {
            continue
        }
        for (const cell of row) {
            const id = parseIdCell(cell)
            if (id && id !== OTTO_ID) {
                uniqueIds.add(id)
            }
        }
    }

    const queryStr = Array.from(uniqueIds).join(",")
    const rows = await queryAllPresentIDs(queryStr)
    const idToDjName = new Map()

    for (const row of rows) {
        const id = row?.ID ?? row?.id
        if (id === undefined || id === null) {
            continue
        }
        const numericId = Number(id)
        const name = row?.defdjname ?? row?.djname ?? row?.name
        if (typeof name === "string" && name.trim()) {
            idToDjName.set(numericId, name.trim())
        }
    }

    const djNameGrid = idArray.map((row, rowIndex) => {
        if (!Array.isArray(row)) {
            return Array.from({ length: expectedWidth }, () => EMPTY_CELL_FALLBACK)
        }

        // iterate by index to cover sparse arrays and preserve non-empty cell guarantees
        return Array.from({ length: expectedWidth }, (_, colIndex) => {
            const cell = row[colIndex]
            const id = parseIdCell(cell)
            if (id === null) {
                // enforce non-empty output for every cell (name or explicit fallback marker)
                if (cell === 0 || cell === "0") {
                    return buildFirstLFromBackupCell(fullNameGridBackup, rowIndex, colIndex) || NAME_FALLBACK_PARSE_ERROR
                }
                const passthrough = String(cell ?? "").trim()
                return passthrough || EMPTY_CELL_FALLBACK
            }
            if (id === OTTO_ID) {
                return OTTO_ALIAS
            }
            const djName = idToDjName.get(id)
            if (typeof djName === "string" && djName.trim()) {
                return djName
            }

            // default missing-name behavior: derive "First L" from the original full-name cell
            return buildFirstLFromBackupCell(fullNameGridBackup, rowIndex, colIndex) || `[NO DJ NAME FOUND] ${id}`
        })
    })

    scheduleCarrier[3] = djNameGrid
    return scheduleCarrier
}
