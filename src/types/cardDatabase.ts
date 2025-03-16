
import { GameCategory } from '@/hooks/use-decks';

export interface CardSet {
  id: string;
  name: string;
  releaseDate: string;
  gameCategory: GameCategory;
  description?: string;
  symbol?: string;
}

export interface CardDetails {
  id: string;
  name: string;
  set: string;
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
}

export interface CardDatabaseFormValues {
  gameCategory: GameCategory;
  setId: string;
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
}
