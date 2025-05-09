
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card as CardType } from '@/hooks/use-decks';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface CardListProps {
  cards: CardType[];
  onCardClick: (card: CardType) => void;
  colorMap: Record<string, string>;
}

const CardList = ({ cards, onCardClick, colorMap }: CardListProps) => {
  const { t } = useLanguage();

  return (
    <div className="border rounded-md divide-y">
      {cards.map((card) => (
        <div 
          key={card.id} 
          className="p-4 flex items-center gap-4 hover:bg-muted/40 transition-colors cursor-pointer"
          onClick={() => onCardClick(card)}
        >
          <div className="h-16 w-12 shrink-0 overflow-hidden rounded-sm">
            <img
              src={card.imageUrl}
              alt={card.name}
              className="object-cover w-full h-full"
              loading="lazy"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm">{card.name}</h3>
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="text-xs text-muted-foreground">{Array.isArray(card.type) ? card.type[0] : card.type}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{card.rarity}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{t('cost')}: {card.cost}</span>
            </div>
          </div>
          <div className="flex gap-1">
            {card.colors.map(color => (
              <div
                key={color}
                className={cn(
                  "w-4 h-4 rounded-full",
                  colorMap[color]?.split(" ")[0] || "bg-gray-200"
                )}
              />
            ))}
          </div>
          <Button size="icon" className="h-8 w-8 shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default CardList;
