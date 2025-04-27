
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card as CardType } from "@/hooks/use-decks";
import { cn } from "@/lib/utils";

interface SelectedCardsListProps {
  selectedCards: { card: CardType; quantity: number }[];
  onAddCard: (card: CardType) => void;
  onRemoveCard: (cardId: string) => void;
}

const SelectedCardsList = ({
  selectedCards,
  onAddCard,
  onRemoveCard
}: SelectedCardsListProps) => {
  const { t } = useLanguage();
  const totalCards = selectedCards.reduce((acc, { quantity }) => acc + quantity, 0);

  return (
    <Card className="animate-scale-up">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{t('myDeck')}</h3>
          <Badge variant="outline">{totalCards} {totalCards === 1 ? t('card') : t('cards')}</Badge>
        </div>
        
        <Separator className="my-2" />
        
        {selectedCards.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>{t('noCardsAddedYet')}</p>
            <p className="text-sm mt-1">{t('browseAddCards')}</p>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto pr-2">
            {selectedCards.sort((a, b) => a.card.name.localeCompare(b.card.name))
              .map(({ card, quantity }) => (
              <div
                key={card.id}
                className="flex items-center py-2 border-b last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <span className="font-medium mr-2 text-sm">{quantity}x</span>
                    <span className="truncate text-sm">{card.name}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-muted-foreground mr-2">{card.type}</span>
                    <div className="flex items-center gap-1">
                      {card.colors.map(color => (
                        <div
                          key={`${card.id}-${color}`}
                          className={cn(
                            "w-2 h-2 rounded-full",
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
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onAddCard(card)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onRemoveCard(card.id)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SelectedCardsList;
