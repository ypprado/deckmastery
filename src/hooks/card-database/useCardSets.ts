
import { useState } from 'react';
import { toast } from 'sonner';
import { CardSet } from '@/types/cardDatabase';
import { GameCategory } from '@/hooks/use-decks';
import { supabase } from '@/integrations/supabase/client';
import { CardSetInsert, convertSetFromSupabase } from './useSupabaseCardData';

export const useCardSets = (initialSets: CardSet[] = []) => {
  const [sets, setSets] = useState<CardSet[]>(initialSets);

  const addSet = async (newSet: CardSet) => {
    // Check if a set with the same name already exists for the game category
    const existingSet = sets.find(
      set => set.name.toLowerCase() === newSet.name.toLowerCase() && 
      set.gameCategory === newSet.gameCategory
    );
    
    if (existingSet) {
      throw new Error(`A set named "${newSet.name}" already exists for ${newSet.gameCategory}`);
    }
    
    try {
      // Try to add to Supabase first - prepare data for insertion
      const cardSetData: CardSetInsert = {
        id: String(newSet.id), // Convert number to string for the insert
        name: newSet.name,
        release_year: newSet.releaseYear, // Use release_year instead of release_date
        game_category: newSet.gameCategory,
        groupid_market_us: newSet.groupid_market_us || null,
      };
      
      const { data, error } = await supabase
        .from('card_sets')
        .insert(cardSetData)
        .select()
        .single();
        
      if (error) throw error;
      
      // Set ID from Supabase response
      const setWithId: CardSet = {
        ...newSet,
        id: Number(data.id) // Convert back to number for our app
      };
      
      // Update local state
      setSets(prevSets => {
        const updatedSets = [...prevSets, setWithId];
        // Save to localStorage as backup
        localStorage.setItem('cardSets', JSON.stringify(updatedSets));
        return updatedSets;
      });
      
      return setWithId;
    } catch (error) {
      console.error("Error adding set to Supabase:", error);
      
      // Fall back to localStorage only
      setSets(prevSets => {
        const updatedSets = [...prevSets, newSet];
        // Save to localStorage
        localStorage.setItem('cardSets', JSON.stringify(updatedSets));
        return updatedSets;
      });
      
      toast.warning("Added set to local storage only. Database sync failed.");
      return newSet;
    }
  };

  const updateSet = async (id: number, setData: Partial<CardSet>) => {
    try {
      // Prepare data for Supabase update
      const updateData: Partial<CardSetInsert> = {
        name: setData.name,
        release_year: setData.releaseYear, // Use release_year instead of release_date
        game_category: setData.gameCategory,
        groupid_market_us: setData.groupid_market_us || null,
      };
      
      // Try to update in Supabase first
      const { error } = await supabase
        .from('card_sets')
        .update(updateData)
        .eq('id', String(id)); // Convert number to string for comparison
        
      if (error) throw error;
      
      // Update local state
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
      
      // Fall back to localStorage only
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

  const deleteSet = async (id: number) => {
    try {
      // Try to delete from Supabase first
      const { error } = await supabase
        .from('card_sets')
        .delete()
        .eq('id', String(id)); // Convert number to string for comparison
        
      if (error) throw error;
      
      // Update local state
      setSets(prevSets => {
        const updatedSets = prevSets.filter(set => set.id !== id);
        localStorage.setItem('cardSets', JSON.stringify(updatedSets));
        return updatedSets;
      });
    } catch (error) {
      console.error("Error deleting set from Supabase:", error);
      
      // Fall back to localStorage only
      setSets(prevSets => {
        const updatedSets = prevSets.filter(set => set.id !== id);
        localStorage.setItem('cardSets', JSON.stringify(updatedSets));
        return updatedSets;
      });
      
      toast.warning("Deleted set from local storage only. Database sync failed.");
    }
  };
  
  const getSetsByGameCategory = (gameCategory: GameCategory) => {
    return sets.filter(set => set.gameCategory === gameCategory);
  };
  
  const getSetById = (id: number) => {
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
