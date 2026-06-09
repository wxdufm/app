// looks up dj names using IDs

import db from "../db/plmanager";

export async function lookupDjNamesFromIDs(idGrid) {
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

        // only parses cells with a DJ id, or strictly, only if it's a # but i suppose nobody's full name is a #
        if (typeof cell === "number" || /^\d+$/.test(String(cell))) {

            const id = Number(cell) // init a var for the query
            
            try {
                // otttooooo~~~ checks rows if ID is 346, hard coded to become Otto
                if (cell == 346) {
                    djNameRow.push("Lunokhod 3")
                } else {

                    // if not otto, fetch dj name, first name, last name
                    // pushes dj name to array, with format First L as the fallback when dj name not found
                    const [rows] = await db.query("SELECT defdjname, firstname, lastname FROM users WHERE ID = ? LIMIT 1", [id]);
                    if (rows && rows.length > 0) {
                        const lastInitial = rows[0].lastname[0];
                        djNameRow.push(rows[0].defdjname || `${rows[0].firstname} ${lastInitial}`);
                    } else {
                        djNameRow.push(`[NO DJ NAME FOUND] ${id}`)
                    }
                }
            } catch (err) {
                djNameRow.push(`[NO DJ NAME FOUND] ${id}`)
            }
        } else {
            // preserves fallback strings from id-lookup
            djNameRow.push(cell)
        }
    }
    result.push(djNameRow)
   }
   return result
}