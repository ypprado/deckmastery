
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card as CardType } from '@/hooks/use-decks';
import { useLanguage } from '@/contexts/LanguageContext';
import CardImageZoom from './CardImageZoom';

interface CardGridProps {
  cards: CardType[];
  onCardClick: (card: CardType) => void;
}

const CardGrid = ({ cards, onCardClick }: CardGridProps) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <Card 
          key={card.id} 
          className="overflow-hidden card-hover relative group transition-all duration-300 cursor-pointer"
          onClick={() => onCardClick(card)}
        >
          <CardImageZoom
            src={card.imageUrl}
            alt={card.name}
            className="aspect-[3/4] overflow-hidden card-tilt"
          />
          <CardContent className="p-3">
            <h3 className="font-medium text-sm leading-tight truncate">{card.name}</h3>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-muted-foreground">{Array.isArray(card.type) ? card.type[0] : card.type}</p>
              <p className="text-xs text-muted-foreground">{t('cost')}: {card.cost}</p>
            </div>
          </CardContent>
          <Button
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default CardGrid;
