import { Card as CardType } from '@/hooks/use-decks';
import CardGridItem from './CardGridItem';

interface CardGridProps {
  cards: CardType[];
  onCardClick: (card: CardType) => void;
}

const CardGrid = ({ cards, onCardClick }: CardGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <CardGridItem key={card.id} card={card} onCardClick={onCardClick} />
      ))}
    </div>
  );
};

export default CardGrid;