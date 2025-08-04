const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

// API URL for fetching crop images
// Note: Ensure the API key is stored securely and not hardcoded in production code
// You can use environment variables or a secure vault for sensitive information.

const API_URL = 'https://api.joshlei.com/v2/growagarden/info?type=seed';

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'jstudio-key': process.env.VITE_JSTUDIO_KEY // Use environment variable for API key'
            }
        };
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}

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

async function main() {
    try {
        const items = await fetchJSON(API_URL);

        if (!fs.existsSync('images')) {
            fs.mkdirSync('images');
        }

        for (const item of items) {
            const url = item.icon;
            const filename = path.join('images', `${item.item_id}.png`);
            console.log(`Downloading ${item.display_name} icon...`);
            await downloadImage(url, filename);
        }

        console.log('✅ All images downloaded.');
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

main();
