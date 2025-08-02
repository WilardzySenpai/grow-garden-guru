-- Create maintenance settings table
CREATE TABLE public.maintenance_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  market BOOLEAN NOT NULL DEFAULT false,
  weather BOOLEAN NOT NULL DEFAULT false,
  encyclopedia BOOLEAN NOT NULL DEFAULT false,
  calculator BOOLEAN NOT NULL DEFAULT false,
  system BOOLEAN NOT NULL DEFAULT false,
  notifications BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.maintenance_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for everyone to view maintenance settings
CREATE POLICY "Maintenance settings are viewable by everyone" 
ON public.maintenance_settings 
FOR SELECT 
USING (true);

-- Create policy for admin to update maintenance settings
CREATE POLICY "Only admin can update maintenance settings" 
ON public.maintenance_settings 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.discord_id = '939867069070065714'
  )
);

-- Insert initial settings
INSERT INTO public.maintenance_settings (
  market, weather, encyclopedia, calculator, system, notifications, recipes
) VALUES (
  false, false, false, false, false, false
);
