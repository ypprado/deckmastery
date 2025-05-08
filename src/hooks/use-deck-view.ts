
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/hooks/use-decks';
import { AttributeType } from '@/hooks/card-database/useSupabaseCardData';

interface DeckCard {
  card: Card;
  quantity: number;
}

interface DeckViewData {
  deck: {
    id: string;
    name: string;
    format: string;
    colors: string[];
    description?: string;
    gameCategory: string;
    createdAt: string;
    updatedAt: string;
    coverCard?: Card;
  } | null;
  cards: DeckCard[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export const useDeckView = (deckId: string): DeckViewData => {
  const [deck, setDeck] = useState<DeckViewData['deck']>(null);
  const [cards, setCards] = useState<DeckCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchDeckData = async () => {
    if (!deckId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Step 1: Fetch the deck details
      const { data: deckData, error: deckError } = await supabase
        .from('decks')
        .select('*')
        .eq('id', deckId)
        .single();
      
      if (deckError) throw deckError;
      if (!deckData) {
        setDeck(null);
        setCards([]);
        setLoading(false);
        return;
      }
      
      // Step 2: Fetch the deck_cards for this deck
      const { data: deckCardsData, error: deckCardsError } = await supabase
        .from('deck_cards')
        .select('card_id, quantity')
        .eq('deck_id', deckId);
        
      if (deckCardsError) throw deckCardsError;
      
      if (!deckCardsData || deckCardsData.length === 0) {
        // We have a deck but no cards
        const formattedDeck = formatDeckData(deckData);
        setDeck(formattedDeck);
        setCards([]);
        setLoading(false);
        return;
      }
      
      // Step 3: Extract the card IDs we need to fetch
      const cardIds = deckCardsData.map(dc => dc.card_id);
      
      // Step 4: Fetch only the cards that are in this deck
      const { data: cardsData, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .in('id', cardIds);
      
      if (cardsError) throw cardsError;
      
      // Step 5: Combine the card data with quantities
      const cardsWithQuantities = deckCardsData.map(dc => {
        const cardData = cardsData?.find(card => Number(card.id) === Number(dc.card_id));
        if (!cardData) return null;
        
        // Get the artwork URL - if it starts with 'card-images/' assume it's a Supabase Storage URL
        let imageUrl = cardData.artwork_url;
        if (imageUrl && imageUrl.startsWith('card-images/')) {
          // Get public URL from Supabase Storage
          const { data } = supabase.storage.from('card-images').getPublicUrl(imageUrl);
          imageUrl = data.publicUrl;
        }
        
        const card: Card = {
          id: String(cardData.id),
          name: cardData.name,
          imageUrl: imageUrl,
          type: cardData.card_type || [],
          cost: cardData.cost || 0,
          rarity: cardData.rarity || '',
          set: cardData.groupid_market_br || '',
          colors: cardData.colors as string[] || [],
          gameCategory: cardData.game_category,
          // Remove the property that's causing the error
          // card_number_market_br: cardData.card_number_market_br,
          attribute: cardData.attribute as AttributeType[] || [],
          parallel: cardData.parallel || [],
          card_number: cardData.card_number,
          category: cardData.category,
          power: cardData.power,
          life: cardData.life,
          counter: cardData.counter
        };
        
        return { card, quantity: dc.quantity };
      }).filter(Boolean) as DeckCard[];
      
      // Format the deck data
      const formattedDeck = formatDeckData(deckData);
      
      // Update cover card if needed
      if (formattedDeck && !formattedDeck.coverCard && cardsWithQuantities.length > 0) {
        formattedDeck.coverCard = cardsWithQuantities[0].card;
      }
      
      setDeck(formattedDeck);
      setCards(cardsWithQuantities);
      
    } catch (err) {
      console.error('Error loading deck view data:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error(`Error loading deck: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to format deck data consistently
  const formatDeckData = (deckData: any): DeckViewData['deck'] => {
    if (!deckData) return null;
    
    // Parse cover card if it's stored as a string
    let coverCard = deckData.cover_card;
    if (coverCard && typeof coverCard === 'string') {
      try {
        coverCard = JSON.parse(coverCard);
      } catch (e) {
        console.warn('Error parsing cover card', e);
        coverCard = undefined;
      }
    }
    
    return {
      id: deckData.id,
      name: deckData.name,
      format: deckData.format,
      colors: deckData.colors || [],
      description: deckData.description,
      gameCategory: deckData.game_category,
      createdAt: deckData.created_at,
      updatedAt: deckData.updated_at,
      coverCard: coverCard
    };
  };
  
  // Load the deck data when the component mounts or deckId changes
  useEffect(() => {
    fetchDeckData();
  }, [deckId]);
  
  return {
    deck,
    cards,
    loading,
    error,
    refresh: fetchDeckData
  };
};
