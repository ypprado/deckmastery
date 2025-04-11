
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardSet } from '@/types/cardDatabase';
import { GameCategory } from '@/hooks/use-decks';

interface AdminCardSetSelectorProps {
  sets: CardSet[];
  value: string;
  onChange: (value: string) => void;
  gameCategory: GameCategory;
}

const AdminCardSetSelector: React.FC<AdminCardSetSelectorProps> = ({
  sets,
  value,
  onChange,
  gameCategory
}) => {
  // Filter sets by game category
  const filteredSets = sets.filter(set => set.gameCategory === gameCategory);
  
  return (
    <Select
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a card set" />
      </SelectTrigger>
      <SelectContent>
        {filteredSets.length === 0 ? (
          <SelectItem value="no-sets" disabled>
            No sets available for {gameCategory}
          </SelectItem>
        ) : (
          filteredSets.map((set) => (
            <SelectItem key={set.id} value={String(set.id)}>
              {set.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};

export default AdminCardSetSelector;
