-- Create unified contacts table to replace bug_reports
CREATE TABLE public.contacts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    purpose TEXT NOT NULL CHECK (purpose IN ('contact', 'bug_report', 'suggestion', 'other')),
    subject TEXT,
    message TEXT NOT NULL,
    image_url TEXT,
    external_image_url TEXT,
    status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
    is_guest BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for the contacts table
CREATE POLICY "Anyone can create contacts" 
ON public.contacts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own contacts" 
ON public.contacts 
FOR SELECT 
USING (auth.uid()::text = user_id);

CREATE POLICY "Admins can view all contacts" 
ON public.contacts 
FOR SELECT 
USING (((auth.jwt() -> 'user_metadata'::text) ->> 'provider_id'::text) = '939867069070065714'::text);

CREATE POLICY "Admins can update contacts" 
ON public.contacts 
FOR UPDATE 
USING (((auth.jwt() -> 'user_metadata'::text) ->> 'provider_id'::text) = '939867069070065714'::text);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_contacts_updated_at
BEFORE UPDATE ON public.contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate existing bug reports to contacts table
INSERT INTO public.contacts (
    user_id, 
    purpose, 
    subject,
    message, 
    image_url, 
    external_image_url, 
    status, 
    is_guest, 
    created_at, 
    updated_at
)
SELECT 
    user_id,
    'bug_report' as purpose,
    'Bug Report' as subject,
    message,
    image_url,
    external_image_url,
    status,
    is_guest,
    created_at,
    updated_at
FROM public.bug_reports;

-- Drop the old bug_reports table
DROP TABLE public.bug_reports;