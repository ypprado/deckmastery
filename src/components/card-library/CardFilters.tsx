
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, X, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

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

const CATEGORY_TYPES = [
  "Leader", "Character", "Event", "Stage", "DON!!"
];
const ATTRIBUTE_TYPES = [
  "Slash", "Strike", "Special", "Wisdom", "Ranged"
];

interface CardFiltersProps {
  uniqueColors: string[];
  uniqueRarities: string[];
  uniqueParallels: string[];
  activeFilters: {
    colors: string[];
    rarities: string[];
    parallels: string[];
    set: string | null;
    // ADVANCED
    category?: string | null;
    cost?: string | null;
    power?: string | null;
    life?: string | null;
    counter?: string | null;
    attribute?: string | null;
  };
  toggleFilter: (type: 'colors' | 'rarities' | 'parallels', value: string) => void;
  clearFilters: () => void;
  isAnyFilterActive: boolean;
  colorMap: Record<string, string>;
  colorNames: Record<string, string>;
  // Advanced filter props
  onAdvancedChange?: (type: string, value: string | null) => void;
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
  onAdvancedChange,
}: CardFiltersProps) => {
  const { t } = useLanguage();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const displayParallels = uniqueParallels.length > 0 
    ? uniqueParallels.filter(p => p && typeof p === 'string' && Object.keys(PARALLEL_TYPE_LABELS).includes(p))
    : Object.keys(PARALLEL_TYPE_LABELS);

  // UI for Advanced filter field
  const advancedInput = (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-2 mt-4">
      {/* Category Dropdown */}
      <div className="space-y-1">
        <label className="block text-xs font-medium">{t('category')}</label>
        <select
          className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-700 text-xs"
          value={activeFilters.category ?? ""}
          onChange={e => onAdvancedChange && onAdvancedChange("category", e.target.value || null)}
        >
          <option value="">{t('all')}</option>
          {CATEGORY_TYPES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      {/* Cost */}
      <div className="space-y-1">
        <label className="block text-xs font-medium">{t('cost')}</label>
        <input
          type="number"
          className="w-full border rounded px-2 py-1 text-xs bg-gray-50 dark:bg-gray-700"
          value={activeFilters.cost ?? ""}
          onChange={e => onAdvancedChange && onAdvancedChange('cost', e.target.value || null)}
          placeholder={t('any')}
          min={0}
        />
      </div>
      {/* Power */}
      <div className="space-y-1">
        <label className="block text-xs font-medium">{t('power')}</label>
        <input
          type="number"
          className="w-full border rounded px-2 py-1 text-xs bg-gray-50 dark:bg-gray-700"
          value={activeFilters.power ?? ""}
          onChange={e => onAdvancedChange && onAdvancedChange('power', e.target.value || null)}
          placeholder={t('any')}
          min={0}
        />
      </div>
      {/* Life */}
      <div className="space-y-1">
        <label className="block text-xs font-medium">{t('life')}</label>
        <input
          type="number"
          className="w-full border rounded px-2 py-1 text-xs bg-gray-50 dark:bg-gray-700"
          value={activeFilters.life ?? ""}
          onChange={e => onAdvancedChange && onAdvancedChange('life', e.target.value || null)}
          placeholder={t('any')}
          min={0}
        />
      </div>
      {/* Counter */}
      <div className="space-y-1">
        <label className="block text-xs font-medium">{t('counter')}</label>
        <input
          type="number"
          className="w-full border rounded px-2 py-1 text-xs bg-gray-50 dark:bg-gray-700"
          value={activeFilters.counter ?? ""}
          onChange={e => onAdvancedChange && onAdvancedChange('counter', e.target.value || null)}
          placeholder={t('any')}
          min={0}
        />
      </div>
      {/* Attribute Dropdown */}
      <div className="space-y-1">
        <label className="block text-xs font-medium">{t('attribute')}</label>
        <select
          className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-700 text-xs"
          value={activeFilters.attribute ?? ""}
          onChange={e => onAdvancedChange && onAdvancedChange("attribute", e.target.value || null)}
        >
          <option value="">{t('all')}</option>
          {ATTRIBUTE_TYPES.map(attr => (
            <option key={attr} value={attr}>{attr}</option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div className="rounded-md border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium flex items-center">
          {t('filters')}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(val => !val)}
            className={cn("ml-2 text-xs px-2 py-1 gap-1", showAdvanced && 'bg-primary/10')}
          >
            <Filter size={16} /> {t('advancedFilters')}
            <ChevronDown className={cn("w-3 h-3 transition-transform", showAdvanced ? "rotate-180" : "")} />
          </Button>
        </h3>
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
      {showAdvanced && advancedInput}
    </div>
  );
};

export default CardFilters;
