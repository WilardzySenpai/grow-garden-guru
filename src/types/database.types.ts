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
    };
  };
}
