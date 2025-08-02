create table websocket_status (
  id text primary key default 'singleton',
  is_connected boolean not null,
  last_checked timestamp with time zone default now(),
  reason text
);
