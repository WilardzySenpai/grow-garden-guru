export interface Contact {
  id: string;
  user_id: string;
  purpose: 'contact' | 'bug_report' | 'suggestion' | 'other';
  subject?: string;
  message: string;
  image_url?: string;
  external_image_url?: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  is_guest: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactFormData {
  purpose: 'contact' | 'bug_report' | 'suggestion' | 'other';
  subject?: string;
  message: string;
  image?: File;
  external_image_url?: string;
}