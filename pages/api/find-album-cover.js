/*
api to get album cover.
Use request as : /api/find-album-cover/titles=album_name1,album_name2,album_name3
Will return an array like this (not obviously in the same order that the input titles):
    [ 
        {title: album_name2, url: ...}
        {title: album_name1, url: ...}
        {title: album_name3, url: ...}
    ]
If the url couldn't be made either because there is no download_db_id in releases document, 
or because dirname and/or nonaudio are empty, then the url will be set to url: null

You can put one or more titles in the request. But limit it to at most 50 at a time.
*/

import connectToMongoDB from '../../lib/db/mongodb';
import { ObjectId } from 'mongodb'


export default async function handler(req, res){
    console.log("[find-album-cover API] getting the album cover...");
    try{
        // opening the database connection
        const {db} = await connectToMongoDB();

        // checking if titles were provided in the request and returning an error if not
        if (!req.query.titles){
            res.status(400).json("ERROR: Must provide titles")
        }

        // getting the titles in the request and converting it as an array
        const titles = String(req.query.titles || '').split(',').map(s=>s.trim()).filter(Boolean);

        // converting everything to lower case to avoid case sensitivity errors
        const titlesLower = titles.map(t => t.toLowerCase());

        // querying the database
        const results = await db.collection('releases').aggregate([
            { $match: { 
                downloads_db_id : {$exists: true}, 
                $expr: {$in: [ { $toLower: "$title" }, titlesLower ]} 
            } },
            { $lookup: {
                from: 'downloads',
                let: {did: '$downloads_db_id'},
                pipeline: [
                    { $match: { $expr: { $eq: ['$_id', { $toObjectId: '$$did' }] } } },
                    { $project: { _id:0, dirname: 1, nonaudio: 1 } }
                ],
                as: 'download'
            }},
            { $unwind: '$download' },
            { $project: {_id: 0, title: '$title', dirname: '$download.dirname', nonaudio: '$download.nonaudio'} }
        ]).toArray();

        let cover = [];
        let doc;
        let dirname;
        let nonaudio;
        let album_title;
        for (let i = 0; i < results.length; i++){
            doc = results?.[i];
            dirname = doc?.dirname;
            nonaudio = doc?.nonaudio?.[0];
            album_title = doc?.title;
            // setting up the array to be returned
            cover.push({
                "title": album_title,
                "url": (dirname && nonaudio) 
                        ? `https://beachyhead.wxdu.duke.edu/media/${encodeURIComponent(dirname)}/${encodeURIComponent(nonaudio)}` 
                        : null
            });
        }

        res.status(200).json(cover);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server error' });
    }
}