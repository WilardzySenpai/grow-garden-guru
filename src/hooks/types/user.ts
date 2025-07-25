import type { User } from '@supabase/supabase-js';

export interface UserMetadata {
    provider_id?: string;
    avatar_url?: string;
    full_name?: string;
    email?: string;
    [key: string]: unknown;
}

export interface AppUser extends User {
    user_metadata: UserMetadata;
}
