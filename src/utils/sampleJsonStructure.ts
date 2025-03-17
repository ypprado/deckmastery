
export const sampleCardData = {
  "id": "card123",
  "name": "Dragon Guardian",
  "imageUrl": "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?q=80&w=250",
  "type": "Creature",
  "cost": 4,
  "rarity": "Rare",
  "set": "Core Set",
  "colors": ["red"],
  "gameCategory": "magic",
  "flavorText": "The dragon's scales shimmer in the moonlight as it guards the ancient treasure.",
  "artist": "Jane Doe",
  "legality": ["Standard", "Modern"],
  "price": 5.99
};

export const sampleDeckData = {
  "id": "deck123",
  "name": "Fire & Ice",
  "format": "Standard",
  "colors": ["red", "blue"],
  "cards": [
    { 
      "card": {
        "id": "card123",
        "name": "Dragon Guardian",
        "imageUrl": "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?q=80&w=250",
        "type": "Creature",
        "cost": 4,
        "rarity": "Rare",
        "set": "Core Set",
        "colors": ["red"],
        "gameCategory": "magic"
      }, 
      "quantity": 4 
    }
  ],
  "createdAt": "2023-05-15T12:00:00Z",
  "updatedAt": "2023-05-16T14:30:00Z",
  "description": "A balanced deck using fire and ice elements for versatile play",
  "gameCategory": "magic"
};

export const sampleStructures = {
  magic: {
    cards: [sampleCardData],
    decks: [sampleDeckData]
  }
};
