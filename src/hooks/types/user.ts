import type { User } from '@supabase/supabase-js';

export interface UserMetadata {
    provider_id?: string;
    full_name?: string;
    avatar_url?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface AppUser extends User {
    user_metadata: UserMetadata;
}