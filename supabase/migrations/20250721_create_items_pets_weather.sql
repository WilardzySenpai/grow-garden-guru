-- Items Table
CREATE TABLE IF NOT EXISTS public.items (
  item_id TEXT PRIMARY KEY,
  display_name TEXT,
  rarity TEXT,
  currency TEXT,
  price TEXT,
  icon TEXT,
  description TEXT,
  duration TEXT,
  last_seen TEXT,
  type TEXT
);

-- Pets Table
CREATE TABLE IF NOT EXISTS public.pets (
  item_id TEXT PRIMARY KEY,
  display_name TEXT,
  rarity TEXT,
  currency TEXT,
  price TEXT,
  icon TEXT,
  description TEXT,
  duration TEXT,
  last_seen TEXT,
  type TEXT
);