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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_actions: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          id: string
          note: string | null
          user_id: string
          verification_request_id: string
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          id?: string
          note?: string | null
          user_id: string
          verification_request_id: string
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          id?: string
          note?: string | null
          user_id?: string
          verification_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "admin_actions_verification_request_id_fkey"
            columns: ["verification_request_id"]
            isOneToOne: false
            referencedRelation: "verification_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      metatrader_accounts: {
        Row: {
          account_type: string
          balance: number
          created_at: string
          currency: string
          equity: number
          free_margin: number
          id: string
          last_updated: string
          leverage: number
          login: string
          margin: number
          server: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_type?: string
          balance?: number
          created_at?: string
          currency?: string
          equity?: number
          free_margin?: number
          id?: string
          last_updated?: string
          leverage?: number
          login: string
          margin?: number
          server: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_type?: string
          balance?: number
          created_at?: string
          currency?: string
          equity?: number
          free_margin?: number
          id?: string
          last_updated?: string
          leverage?: number
          login?: string
          margin?: number
          server?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      overseas_companies: {
        Row: {
          company_name: string
          contact_email: string
          contact_phone: string | null
          created_at: string
          id: string
          incorporation_date: string
          jurisdiction: string
          registration_number: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name: string
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          incorporation_date: string
          jurisdiction: string
          registration_number: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          incorporation_date?: string
          jurisdiction?: string
          registration_number?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      overseas_company_requests: {
        Row: {
          admin_notes: string | null
          business_description: string | null
          business_type: string
          company_names: string[]
          contact_email: string
          created_at: string
          documents_requested: string[] | null
          estimated_completion: string | null
          id: string
          jurisdiction: string
          selected_company_name: string | null
          status: string
          submitted_at: string
          updated_at: string
          uploaded_documents: Json | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          business_description?: string | null
          business_type: string
          company_names: string[]
          contact_email: string
          created_at?: string
          documents_requested?: string[] | null
          estimated_completion?: string | null
          id?: string
          jurisdiction: string
          selected_company_name?: string | null
          status?: string
          submitted_at?: string
          updated_at?: string
          uploaded_documents?: Json | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          business_description?: string | null
          business_type?: string
          company_names?: string[]
          contact_email?: string
          created_at?: string
          documents_requested?: string[] | null
          estimated_completion?: string | null
          id?: string
          jurisdiction?: string
          selected_company_name?: string | null
          status?: string
          submitted_at?: string
          updated_at?: string
          uploaded_documents?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          annual_income: number | null
          avatar_url: string | null
          city: string | null
          created_at: string
          documents_uploaded: boolean | null
          employer: string | null
          employment_status: string | null
          full_name: string | null
          has_completed_profile: boolean
          id: string
          investment_experience: string | null
          investment_goals: string[] | null
          phone: string | null
          risk_tolerance: string | null
          state: string | null
          status: string | null
          updated_at: string
          user_id: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          annual_income?: number | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          documents_uploaded?: boolean | null
          employer?: string | null
          employment_status?: string | null
          full_name?: string | null
          has_completed_profile?: boolean
          id?: string
          investment_experience?: string | null
          investment_goals?: string[] | null
          phone?: string | null
          risk_tolerance?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          annual_income?: number | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          documents_uploaded?: boolean | null
          employer?: string | null
          employment_status?: string | null
          full_name?: string | null
          has_completed_profile?: boolean
          id?: string
          investment_experience?: string | null
          investment_goals?: string[] | null
          phone?: string | null
          risk_tolerance?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      referral_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          notes: string | null
          payment_date: string
          referral_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          notes?: string | null
          payment_date?: string
          referral_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          payment_date?: string
          referral_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_payments_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_signups: {
        Row: {
          created_at: string
          deposit_amount: number | null
          deposit_date: string | null
          id: string
          referral_id: string
          referred_user_id: string
          signup_date: string
        }
        Insert: {
          created_at?: string
          deposit_amount?: number | null
          deposit_date?: string | null
          id?: string
          referral_id: string
          referred_user_id: string
          signup_date?: string
        }
        Update: {
          created_at?: string
          deposit_amount?: number | null
          deposit_date?: string | null
          id?: string
          referral_id?: string
          referred_user_id?: string
          signup_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_signups_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string
          deposit_date: string | null
          id: string
          initial_deposit: number | null
          is_active: boolean
          referral_code: string
          referral_link: string
          status: string
          total_earnings: number
          total_referrals: number
          updated_at: string
          user_id: string
          year_to_date_earnings: number
        }
        Insert: {
          created_at?: string
          deposit_date?: string | null
          id?: string
          initial_deposit?: number | null
          is_active?: boolean
          referral_code: string
          referral_link: string
          status?: string
          total_earnings?: number
          total_referrals?: number
          updated_at?: string
          user_id: string
          year_to_date_earnings?: number
        }
        Update: {
          created_at?: string
          deposit_date?: string | null
          id?: string
          initial_deposit?: number | null
          is_active?: boolean
          referral_code?: string
          referral_link?: string
          status?: string
          total_earnings?: number
          total_referrals?: number
          updated_at?: string
          user_id?: string
          year_to_date_earnings?: number
        }
        Relationships: []
      }
      request_documents: {
        Row: {
          description: string | null
          document_type: string
          file_size: number
          file_type: string
          file_url: string
          filename: string
          id: string
          request_id: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          description?: string | null
          document_type: string
          file_size: number
          file_type: string
          file_url: string
          filename: string
          id?: string
          request_id: string
          uploaded_at?: string
          user_id: string
        }
        Update: {
          description?: string | null
          document_type?: string
          file_size?: number
          file_type?: string
          file_url?: string
          filename?: string
          id?: string
          request_id?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_documents_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          admin_notes: string | null
          amount: number
          created_at: string
          currency: string
          description: string | null
          id: string
          payment_method: string
          status: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          payment_method: string
          status?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          payment_method?: string
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      verification_requests: {
        Row: {
          created_at: string
          documents: Json
          id: string
          reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          documents?: Json
          id?: string
          reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          documents?: Json
          id?: string
          reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_referral_code: {
        Args: { first_name: string }
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
