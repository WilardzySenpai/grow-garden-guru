// Express/Next.js/Vite API route for admin cache refresh
import type { NextApiRequest, NextApiResponse } from 'next';
import { syncCache } from '@/integrations/supabase/sync-cache-api';

// For Express, export as a handler function
// For Next.js, export as default
// For Vite, adapt to your API middleware

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  await syncCache(req, res);
}

// Express usage:
// import handler from '@/api/admin/sync-cache';
// app.post('/api/admin/sync-cache', handler);

// Next.js usage:
// Place this file in /pages/api/admin/sync-cache.ts
// Vite usage:
// Use as a middleware in your dev server
