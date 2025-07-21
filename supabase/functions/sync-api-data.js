const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://emufdclxlqzwhlcsvtjt.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtdWZkY2x4bHF6d2hsY3N2dGp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQ2MTE5MSwiZXhwIjoyMDY3MDM3MTkxfQ.3zgJC9OSk5ZnRY_r0xJ_5e8hEGdKJzNda8u703SvkgY";
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const endpoints = [
  {
    url: 'https://api.joshlei.com/v2/growagarden/info/',
    table: 'items',
    uniqueKey: 'item_id',
  },
  {
    url: 'https://api.joshlei.com/v2/growagarden/info?type=pet',
    table: 'pets',
    uniqueKey: 'item_id',
  },
  {
    url: 'https://api.joshlei.com/v2/growagarden/weather',
    table: 'weather',
    uniqueKey: 'weather_id',
    transform: (data) => data.weather || [],
  },
];

async function syncTable(endpoint) {
  const response = await fetch(endpoint.url, {
    headers: {
      'Jstudio-key': 'jstudio',
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    console.error(`Failed to fetch ${endpoint.url}: ${response.status}`);
    return;
  }
  let data = await response.json();
  if (endpoint.transform) data = endpoint.transform(data);
  if (!Array.isArray(data)) {
    console.error(`Unexpected data format for ${endpoint.url}`);
    return;
  }
  const { error } = await supabase
    .from(endpoint.table)
    .upsert(data, { onConflict: endpoint.uniqueKey });
  if (error) {
    console.error(`Supabase upsert error for ${endpoint.table}:`, error);
  } else {
    console.log(`${endpoint.table} synced!`);
  }
}

async function main() {
  for (const endpoint of endpoints) {
    await syncTable(endpoint);
  }
}

main();
