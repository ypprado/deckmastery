
export type GameCategory = 'magic' | 'pokemon' | 'yugioh' | 'onepiece';

export interface Card {
  id: string;
  name: string;
  imageUrl: string;
  type: string | string[]; 
  cost: number;
  rarity: string;
  set: string;
  colors: string[];
  gameCategory: GameCategory;
  flavorText?: string;
  artist?: string;
  legality?: string[];
  price?: number;
  parallel?: string[];
  card_number?: string;
  category?: string;
  power?: number;
  life?: number;
  counter?: number;
  attribute?: string[];
}

export interface Deck {
  id: string;
  name: string;
  format: string;
  colors: string[];
  cards: { card: Card; quantity: number }[];
  createdAt: string;
  updatedAt: string;
  description?: string;
  coverCard?: Card;
  gameCategory: GameCategory;
}

export const gameCategories = [
  { id: 'magic', name: 'Magic: The Gathering', hidden: true },
  { id: 'pokemon', name: 'Pokémon', hidden: true },
  { id: 'yugioh', name: 'Yu-Gi-Oh!', hidden: true },
  { id: 'onepiece', name: 'One Piece', hidden: false }
];
