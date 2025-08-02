create table weather_status (
  id text primary key, -- always 'singleton'
  weather_id text,
  weather_name text,
  icon text,
  duration integer,
  start_duration_unix bigint,
  end_duration_unix bigint,
  active boolean,
  last_updated timestamptz default now()
);
