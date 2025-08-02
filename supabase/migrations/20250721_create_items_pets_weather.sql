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

-- Weather Table
CREATE TABLE IF NOT EXISTS public.weather (
  weather_id TEXT PRIMARY KEY,
  weather_name TEXT,
  icon TEXT,
  duration INTEGER,
  active BOOLEAN,
  start_duration_unix INTEGER,
  end_duration_unix INTEGER
);
