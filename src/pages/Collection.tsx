
import { useLanguage } from "@/contexts/LanguageContext";
import { useDecks } from "@/hooks/use-decks";
import { useCardDatabase } from "@/hooks/card-database/useCardDatabase";
import { Card } from "@/components/ui/card";

const Collection = () => {
  const { t } = useLanguage();
  const { activeGameCategory } = useDecks();
  const { sets, cards, getSetsByGameCategory } = useCardDatabase();
  
  // Get sets for current game category
  const gameSets = getSetsByGameCategory(activeGameCategory);
  
  // Sort the sets alphabetically by their ID
  const sortedSets = [...gameSets].sort((a, b) => a.id.localeCompare(b.id));
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('collection')}</h1>
        <p className="text-muted-foreground">{t('manageCards')}</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedSets.map(set => {
          // Count total cards in set
          const totalCards = cards.filter(card => card.set === String(set.id)).length;
          
          // For now, we'll show 0 collected cards as this feature will be implemented later
          const collectedCards = 0;
          
          return (
            <Card key={set.id} className="p-6">
              <h3 className="font-semibold">
                {set.id} - {set.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {collectedCards}/{totalCards} {t('cards')}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Collection;
