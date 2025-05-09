import React from 'react';
import { Card } from '@/types/card';
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card as UICard, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface CardGridItemProps {
  card: Card;
  onClick?: (card: Card) => void;
}

// In the component (update the onClick handler):
const CardGridItem = ({ card, onClick }: CardGridItemProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleCardClick = () => {
    if (onClick) {
      onClick(card);
    } else {
      // If no custom onClick is provided, navigate to the card page
      navigate(`/cards/${card.id}`);
    }
  };
  
  return (
    <UICard
      onClick={handleCardClick}
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
    >
      <CardHeader>
        <CardTitle>{card.name}</CardTitle>
        <CardDescription>{card.set}</CardDescription>
      </CardHeader>
      <CardContent>
        <AspectRatio ratio={3 / 4}>
          <img
            src={card.imageUrl}
            alt={card.name}
            className="object-cover rounded-md"
          />
        </AspectRatio>
      </CardContent>
    </UICard>
  );
};

export default CardGridItem;
