
import { GameCategory, AttributeType } from '@/types/card';

export interface CardSet {
  id: string; // Changed to string to match the Supabase database
  name: string;
  releaseYear: number;
  gameCategory: GameCategory;
  groupid_market_us?: number;
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
  url_market_us?: string;
  url_market_br?: string;
  subTypeName?: string;
  card_number?: string;
  card_number_market_br?: string;
  groupid_market_us?: number;
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
  url_market_us?: string;
  url_market_br?: string;
  subTypeName?: string;
  card_number?: string;
  card_number_market_br?: string;
  groupid_market_us?: number;
  attribute?: AttributeType[];
}
