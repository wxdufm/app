// looks up IDs from full names, skipping [X] and [SP] tags
// this version resolves IDs through the external station API, not local MySQL

/*
structure of scheduleCarrier, of which [3] and [2] are passed into this function

[0] headerRow = fullArray[0]   (1 row, 8 columns)
[1] hourColumn = fullArray.map(row => row[0]).slice(1)   (rotates hour column into 1 row, 24 columns)
[2] specialtyShowIndices = []   (marks indexes of all specialty shows relative to [3], 24x7)
[3] djNameOnlyArray = [] (starts out as fullNameOnlyArray but gets overwritten)     (24 rows, 7 columns)
[4] idGrid     (same dimensions as [3] but with MySQL ids)
*/

// keep API host configurable while preserving a prod-safe default
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.wxdu.art";

// cap parallel lookups to avoid a burst of traffic as each Last, First is looked up
const LOOKUP_CONCURRENCY = 8;

// parses "Last, First" into structured pieces used for endpoint lookups
function parseLastFirstName(cell) {
    if (typeof cell !== "string") {
        return null;
    }

    const parts = cell.split(",");
    const lastName = parts[0]?.trim();
    const firstName = parts.slice(1).join(",")?.trim();

    if (!firstName || !lastName) {
        return null;
    }

    // normalized display value keeps fallback strings consistent across branches
    const displayName = `${lastName}, ${firstName}`;
    return { firstName, lastName, displayName };
}

// stable cache key lets duplicate names (i.e. 2 hr shows) reuse one result in this function call
function buildNameKey(firstName, lastName) {
    return `${lastName.toLowerCase()}|${firstName.toLowerCase()}`;
}

// fetches one name lookup result from the external API and maps it to the schedule token format
async function lookupSingleName(firstName, lastName, displayName) {
    try {
        const url = new URL("/api/djs", API_BASE);
        url.searchParams.set("firstname", firstName);
        url.searchParams.set("lastname", lastName);

        // here is where fetch lives! in case you can't see it.
        const response = await fetch(url.toString());
        if (!response.ok) {
            return `[COULD NOT QUERY W/ NAME] ${displayName}`;
        }

        const payload = await response.json();
        const rows = Array.isArray(payload) ? payload : payload ? [payload] : [];

        // match old LIMIT 1 behavior only when the endpoint is truly unambiguous
        if (rows.length === 1 && rows[0]?.ID !== undefined && rows[0]?.ID !== null) {
            return rows[0].ID;
        }

        // if for whatever reason there's 2 users with the same Last, First...
        // rare but if that happens I would just use pass-through tags "[X]" lol
        if (rows.length > 1) {
            return `[AMBIGUOUS USER] ${displayName}`;
        }

        return `[NO USER FOUND] ${displayName}`;
    } catch (err) {
        return `[COULD NOT QUERY W/ NAME] ${displayName}`;
    }
}

export async function lookupIDsfromFullNames(scheduleCarrier) {
    const fullNameGrid = scheduleCarrier[3];
    var specialtyShowIndices = scheduleCarrier[2];

    // cache of unique parsed names (no need query twice for 2-hr shows etc), reset on every call
    const lookupResultCache = new Map();

    // queue of unique names to prefetch once, even if repeated across the grid
    const lookupQueue = [];

    // first pass only discovers unique lookup names and seeds the queue
    for (const row of fullNameGrid) {
        for (const cell of row) {
            if (!cell) {
                continue;
            }

            if (typeof cell === "string" && (cell.trim().startsWith("[X] ") || cell.trim().startsWith("[SP] "))) {
                continue;
            }

            // this ver: functionalised the actual comma separation ("Last, First" --> consts for First and Last)
            const parsed = parseLastFirstName(cell);
            if (!parsed) {
                continue;
            }

            // add unique names to da cache
            const key = buildNameKey(parsed.firstName, parsed.lastName);
            if (!lookupResultCache.has(key)) {
                lookupResultCache.set(key, null);
                lookupQueue.push({ key, ...parsed });
            }
        }
    }

    // worker pool consumes the queue with bounded concurrency
    let queueIndex = 0;
    const workerCount = Math.min(LOOKUP_CONCURRENCY, lookupQueue.length);

    await Promise.all(
        Array.from({ length: workerCount }, async () => {
            while (true) {
                const currentIndex = queueIndex;
                queueIndex += 1;

                if (currentIndex >= lookupQueue.length) {
                    break;
                }

                const item = lookupQueue[currentIndex];
                const lookupResult = await lookupSingleName(item.firstName, item.lastName, item.displayName);
                lookupResultCache.set(item.key, lookupResult);
            }
        })
    );

    const result = [];

    // actual lookup happens here!! idc about inefficiency tbh, this thing is supposed to run once a semester
    for (const [rowIndex, row] of fullNameGrid.entries()) {
        const idRow = [];

        for (const [colIndex, cell] of row.entries()) {

            // defaults empty cells to Otto, whose ID is 346 & name is Lunokhod 3
            if (!cell) {
                idRow.push(346);
                continue;
            }

            // ignores tags "[X] " from the .csv which mean for whaterver reason, skip the lookup
            if (typeof cell === "string" && cell.trim().startsWith("[X] ")) {
                idRow.push(cell.trim().replace(/^\[X\]\s*/, "")); // removes "[X] "
                continue;
            }

            // ignores tags "[SP] " from the .csv which mean specialty show --> skip the lookup
            if (typeof cell === "string" && cell.trim().startsWith("[SP] ")) {
                idRow.push(cell.trim().replace(/^\[SP\]\s*/, ""));
                specialtyShowIndices.push([rowIndex, colIndex]);
                continue;
            }

            // parse as "Last, First" (functionalized now!!!!) and fallback if invalid
            const parsed = parseLastFirstName(cell);
            if (!parsed) {
                idRow.push(`[NAME PARSE ERROR] ${cell}`);
                continue;
            }

            // read pre-fetched result from cache if exists
            const key = buildNameKey(parsed.firstName, parsed.lastName);
            const cachedResult = lookupResultCache.get(key);
            idRow.push(cachedResult ?? `[COULD NOT QUERY W/ CACHE] ${parsed.displayName}`);
        }

        result.push(idRow);
    }

    scheduleCarrier[2] = specialtyShowIndices;
    scheduleCarrier[3] = result;
    scheduleCarrier[4] = result;
    return scheduleCarrier;
}
