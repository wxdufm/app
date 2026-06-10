// This API returns cover url when given artist and album name.



import connectToMongoDB from '../../../lib/db/mongodb';
import { ObjectId } from 'mongodb'
import Fuse from 'fuse.js'

export default async function handler(req, res) {
    const { artist, album } = req.query;
    if (!artist || !album) {
        return res.status(400).json({ error: 'artist and album are required' });
    }
    try {
        // opening the database connection
        const {db} = await connectToMongoDB();

        let release = await db.collection('releases').findOne({
            artist: { $regex: new RegExp(`^${escapeRegex(artist)}$`, 'i') },
            title:  { $regex: new RegExp(`^${escapeRegex(album)}$`, 'i') },
        });

        // Implement fuzzy search if nothing found through normal search
        if (!release) {
            release = await fuzzySearch(artist, album, db);
            if (!release){
                return res.status(200).json({coverUrl: null})
            }
        }
        if (release.cover_url) {
            return res.status(200).json({ coverUrl: release.cover_url });
        }
        if (release.downloads_db_id) {
            const download = await db.collection('downloads').findOne({
                _id: new ObjectId(release.downloads_db_id),
            });

            if (download && download.nonaudio && download.nonaudio.length > 0) {
                let nonaudio = download.nonaudio[0];
                let test = download.nonaudio
                // check to see which element is the image file
                if (download.nonaudio.length > 1){
                    nonaudio = findNonAudio(download.nonaudio)
                }
                const coverUrl = `https://beachyhead.wxdu.duke.edu/media/${download.dirname}/${nonaudio}`;
                
                return res.status(200).json({ coverUrl });
            }
        }

        return res.status(200).json({ coverUrl: null });
    } catch (error) {
        console.error('[charts/cover API]', error);
        return res.status(500).json({ error: error.message });
    }
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// function to return the image file in an array of more than one element
function findNonAudio(nonaudio){
    let url;
    for (const item of nonaudio) {
        if (item.includes(".jpg") || item.includes(".png"))
        {
            return item
        }
    }

    return null
}

// function to implement a fuzzy search of the database
async function fuzzySearch(artist, album, db) {
    const albumQ = album ? escapeRegex(album) : '';
    const artistQ = artist ? escapeRegex(artist) : '';

    // Prefilter: if artist provided, narrow to that artist (case-insensitive)
    const baseFilter = artist
        ? { artist: { $regex: `^${artistQ}$`, $options: 'i' } }
        : {
            $or: [
            { title: { $regex: albumQ || '', $options: 'i' } },
            { artist: { $regex: artistQ || '', $options: 'i' } }
            ]
        };

    // Remove/omit any downloads_db_id existence filter so we include exact results
    const candidates = await db.collection('releases')
        .find(baseFilter)
        .project({ title: 1, artist: 1, downloads_db_id: 1, cover_url: 1 })
        .limit(500)
        .toArray();

    if (!candidates.length) return null;

    const fuse = new Fuse(candidates, {
        keys: [{ name: 'title', weight: 0.8 }, { name: 'artist', weight: 0.2 }],
        threshold: 0.45,
        includeScore: true,
        ignoreLocation: true,
        minMatchCharLength: 2
    });

    // Prefer searching by album/title first (primary key)
    let fuseResults = album ? fuse.search(album) : fuse.search(artist || '');
    // fallback: try artist or combined query
    if (!fuseResults.length && artist) fuseResults = fuse.search(artist);
    if (!fuseResults.length && artist && album) fuseResults = fuse.search(`${artist} ${album}`);

    if (!fuseResults.length) return null;

    // Accept top result only if score is reasonable (lower = better)
    const top = fuseResults[0];
    if (typeof top.score === 'number' && top.score <= 0.6) return top.item;
    return null;
}