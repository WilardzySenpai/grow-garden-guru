-- Fix RLS policies that reference user metadata insecurely
-- Drop the existing admin policies that reference user_metadata
DROP POLICY IF EXISTS "Admins can view all contacts" ON public.contacts;
DROP POLICY IF EXISTS "Admins can update contacts" ON public.contacts;

-- Create secure admin policies using the profiles table instead
CREATE POLICY "Admins can view all contacts" 
ON public.contacts 
FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.discord_id = '939867069070065714'
));

CREATE POLICY "Admins can update contacts" 
ON public.contacts 
FOR UPDATE 
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.discord_id = '939867069070065714'
));

-- Enable RLS on all remaining tables that don't have it
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jandel_messages ENABLE ROW LEVEL SECURITY; 
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websocket_status ENABLE ROW LEVEL SECURITY;

-- Create basic policies for public read access to these tables
CREATE POLICY "Items are viewable by everyone" ON public.items FOR SELECT USING (true);
CREATE POLICY "Jandel messages are viewable by everyone" ON public.jandel_messages FOR SELECT USING (true);
CREATE POLICY "Pets are viewable by everyone" ON public.pets FOR SELECT USING (true);
CREATE POLICY "Weather is viewable by everyone" ON public.weather FOR SELECT USING (true);
CREATE POLICY "Weather status is viewable by everyone" ON public.weather_status FOR SELECT USING (true);
CREATE POLICY "Websocket status is viewable by everyone" ON public.websocket_status FOR SELECT USING (true);