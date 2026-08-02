export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      anon_ai_usage: {
        Row: {
          fingerprint: string
          id: string
          updated_at: string
          used: number
          window_start: string
        }
        Insert: {
          fingerprint: string
          id?: string
          updated_at?: string
          used?: number
          window_start?: string
        }
        Update: {
          fingerprint?: string
          id?: string
          updated_at?: string
          used?: number
          window_start?: string
        }
        Relationships: []
      }
      bundle_prompts: {
        Row: {
          bundle_id: string
          prompt_id: string
          sort_order: number
        }
        Insert: {
          bundle_id: string
          prompt_id: string
          sort_order?: number
        }
        Update: {
          bundle_id?: string
          prompt_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "bundle_prompts_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_prompts_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      bundles: {
        Row: {
          category_slug: string | null
          cover: string | null
          created_at: string
          description: string | null
          hero_image_url: string | null
          id: string
          is_premium: boolean
          published: boolean
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          category_slug?: string | null
          cover?: string | null
          created_at?: string
          description?: string | null
          hero_image_url?: string | null
          id?: string
          is_premium?: boolean
          published?: boolean
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          category_slug?: string | null
          cover?: string | null
          created_at?: string
          description?: string | null
          hero_image_url?: string | null
          id?: string
          is_premium?: boolean
          published?: boolean
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bundles_category_slug_fkey"
            columns: ["category_slug"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["slug"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          emoji: string | null
          gradient: string | null
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          emoji?: string | null
          gradient?: string | null
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          emoji?: string | null
          gradient?: string | null
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_path: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          headline: string | null
          id: string
          location: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          avatar_path?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          headline?: string | null
          id: string
          location?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          avatar_path?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          headline?: string | null
          id?: string
          location?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      prompts: {
        Row: {
          audience: string[]
          beginner: boolean
          body: string
          category_slug: string | null
          cover: string | null
          created_at: string
          creator_avatar: string | null
          creator_handle: string | null
          creator_name: string | null
          description: string | null
          difficulty: string
          estimated_time: string | null
          examples: Json
          faqs: Json
          hero_image_url: string | null
          id: string
          instructions: string[]
          is_featured: boolean
          is_premium: boolean
          language: string
          metadata: Json
          outcome: string | null
          price: number
          published: boolean
          rating: number
          related_slugs: string[]
          reviews_count: number
          saves_count: number
          slug: string
          source: string | null
          subcategory: string | null
          tags: string[]
          tips: string[]
          title: string
          tools: string[]
          updated_at: string
          uses_count: number
          variables: Json
        }
        Insert: {
          audience?: string[]
          beginner?: boolean
          body: string
          category_slug?: string | null
          cover?: string | null
          created_at?: string
          creator_avatar?: string | null
          creator_handle?: string | null
          creator_name?: string | null
          description?: string | null
          difficulty?: string
          estimated_time?: string | null
          examples?: Json
          faqs?: Json
          hero_image_url?: string | null
          id?: string
          instructions?: string[]
          is_featured?: boolean
          is_premium?: boolean
          language?: string
          metadata?: Json
          outcome?: string | null
          price?: number
          published?: boolean
          rating?: number
          related_slugs?: string[]
          reviews_count?: number
          saves_count?: number
          slug: string
          source?: string | null
          subcategory?: string | null
          tags?: string[]
          tips?: string[]
          title: string
          tools?: string[]
          updated_at?: string
          uses_count?: number
          variables?: Json
        }
        Update: {
          audience?: string[]
          beginner?: boolean
          body?: string
          category_slug?: string | null
          cover?: string | null
          created_at?: string
          creator_avatar?: string | null
          creator_handle?: string | null
          creator_name?: string | null
          description?: string | null
          difficulty?: string
          estimated_time?: string | null
          examples?: Json
          faqs?: Json
          hero_image_url?: string | null
          id?: string
          instructions?: string[]
          is_featured?: boolean
          is_premium?: boolean
          language?: string
          metadata?: Json
          outcome?: string | null
          price?: number
          published?: boolean
          rating?: number
          related_slugs?: string[]
          reviews_count?: number
          saves_count?: number
          slug?: string
          source?: string | null
          subcategory?: string | null
          tags?: string[]
          tips?: string[]
          title?: string
          tools?: string[]
          updated_at?: string
          uses_count?: number
          variables?: Json
        }
        Relationships: [
          {
            foreignKeyName: "prompts_category_slug_fkey"
            columns: ["category_slug"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["slug"]
          },
        ]
      }
      saved_prompts: {
        Row: {
          created_at: string
          id: string
          prompt_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          prompt_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          prompt_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_prompts_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          environment: string
          id: string
          plan: string
          price_id: string | null
          provider: string | null
          provider_customer_id: string | null
          provider_subscription_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          environment?: string
          id?: string
          plan?: string
          price_id?: string | null
          provider?: string | null
          provider_customer_id?: string | null
          provider_subscription_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          environment?: string
          id?: string
          plan?: string
          price_id?: string | null
          provider?: string | null
          provider_customer_id?: string | null
          provider_subscription_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      tool_usage: {
        Row: {
          anonymous_generation_used: boolean
          ats_used: number
          cover_letter_used: number
          created_at: string
          cv_used: number
          humanizer_used: number
          plan: string
          updated_at: string
          user_id: string
        }
        Insert: {
          anonymous_generation_used?: boolean
          ats_used?: number
          cover_letter_used?: number
          created_at?: string
          cv_used?: number
          humanizer_used?: number
          plan?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          anonymous_generation_used?: boolean
          ats_used?: number
          cover_letter_used?: number
          created_at?: string
          cv_used?: number
          humanizer_used?: number
          plan?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      translations_cache: {
        Row: {
          created_at: string
          hash: string
          locale: string
          source: string
          translated: string
        }
        Insert: {
          created_at?: string
          hash: string
          locale: string
          source: string
          translated: string
        }
        Update: {
          created_at?: string
          hash?: string
          locale?: string
          source?: string
          translated?: string
        }
        Relationships: []
      }
      usage_events: {
        Row: {
          counted_against_free: boolean
          created_at: string
          id: string
          plan: string
          tool: string
          user_id: string
        }
        Insert: {
          counted_against_free?: boolean
          created_at?: string
          id?: string
          plan?: string
          tool: string
          user_id: string
        }
        Update: {
          counted_against_free?: boolean
          created_at?: string
          id?: string
          plan?: string
          tool?: string
          user_id?: string
        }
        Relationships: []
      }
      user_documents: {
        Row: {
          created_at: string
          doc_type: string
          id: string
          job_description: string | null
          meta: Json | null
          output: string
          source_input: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          doc_type: string
          id?: string
          job_description?: string | null
          meta?: Json | null
          output: string
          source_input?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          doc_type?: string
          id?: string
          job_description?: string | null
          meta?: Json | null
          output?: string
          source_input?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      consume_tool_credit: {
        Args: { _limit: number; _tool: string }
        Returns: Json
      }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      get_tool_usage: { Args: never; Returns: Json }
      has_active_subscription: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
