import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card as CardType } from '@/hooks/use-decks';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLatestPrice } from '../../hooks/use-latest-price';

interface CardGridItemProps {
  card: CardType;
  onCardClick: (card: CardType) => void;
}

const CardGridItem = ({ card, onCardClick }: CardGridItemProps) => {
  const { t } = useLanguage();
  const { data: latestPrice } = useLatestPrice(card.id);

  const formatPrice = (price: number | null | undefined, currency: string) => {
    if (typeof price !== 'number') return `${currency} --`;
    return `${currency} ${price.toFixed(2)}`;
  };

  return (
    <Card 
      key={card.id}
      className="overflow-hidden card-hover relative group transition-all duration-300 cursor-pointer"
      onClick={() => onCardClick(card)}
    >
      <img
        src={card.imageUrl}
        alt={card.name}
        className="aspect-[3/4] overflow-hidden card-tilt"
      />
      <CardContent className="p-3">
        <h3 className="font-medium text-sm leading-tight truncate">{card.name}</h3>
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-muted-foreground">
            {formatPrice(latestPrice?.price_min_market_br, 'R$')}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatPrice(latestPrice?.price_market_market_us, '$')}
          </p>
        </div>
      </CardContent>
      <Button
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </Card>
  );
};

export default CardGridItem;