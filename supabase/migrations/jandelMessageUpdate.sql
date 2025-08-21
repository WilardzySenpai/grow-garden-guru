ALTER TABLE jandel_messages
DROP CONSTRAINT IF EXISTS unique_message_timestamp;

ALTER TABLE jandel_messages
ADD CONSTRAINT unique_message UNIQUE (message);
