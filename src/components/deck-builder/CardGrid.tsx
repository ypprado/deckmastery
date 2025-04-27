
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Plus, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card as CardType } from "@/hooks/use-decks";
import { cn } from "@/lib/utils";
import CardPagination from "@/components/card-library/CardPagination";

interface CardGridProps {
  cards: CardType[];
  selectedCards: { card: CardType; quantity: number }[];
  onAddCard: (card: CardType) => void;
  onClearFilters: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CardGrid = ({
  cards,
  selectedCards,
  onAddCard,
  onClearFilters,
  currentPage,
  totalPages,
  onPageChange
}: CardGridProps) => {
  const { t } = useLanguage();

  if (cards.length === 0) {
    return (
      <div className="col-span-full py-12 text-center">
        <Filter className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">{t('noCardsFound')}</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
          {t('tryAdjustingFilters')}
        </p>
        <Button onClick={onClearFilters} variant="outline" className="mt-4">
          {t('clearFilters')}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(card => {
          const isSelected = selectedCards.some(item => item.card.id === card.id);
          const quantity = selectedCards.find(item => item.card.id === card.id)?.quantity || 0;
          
          return (
            <Card 
              key={card.id}
              className={cn(
                "overflow-hidden card-hover transition-all duration-300 animate-scale-up",
                isSelected && "ring-2 ring-primary"
              )}
            >
              <div className="aspect-[3/4] overflow-hidden relative">
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  className="object-cover w-full h-full card-tilt"
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-white font-medium">
                    {quantity}
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm leading-tight truncate">{card.name}</h3>
                  <span className="text-xs">{card.cost}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-muted-foreground">{card.type}</p>
                  <div className="flex items-center gap-1">
                    {card.colors.map(color => (
                      <div
                        key={`${card.id}-${color}`}
                        className={cn(
                          "w-3 h-3 rounded-full",
                          color === 'white' ? 'bg-amber-100 dark:bg-amber-800' :
                          color === 'blue' ? 'bg-blue-100 dark:bg-blue-800' :
                          color === 'black' ? 'bg-gray-700 dark:bg-gray-900' :
                          color === 'red' ? 'bg-red-100 dark:bg-red-800' :
                          color === 'green' ? 'bg-green-100 dark:bg-green-800' :
                          color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-800' :
                          color === 'purple' ? 'bg-purple-100 dark:bg-purple-800' :
                          'bg-gray-200'
                        )}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-full"
                    onClick={() => onAddCard(card)}
                  >
                    {isSelected ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        {t('added')}
                      </>
                    ) : (
                      <>
                        <Plus className="h-3 w-3 mr-1" />
                        {t('add')}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {totalPages > 1 && (
        <CardPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default CardGrid;
