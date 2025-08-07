CREATE TABLE ingame_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message TEXT NOT NULL,
    timestamp BIGINT NOT NULL,
    received_at TIMESTAMP DEFAULT now(),
    CONSTRAINT unique_message_timestamp UNIQUE (message, timestamp)
);
