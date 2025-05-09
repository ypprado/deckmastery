
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card as CardType } from '@/hooks/use-decks';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLatestPrice } from '../../hooks/use-latest-price';
import { useNavigate } from 'react-router-dom';

interface CardGridItemProps {
  card: CardType;
  onCardClick: (card: CardType) => void;
}

const CardGridItem = ({ card, onCardClick }: CardGridItemProps) => {
  const { t } = useLanguage();
  const { data: latestPrice } = useLatestPrice(card.id);
  const navigate = useNavigate();

  const formatPrice = (price: number | null | undefined, currency: string) => {
    if (typeof price !== 'number') return `${currency} --`;
    return `${currency} ${price.toFixed(2)}`;
  };

  // Handle card click - either navigate or open modal
  const handleCardClick = (e: React.MouseEvent) => {
    // Allow middle click or ctrl+click to open in a new tab
    if (e.ctrlKey || e.metaKey || e.button === 1) {
      return; // Let the browser handle it
    }

    e.preventDefault();
    // Use history state to track that we're coming from the card library
    navigate(`/cards/${card.id}`, { state: { from: 'cardLibrary' } });
  };

  return (
    <Card 
      key={card.id}
      className="overflow-hidden card-hover relative group transition-all duration-300 cursor-pointer"
      onClick={(e: React.MouseEvent) => handleCardClick(e)}
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
        onClick={(e) => {
          e.stopPropagation();
          onCardClick(card);
        }}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </Card>
  );
};

export default CardGridItem;
