
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCardDatabase } from '@/hooks/card-database/useCardDatabase';
import CardDetailView from '@/components/cards/CardDetailView';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card as CardType } from '@/types/card';

const CardPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { cards, loading } = useCardDatabase();
  const [card, setCard] = useState<CardType | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(true);
  
  useEffect(() => {
    if (!loading && cards.length > 0 && id) {
      // Check for several ID formats: direct match, string match, and number match
      const foundCard = cards.find(c => 
        c.id === id || 
        c.id === String(id) || 
        String(c.id) === String(id)
      );
      
      console.log(`Looking for card with ID: ${id}`);
      console.log(`Found card: ${foundCard ? foundCard.name : 'Not found'}`);
      
      setCard(foundCard || null);
    }
  }, [id, cards, loading]);
  
  // Handle closing the detail view
  const handleOpenChange = (open: boolean) => {
    setIsDetailOpen(open);
    if (!open) {
      // Navigate back when closing the detail view
      navigate(-1);
    }
  };
  
  // Handle going back to the previous page
  const handleGoBack = () => {
    navigate(-1);
  };
  
  // Generate a title for the page based on the card
  useEffect(() => {
    if (card) {
      document.title = `${card.name} - ${card.set} - DeckMastery`;
    } else {
      document.title = 'Card Details - DeckMastery';
    }
    
    return () => {
      document.title = 'DeckMastery';
    };
  }, [card]);
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t('back')}
          </Button>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <Skeleton className="h-[500px] w-full" />
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!card) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t('back')}
          </Button>
        </div>
        <div className="py-12 text-center">
          <h2 className="text-2xl font-bold">{t('cardNotFound')}</h2>
          <p className="text-muted-foreground mt-2">
            {t('cardNotFoundDescription')}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handleGoBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t('back')}
        </Button>
      </div>
      
      <CardDetailView
        card={card}
        isOpen={isDetailOpen}
        onOpenChange={handleOpenChange}
        // These props are needed for navigation between cards in the detail view
        // but aren't relevant for a dedicated page, so we provide empty values
        onNextCard={() => {}}
        onPreviousCard={() => {}}
        hasNextCard={false}
        hasPreviousCard={false}
      />
    </div>
  );
};

export default CardPage;
