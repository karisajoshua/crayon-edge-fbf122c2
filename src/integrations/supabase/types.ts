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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          archived: boolean | null
          archived_at: string | null
          author_id: string | null
          category_id: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          published: boolean | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          archived?: boolean | null
          archived_at?: string | null
          author_id?: string | null
          category_id?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published?: boolean | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          archived?: boolean | null
          archived_at?: string | null
          author_id?: string | null
          category_id?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published?: boolean | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          name: string
          slug: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          name: string
          slug: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          approved: boolean
          author_email: string
          author_name: string
          comment_text: string
          created_at: string
          id: string
          post_id: string
        }
        Insert: {
          approved?: boolean
          author_email: string
          author_name: string
          comment_text: string
          created_at?: string
          id?: string
          post_id: string
        }
        Update: {
          approved?: boolean
          author_email?: string
          author_name?: string
          comment_text?: string
          created_at?: string
          id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          read: boolean
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          read?: boolean
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean
          subject?: string
        }
        Relationships: []
      }
      creative_artworks: {
        Row: {
          artwork_type: string
          canvas_data: Json | null
          child_profile_id: string
          created_at: string
          id: string
          image_url: string | null
          title: string | null
        }
        Insert: {
          artwork_type?: string
          canvas_data?: Json | null
          child_profile_id: string
          created_at?: string
          id?: string
          image_url?: string | null
          title?: string | null
        }
        Update: {
          artwork_type?: string
          canvas_data?: Json | null
          child_profile_id?: string
          created_at?: string
          id?: string
          image_url?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creative_artworks_child_profile_id_fkey"
            columns: ["child_profile_id"]
            isOneToOne: false
            referencedRelation: "creative_child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creative_badges: {
        Row: {
          age_group: Database["public"]["Enums"]["creative_age_group"]
          badge_type: string
          created_at: string
          description: string
          icon: string
          id: string
          name: string
        }
        Insert: {
          age_group: Database["public"]["Enums"]["creative_age_group"]
          badge_type?: string
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
        }
        Update: {
          age_group?: Database["public"]["Enums"]["creative_age_group"]
          badge_type?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      creative_challenge_completions: {
        Row: {
          artwork_id: string | null
          challenge_id: string
          child_profile_id: string
          completed_at: string
          id: string
        }
        Insert: {
          artwork_id?: string | null
          challenge_id: string
          child_profile_id: string
          completed_at?: string
          id?: string
        }
        Update: {
          artwork_id?: string | null
          challenge_id?: string
          child_profile_id?: string
          completed_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creative_challenge_completions_artwork_id_fkey"
            columns: ["artwork_id"]
            isOneToOne: false
            referencedRelation: "creative_artworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creative_challenge_completions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "creative_challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creative_challenge_completions_child_profile_id_fkey"
            columns: ["child_profile_id"]
            isOneToOne: false
            referencedRelation: "creative_child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creative_challenges: {
        Row: {
          age_group: Database["public"]["Enums"]["creative_age_group"]
          challenge_type: string
          created_at: string
          description: string
          end_date: string | null
          id: string
          is_active: boolean
          start_date: string | null
          title: string
        }
        Insert: {
          age_group: Database["public"]["Enums"]["creative_age_group"]
          challenge_type?: string
          created_at?: string
          description: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          start_date?: string | null
          title: string
        }
        Update: {
          age_group?: Database["public"]["Enums"]["creative_age_group"]
          challenge_type?: string
          created_at?: string
          description?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          start_date?: string | null
          title?: string
        }
        Relationships: []
      }
      creative_child_profiles: {
        Row: {
          age: number
          age_group: Database["public"]["Enums"]["creative_age_group"]
          avatar_url: string | null
          created_at: string
          id: string
          name: string
          parent_id: string
          updated_at: string
        }
        Insert: {
          age: number
          age_group: Database["public"]["Enums"]["creative_age_group"]
          avatar_url?: string | null
          created_at?: string
          id?: string
          name: string
          parent_id: string
          updated_at?: string
        }
        Update: {
          age?: number
          age_group?: Database["public"]["Enums"]["creative_age_group"]
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string
          parent_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      creative_coloring_pages: {
        Row: {
          created_at: string
          difficulty: string | null
          id: string
          image_url: string
          is_active: boolean
          is_premium: boolean
          title: string
        }
        Insert: {
          created_at?: string
          difficulty?: string | null
          id?: string
          image_url: string
          is_active?: boolean
          is_premium?: boolean
          title: string
        }
        Update: {
          created_at?: string
          difficulty?: string | null
          id?: string
          image_url?: string
          is_active?: boolean
          is_premium?: boolean
          title?: string
        }
        Relationships: []
      }
      creative_earned_badges: {
        Row: {
          badge_id: string
          child_profile_id: string
          earned_at: string
          id: string
        }
        Insert: {
          badge_id: string
          child_profile_id: string
          earned_at?: string
          id?: string
        }
        Update: {
          badge_id?: string
          child_profile_id?: string
          earned_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creative_earned_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "creative_badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creative_earned_badges_child_profile_id_fkey"
            columns: ["child_profile_id"]
            isOneToOne: false
            referencedRelation: "creative_child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creative_journal_entries: {
        Row: {
          child_profile_id: string
          content: string
          created_at: string
          id: string
          is_private: boolean
          mood: string | null
          prompt_used: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          child_profile_id: string
          content: string
          created_at?: string
          id?: string
          is_private?: boolean
          mood?: string | null
          prompt_used?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          child_profile_id?: string
          content?: string
          created_at?: string
          id?: string
          is_private?: boolean
          mood?: string | null
          prompt_used?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "creative_journal_entries_child_profile_id_fkey"
            columns: ["child_profile_id"]
            isOneToOne: false
            referencedRelation: "creative_child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creative_mood_boards: {
        Row: {
          board_data: Json
          child_profile_id: string
          created_at: string
          id: string
          is_private: boolean
          title: string
          updated_at: string
        }
        Insert: {
          board_data?: Json
          child_profile_id: string
          created_at?: string
          id?: string
          is_private?: boolean
          title?: string
          updated_at?: string
        }
        Update: {
          board_data?: Json
          child_profile_id?: string
          created_at?: string
          id?: string
          is_private?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "creative_mood_boards_child_profile_id_fkey"
            columns: ["child_profile_id"]
            isOneToOne: false
            referencedRelation: "creative_child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creative_parent_settings: {
        Row: {
          created_at: string
          id: string
          session_limit_minutes: number | null
          sound_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          session_limit_minutes?: number | null
          sound_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          session_limit_minutes?: number | null
          sound_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      creative_portfolio_items: {
        Row: {
          child_profile_id: string
          created_at: string
          display_order: number | null
          id: string
          is_public: boolean
          item_id: string
          item_type: string
        }
        Insert: {
          child_profile_id: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_public?: boolean
          item_id: string
          item_type: string
        }
        Update: {
          child_profile_id?: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_public?: boolean
          item_id?: string
          item_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "creative_portfolio_items_child_profile_id_fkey"
            columns: ["child_profile_id"]
            isOneToOne: false
            referencedRelation: "creative_child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creative_prompts: {
        Row: {
          age_group: Database["public"]["Enums"]["creative_age_group"]
          category: Database["public"]["Enums"]["creative_prompt_category"]
          created_at: string
          id: string
          is_active: boolean
          is_ai_generated: boolean
          prompt_text: string
        }
        Insert: {
          age_group: Database["public"]["Enums"]["creative_age_group"]
          category: Database["public"]["Enums"]["creative_prompt_category"]
          created_at?: string
          id?: string
          is_active?: boolean
          is_ai_generated?: boolean
          prompt_text: string
        }
        Update: {
          age_group?: Database["public"]["Enums"]["creative_age_group"]
          category?: Database["public"]["Enums"]["creative_prompt_category"]
          created_at?: string
          id?: string
          is_active?: boolean
          is_ai_generated?: boolean
          prompt_text?: string
        }
        Relationships: []
      }
      creative_session_logs: {
        Row: {
          child_profile_id: string
          duration_minutes: number | null
          ended_at: string | null
          id: string
          started_at: string
        }
        Insert: {
          child_profile_id: string
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          started_at?: string
        }
        Update: {
          child_profile_id?: string
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "creative_session_logs_child_profile_id_fkey"
            columns: ["child_profile_id"]
            isOneToOne: false
            referencedRelation: "creative_child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creative_stories: {
        Row: {
          child_profile_id: string
          created_at: string
          id: string
          pages: Json
          title: string
          updated_at: string
        }
        Insert: {
          child_profile_id: string
          created_at?: string
          id?: string
          pages?: Json
          title?: string
          updated_at?: string
        }
        Update: {
          child_profile_id?: string
          created_at?: string
          id?: string
          pages?: Json
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "creative_stories_child_profile_id_fkey"
            columns: ["child_profile_id"]
            isOneToOne: false
            referencedRelation: "creative_child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          alt_text: string | null
          created_at: string | null
          filename: string
          id: string
          uploaded_by: string | null
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          filename: string
          id?: string
          uploaded_by?: string | null
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          filename?: string
          id?: string
          uploaded_by?: string | null
          url?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          subscribed_at: string
          unsubscribed: boolean
        }
        Insert: {
          email: string
          id?: string
          subscribed_at?: string
          unsubscribed?: boolean
        }
        Update: {
          email?: string
          id?: string
          subscribed_at?: string
          unsubscribed?: boolean
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      creative_age_group: "minis" | "creators" | "studio"
      creative_prompt_category:
        | "journal"
        | "story"
        | "challenge"
        | "idea"
        | "writing"
        | "art"
        | "design"
        | "reflection"
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
      creative_age_group: ["minis", "creators", "studio"],
      creative_prompt_category: [
        "journal",
        "story",
        "challenge",
        "idea",
        "writing",
        "art",
        "design",
        "reflection",
      ],
    },
  },
} as const
