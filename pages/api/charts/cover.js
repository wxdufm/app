import clientPromise from '../../../lib/db/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    const { artist, album } = req.query;
    if (!artist || !album) {
        return res.status(400).json({ error: 'artist and album are required' });
    }
    try {
        const client = await clientPromise;
        const db = client.db('wxdu');

        const release = await db.collection('releases').findOne({
            artist: { $regex: new RegExp(`^${escapeRegex(artist)}$`, 'i') },
            title:  { $regex: new RegExp(`^${escapeRegex(album)}$`, 'i') },
        });

        if (!release) {
            return res.status(200).json({ coverUrl: null });
        }
        if (release.cover_url) {
            return res.status(200).json({ coverUrl: release.cover_url });
        }
        if (release.downloads_db_id) {
            const download = await db.collection('downloads').findOne({
                _id: new ObjectId(release.downloads_db_id),
            });

            if (download && download.nonaudio && download.nonaudio.length > 0) {
                const coverUrl = `https://beachyhead.wxdu.duke.edu/media/${download.dirname}/${download.nonaudio[0]}`;
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
