const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio')
const { MongoClient } = require('mongodb');

const nodeDir = path.join(__dirname, '../../ogwxdu/node');
const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'wxdu';

async function run() {
    const files = fs.readdirSync(nodeDir).filter(f => f.endsWith('.html'));
    const charts = [];

    for (const file of files) {
        const html = fs.readFileSync(path.join(nodeDir, file), 'utf8');
        const $ = cheerio.load(html)

        const dateEl = $('span.date-display-single');
        if(!dateEl.length) continue;

        const dateText = dateEl.text().trim();
        const date = new Date(dateText);
        if (isNaN(date.getTime())) continue;

        const dateStr = date.toISOString().split('T')[0]; // "2018-03-25"

        let title = '';
        const pStrong = $('p strong').first();
        const h2link = $('h2 a').first();
        if (pStrong.length) {
            title = pStrong.text().trim();
        } else if (h2link.length) {
            title = h2link.text().trim();
        }
        if (!title) title = `WXDU Charts Ending ${dateText}`;


        
        const rawLines = [];
        $('p').each((i, el) => {
            //skip title paragraph
            if ($(el).find('strong').length) return;
            //convert <br> tags to newlines then get text
            $(el).find('br').replaceWith('\n')
            const text = $(el).text();
            //split by newlines and add nonempty lines
            text.split('\n').forEach(line => {
                if (line.trim()) rawLines.push(line.trim());
            });
        });

        const entries = [];
        const seenRanks = new Set();
        for (const line of rawLines) {
            const normalized = line.replace(/…/g, '...');
            //match: number, then dot/tab/space, then number, then ...
            const match = normalized.match(/^(\d+(?:\.\d+)?)\s*[\.\s]+(\d+)\s*\.\.\.(.*)/);
            if (!match) continue;

            const rankStr = match[1]; //"1" or "88.7"
            const spins = parseInt(match[2]);
            const rest = match[3]; //"Artist...Album...Label"
            //skip if we've already seen this rank (means its a genre sub chart)
            if (seenRanks.has(rankStr)) continue;
            seenRanks.add(rankStr);
            //split rest into artist / album / label
            //use first part as artist, last part as label, middle as album
            const parts = rest.split('...');
            if (parts.length < 3) continue;
            const artist = parts[0].trim();
            const label = parts[parts.length - 1].trim();
            const album = parts.slice(1, -1).join('...').trim();

            entries.push({ rank: rankStr, spins, artist, album, label});
        }
        if (entries.length > 0) {
            charts.push({ date: dateStr, title, entries });
        }
    }
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection('charts');
    //wipe any existing data (safe to re run script)
    await collection.deleteMany({});
    //insert all charts at once
    await collection.insertMany(charts);
    //create index so date lookups are fast
    await collection.createIndex({ date: -1 });
    console.log(`Imported ${charts.length} charts`);
    await client.close(); 
}

run().catch(err => {
    console.error(err);
    process.exit(1)
});