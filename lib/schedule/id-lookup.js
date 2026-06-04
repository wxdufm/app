// looks up IDs from full names

import db from 'lib/db/plmanager';

async function lookupIDs(fullNameGrid) {

   const result = [];

   for (const row of fullNameGrid) {
    const idRow = [];

    for (const cell of row) {

        // keep empty cells empty
        if (!cell || !cell.trim()) {
            idRow.push("")
            continue;
        }

        // splits (Extra First Names) First.Last (Extra Last Names)
        const parts = cell.split(".");
        const firstNames = parts[0];
        const lastNames = parts[1];

        // if the splitting goes wrong
        if (!first || !last) {
                idRow.push(`[NAME PARSE ERROR] ${cell}`);
                continue;
        }

        try {
            const [rows] = await db.query("SELECT ID FROM users WHERE firstname = ? AND lastname = ? LIMIT 1", [firstName, lastName])
            if (rows && rows.length > 0) {
                
            }
        }

        // also returns first + last initial in case DJ name is null
        if (typeof cell === "number" || /^\d+$/.test(String(cell))) {
            const id = Number(cell)
            try {
                const [rows] = await db.query("SELECT defdjname, firstname, lastname FROM users WHERE ID = ? LIMIT 1", [id]);
                if (rows && rows.length >0) {
                    const lastInitial = rows[0].lastname[0];
                    idRow.push(rows[0].defdjname || `${rows[0].firstname} lastInitial`);
                } else {
                    idRow.push(`[NO DJ NAME FOUND] ${id}`)
                }
            } catch (err) {
                idRow.push(`[NO DJ NAME FOUND] ${id}`)
            }
        } else {
            // preserves fallback strings from fullName-lookup
            idRowidRow.push(cell)
        }
    }
    result.push(idRow)
   }
   return result
}

module.exports = { lookupDjNamesFromIDs }



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