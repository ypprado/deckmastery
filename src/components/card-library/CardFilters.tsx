
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardFiltersProps {
  uniqueColors: string[];
  uniqueRarities: string[];
  uniqueParallels: string[];
  activeFilters: {
    colors: string[];
    rarities: string[];
    parallels: string[];
    set: string | null;
  };
  toggleFilter: (type: 'colors' | 'rarities' | 'parallels', value: string) => void;
  clearFilters: () => void;
  isAnyFilterActive: boolean;
  colorMap: Record<string, string>;
  colorNames: Record<string, string>;
}

const CardFilters = ({
  uniqueColors,
  uniqueRarities,
  uniqueParallels,
  activeFilters,
  toggleFilter,
  clearFilters,
  isAnyFilterActive,
  colorMap,
  colorNames,
}: CardFiltersProps) => {
  return (
    <div className="rounded-md border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Filters</h3>
        {isAnyFilterActive && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
            <X className="h-3 w-3 mr-1" /> Clear All
          </Button>
        )}
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <h4 className="text-xs font-medium mb-2">Colors</h4>
          <div className="flex flex-wrap gap-1">
            {uniqueColors.map(color => (
              <Badge 
                key={color}
                variant={activeFilters.colors.includes(color) ? "default" : "outline"}
                className={cn(
                  "cursor-pointer hover:bg-muted transition-colors",
                  activeFilters.colors.includes(color) && colorMap[color]
                )}
                onClick={() => toggleFilter('colors', color)}
              >
                {colorNames[color] || color.charAt(0).toUpperCase() + color.slice(1)}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-xs font-medium mb-2">Rarities</h4>
          <div className="flex flex-wrap gap-1">
            {uniqueRarities.map(rarity => (
              <Badge 
                key={rarity}
                variant={activeFilters.rarities.includes(rarity) ? "default" : "outline"}
                className="cursor-pointer hover:bg-muted transition-colors"
                onClick={() => toggleFilter('rarities', rarity)}
              >
                {rarity}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-medium mb-2">Parallels</h4>
          <div className="flex flex-wrap gap-1">
            {uniqueParallels.map(parallel => (
              <Badge 
                key={parallel}
                variant={activeFilters.parallels.includes(parallel) ? "default" : "outline"}
                className="cursor-pointer hover:bg-muted transition-colors"
                onClick={() => toggleFilter('parallels', parallel)}
              >
                {parallel}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardFilters;
