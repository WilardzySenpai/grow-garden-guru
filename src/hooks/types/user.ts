import type { User } from '@supabase/supabase-js';

export interface UserMetadata {
    provider_id?: string;
    [key: string]: unknown;
}

export interface AppUser extends User {
    user_metadata: UserMetadata;
    app_metadata: {
        role?: 'admin';
        [key: string]: unknown;
    };
    is_admin?: boolean;
}
