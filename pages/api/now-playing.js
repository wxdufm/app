import { Table } from "@mui/material";
import * as cheerio from "cheerio";

const PLAYLIST_URL = "https://wxdu.org/plmanager/world/currentplaylist.php";

function cleanText(text) {
    return text?.replace(/\s+/g, ' ').trim() || null;
}

export default async function handler(req, res) {

    // fetch currentplaylist page from wxdu.org
    try {
        const response = await fetch(PLAYLIST_URL, {
            headers: {
                "User-Agent": "wxdu.art now-playing fetcher"
            },
        });

        // if wxdu.org currentplaylist fails to load
        if (!response.ok) {
        return res.status(502).json({
            artist: null,
            title: null,
            source: PLAYLIST_URL,
            error: `Playlist request failed with ${response.status}`,
        });
        }

        // reads currentplaylist page as raw html and loads it into cheerio
        const html = await response.text();
        const $ = cheerio.load(html);

        // find last row in the first table on the page, which is the flowsheet
        const flowsheetTable = $("table").first();
        const lastRow = table.find("tr").last();

        // parses each cell in the last row
        const cells = lastRow
            .find("td")
            .map((_, cell) => clean($(cell).text()))
            .get();

        // in case of half-filled rows... avoids errors later
        if (cells.length < 2) {
            return res.status(404).json({
                artist: null,
                title: null,
                source: PLAYLIST_URL,
                error: "No current track found",
            });
        }

        const artist = cells[0];
        const title = cells[1];

        // in case of missing artist/title info...
        if (!artist || !title) {
            return res.status(404).json({
                artist: null,
                title: null,
                source: PLAYLIST_URL,
                error: "No current track found",
            });
        }

        const result = {
            artist,
            title,
            // extra goodies
            album: cells[2] ?? null,
            label: cells[3] ?? null,
            comments: cells[4] ?? null,
            source: PLAYLIST_URL
        };

        // cache
        res.setHeader(
            "Cache-Control",
            "s-maxage=30, stale-while-revalidate=120"
        );

        return res.status(200).json(result);
        
    } catch (error) {
        return res.status(500).json({
            artist: null,
            title: null,
            source: PLAYLIST_URL,
            error: "Unable to fetch now-playing data",
        });
    }
}