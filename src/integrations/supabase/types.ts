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
      agendamentos: {
        Row: {
          cliente_id: string
          created_at: string
          data_fim: string
          data_inicio: string
          data_txt: string
          descricao: string | null
          google_event_id: string | null
          horario_txt: string
          id: string
          lembrete_1dia: boolean
          lembrete_2hs: boolean
          status: Database["public"]["Enums"]["appointment_status"]
          titulo: string
          updated_at: string
        }
        Insert: {
          cliente_id: string
          created_at?: string
          data_fim: string
          data_inicio: string
          data_txt: string
          descricao?: string | null
          google_event_id?: string | null
          horario_txt: string
          id?: string
          lembrete_1dia?: boolean
          lembrete_2hs?: boolean
          status?: Database["public"]["Enums"]["appointment_status"]
          titulo: string
          updated_at?: string
        }
        Update: {
          cliente_id?: string
          created_at?: string
          data_fim?: string
          data_inicio?: string
          data_txt?: string
          descricao?: string | null
          google_event_id?: string | null
          horario_txt?: string
          id?: string
          lembrete_1dia?: boolean
          lembrete_2hs?: boolean
          status?: Database["public"]["Enums"]["appointment_status"]
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_messages: {
        Row: {
          agent_id: string
          conversation_id: string | null
          created_at: string
          id: string
          message: string
          user_id: string
          writer: Database["public"]["Enums"]["message_writer"]
        }
        Insert: {
          agent_id: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          message: string
          user_id: string
          writer: Database["public"]["Enums"]["message_writer"]
        }
        Update: {
          agent_id?: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          message?: string
          user_id?: string
          writer?: Database["public"]["Enums"]["message_writer"]
        }
        Relationships: [
          {
            foreignKeyName: "agent_messages_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_messages_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          avatar_url: string | null
          created_at: string
          description: string | null
          id: string
          model: string
          name: string
          owner_id: string
          prompt: string | null
          status: Database["public"]["Enums"]["agent_status"]
          temperature: number | null
          updated_at: string
          url: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          model: string
          name: string
          owner_id: string
          prompt?: string | null
          status?: Database["public"]["Enums"]["agent_status"]
          temperature?: number | null
          updated_at?: string
          url: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          model?: string
          name?: string
          owner_id?: string
          prompt?: string | null
          status?: Database["public"]["Enums"]["agent_status"]
          temperature?: number | null
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "agents_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agents_users: {
        Row: {
          agent_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agents_users_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agents_users_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_usage_logs: {
        Row: {
          agent_id: string | null
          completion_tokens: number
          created_at: string | null
          duration_ms: number | null
          estimated_cost_usd: number
          function_name: string
          id: string
          model: string
          prompt_tokens: number
          total_tokens: number | null
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          completion_tokens?: number
          created_at?: string | null
          duration_ms?: number | null
          estimated_cost_usd?: number
          function_name: string
          id?: string
          model: string
          prompt_tokens?: number
          total_tokens?: number | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          completion_tokens?: number
          created_at?: string | null
          duration_ms?: number | null
          estimated_cost_usd?: number
          function_name?: string
          id?: string
          model?: string
          prompt_tokens?: number
          total_tokens?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_usage_logs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_usage_logs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      beta_feedback: {
        Row: {
          allows_screenshot: boolean | null
          allows_testimonial: boolean | null
          assistant_name: string | null
          created_at: string | null
          feedback_quality: string | null
          feedback_text: string | null
          id: string
          rating: number
          screenshot_url: string | null
          testimonial_status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          allows_screenshot?: boolean | null
          allows_testimonial?: boolean | null
          assistant_name?: string | null
          created_at?: string | null
          feedback_quality?: string | null
          feedback_text?: string | null
          id?: string
          rating: number
          screenshot_url?: string | null
          testimonial_status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          allows_screenshot?: boolean | null
          allows_testimonial?: boolean | null
          assistant_name?: string | null
          created_at?: string | null
          feedback_quality?: string | null
          feedback_text?: string | null
          id?: string
          rating?: number
          screenshot_url?: string | null
          testimonial_status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          conversa_id: string | null
          created_at: string
          email: string | null
          id: string
          nome: string
          telefone: string
          updated_at: string
        }
        Insert: {
          conversa_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nome: string
          telefone: string
          updated_at?: string
        }
        Update: {
          conversa_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nome?: string
          telefone?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          read: boolean
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          read?: boolean
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          read?: boolean
        }
        Relationships: []
      }
      conversations: {
        Row: {
          agent_id: string
          created_at: string
          id: string
          style: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          id?: string
          style?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          id?: string
          style?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_usage: {
        Row: {
          coupon_id: string
          discount_amount: number
          final_amount: number
          id: string
          original_amount: number
          plan_type: string
          used_at: string
          user_id: string
        }
        Insert: {
          coupon_id: string
          discount_amount: number
          final_amount: number
          id?: string
          original_amount: number
          plan_type: string
          used_at?: string
          user_id: string
        }
        Update: {
          coupon_id?: string
          discount_amount?: number
          final_amount?: number
          id?: string
          original_amount?: number
          plan_type?: string
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_usage_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          active: boolean
          applicable_plans: string[] | null
          code: string
          created_at: string
          current_uses: number
          description: string | null
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          id: string
          max_uses: number | null
          min_plan_value: number | null
          updated_at: string
          valid_from: string
          valid_until: string
        }
        Insert: {
          active?: boolean
          applicable_plans?: string[] | null
          code: string
          created_at?: string
          current_uses?: number
          description?: string | null
          discount_type?: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          id?: string
          max_uses?: number | null
          min_plan_value?: number | null
          updated_at?: string
          valid_from?: string
          valid_until: string
        }
        Update: {
          active?: boolean
          applicable_plans?: string[] | null
          code?: string
          created_at?: string
          current_uses?: number
          description?: string | null
          discount_type?: Database["public"]["Enums"]["discount_type"]
          discount_value?: number
          id?: string
          max_uses?: number | null
          min_plan_value?: number | null
          updated_at?: string
          valid_from?: string
          valid_until?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          asaas_customer_id: string | null
          beta_assistant_choice: string | null
          beta_expires_at: string | null
          beta_source: string | null
          billing_name: string | null
          cpf_cnpj: string | null
          created_at: string
          email: string
          financial_goal: string | null
          firstname: string
          id: string
          is_beta_user: boolean | null
          last_seen_at: string | null
          lastname: string
          monthly_income: number | null
          phone: string
          plan: string | null
          stripe_customer_id: string | null
          subscription_amount: number | null
          subscription_end_date: string | null
          subscription_id: string | null
          subscription_plan: string | null
          subscription_start_date: string | null
          subscription_status: string | null
          whatsapp: string
        }
        Insert: {
          age?: number | null
          asaas_customer_id?: string | null
          beta_assistant_choice?: string | null
          beta_expires_at?: string | null
          beta_source?: string | null
          billing_name?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          email: string
          financial_goal?: string | null
          firstname: string
          id: string
          is_beta_user?: boolean | null
          last_seen_at?: string | null
          lastname: string
          monthly_income?: number | null
          phone: string
          plan?: string | null
          stripe_customer_id?: string | null
          subscription_amount?: number | null
          subscription_end_date?: string | null
          subscription_id?: string | null
          subscription_plan?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          whatsapp?: string
        }
        Update: {
          age?: number | null
          asaas_customer_id?: string | null
          beta_assistant_choice?: string | null
          beta_expires_at?: string | null
          beta_source?: string | null
          billing_name?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          email?: string
          financial_goal?: string | null
          firstname?: string
          id?: string
          is_beta_user?: boolean | null
          last_seen_at?: string | null
          lastname?: string
          monthly_income?: number | null
          phone?: string
          plan?: string | null
          stripe_customer_id?: string | null
          subscription_amount?: number | null
          subscription_end_date?: string | null
          subscription_id?: string | null
          subscription_plan?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          acquisition_channel: string
          amount: number
          created_at: string | null
          external_payment_id: string | null
          id: string
          payment_method: string | null
          product_name: string
          product_type: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          acquisition_channel: string
          amount: number
          created_at?: string | null
          external_payment_id?: string | null
          id?: string
          payment_method?: string | null
          product_name: string
          product_type: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          acquisition_channel?: string
          amount?: number
          created_at?: string | null
          external_payment_id?: string | null
          id?: string
          payment_method?: string | null
          product_name?: string
          product_type?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_meals: {
        Row: {
          created_at: string | null
          date_only: string | null
          datetime: string
          id: string
          items: Json
          meal_name: string
          month: string | null
          total_calories: number
          user_id: string
          week_number: number | null
        }
        Insert: {
          created_at?: string | null
          date_only?: string | null
          datetime?: string
          id?: string
          items?: Json
          meal_name: string
          month?: string | null
          total_calories: number
          user_id: string
          week_number?: number | null
        }
        Update: {
          created_at?: string | null
          date_only?: string | null
          datetime?: string
          id?: string
          items?: Json
          meal_name?: string
          month?: string | null
          total_calories?: number
          user_id?: string
          week_number?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      agent_public_info: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          description: string | null
          id: string | null
          model: string | null
          name: string | null
          status: Database["public"]["Enums"]["agent_status"] | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          model?: string | null
          name?: string | null
          status?: Database["public"]["Enums"]["agent_status"] | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          model?: string | null
          name?: string | null
          status?: Database["public"]["Enums"]["agent_status"] | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_daily_summary: {
        Args: { _date: string; _user_id: string }
        Returns: {
          meal_count: number
          meals: Json
          total_calories: number
        }[]
      }
      get_monthly_summary: {
        Args: { _month: string; _user_id: string }
        Returns: {
          avg_daily_calories: number
          by_meal_type: Json
          days_logged: number
          meal_count: number
          total_calories: number
        }[]
      }
      get_user_agents: {
        Args: never
        Returns: {
          avatar_url: string | null
          created_at: string
          description: string | null
          id: string
          model: string
          name: string
          owner_id: string
          prompt: string | null
          status: Database["public"]["Enums"]["agent_status"]
          temperature: number | null
          updated_at: string
          url: string
        }[]
        SetofOptions: {
          from: "*"
          to: "agents"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_weekly_summary: {
        Args: { _user_id: string; _week: number; _year: number }
        Returns: {
          avg_daily_calories: number
          days_logged: number
          meal_count: number
          total_calories: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      agent_status: "active" | "suspended" | "deleted"
      app_role: "admin" | "user"
      appointment_status:
        | "agendado"
        | "confirmado"
        | "cancelado"
        | "reagendado"
        | "concluido"
      discount_type: "percentage" | "fixed"
      message_writer: "user" | "assistant"
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
      agent_status: ["active", "suspended", "deleted"],
      app_role: ["admin", "user"],
      appointment_status: [
        "agendado",
        "confirmado",
        "cancelado",
        "reagendado",
        "concluido",
      ],
      discount_type: ["percentage", "fixed"],
      message_writer: ["user", "assistant"],
    },
  },
} as const
