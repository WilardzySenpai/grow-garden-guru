-- Create table for user crop checklist
CREATE TABLE public.user_crop_checklist (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    crop_item_id TEXT NOT NULL,
    is_planted BOOLEAN NOT NULL DEFAULT false,
    planted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, crop_item_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_crop_checklist ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own crop checklist" 
ON public.user_crop_checklist 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own crop checklist entries" 
ON public.user_crop_checklist 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own crop checklist" 
ON public.user_crop_checklist 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own crop checklist entries" 
ON public.user_crop_checklist 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_crop_checklist_updated_at
BEFORE UPDATE ON public.user_crop_checklist
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();