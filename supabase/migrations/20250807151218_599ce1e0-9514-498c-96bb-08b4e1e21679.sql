-- Add missing INSERT policy for notifications table
-- This allows users to create notifications for themselves (needed for stock alerts)
CREATE POLICY "Allow users to insert their own notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Also allow the system to insert notifications (for automated stock alerts)
-- by ensuring the user_id matches the authenticated user
-- This policy ensures notifications can only be created for the authenticated user