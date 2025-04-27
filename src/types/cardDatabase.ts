
import { GameCategory } from '@/hooks/use-decks';
import { AttributeType } from '@/hooks/card-database/useSupabaseCardData';

export interface CardSet {
  id: number; // Changed from string to number to match int8
  name: string;
  releaseYear: number; // Changed from releaseDate string to releaseYear number
  gameCategory: GameCategory;
  groupid_tcg?: number; // Added new field
}

export interface CardDetails {
  id: string;
  name: string;
  set: string; // This now refers to groupid_market_br
  setName?: string;
  imageUrl: string;
  type: string | string[];
  cost: number;
  rarity: string;
  colors: string[];
  gameCategory: GameCategory;
  flavorText?: string;
  artist?: string;
  legality?: string[];
  price?: number;
  url_tcg?: string;
  url_market_br?: string;
  subTypeName?: string;
  card_number?: string;
  card_number_market_br?: string;
  groupid_tcg?: number;
  attribute?: AttributeType[];
  parallel?: string[];
  category?: string;
  life?: number;
  power?: number;
  card_type?: string | string[];
  card_text?: string;
}

export interface CardDatabaseFormValues {
  gameCategory: GameCategory;
  setId: string; // This now refers to groupid_market_br
  name: string;
  type: string | string[];
  cost: number;
  rarity: string;
  colors: string[];
  imageUrl: string;
  flavorText?: string;
  artist?: string;
  legality?: string;
  price?: number;
  url_tcg?: string;
  url_market_br?: string;
  subTypeName?: string;
  card_number?: string;
  card_number_market_br?: string;
  groupid_tcg?: number;
  attribute?: AttributeType[];
}
