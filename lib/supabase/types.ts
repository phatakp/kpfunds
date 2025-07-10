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
      annadaan_bookings: {
        Row: {
          amount: number
          amount_paid_to: string
          booked_by_building: Database["public"]["Enums"]["building_enum"]
          booked_by_flat: number
          booked_by_name: string
          booked_qty: number
          created_at: string
          item_name: string
          year: number
        }
        Insert: {
          amount?: number
          amount_paid_to: string
          booked_by_building: Database["public"]["Enums"]["building_enum"]
          booked_by_flat: number
          booked_by_name: string
          booked_qty?: number
          created_at?: string
          item_name: string
          year: number
        }
        Update: {
          amount?: number
          amount_paid_to?: string
          booked_by_building?: Database["public"]["Enums"]["building_enum"]
          booked_by_flat?: number
          booked_by_name?: string
          booked_qty?: number
          created_at?: string
          item_name?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "annadaan_bookings_item_name_fkey"
            columns: ["item_name"]
            isOneToOne: false
            referencedRelation: "annadaan_items"
            referencedColumns: ["item_name"]
          },
        ]
      }
      annadaan_items: {
        Row: {
          amount: number
          item_name: string
          price: number
          quantity: number
        }
        Insert: {
          amount?: number
          item_name: string
          price: number
          quantity: number
        }
        Update: {
          amount?: number
          item_name?: string
          price?: number
          quantity?: number
        }
        Relationships: []
      }
      collections: {
        Row: {
          amount: number
          created_at: string
          donor_building: Database["public"]["Enums"]["building_enum"]
          donor_flat: number
          donor_name: string
          event_type: Database["public"]["Enums"]["event_type_enum"]
          id: string
          logged_by_user: string | null
          payment_type: Database["public"]["Enums"]["payment_type_enum"]
          receiver_name: string
        }
        Insert: {
          amount?: number
          created_at?: string
          donor_building: Database["public"]["Enums"]["building_enum"]
          donor_flat: number
          donor_name: string
          event_type?: Database["public"]["Enums"]["event_type_enum"]
          id?: string
          logged_by_user?: string | null
          payment_type?: Database["public"]["Enums"]["payment_type_enum"]
          receiver_name: string
        }
        Update: {
          amount?: number
          created_at?: string
          donor_building?: Database["public"]["Enums"]["building_enum"]
          donor_flat?: number
          donor_name?: string
          event_type?: Database["public"]["Enums"]["event_type_enum"]
          id?: string
          logged_by_user?: string | null
          payment_type?: Database["public"]["Enums"]["payment_type_enum"]
          receiver_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "collections_logged_by_user_fkey"
            columns: ["logged_by_user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      commitee_members: {
        Row: {
          committee_name: string
          is_active: boolean
          member_id: string
        }
        Insert: {
          committee_name: string
          is_active?: boolean
          member_id: string
        }
        Update: {
          committee_name?: string
          is_active?: boolean
          member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "commitee_members_committee_name_fkey"
            columns: ["committee_name"]
            isOneToOne: false
            referencedRelation: "committees"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "commitee_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      committees: {
        Row: {
          balance: number
          name: string
        }
        Insert: {
          balance?: number
          name: string
        }
        Update: {
          balance?: number
          name?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          committee_name: string
          is_active: boolean
          name: string
          slug: string
          type: Database["public"]["Enums"]["event_type_enum"]
          year: number
        }
        Insert: {
          committee_name: string
          is_active?: boolean
          name: string
          slug: string
          type: Database["public"]["Enums"]["event_type_enum"]
          year: number
        }
        Update: {
          committee_name?: string
          is_active?: boolean
          name?: string
          slug?: string
          type?: Database["public"]["Enums"]["event_type_enum"]
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "events_committee_name_fkey"
            columns: ["committee_name"]
            isOneToOne: false
            referencedRelation: "committees"
            referencedColumns: ["name"]
          },
        ]
      }
      logger: {
        Row: {
          actioned_by: string
          created_at: string
          text: string
        }
        Insert: {
          actioned_by: string
          created_at?: string
          text: string
        }
        Update: {
          actioned_by?: string
          created_at?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "logger_actioned_by_fkey"
            columns: ["actioned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          building: Database["public"]["Enums"]["building_enum"]
          created_at: string
          email: string
          flat: number
          id: string
          image: string | null
          is_admin: boolean | null
          name: string
        }
        Insert: {
          building: Database["public"]["Enums"]["building_enum"]
          created_at?: string
          email: string
          flat: number
          id: string
          image?: string | null
          is_admin?: boolean | null
          name: string
        }
        Update: {
          building?: Database["public"]["Enums"]["building_enum"]
          created_at?: string
          email?: string
          flat?: number
          id?: string
          image?: string | null
          is_admin?: boolean | null
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      activate_event: {
        Args: { slug_input: string }
        Returns: undefined
      }
      approve_member: {
        Args: { committeename: string; memberid: string }
        Returns: undefined
      }
      create_booking: {
        Args: {
          itemname: string
          yr: number
          bookname: string
          building: string
          flat: number
          qty: number
          receiver: string
          amt: number
        }
        Returns: boolean
      }
      create_event: {
        Args: {
          slug_input: string
          name_input: string
          year: number
          committeename: string
          type_input: string
        }
        Returns: undefined
      }
      deactivate_event: {
        Args: { slug_input: string }
        Returns: undefined
      }
      delete_member: {
        Args: { committeename: string; memberid: string }
        Returns: undefined
      }
      get_annadaan_items_with_bookings: {
        Args: Record<PropertyKey, never>
        Returns: {
          item_name: string
          quantity: number
          price: number
          amount: number
          year: number
          booked_by_name: string
          booked_by_building: Database["public"]["Enums"]["building_enum"]
          booked_by_flat: number
          booked_qty: number
          amount_paid_to: string
          created_at: string
        }[]
      }
    }
    Enums: {
      building_enum: "A" | "B" | "C" | "D" | "E" | "F" | "G"
      event_type_enum: "annadaan" | "ganpati" | "temple" | "other"
      payment_type_enum: "cash" | "online"
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
      building_enum: ["A", "B", "C", "D", "E", "F", "G"],
      event_type_enum: ["annadaan", "ganpati", "temple", "other"],
      payment_type_enum: ["cash", "online"],
    },
  },
} as const
