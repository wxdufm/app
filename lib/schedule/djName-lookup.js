// looks up dj names using IDs

import db from 'lib/db/plmanager';

async function lookupDjNames(idGrid) {
    /*
    accept scheduleCarrier or raw idGrid

    if (Array.isArray(idGrid) && idGrid.length >= 4 && Array.isArray(idGrid[3])) {
        idGrid = idGrid[3]
    }
    */
   const result = [];

   for (const row of idGrid) {
    const djNameRow = [];

    for (const cell of row) {

        // defaults empty cells to Otto, whose ID is 346
        if (!cell || !cell.trim()) {
            djNameRow.push(346);
            continue;
        }

        // also returns first + last initial in case DJ name is null
        if (typeof cell === "number" || /^\d+$/.test(String(cell))) {
            const id = Number(cell)
            try {
                const [rows] = await db.query("SELECT defdjname, firstname, lastname FROM users WHERE ID = ? LIMIT 1", [id]);
                if (rows && rows.length > 0) {
                    const lastInitial = rows[0].lastname[0];
                    djNameRow.push(rows[0].defdjname || `${rows[0].firstname} lastInitial`);
                } else {
                    djNameRow.push(`[NO DJ NAME FOUND] ${id}`)
                }
            } catch (err) {
                djNameRow.push(`[NO DJ NAME FOUND] ${id}`)
            }
        } else {
            // preserves fallback strings from fullName-lookup
            djNameRow.push(cell)
        }
    }
    result.push(djnameRow)
   }
   return result
}

module.exports = { lookupDjNamesFromIDs }