// looks up IDs from full names, skipping [X] and [SP] tags

import db from "../db/plmanager";

/*
structure of scheduleCarrier, of which [3] and [2] are passed into this function

[0] headerRow = fullArray[0]   (1 row, 8 columns)
[1] hourColumn = fullArray.map(row => row[0]).slice(1)   (rotates hour column into 1 row, 24 columns)
[2] specialtyShowIndices = []   (marks indexes of all specialty shows relative to [3], 24x7)
[3] djNameOnlyArray = [] (starts out as fullNameOnlyArray but gets overwritten)     (24 rows, 7 columns)
[4] idGrid     (same dimensions as [3] but with MySQL ids)
*/


export async function lookupIDsfromFullNames(fullNameGrid, specialtyShowIndices = []) {
    const result = [];

    for (const [rowIndex, row] of fullNameGrid.entries()) {
        const idRow = [];

        for (const [colIndex, cell] of row.entries()) {

            // defaults empty cells to Otto, whose ID is 346 & name is Lunokhod 3
            if (!cell) {
                idRow.push(346);
                continue;
            }

            // ignores tags "[X] " from the .csv which mean skip the lookup
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

            // Expect a "Last, First" format.
            const parts = cell.split(",");
            const lastName = parts[0]?.trim();
            const firstName = parts.slice(1).join(",")?.trim();

            if (!firstName || !lastName) {
                idRow.push(`[NAME PARSE ERROR] ${cell}`);
                continue;
            }

            try {
                const [rows] = await db.query(
                    "SELECT ID FROM users WHERE firstname = ? AND lastname = ? LIMIT 1",
                    [firstName, lastName]
                );

                if (rows.length > 0) {
                    idRow.push(rows[0].ID);
                } else {
                    idRow.push(`[NO USER FOUND] ${cell}`);
                }
            } catch (err) {
                idRow.push(`[COULD NOT QUERY W/ ID] ${cell}`);
            }
        }

        result.push(idRow);
    }

    return result;
}