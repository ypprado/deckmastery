import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CardSet } from '@/types/cardDatabase';
import { GameCategoryId } from '@/hooks/use-decks';
import { supabase } from '@/integrations/supabase/client';
import { CardSetInsert, convertSetFromSupabase } from './useSupabaseCardData';

export const useCardSets = (initialSets: CardSet[] = []) => {
  const [sets, setSets] = useState<CardSet[]>(initialSets);

  useEffect(() => {
    setSets(initialSets);
  }, [initialSets]);

  const addSet = async (newSet: CardSet) => {
    const existingSet = sets.find(
      set => set.name.toLowerCase() === newSet.name.toLowerCase() && 
      set.gameCategory === newSet.gameCategory
    );
    
    if (existingSet) {
      throw new Error(`A set named "${newSet.name}" already exists for ${newSet.gameCategory}`);
    }
    
    try {
      const cardSetData: CardSetInsert = {
        id: String(newSet.id),
        name: newSet.name,
        release_year: newSet.releaseYear,
        game_category: newSet.gameCategory,
        groupid_market_us: newSet.groupid_market_us || null,
      };
      
      const { data, error } = await supabase
        .from('card_sets')
        .insert(cardSetData)
        .select()
        .single();
        
      if (error) throw error;
      
      const setWithId: CardSet = {
        ...newSet,
        id: data.id
      };
      
      setSets(prevSets => {
        const updatedSets = [...prevSets, setWithId];
        localStorage.setItem('cardSets', JSON.stringify(updatedSets));
        return updatedSets;
      });
      
      return setWithId;
    } catch (error) {
      console.error("Error adding set to Supabase:", error);
      
      setSets(prevSets => {
        const updatedSets = [...prevSets, newSet];
        localStorage.setItem('cardSets', JSON.stringify(updatedSets));
        return updatedSets;
      });
      
      toast.warning("Added set to local storage only. Database sync failed.");
      return newSet;
    }
  };

  const updateSet = async (id: string, setData: Partial<CardSet>) => {
    try {
      const updateData: Partial<CardSetInsert> = {
        name: setData.name,
        release_year: setData.releaseYear,
        game_category: setData.gameCategory,
        groupid_market_us: setData.groupid_market_us || null,
      };
      
      const { error } = await supabase
        .from('card_sets')
        .update(updateData)
        .eq('id', String(id));
        
      if (error) throw error;
      
      setSets(prevSets => {
        const setIndex = prevSets.findIndex(s => s.id === id);
        if (setIndex === -1) {
          toast.error("Set not found");
          return prevSets;
        }

        const updatedSets = [...prevSets];
        updatedSets[setIndex] = {
          ...updatedSets[setIndex],
          ...setData,
        };

        localStorage.setItem('cardSets', JSON.stringify(updatedSets));
        return updatedSets;
      });
    } catch (error) {
      console.error("Error updating set in Supabase:", error);
      
      setSets(prevSets => {
        const setIndex = prevSets.findIndex(s => s.id === id);
        if (setIndex === -1) {
          toast.error("Set not found");
          return prevSets;
        }

        const updatedSets = [...prevSets];
        updatedSets[setIndex] = {
          ...updatedSets[setIndex],
          ...setData,
        };

        localStorage.setItem('cardSets', JSON.stringify(updatedSets));
        return updatedSets;
      });
      
      toast.warning("Updated set in local storage only. Database sync failed.");
    }
  };

  const deleteSet = async (id: string) => {
    try {
      const { error } = await supabase
        .from('card_sets')
        .delete()
        .eq('id', String(id));
        
      if (error) throw error;
      
      setSets(prevSets => {
        const updatedSets = prevSets.filter(set => set.id !== id);
        localStorage.setItem('cardSets', JSON.stringify(updatedSets));
        return updatedSets;
      });
    } catch (error) {
      console.error("Error deleting set from Supabase:", error);
      
      setSets(prevSets => {
        const updatedSets = prevSets.filter(set => set.id !== id);
        localStorage.setItem('cardSets', JSON.stringify(updatedSets));
        return updatedSets;
      });
      
      toast.warning("Deleted set from local storage only. Database sync failed.");
    }
  };
  
  const getSetsByGameCategory = (gameCategory: GameCategoryId) => {
    return sets.filter(set => set.gameCategory === gameCategory);
  };
  
  const getSetById = (id: string) => {
    return sets.find(set => set.id === id);
  };

  return {
    sets,
    addSet,
    updateSet,
    deleteSet,
    getSetsByGameCategory,
    getSetById
  };
};
