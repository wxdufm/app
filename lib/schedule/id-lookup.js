// looks up IDs from full names

import db from "../db/plmanager";

export async function lookupIDsfromFullNames(fullNameGrid) {
    const result = [];

    for (const row of fullNameGrid) {
        const idRow = [];

        for (const cell of row) {

            // defaults empty cells to Otto, whose ID is 346 & name is Lunokhod 3
            if (!cell) {
                idRow.push(346);
                continue;
            }

            // // keep empty cells empty
            // if (!cell || !cell.trim()) {
            //     idRow.push("")
            //     continue;
            // }

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