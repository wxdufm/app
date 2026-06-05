// open database connection from lib/db/plmanager.js

// query users in the plmanager database, using first + last name, returning primary key "ID"
    // strip [SP] from specialty shows, note down array indices
    // use fallback of "[NO USER FOUND] first name + last name" if no match found in users

// pass the new array into schedule-djName-lookup.js

import { lookupIDsfromFullNames } from 'lib/schedule/id-lookup'

// receives body-only array of full names

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end()
    try {
        const fullNameGrid = req.body;
        const idGrid = await lookupIDsfromFullNames(fullNameGrid)
        res.status(200).json(idGrid);
    } catch (err) {
        res.status(500).json({ error: "ID lookup failed"})
    }
}