export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      api_usage_logs: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          ip_address: string | null
          method: string
          response_time_ms: number | null
          status_code: number
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          ip_address?: string | null
          method: string
          response_time_ms?: number | null
          status_code: number
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          ip_address?: string | null
          method?: string
          response_time_ms?: number | null
          status_code?: number
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      bug_reports: {
        Row: {
          created_at: string | null
          external_image_url: string | null
          id: string
          image_url: string | null
          is_guest: boolean | null
          message: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          external_image_url?: string | null
          id?: string
          image_url?: string | null
          is_guest?: boolean | null
          message: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          external_image_url?: string | null
          id?: string
          image_url?: string | null
          is_guest?: boolean | null
          message?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      items: {
        Row: {
          currency: string | null
          description: string | null
          display_name: string | null
          duration: string | null
          icon: string | null
          item_id: string
          last_seen: string | null
          price: string | null
          rarity: string | null
          type: string | null
        }
        Insert: {
          currency?: string | null
          description?: string | null
          display_name?: string | null
          duration?: string | null
          icon?: string | null
          item_id: string
          last_seen?: string | null
          price?: string | null
          rarity?: string | null
          type?: string | null
        }
        Update: {
          currency?: string | null
          description?: string | null
          display_name?: string | null
          duration?: string | null
          icon?: string | null
          item_id?: string
          last_seen?: string | null
          price?: string | null
          rarity?: string | null
          type?: string | null
        }
        Relationships: []
      }
      jandel_messages: {
        Row: {
          id: string
          message: string
          received_at: string | null
          timestamp: number
        }
        Insert: {
          id?: string
          message: string
          received_at?: string | null
          timestamp: number
        }
        Update: {
          id?: string
          message?: string
          received_at?: string | null
          timestamp?: number
        }
        Relationships: []
      }
      maintenance_settings: {
        Row: {
          calculator: boolean
          encyclopedia: boolean
          id: string
          market: boolean
          notifications: boolean
          system: boolean
          updated_at: string
          updated_by: string | null
          weather: boolean
        }
        Insert: {
          calculator?: boolean
          encyclopedia?: boolean
          id?: string
          market?: boolean
          notifications?: boolean
          system?: boolean
          updated_at?: string
          updated_by?: string | null
          weather?: boolean
        }
        Update: {
          calculator?: boolean
          encyclopedia?: boolean
          id?: string
          market?: boolean
          notifications?: boolean
          system?: boolean
          updated_at?: string
          updated_by?: string | null
          weather?: boolean
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          icon: string | null
          id: number
          item_id: string | null
          message: string
          read: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: number
          item_id?: string | null
          message: string
          read?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: number
          item_id?: string | null
          message?: string
          read?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      pets: {
        Row: {
          currency: string | null
          description: string | null
          display_name: string | null
          duration: string | null
          icon: string | null
          item_id: string
          last_seen: string | null
          price: string | null
          rarity: string | null
          type: string | null
        }
        Insert: {
          currency?: string | null
          description?: string | null
          display_name?: string | null
          duration?: string | null
          icon?: string | null
          item_id: string
          last_seen?: string | null
          price?: string | null
          rarity?: string | null
          type?: string | null
        }
        Update: {
          currency?: string | null
          description?: string | null
          display_name?: string | null
          duration?: string | null
          icon?: string | null
          item_id?: string
          last_seen?: string | null
          price?: string | null
          rarity?: string | null
          type?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          discord_id: string | null
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          discord_id?: string | null
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          discord_id?: string | null
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_stock_alerts: {
        Row: {
          created_at: string | null
          id: number
          item_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          item_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          item_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_stock_alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      weather: {
        Row: {
          active: boolean | null
          duration: number | null
          end_duration_unix: number | null
          icon: string | null
          start_duration_unix: number | null
          weather_id: string
          weather_name: string | null
        }
        Insert: {
          active?: boolean | null
          duration?: number | null
          end_duration_unix?: number | null
          icon?: string | null
          start_duration_unix?: number | null
          weather_id: string
          weather_name?: string | null
        }
        Update: {
          active?: boolean | null
          duration?: number | null
          end_duration_unix?: number | null
          icon?: string | null
          start_duration_unix?: number | null
          weather_id?: string
          weather_name?: string | null
        }
        Relationships: []
      }
      weather_status: {
        Row: {
          active: boolean | null
          duration: number | null
          end_duration_unix: number | null
          icon: string | null
          id: string
          last_updated: string | null
          start_duration_unix: number | null
          weather_id: string | null
          weather_name: string | null
        }
        Insert: {
          active?: boolean | null
          duration?: number | null
          end_duration_unix?: number | null
          icon?: string | null
          id?: string
          last_updated?: string | null
          start_duration_unix?: number | null
          weather_id?: string | null
          weather_name?: string | null
        }
        Update: {
          active?: boolean | null
          duration?: number | null
          end_duration_unix?: number | null
          icon?: string | null
          id?: string
          last_updated?: string | null
          start_duration_unix?: number | null
          weather_id?: string | null
          weather_name?: string | null
        }
        Relationships: []
      }
      websocket_status: {
        Row: {
          id: string
          is_connected: boolean
          last_checked: string | null
          reason: string | null
        }
        Insert: {
          id?: string
          is_connected: boolean
          last_checked?: string | null
          reason?: string | null
        }
        Update: {
          id?: string
          is_connected?: boolean
          last_checked?: string | null
          reason?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_api_logs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      set_admin_role: {
        Args: { uid: string; is_admin: boolean }
        Returns: string
      }
      set_claim: {
        Args: { uid: string; claim: string; value: Json }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
