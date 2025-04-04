export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      card_sets: {
        Row: {
          created_at: string
          description: string | null
          game_category: Database["public"]["Enums"]["game_category"]
          id: string
          name: string
          release_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          game_category: Database["public"]["Enums"]["game_category"]
          id?: string
          name: string
          release_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          game_category?: Database["public"]["Enums"]["game_category"]
          id?: string
          name?: string
          release_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cards: {
        Row: {
          art_urls: string[] | null
          artwork_url: string
          attribute: Database["public"]["Enums"]["attribute_type"] | null
          card_number: number | null
          card_text: string | null
          card_type: string | null
          category: Database["public"]["Enums"]["category_type"] | null
          colors: Database["public"]["Enums"]["color_type"][] | null
          cost: number | null
          counter: number | null
          created_at: string
          game_category: Database["public"]["Enums"]["game_category"]
          id: string
          language: Database["public"]["Enums"]["language_type"] | null
          life: number | null
          name: string
          parallel: Database["public"]["Enums"]["parallel_type"] | null
          power: number | null
          rarity: Database["public"]["Enums"]["rarity_type"] | null
          series: Database["public"]["Enums"]["series_type"] | null
          set_id: string
          updated_at: string
        }
        Insert: {
          art_urls?: string[] | null
          artwork_url: string
          attribute?: Database["public"]["Enums"]["attribute_type"] | null
          card_number?: number | null
          card_text?: string | null
          card_type?: string | null
          category?: Database["public"]["Enums"]["category_type"] | null
          colors?: Database["public"]["Enums"]["color_type"][] | null
          cost?: number | null
          counter?: number | null
          created_at?: string
          game_category: Database["public"]["Enums"]["game_category"]
          id?: string
          language?: Database["public"]["Enums"]["language_type"] | null
          life?: number | null
          name: string
          parallel?: Database["public"]["Enums"]["parallel_type"] | null
          power?: number | null
          rarity?: Database["public"]["Enums"]["rarity_type"] | null
          series?: Database["public"]["Enums"]["series_type"] | null
          set_id: string
          updated_at?: string
        }
        Update: {
          art_urls?: string[] | null
          artwork_url?: string
          attribute?: Database["public"]["Enums"]["attribute_type"] | null
          card_number?: number | null
          card_text?: string | null
          card_type?: string | null
          category?: Database["public"]["Enums"]["category_type"] | null
          colors?: Database["public"]["Enums"]["color_type"][] | null
          cost?: number | null
          counter?: number | null
          created_at?: string
          game_category?: Database["public"]["Enums"]["game_category"]
          id?: string
          language?: Database["public"]["Enums"]["language_type"] | null
          life?: number | null
          name?: string
          parallel?: Database["public"]["Enums"]["parallel_type"] | null
          power?: number | null
          rarity?: Database["public"]["Enums"]["rarity_type"] | null
          series?: Database["public"]["Enums"]["series_type"] | null
          set_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cards_set_id_fkey"
            columns: ["set_id"]
            isOneToOne: false
            referencedRelation: "card_sets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      attribute_type: "Slash" | "Strike" | "Special" | "Wisdom" | "Ranged"
      category_type: "Leader" | "Character" | "Event" | "Stage"
      color_type: "Red" | "Green" | "Blue" | "Purple" | "Black" | "Yellow"
      game_category: "magic" | "pokemon" | "yugioh" | "onepiece"
      language_type: "English" | "Japanese" | "Chinese" | "Portuguese"
      parallel_type: "Alternate Art" | "Manga Art"
      rarity_type:
        | "Leader"
        | "Common"
        | "Uncommon"
        | "Rare"
        | "Super Rare"
        | "Secret Rare"
        | "Special Card"
        | "Treasure Rare"
        | "Promo"
      series_type: "OP" | "ST" | "EB" | "P"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
