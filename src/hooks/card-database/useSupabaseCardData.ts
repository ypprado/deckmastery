import { toast } from 'sonner';
import { CardDetails, CardSet } from '@/types/cardDatabase';
import { GameCategory, AttributeType } from '@/types/card';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Types for Supabase tables
export type CardSetInsert = Database['public']['Tables']['card_sets']['Insert'];
export type CardInsert = Database['public']['Tables']['cards']['Insert'];
export type RarityType = Database['public']['Enums']['rarity_type'];
export type ColorType = Database['public']['Enums']['color_type'];
export type SubTypeNameEnum = Database['public']['Enums']['sub_type'];

// Shared utilities
export const convertSetFromSupabase = (set: any): CardSet => {
  return {
    id: set.id,
    name: set.name,
    releaseYear: set.release_year || new Date().getFullYear(),
    gameCategory: set.game_category,
    groupid_market_us: set.groupid_market_us || undefined,
  };
};

export const convertCardFromSupabase = (
  card: any, 
  sets: CardSet[]
): CardDetails => {
  // Find the set name for this card
  const cardSet = sets.find(set => set.id === card.groupid_market_br);
  
  return {
    id: String(card.id),
    name: card.name,
    set: card.groupid_market_br || '',
    setName: cardSet?.name,
    imageUrl: card.artwork_url,
    type: card.card_type || '',
    cost: card.cost || 0,
    rarity: card.rarity || '',
    colors: card.colors || [],
    gameCategory: card.game_category,
    flavorText: card.card_text || '',
    url_market_us: card.url_market_us || '',
    url_market_br: card.url_market_br || '',
    subTypeName: card.subTypeName || '',
    card_number: card.card_number || '',
    card_number_market_br: card.card_number_market_br || '', // Added new field
    groupid_market_us: card.groupid_market_us,
    attribute: card.attribute || [], // Added attribute as array
    artist: '',
    legality: [],
    price: 0,
  };
};

// Load data from Supabase or localStorage
export const loadCardsAndSets = async (): Promise<{
  cards: CardDetails[];
  sets: CardSet[];
}> => {
  try {
    // Try to load from Supabase first
    const { data: setsData, error: setsError } = await supabase
      .from('card_sets')
      .select('*');
      
    if (setsError) throw setsError;
    
    if (setsData && setsData.length > 0) {
      // Transform Supabase data to match our app's format
      const formattedSets = setsData.map(convertSetFromSupabase);

      // Load all cards using pagination to overcome the 1000 row limit
      let allCards: any[] = [];
      let page = 0;
      const pageSize = 1000;
      let hasMore = true;
      
      while (hasMore) {
        const { data: cardsData, error: cardsError } = await supabase
          .from('cards')
          .select('*')
          .range(page * pageSize, (page + 1) * pageSize - 1)
          .order('id', { ascending: true });
          
        if (cardsError) throw cardsError;
        
        if (cardsData && cardsData.length > 0) {
          allCards = [...allCards, ...cardsData];
          // Check if we need to fetch more pages
          hasMore = cardsData.length === pageSize;
          page++;
        } else {
          hasMore = false;
        }
      }
      
      console.log(`Loaded ${allCards.length} cards from database`);
      
      if (allCards.length > 0) {
        // Transform Supabase data to match our app's format
        const formattedCards = allCards.map(card => convertCardFromSupabase(card, formattedSets));
        
        return { cards: formattedCards, sets: formattedSets };
      }
    }
    
    // Fall back to localStorage if no data in Supabase
    const storedCards = localStorage.getItem('cardDatabase');
    const storedSets = localStorage.getItem('cardSets');
    
    return {
      cards: storedCards ? JSON.parse(storedCards) : [],
      sets: storedSets ? JSON.parse(storedSets) : []
    };
  } catch (error) {
    console.error("Error loading data:", error);
    
    // Fall back to localStorage on error
    const storedCards = localStorage.getItem('cardDatabase');
    const storedSets = localStorage.getItem('cardSets');
    
    return {
      cards: storedCards ? JSON.parse(storedCards) : [],
      sets: storedSets ? JSON.parse(storedSets) : []
    };
  }
};
