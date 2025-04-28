import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, GameCategory, Deck } from '@/hooks/use-decks';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { AttributeType } from './card-database/useSupabaseCardData';

interface StaticDataOptions {
  initialGameCategory?: GameCategory;
}

export const useStaticData = (options: StaticDataOptions = {}) => {
  const { 
    initialGameCategory = 'magic'
  } = options;
  
  const [cards, setCards] = useState<Card[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [activeGameCategory, setActiveGameCategory] = useState<GameCategory>(initialGameCategory);

  // Load data whenever the active game category changes
  useEffect(() => {
    loadStaticData(activeGameCategory);
  }, [activeGameCategory]);

  const loadStaticData = async (gameCategory: GameCategory) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch card sets
      const { data: setsData, error: setsError } = await supabase
        .from('card_sets')
        .select('*')
        .eq('game_category', gameCategory);
      
      if (setsError) {
        throw new Error(`Error fetching sets: ${setsError.message}`);
      }
      
      // Fetch cards for the game category using pagination to overcome the 1000 row limit
      let allCards: any[] = [];
      let page = 0;
      const pageSize = 1000;
      let hasMore = true;
      
      while (hasMore) {
        const { data: cardsData, error: cardsError } = await supabase
          .from('cards')
          .select('*')
          .eq('game_category', gameCategory)
          .range(page * pageSize, (page + 1) * pageSize - 1);
          
        if (cardsError) {
          throw new Error(`Error fetching cards: ${cardsError.message}`);
        }
        
        if (cardsData && cardsData.length > 0) {
          allCards = [...allCards, ...cardsData];
          // Check if we need to fetch more pages
          hasMore = cardsData.length === pageSize;
          page++;
        } else {
          hasMore = false;
        }
      }
      
      if (allCards.length === 0) {
        console.log(`No cards found for ${gameCategory}`);
      } else {
        console.log(`Loaded ${allCards.length} cards for ${gameCategory}`);
      }
      
      // Map Supabase data to our app's format
      const mappedCards: Card[] = allCards.map(card => {
        // Get the artwork URL - if it starts with 'card-images/' assume it's a Supabase Storage URL
        let imageUrl = card.artwork_url;
        if (imageUrl && imageUrl.startsWith('card-images/')) {
          // Get public URL from Supabase Storage
          const { data } = supabase.storage.from('card-images').getPublicUrl(imageUrl);
          imageUrl = data.publicUrl;
        }
        
        return {
          id: String(card.id),
          name: card.name,
          imageUrl: imageUrl,
          type: card.card_type || [],
          cost: card.cost || 0,
          rarity: card.rarity || '',
          set: card.groupid_market_br || '',
          colors: card.colors as string[] || [],
          gameCategory: card.game_category,
          card_number_market_br: card.card_number_market_br,
          attribute: card.attribute as AttributeType[] || [],
          parallel: card.parallel || [], // Add parallel to the mapped data
          card_number: card.card_number,
          category: card.category,
          power: card.power,
          life: card.life,
          counter: card.counter
        };
      }) || [];
      
      // For decks, we need to handle the cards field differently
      // Since we don't have a decks table in Supabase yet, we'll leave this as an empty array for now
      const mappedDecks: Deck[] = [];
      
      setCards(mappedCards);
      setDecks(mappedDecks);
      
      toast.success(`Loaded ${gameCategory} data successfully`);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error(`Error loading data: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const changeGameCategory = (gameCategory: GameCategory) => {
    setActiveGameCategory(gameCategory);
    // Data will be loaded by the useEffect that watches activeGameCategory
  };

  return {
    cards,
    decks,
    loading,
    error,
    activeGameCategory,
    changeGameCategory,
    loadStaticData
  };
};
