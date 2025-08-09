const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const API_URL = 'https://api.joshlei.com/v2/growagarden/info?type=seed';

// ---- Fetch JSON from API ----
function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'jstudio-key': process.env.VITE_JSTUDIO_KEY
            }
        };
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (err) {
                    reject(err);
                }
            });
        }).on('error', reject);
    });
}

// ---- Download Image ----
function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filename);
        const options = {
            headers: {
                'jstudio-key': process.env.VITE_JSTUDIO_KEY
            }
        };
        https.get(url, options, (response) => {
            response.pipe(file);
            file.on('finish', () => file.close(resolve));
        }).on('error', (err) => {
            fs.unlink(filename, () => reject(err));
        });
    });
}

// ---- Main Script ----
async function main() {
    try {
        const items = await fetchJSON(API_URL);
        const args = process.argv.slice(2); // IDs passed from CLI
        let filteredItems = items;

        if (args.length > 0) {
            const ids = args.map(id => id.toString());
            filteredItems = items.filter(item => ids.includes(item.item_id.toString()));
            if (filteredItems.length === 0) {
                console.log("⚠ No matching items found for the given IDs.");
                return;
            }
        }

        if (!fs.existsSync('images')) {
            fs.mkdirSync('images');
        }

        for (const item of filteredItems) {
            const url = item.icon;
            const filename = path.join('images', `${item.item_id}.png`);
            console.log(`⬇ Downloading ${item.display_name} (${item.item_id})...`);
            await downloadImage(url, filename);
        }

        console.log('✅ Download complete.');
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

main();
