// open database connection from lib/db/plmanager.js

// query users in the plmanager database, using first + last name, returning primary key "ID"
    // strip [SP] from specialty shows, note down array indices
    // use fallback of "[NO USER FOUND] first name + last name" if no match found in users

// pass the new array into schedule-djName-lookup.js

import db from "../../lib/db/plmanager";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const fullNameArray = req.body;
    const idGrid = [];

    for (const row of fullNameArray) {
        const idRow = [];

        for (let cell of row) {

            // keep empty cells empty
            if (!cell || !cell.trim()) {
                idRow.push("")
                continue;
            }

            // splits (Extra First Names) First.Last (Extra Last Names)
            const parts = cell.split(".");
            const firstName = parts[0];
            const lastName = parts[1];

            // passes [NAME ERROR] to differentiate from [NO USER FOUND], which queries but is unsuccessful
            if (!first || !last) {
                idRow.push(`[NAME ERROR] ${cell}`);
                continue;
            }

            // query plmanager
            const [rows] = await db.query(
                "SELECT ID FROM users WHERE firstname = ? AND lastname = ? LIMIT 1",
                [firstName, lastName]
            );

            if (rows.length > 0) {
                idRow.push(rows[0].ID);
            } else {
                idRow.push(`[NO USER FOUND] ${cell}`);
            }
        }

        idGrid.push(idRow);
    }

    res.status(200).json(idGrid);
}