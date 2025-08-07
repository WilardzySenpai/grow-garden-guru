export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    created_at: string;
                    display_name: string;
                    avatar_url: string;
                    user_metadata: Record<string, unknown>;
                };
                Insert: {
                    id: string;
                    created_at?: string;
                    display_name: string;
                    avatar_url?: string;
                    user_metadata?: Record<string, unknown>;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    display_name?: string;
                    avatar_url?: string;
                    user_metadata?: Record<string, unknown>;
                };
            };
            bug_reports: {
                Row: {
                    id: string;
                    user_id: string;
                    message: string;
                    image_url?: string;
                    external_image_url?: string;
                    status: 'pending' | 'in_progress' | 'done';
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    message: string;
                    image_url?: string;
                    external_image_url?: string;
                    status?: 'pending' | 'in_progress' | 'done';
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    message?: string;
                    image_url?: string;
                    external_image_url?: string;
                    status?: 'pending' | 'in_progress' | 'done';
                    created_at?: string;
                    updated_at?: string;
                };
            };
            maintenance_settings: {
                Row: {
                    id: string;
                    enabled: boolean;
                    message: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    enabled: boolean;
                    message: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    enabled?: boolean;
                    message?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            api_usage_logs: {
                Row: {
                    id: string;
                    user_id: string;
                    endpoint: string;
                    method: string;
                    status_code: number;
                    response_time_ms: number;
                    ip_address: string;
                    user_agent: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    endpoint: string;
                    method: string;
                    status_code: number;
                    response_time_ms: number;
                    ip_address: string;
                    user_agent: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    endpoint?: string;
                    method?: string;
                    status_code?: number;
                    response_time_ms?: number;
                    ip_address?: string;
                    user_agent?: string;
                    created_at?: string;
                };
            };
            weather: {
                Row: {
                    weather_id: string;
                    weather_name: string;
                    icon: string;
                    duration: number;
                    active: boolean;
                    start_duration_unix: number;
                    end_duration_unix: number;
                };
                Insert: {
                    weather_id: string;
                    weather_name: string;
                    icon: string;
                    duration: number;
                    active: boolean;
                    start_duration_unix: number;
                    end_duration_unix: number;
                };
                Update: {
                    weather_id?: string;
                    weather_name?: string;
                    icon?: string;
                    duration?: number;
                    active?: boolean;
                    start_duration_unix?: number;
                    end_duration_unix?: number;
                };
            };
            weather_status: {
                Row: {
                    id: string;
                    weather_id: string | null;
                    weather_name: string | null;
                    icon: string | null;
                    duration: number | null;
                    start_duration_unix: number | null;
                    end_duration_unix: number | null;
                    active: boolean | null;
                    last_updated: string | null;
                };
                Insert: {
                    id: string;
                    weather_id?: string | null;
                    weather_name?: string | null;
                    icon?: string | null;
                    duration?: number | null;
                    start_duration_unix?: number | null;
                    end_duration_unix?: number | null;
                    active?: boolean | null;
                    last_updated?: string | null;
                };
                Update: {
                    id?: string;
                    weather_id?: string | null;
                    weather_name?: string | null;
                    icon?: string | null;
                    duration?: number | null;
                    start_duration_unix?: number | null;
                    end_duration_unix?: number | null;
                    active?: boolean | null;
                    last_updated?: string | null;
                };
            };
            ingame_notifications: {
                Row: {
                    id: string;
                    message: string;
                    timestamp: number;
                    received: string;
                };
                Insert: {
                    id?: string;
                    message: string;
                    timestamp?: number;
                    received?: string;
                };
                Update: {
                    id?: string;
                    message?: string;
                    timestamp?: number;
                    received?: string;
                };
            };
            websocket_status: {
                Row: {
                    id: string;
                    is_connected: boolean;
                    last_checked: string;
                    reason: string | null;
                };
                Insert: {
                    id?: string;
                    is_connected: boolean;
                    last_checked?: string;
                    reason?: string | null;
                };
                Update: {
                    id?: string;
                    is_connected?: boolean;
                    last_checked?: string;
                    reason?: string | null;
                };
            };
        };
    };
}
