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
          game_category: Database["public"]["Enums"]["game_category"]
          groupid_tcg: number | null
          id: string
          name: string
          release_year: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          game_category: Database["public"]["Enums"]["game_category"]
          groupid_tcg?: number | null
          id: string
          name: string
          release_year?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          game_category?: Database["public"]["Enums"]["game_category"]
          groupid_tcg?: number | null
          id?: string
          name?: string
          release_year?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      cards: {
        Row: {
          artwork_url: string
          attribute: Database["public"]["Enums"]["attribute_type"][] | null
          card_number: string | null
          card_number_liga: string | null
          card_text: string | null
          card_type: Database["public"]["Enums"]["card_type"][]
          category: Database["public"]["Enums"]["category_type"] | null
          colors: Database["public"]["Enums"]["color_type"][] | null
          cost: number | null
          counter: number | null
          created_at: string
          game_category: Database["public"]["Enums"]["game_category"]
          groupid_liga: string | null
          groupid_tcg: number | null
          id: number
          language: Database["public"]["Enums"]["language_type"] | null
          life: number | null
          name: string
          parallel: Database["public"]["Enums"]["parallel_type"][] | null
          power: number | null
          rarity: Database["public"]["Enums"]["rarity_type"] | null
          subTypeName: Database["public"]["Enums"]["sub_type"] | null
          updated_at: string
          url_liga: string | null
          url_tcg: string | null
        }
        Insert: {
          artwork_url: string
          attribute?: Database["public"]["Enums"]["attribute_type"][] | null
          card_number?: string | null
          card_number_liga?: string | null
          card_text?: string | null
          card_type: Database["public"]["Enums"]["card_type"][]
          category?: Database["public"]["Enums"]["category_type"] | null
          colors?: Database["public"]["Enums"]["color_type"][] | null
          cost?: number | null
          counter?: number | null
          created_at?: string
          game_category: Database["public"]["Enums"]["game_category"]
          groupid_liga?: string | null
          groupid_tcg?: number | null
          id: number
          language?: Database["public"]["Enums"]["language_type"] | null
          life?: number | null
          name: string
          parallel?: Database["public"]["Enums"]["parallel_type"][] | null
          power?: number | null
          rarity?: Database["public"]["Enums"]["rarity_type"] | null
          subTypeName?: Database["public"]["Enums"]["sub_type"] | null
          updated_at?: string
          url_liga?: string | null
          url_tcg?: string | null
        }
        Update: {
          artwork_url?: string
          attribute?: Database["public"]["Enums"]["attribute_type"][] | null
          card_number?: string | null
          card_number_liga?: string | null
          card_text?: string | null
          card_type?: Database["public"]["Enums"]["card_type"][]
          category?: Database["public"]["Enums"]["category_type"] | null
          colors?: Database["public"]["Enums"]["color_type"][] | null
          cost?: number | null
          counter?: number | null
          created_at?: string
          game_category?: Database["public"]["Enums"]["game_category"]
          groupid_liga?: string | null
          groupid_tcg?: number | null
          id?: number
          language?: Database["public"]["Enums"]["language_type"] | null
          life?: number | null
          name?: string
          parallel?: Database["public"]["Enums"]["parallel_type"][] | null
          power?: number | null
          rarity?: Database["public"]["Enums"]["rarity_type"] | null
          subTypeName?: Database["public"]["Enums"]["sub_type"] | null
          updated_at?: string
          url_liga?: string | null
          url_tcg?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cards_groupid_liga_fkey"
            columns: ["groupid_liga"]
            isOneToOne: false
            referencedRelation: "card_sets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cards_groupid_tcg_fkey"
            columns: ["groupid_tcg"]
            isOneToOne: false
            referencedRelation: "card_sets"
            referencedColumns: ["groupid_tcg"]
          },
        ]
      }
      config: {
        Row: {
          key: string
          updated_at: string
          value: number | null
        }
        Insert: {
          key: string
          updated_at?: string
          value?: number | null
        }
        Update: {
          key?: string
          updated_at?: string
          value?: number | null
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string | null
          following_id: string | null
          id: string
        }
        Insert: {
          created_at?: string
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      price_history: {
        Row: {
          card_id: number
          id: number
          price_avg_liga: number | null
          price_avg_tcg: number | null
          price_market_tcg: number | null
          price_max_liga: number | null
          price_max_tcg: number | null
          price_min_liga: number | null
          price_min_tcg: number | null
          recorded_at: string
          source: string
        }
        Insert: {
          card_id: number
          id?: number
          price_avg_liga?: number | null
          price_avg_tcg?: number | null
          price_market_tcg?: number | null
          price_max_liga?: number | null
          price_max_tcg?: number | null
          price_min_liga?: number | null
          price_min_tcg?: number | null
          recorded_at?: string
          source?: string
        }
        Update: {
          card_id?: number
          id?: number
          price_avg_liga?: number | null
          price_avg_tcg?: number | null
          price_market_tcg?: number | null
          price_max_liga?: number | null
          price_max_tcg?: number | null
          price_min_liga?: number | null
          price_min_tcg?: number | null
          recorded_at?: string
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_history_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_comments: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          id: string
          profile_id: string | null
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          id?: string
          profile_id?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          id?: string
          profile_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          awarded_at: string
          badge_type: Database["public"]["Enums"]["badge_type"]
          id: string
          user_id: string | null
        }
        Insert: {
          awarded_at?: string
          badge_type: Database["public"]["Enums"]["badge_type"]
          id?: string
          user_id?: string | null
        }
        Update: {
          awarded_at?: string
          badge_type?: Database["public"]["Enums"]["badge_type"]
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      badge_type:
        | "deck_creator"
        | "collector"
        | "price_tracker"
        | "community_contributor"
      card_type:
        | "Alabasta"
        | "Amazon Lily"
        | "Animal"
        | "Animal Kingdom Pirates"
        | "Arlong Pirates"
        | "Baroque Works"
        | "Barto Club"
        | "Beautiful Pirates"
        | "Big Mom Pirates"
        | "Biological Weapon"
        | "Black Cat Pirates"
        | "Blackbeard Pirates"
        | "Bonney Pirates"
        | "Buggy Pirates"
        | "CP0"
        | "CP9"
        | "Caribou Pirates"
        | "Celestial Dragons"
        | "Cross Guild"
        | "Donquixote Pirates"
        | "Drake Pirates"
        | "Dressrosa"
        | "Drum Kingdom"
        | "East Blue"
        | "Egghead"
        | "FILM"
        | "Fallen Monk Pirates"
        | "Firetank Pirates"
        | "Fish-Man"
        | "Fish-Man Island"
        | "Former Baroque Works"
        | "Former Navy"
        | "Former Rocks Pirates"
        | "Former Roger Pirates"
        | "Former Whitebeard Pirates"
        | "Foxy Pirates"
        | "GERMA 66"
        | "Galley-La Company"
        | "Giant"
        | "Goa Kingdom"
        | "Golden Lion Pirates"
        | "Grantesoro"
        | "Happosui Army"
        | "Hawkins Pirates"
        | "Heart Pirates"
        | "Homies"
        | "Impel Down"
        | "Jailer Beast"
        | "Jaya"
        | "Kid Pirates"
        | "Kingdom of GERMA"
        | "Kouzuki Clan"
        | "Krieg Pirates"
        | "Kuja Pirates"
        | "Kurozumi Clan"
        | "Land of Wano"
        | "Merfolk"
        | "Minks"
        | "Mountain Bandits"
        | "Muggy Kingdom"
        | "Music"
        | "Navy"
        | "Neo Navy"
        | "Neptunian"
        | "New Fish-Man Pirates"
        | "ODYSSEY"
        | "Ohara"
        | "On-Air Pirates"
        | "Punk Hazard"
        | "Red-Haired Pirates"
        | "Revolutionary Army"
        | "Roger Pirates"
        | "SMILE"
        | "SWORD"
        | "Scientist"
        | "Seraphim"
        | "Shandian Warrior"
        | "Sky Island"
        | "Sniper Island"
        | "Straw Hat Crew"
        | "Supernovas"
        | "The Akazaya Nine"
        | "The Flying Fish Riders"
        | "The Four Emperors"
        | "The Franky Family"
        | "The Pirates Fest"
        | "The Seven Warlords of the Sea"
        | "The Sun Pirates"
        | "The Tontattas"
        | "The Vinsmoke Family"
        | "Thriller Bark Pirates"
        | "Vassals"
        | "Water Seven"
        | "Whitebeard Pirates"
        | "Whitebeard Pirates Allies"
        | "Windmill Village"
        | "World Government"
        | "Film"
        | "New Giant Pirate Crew"
        | "Barto Club Pirates"
        | "None"
        | "No Type"
        | "Alvida Pirates"
        | "Asuka Island"
        | "Blackbeard Pirates Allies"
        | "Bluejam Pirates"
        | "Botanist"
        | "Brownbeard Pirates"
        | "Buggy's Delivery"
        | "CP6"
        | "CP7"
        | "Crown Island"
        | "Eldoraggo Crew"
        | "Flying Pirates"
        | "Former Arlong Pirates"
        | "Former CP9"
        | "Frost Moon Village"
        | "Gasparde Pirates"
        | "Jellyfish Pirates"
        | "Journalist"
        | "King of the Pirates"
        | "Kingdom of Prodence"
        | "Lunarian"
        | "Mecha Island"
        | "Mugiwara Chase"
        | "Omatsuri Island"
        | "Plague"
        | "Shipbuilding Town"
        | "Spade Pirates"
        | "The Moon"
        | "Trump Pirates"
        | "Weevil's Mother"
        | "Whole Cake Island"
        | "Yonta Maria Fleet"
        | "Rumbar Pirates"
        | "Monkey Mountain Alliance"
        | "World Pirates"
        | "The House of Lambs"
        | "Former Rumbar Pirates"
        | "Gyro Pirates"
        | "Lulucia Kingdom"
        | "Foolshout Island"
        | "Long Ring Long Land"
        | "Bellamy Pirates"
        | "Mary Geoise"
        | "Peachbeard Pirates"
        | "New Giant Pirates"
        | "Bowin Island"
      category_type: "Leader" | "Character" | "Event" | "Stage" | "DON!!"
      color_type: "Red" | "Green" | "Blue" | "Purple" | "Black" | "Yellow"
      game_category: "magic" | "pokemon" | "yugioh" | "onepiece"
      language_type: "English" | "Japanese" | "Chinese" | "Portuguese"
      parallel_type:
        | "Alternate Art"
        | "Manga Art"
        | "Parallel Art"
        | "Box Topper"
        | "Wanted Poster"
        | "SP"
        | "TR"
        | "Jolly Roger Foil"
        | "Reprint"
        | "Full Art"
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
        | "DON!!"
      sub_type: "Normal" | "Foil"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      attribute_type: ["Slash", "Strike", "Special", "Wisdom", "Ranged"],
      badge_type: [
        "deck_creator",
        "collector",
        "price_tracker",
        "community_contributor",
      ],
      card_type: [
        "Alabasta",
        "Amazon Lily",
        "Animal",
        "Animal Kingdom Pirates",
        "Arlong Pirates",
        "Baroque Works",
        "Barto Club",
        "Beautiful Pirates",
        "Big Mom Pirates",
        "Biological Weapon",
        "Black Cat Pirates",
        "Blackbeard Pirates",
        "Bonney Pirates",
        "Buggy Pirates",
        "CP0",
        "CP9",
        "Caribou Pirates",
        "Celestial Dragons",
        "Cross Guild",
        "Donquixote Pirates",
        "Drake Pirates",
        "Dressrosa",
        "Drum Kingdom",
        "East Blue",
        "Egghead",
        "FILM",
        "Fallen Monk Pirates",
        "Firetank Pirates",
        "Fish-Man",
        "Fish-Man Island",
        "Former Baroque Works",
        "Former Navy",
        "Former Rocks Pirates",
        "Former Roger Pirates",
        "Former Whitebeard Pirates",
        "Foxy Pirates",
        "GERMA 66",
        "Galley-La Company",
        "Giant",
        "Goa Kingdom",
        "Golden Lion Pirates",
        "Grantesoro",
        "Happosui Army",
        "Hawkins Pirates",
        "Heart Pirates",
        "Homies",
        "Impel Down",
        "Jailer Beast",
        "Jaya",
        "Kid Pirates",
        "Kingdom of GERMA",
        "Kouzuki Clan",
        "Krieg Pirates",
        "Kuja Pirates",
        "Kurozumi Clan",
        "Land of Wano",
        "Merfolk",
        "Minks",
        "Mountain Bandits",
        "Muggy Kingdom",
        "Music",
        "Navy",
        "Neo Navy",
        "Neptunian",
        "New Fish-Man Pirates",
        "ODYSSEY",
        "Ohara",
        "On-Air Pirates",
        "Punk Hazard",
        "Red-Haired Pirates",
        "Revolutionary Army",
        "Roger Pirates",
        "SMILE",
        "SWORD",
        "Scientist",
        "Seraphim",
        "Shandian Warrior",
        "Sky Island",
        "Sniper Island",
        "Straw Hat Crew",
        "Supernovas",
        "The Akazaya Nine",
        "The Flying Fish Riders",
        "The Four Emperors",
        "The Franky Family",
        "The Pirates Fest",
        "The Seven Warlords of the Sea",
        "The Sun Pirates",
        "The Tontattas",
        "The Vinsmoke Family",
        "Thriller Bark Pirates",
        "Vassals",
        "Water Seven",
        "Whitebeard Pirates",
        "Whitebeard Pirates Allies",
        "Windmill Village",
        "World Government",
        "Film",
        "New Giant Pirate Crew",
        "Barto Club Pirates",
        "None",
        "No Type",
        "Alvida Pirates",
        "Asuka Island",
        "Blackbeard Pirates Allies",
        "Bluejam Pirates",
        "Botanist",
        "Brownbeard Pirates",
        "Buggy's Delivery",
        "CP6",
        "CP7",
        "Crown Island",
        "Eldoraggo Crew",
        "Flying Pirates",
        "Former Arlong Pirates",
        "Former CP9",
        "Frost Moon Village",
        "Gasparde Pirates",
        "Jellyfish Pirates",
        "Journalist",
        "King of the Pirates",
        "Kingdom of Prodence",
        "Lunarian",
        "Mecha Island",
        "Mugiwara Chase",
        "Omatsuri Island",
        "Plague",
        "Shipbuilding Town",
        "Spade Pirates",
        "The Moon",
        "Trump Pirates",
        "Weevil's Mother",
        "Whole Cake Island",
        "Yonta Maria Fleet",
        "Rumbar Pirates",
        "Monkey Mountain Alliance",
        "World Pirates",
        "The House of Lambs",
        "Former Rumbar Pirates",
        "Gyro Pirates",
        "Lulucia Kingdom",
        "Foolshout Island",
        "Long Ring Long Land",
        "Bellamy Pirates",
        "Mary Geoise",
        "Peachbeard Pirates",
        "New Giant Pirates",
        "Bowin Island",
      ],
      category_type: ["Leader", "Character", "Event", "Stage", "DON!!"],
      color_type: ["Red", "Green", "Blue", "Purple", "Black", "Yellow"],
      game_category: ["magic", "pokemon", "yugioh", "onepiece"],
      language_type: ["English", "Japanese", "Chinese", "Portuguese"],
      parallel_type: [
        "Alternate Art",
        "Manga Art",
        "Parallel Art",
        "Box Topper",
        "Wanted Poster",
        "SP",
        "TR",
        "Jolly Roger Foil",
        "Reprint",
        "Full Art",
      ],
      rarity_type: [
        "Leader",
        "Common",
        "Uncommon",
        "Rare",
        "Super Rare",
        "Secret Rare",
        "Special Card",
        "Treasure Rare",
        "Promo",
        "DON!!",
      ],
      sub_type: ["Normal", "Foil"],
    },
  },
} as const
