import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from "path";

dotenv.config({
    path: path.resolve(__dirname, "../../.env.local"),
});

const VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL!; // Replace with your actual Supabase URL
const SUPABASE_SERVICE_ROLE_KEY_PUBLIC = process.env.SUPABASE_SERVICE_ROLE_KEY_PUBLIC!; // Replace with your actual service role key
const VITE_JSTUDIO_KEY = process.env.VITE_JSTUDIO_KEY!; // Replace with your actual Jstudio key

if (!VITE_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY_PUBLIC) {
    throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY_PUBLIC);

// console.log('Supabase client created with URL:', VITE_SUPABASE_URL);
// console.log('Using Jstudio key:', VITE_JSTUDIO_KEY);
// console.log('Supabase service role key public:', SUPABASE_SERVICE_ROLE_KEY_PUBLIC);

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
        transform: (data: any) => data.weather || [],
    },
];

async function syncTable(endpoint: typeof endpoints[0]) {
    const response = await fetch(endpoint.url, {
        headers: {
            'Jstudio-key': VITE_JSTUDIO_KEY,
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
