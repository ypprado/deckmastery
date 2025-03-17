
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, GameCategory, Deck } from '@/hooks/use-decks';

interface StaticDataOptions {
  baseUrl?: string;
  fallbackToLocal?: boolean;
}

export const useStaticData = (options: StaticDataOptions = {}) => {
  const { 
    baseUrl = 'https://raw.githubusercontent.com/yourusername/card-data/main',
    fallbackToLocal = true
  } = options;
  
  const [cards, setCards] = useState<Card[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStaticData = async (gameCategory: GameCategory) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch cards for the specific game category
      const cardsResponse = await fetch(`${baseUrl}/${gameCategory}/cards.json`);
      
      if (!cardsResponse.ok) {
        throw new Error(`Failed to fetch ${gameCategory} cards: ${cardsResponse.status}`);
      }
      
      const cardsData = await cardsResponse.json();
      setCards(cardsData);
      
      // Fetch decks for the specific game category
      const decksResponse = await fetch(`${baseUrl}/${gameCategory}/decks.json`);
      
      if (!decksResponse.ok) {
        throw new Error(`Failed to fetch ${gameCategory} decks: ${decksResponse.status}`);
      }
      
      const decksData = await decksResponse.json();
      setDecks(decksData);
      
      toast.success(`Loaded ${gameCategory} data successfully`);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error(`Error loading static data: ${err instanceof Error ? err.message : String(err)}`);
      
      // Fallback to local data if enabled
      if (fallbackToLocal) {
        // This would load data from the local storage or default data
        const localData = localStorage.getItem(`${gameCategory}_cards`);
        if (localData) {
          setCards(JSON.parse(localData));
        }
        
        const localDecks = localStorage.getItem(`${gameCategory}_decks`);
        if (localDecks) {
          setDecks(JSON.parse(localDecks));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const exportToJson = (gameCategory: GameCategory) => {
    // Get current cards and decks from localStorage
    const localCards = localStorage.getItem('cardDatabase');
    const localDecks = localStorage.getItem('decks');
    
    if (localCards && localDecks) {
      const parsedCards = JSON.parse(localCards);
      const parsedDecks = JSON.parse(localDecks);
      
      // Filter by game category
      const filteredCards = parsedCards.filter((card: Card) => card.gameCategory === gameCategory);
      const filteredDecks = parsedDecks.filter((deck: Deck) => deck.gameCategory === gameCategory);
      
      // Create downloadable JSON files
      const cardsBlob = new Blob([JSON.stringify(filteredCards, null, 2)], { type: 'application/json' });
      const decksBlob = new Blob([JSON.stringify(filteredDecks, null, 2)], { type: 'application/json' });
      
      // Create download links
      const cardsUrl = URL.createObjectURL(cardsBlob);
      const decksUrl = URL.createObjectURL(decksBlob);
      
      // Create and trigger download
      const cardsLink = document.createElement('a');
      cardsLink.href = cardsUrl;
      cardsLink.download = `${gameCategory}_cards.json`;
      cardsLink.click();
      
      const decksLink = document.createElement('a');
      decksLink.href = decksUrl;
      decksLink.download = `${gameCategory}_decks.json`;
      decksLink.click();
      
      // Clean up
      URL.revokeObjectURL(cardsUrl);
      URL.revokeObjectURL(decksUrl);
      
      toast.success('Exported data successfully');
    } else {
      toast.error('No data to export');
    }
  };

  return {
    cards,
    decks,
    loading,
    error,
    fetchStaticData,
    exportToJson
  };
};
