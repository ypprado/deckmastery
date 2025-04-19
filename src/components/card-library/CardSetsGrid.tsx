
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card as CardType } from '@/hooks/use-decks';

interface CardSetsGridProps {
  availableSets: string[];
  cards: CardType[];
  onSelectSet: (set: string) => void;
}

const CardSetsGrid = ({ availableSets, cards, onSelectSet }: CardSetsGridProps) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {availableSets.map((set) => {
        const setCoverCard = cards.find(card => card.set === set);
        const cardCount = cards.filter(card => card.set === set).length;
        
        return (
          <Card 
            key={set} 
            className="cursor-pointer hover:shadow-md transition-shadow" 
            onClick={() => onSelectSet(set)}
          >
            <div className="flex p-4 gap-4">
              {setCoverCard && (
                <div className="h-20 w-16 shrink-0 overflow-hidden rounded-sm">
                  <img
                    src={setCoverCard.imageUrl}
                    alt={set}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-medium">{set}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {cardCount} {cardCount !== 1 ? t('cards') : t('card')}
                </p>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="mt-2"
                >
                  {t('viewCards')}
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default CardSetsGrid;
