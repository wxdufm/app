// kind of janky API because it scrapes HTML off wxdu.org's current playlist instead of actually plugging into adrenalin's php backend

import * as cheerio from "cheerio";

const PLAYLIST_URL = "https://wxdu.org/plmanager/world/currentplaylist.php";

function cleanText(text) {
    return text?.replace(/\s+/g, ' ').trim() || null;
}

export default async function handler(req, res) {

    // fetch currentplaylist page from wxdu.org
    console.log("[now-playing API] fetching playlist...");
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
        console.log("[now-playing API] HTML length: ", html.length);

        // find last row in the first table on the page, which is the flowsheet
        const flowsheetTable = $("table").first();
        const lastRow = flowsheetTable.find("tr").last();
        console.log("[now-playing API] current playlist rows: ", flowsheetTable.find("tr").length - 1); // subtract header row

        // parses each cell in the last row
        const cells = lastRow
            .find("td")
            .map((_, cell) => cleanText($(cell).text()))
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

        // find the h2 containing the DJ/show name, and extract the DJ name only
        const showInfo = $("h2").first();
        const noArchive = showInfo.clone().find("a").remove().end().text().replace(/\s+/g, " ").trim();
        const djTemp = noArchive.match(/with\s+(.+)$/);
        const djName = djTemp?.[1] || null;

        // the successful one
        const result = {
            artist,
            title,
            album: cells[2] ?? null,
            dj: djName,
            // extra goodies
            label: cells[3] ?? null,
            comments: cells[4] ?? null,
            source: PLAYLIST_URL,
        };

        // cache
        res.setHeader(
            "Cache-Control",
            "s-maxage=30, stale-while-revalidate=120"
        );

        return res.status(200).json(result);
        
    } catch (error) {
        console.error("]now-playing API] threw error: ", error);

        return res.status(500).json({
            artist: null,
            title: null,
            source: PLAYLIST_URL,
            error: error.message
        });
    }
}