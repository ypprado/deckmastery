
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

// Official parallel types enum values
const PARALLEL_TYPE_LABELS: Record<string, string> = {
  "Alternate Art": "Alternate Art",
  "Manga Art": "Manga Art",
  "Parallel Art": "Parallel Art",
  "Box Topper": "Box Topper",
  "Wanted Poster": "Wanted Poster",
  "SP": "SP",
  "TR": "TR",
  "Jolly Roger Foil": "Jolly Roger Foil",
  "Reprint": "Reprint",
  "Full Art": "Full Art",
};

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
  const { t } = useLanguage();

  // Display all parallels from PARALLEL_TYPE_LABELS if there are no uniqueParallels from the data
  // This ensures we always show the complete list of valid parallel types
  const displayParallels = uniqueParallels.length > 0 
    ? uniqueParallels.filter(p => p && typeof p === 'string' && Object.keys(PARALLEL_TYPE_LABELS).includes(p))
    : Object.keys(PARALLEL_TYPE_LABELS);

  return (
    <div className="rounded-md border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">{t('filters')}</h3>
        {isAnyFilterActive && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
            <X className="h-3 w-3 mr-1" /> {t('clearAll')}
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <h4 className="text-xs font-medium mb-2">{t('colors')}</h4>
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
          <h4 className="text-xs font-medium mb-2">{t('rarities')}</h4>
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
          <h4 className="text-xs font-medium mb-2">{t('parallels')}</h4>
          <div className="flex flex-wrap gap-1">
            {displayParallels.map(parallel => (
              <Badge
                key={parallel}
                variant={activeFilters.parallels.includes(parallel) ? "default" : "outline"}
                className="cursor-pointer hover:bg-muted transition-colors"
                onClick={() => toggleFilter('parallels', parallel)}
              >
                {PARALLEL_TYPE_LABELS[parallel] || parallel}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardFilters;
