CREATE TABLE weather_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  weather_id TEXT UNIQUE,  -- <- make sure this is UNIQUE
  weather_name TEXT,
  icon TEXT,
  duration INTEGER,
  start_duration_unix BIGINT,
  end_duration_unix BIGINT,
  active BOOLEAN,
  last_updated TIMESTAMP WITH TIME ZONE
);
