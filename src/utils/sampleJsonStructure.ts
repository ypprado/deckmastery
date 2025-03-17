
export interface CardData {
  id: string;
  name: string;
  imageUrl: string;
  type: string;
  cost: number;
  rarity: string;
  set: string;
  colors: string[];
  gameCategory: string;
  flavorText?: string;
  artist?: string;
  legality?: string[];
  price?: number;
}

export interface DeckData {
  id: string;
  name: string;
  format: string;
  colors: string[];
  cards: { 
    card: {
      id: string;
      name: string;
      imageUrl: string;
      type: string;
      cost: number;
      rarity: string;
      set: string;
      colors: string[];
      gameCategory: string;
    }; 
    quantity: number;
  }[];
  createdAt: string;
  updatedAt: string;
  description?: string;
  gameCategory: string;
}

// Magic: The Gathering
export const magicCards: CardData[] = [
  {
    id: "card123",
    name: "Dragon Guardian",
    imageUrl: "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?q=80&w=250",
    type: "Creature",
    cost: 4,
    rarity: "Rare",
    set: "Core Set",
    colors: ["red"],
    gameCategory: "magic",
    flavorText: "The dragon's scales shimmer in the moonlight as it guards the ancient treasure.",
    artist: "Jane Doe",
    legality: ["Standard", "Modern"],
    price: 5.99
  },
  {
    id: "card124",
    name: "Mystic Sorcerer",
    imageUrl: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=250",
    type: "Creature",
    cost: 3,
    rarity: "Uncommon",
    set: "Core Set",
    colors: ["blue"],
    gameCategory: "magic"
  }
];

export const magicDecks: DeckData[] = [
  {
    id: "deck123",
    name: "Fire & Ice",
    format: "Standard",
    colors: ["red", "blue"],
    cards: [
      { 
        card: {
          id: "card123",
          name: "Dragon Guardian",
          imageUrl: "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?q=80&w=250",
          type: "Creature",
          cost: 4,
          rarity: "Rare",
          set: "Core Set",
          colors: ["red"],
          gameCategory: "magic"
        }, 
        quantity: 4 
      }
    ],
    createdAt: "2023-05-15T12:00:00Z",
    updatedAt: "2023-05-16T14:30:00Z",
    description: "A balanced deck using fire and ice elements for versatile play",
    gameCategory: "magic"
  }
];

// Pokemon
export const pokemonCards: CardData[] = [
  {
    id: "poke001",
    name: "Pikachu",
    imageUrl: "https://images.unsplash.com/photo-1638361631748-adee2db0c2f3?q=80&w=250",
    type: "Pokemon",
    cost: 2,
    rarity: "Rare",
    set: "Base Set",
    colors: ["yellow"],
    gameCategory: "pokemon"
  }
];

export const pokemonDecks: DeckData[] = [
  {
    id: "pokedeck001",
    name: "Electric Power",
    format: "Standard",
    colors: ["yellow"],
    cards: [
      {
        card: {
          id: "poke001",
          name: "Pikachu",
          imageUrl: "https://images.unsplash.com/photo-1638361631748-adee2db0c2f3?q=80&w=250",
          type: "Pokemon",
          cost: 2,
          rarity: "Rare",
          set: "Base Set",
          colors: ["yellow"],
          gameCategory: "pokemon"
        },
        quantity: 4
      }
    ],
    createdAt: "2023-06-15T12:00:00Z",
    updatedAt: "2023-06-16T14:30:00Z",
    description: "A Pokemon deck focusing on electric types",
    gameCategory: "pokemon"
  }
];

// Yu-Gi-Oh!
export const yugiohCards: CardData[] = [
  {
    id: "ygo001",
    name: "Dark Magician",
    imageUrl: "https://images.unsplash.com/photo-1584198214525-66552afb419f?q=80&w=250",
    type: "Monster",
    cost: 7,
    rarity: "Ultra Rare",
    set: "Legend of Blue Eyes",
    colors: ["purple"],
    gameCategory: "yugioh"
  }
];

export const yugiohDecks: DeckData[] = [
  {
    id: "ygodeck001",
    name: "Magician's Force",
    format: "Traditional",
    colors: ["purple"],
    cards: [
      {
        card: {
          id: "ygo001",
          name: "Dark Magician",
          imageUrl: "https://images.unsplash.com/photo-1584198214525-66552afb419f?q=80&w=250",
          type: "Monster",
          cost: 7,
          rarity: "Ultra Rare",
          set: "Legend of Blue Eyes",
          colors: ["purple"],
          gameCategory: "yugioh"
        },
        quantity: 3
      }
    ],
    createdAt: "2023-07-15T12:00:00Z",
    updatedAt: "2023-07-16T14:30:00Z",
    description: "A Yu-Gi-Oh! deck built around spellcasters",
    gameCategory: "yugioh"
  }
];

// One Piece
export const onepieceCards: CardData[] = [
  {
    id: "op001",
    name: "Monkey D. Luffy",
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?q=80&w=250",
    type: "Character",
    cost: 4,
    rarity: "Super Rare",
    set: "Romance Dawn",
    colors: ["red"],
    gameCategory: "onepiece"
  }
];

export const onepieceDecks: DeckData[] = [
  {
    id: "opdeck001",
    name: "Straw Hat Crew",
    format: "Standard",
    colors: ["red", "green"],
    cards: [
      {
        card: {
          id: "op001",
          name: "Monkey D. Luffy",
          imageUrl: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?q=80&w=250",
          type: "Character",
          cost: 4,
          rarity: "Super Rare",
          set: "Romance Dawn",
          colors: ["red"],
          gameCategory: "onepiece"
        },
        quantity: 2
      }
    ],
    createdAt: "2023-08-15T12:00:00Z",
    updatedAt: "2023-08-16T14:30:00Z",
    description: "A One Piece deck featuring the Straw Hat Pirates",
    gameCategory: "onepiece"
  }
];

// Combined static data structure for easy access
export const staticCardDatabase = {
  magic: {
    cards: magicCards,
    decks: magicDecks
  },
  pokemon: {
    cards: pokemonCards,
    decks: pokemonDecks
  },
  yugioh: {
    cards: yugiohCards,
    decks: yugiohDecks
  },
  onepiece: {
    cards: onepieceCards,
    decks: onepieceDecks
  }
};
