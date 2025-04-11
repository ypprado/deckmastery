
import { GameCategory } from '@/hooks/use-decks';

export interface CardSet {
  id: number; // Changed from string to number to match int8
  name: string;
  releaseYear: number; // Changed from releaseDate string to releaseYear number
  gameCategory: GameCategory;
  groupid_tcg?: number; // Added new field
}

export interface CardDetails {
  id: string; // Keeping as string for compatibility
  name: string;
  set: string; // This now refers to groupid_liga
  setName?: string;
  imageUrl: string;
  type: string;
  cost: number;
  rarity: string;
  colors: string[];
  gameCategory: GameCategory;
  flavorText?: string;
  artist?: string;
  legality?: string[];
  price?: number;
  url_tcg?: string; // Added new field
  url_liga?: string; // Added new field
  subTypeName?: string; // Added new field
  card_number?: string; // Added field, now text type
  groupid_tcg?: number; // Added new field
}

export interface CardDatabaseFormValues {
  gameCategory: GameCategory;
  setId: string; // This now refers to groupid_liga
  name: string;
  type: string;
  cost: number;
  rarity: string;
  colors: string[];
  imageUrl: string;
  flavorText?: string;
  artist?: string;
  legality?: string;
  price?: number;
  url_tcg?: string; // Added new field
  url_liga?: string; // Added new field 
  subTypeName?: string; // Added new field
  card_number?: string; // Added field
  groupid_tcg?: number; // Added new field
}
