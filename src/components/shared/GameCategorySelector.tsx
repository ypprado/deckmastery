
import { useState } from 'react';
import { GameCategory, gameCategories } from '@/hooks/use-decks';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface GameCategorySelectorProps {
  activeCategory: GameCategory;
  onCategoryChange: (category: GameCategory) => void;
  className?: string;
}

const GameCategorySelector = ({
  activeCategory,
  onCategoryChange,
  className
}: GameCategorySelectorProps) => {
  // Filter out hidden categories
  const visibleCategories = gameCategories.filter(category => !category.hidden);

  return (
    <Tabs 
      value={activeCategory} 
      className={cn("w-full", className)}
      onValueChange={(value) => onCategoryChange(value as GameCategory)}
    >
      <TabsList className="w-full flex">
        {visibleCategories.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id}
            className="flex-1"
          >
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default GameCategorySelector;
