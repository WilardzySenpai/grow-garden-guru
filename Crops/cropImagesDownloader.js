const https = require('https');
const fs = require('fs');
const path = require('path');

const API_URL = 'https://api.joshlei.com/v2/growagarden/info?type=seed';

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    https.get(url, (response) => {
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
