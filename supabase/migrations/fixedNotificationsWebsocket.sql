-- ============================
-- CLEAN UP OLD POLICIES
-- ============================
DROP POLICY IF EXISTS "Allow frontend read messages (all users)" ON jandel_messages;
DROP POLICY IF EXISTS "Allow frontend read weather (all users)" ON weather_status;
DROP POLICY IF EXISTS "Allow frontend read websocket (all users)" ON websocket_status;
DROP POLICY IF EXISTS "Allow backend upsert messages" ON jandel_messages;
DROP POLICY IF EXISTS "Allow backend upsert weather" ON weather_status;
DROP POLICY IF EXISTS "Allow backend upsert websocket" ON websocket_status;
DROP POLICY IF EXISTS "Allow backend read messages" ON jandel_messages;
DROP POLICY IF EXISTS "Allow backend read weather" ON weather_status;
DROP POLICY IF EXISTS "Allow backend read websocket" ON websocket_status;

-- ============================
-- FRONTEND POLICIES (READ ONLY for anon + authenticated)
-- ============================
CREATE POLICY "Allow frontend read messages (all users)"
  ON jandel_messages
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow frontend read weather (all users)"
  ON weather_status
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow frontend read websocket (all users)"
  ON websocket_status
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ============================
-- BACKEND POLICIES (FULL READ + WRITE for service role)
-- ============================
-- Messages
CREATE POLICY "Allow backend upsert messages"
  ON jandel_messages
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow backend read messages"
  ON jandel_messages
  FOR SELECT
  TO service_role
  USING (true);

-- Weather
CREATE POLICY "Allow backend upsert weather"
  ON weather_status
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow backend read weather"
  ON weather_status
  FOR SELECT
  TO service_role
  USING (true);

-- Websocket
CREATE POLICY "Allow backend upsert websocket"
  ON websocket_status
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow backend read websocket"
  ON websocket_status
  FOR SELECT
  TO service_role
  USING (true);
