// open database connection from lib/db/plmanager.js

// query users in the plmanager database, using ID, returning defdjname
    // use fallback of "[NO DJ NAME FOUND]" if no match found in users

import db from "../../lib/db/plmanager";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const fullIdArray = req.body;
    const djNameGrid = [];

    for (const row of fullIdArray) {
        const djNameRow = [];

        for (let cell of row) {

            // defaults empty cells to Otto, whose ID is 346
            if (!cell || !cell.trim()) {
                djNameRow.push(346)
                continue;
            }

            // skips over errors generated in fullName-lookup
            if ("[" in cell) {
                djNameRow.push(cell);
                continue;
            }

            // query plmanager
            const [rows] = await db.query(
                "SELECT ID FROM users WHERE id = ? LIMIT 1",
                [cell]
            );

            if (rows.length > 0) {
                djNameRow.push(rows[0].defdjname);
            } else {
                djNameRow.push(`[NO DJ NAME FOUND] ${cell}`);
            }
        }

        djNameGrid.push(djNameRow);
    }

    res.status(200).json(djNameGrid);
}