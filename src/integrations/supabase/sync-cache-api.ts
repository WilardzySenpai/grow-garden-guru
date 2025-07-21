// Robust API endpoint for admin cache refresh
// This file should be imported and used in your backend API route

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Supabase credentials missing');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function fetchEncyclopediaData() {
  // Fetch from API
  const headers = {
    'Jstudio-key': 'jstudio',
    'Content-Type': 'application/json',
  };
  const [itemsRes, petsRes, weatherRes] = await Promise.all([
    fetch('https://api.joshlei.com/v2/growagarden/info/', { headers }),
    fetch('https://api.joshlei.com/v2/growagarden/info?type=pet', { headers }),
    fetch('https://api.joshlei.com/v2/growagarden/weather', { headers }),
  ]);
  if (!itemsRes.ok || !petsRes.ok || !weatherRes.ok) {
    throw new Error('API fetch failed');
  }
  const items = await itemsRes.json();
  const pets = await petsRes.json();
  const weather = await weatherRes.json();
  return { items, pets, weather: weather.weather || [] };
}

export async function syncCache(req, res) {
  // Simple admin authentication (replace with real auth in production)
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret || req.headers['x-admin-secret'] !== adminSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const { items, pets, weather } = await fetchEncyclopediaData();
    // Upsert items
    if (Array.isArray(items)) {
      await supabase.from('items').upsert(items, { onConflict: 'item_id' });
    }
    if (Array.isArray(pets)) {
      await supabase.from('pets').upsert(pets, { onConflict: 'item_id' });
    }
    if (Array.isArray(weather)) {
      await supabase.from('weather').upsert(weather, { onConflict: 'weather_id' });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
