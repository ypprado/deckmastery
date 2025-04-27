
import { GameCategory, GameCategoryId } from '@/hooks/use-decks';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface GameCategorySelectorProps {
  activeCategory: GameCategoryId;
  onCategoryChange: (category: GameCategoryId) => void;
  className?: string;
}

const GameCategorySelector = ({
  activeCategory,
  onCategoryChange,
  className
}: GameCategorySelectorProps) => {
  return (
    <Tabs 
      value={activeCategory} 
      className={cn("w-full", className)}
      onValueChange={(value) => onCategoryChange(value as GameCategoryId)}
    >
      <TabsList className="w-full flex">
        {gameCategories.filter(category => !category.hidden).map((category) => (
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
