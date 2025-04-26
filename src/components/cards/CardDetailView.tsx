import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card as CardType } from '@/hooks/use-decks';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CardDetailImageZoom from '@/components/ui/card-detail-image-zoom';

interface CardDetailViewProps {
  card: CardType | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onNextCard?: () => void;
  onPreviousCard?: () => void;
  hasNextCard?: boolean;
  hasPreviousCard?: boolean;
}

type DisplayCardType = CardType | Database['public']['Tables']['cards']['Row'];

const colorNames: Record<string, string> = {
  Red: 'Red',
  Green: 'Green',
  Blue: 'Blue',
  Purple: 'Purple',
  Black: 'Black',
  Yellow: 'Yellow',
  white: 'White',
  blue: 'Blue',
  black: 'Black',
  red: 'Red',
  green: 'Green',
  yellow: 'Yellow',
  purple: 'Purple',
};

const colorMap: Record<string, string> = {
  Red: 'bg-red-100 text-red-800',
  Green: 'bg-green-100 text-green-800',
  Blue: 'bg-blue-100 text-blue-800',
  Purple: 'bg-purple-100 text-purple-800',
  Black: 'bg-gray-700 text-white',
  Yellow: 'bg-yellow-100 text-yellow-800',
  white: 'bg-amber-100 text-amber-800',
  blue: 'bg-blue-100 text-blue-800',
  black: 'bg-gray-700 text-white',
  red: 'bg-red-100 text-red-800',
  green: 'bg-green-100 text-green-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  purple: 'bg-purple-100 text-purple-800',
};

const generatePriceData = () => {
  const data = [];
  const startPrice = Math.random() * 20 + 5;
  
  for (let i = 0; i < 30; i++) {
    const dayPrice = startPrice + (Math.random() * 10 - 5) * (i / 15);
    data.push({
      day: i + 1,
      price: Math.max(0.5, parseFloat(dayPrice.toFixed(2))),
    });
  }
  
  return data;
};

const getCardImageUrl = (card: DisplayCardType): string => {
  if ('imageUrl' in card) {
    return card.imageUrl;
  } else if ('artwork_url' in card) {
    let url = card.artwork_url;
    if (url && url.startsWith('card-images/')) {
      const { data } = supabase.storage.from('card-images').getPublicUrl(url);
      return data.publicUrl;
    }
    return url;
  }
  return '';
};

const getCardType = (card: DisplayCardType): string | string[] => {
  if ('type' in card) {
    return card.type;
  } else if ('card_type' in card) {
    return card.card_type || [];
  }
  return [];
};

const formatCardType = (type: string | string[]): string => {
  if (Array.isArray(type)) {
    return type.join(', ');
  }
  return type;
};

const getCardSet = (card: DisplayCardType): string => {
  if ('set' in card) {
    return card.set;
  } else if ('groupid_liga' in card) {
    return card.groupid_liga || '';
  }
  return '';
};

const getCardColors = (card: DisplayCardType): string[] => {
  if ('colors' in card) {
    return Array.isArray(card.colors) ? card.colors : [];
  }
  return [];
};

const CardDetailView: React.FC<CardDetailViewProps> = ({ 
  card, 
  isOpen, 
  onOpenChange,
  onNextCard,
  onPreviousCard,
  hasNextCard = false,
  hasPreviousCard = false
}) => {
  const [priceData] = useState(generatePriceData());
  const { t } = useLanguage();
  const [supabaseCard, setSupabaseCard] = useState<Database['public']['Tables']['cards']['Row'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (event.key === 'ArrowLeft' && hasPreviousCard && onPreviousCard) {
        onPreviousCard();
      } else if (event.key === 'ArrowRight' && hasNextCard && onNextCard) {
        onNextCard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onNextCard, onPreviousCard, hasNextCard, hasPreviousCard]);

  useEffect(() => {
    const fetchCardDetails = async () => {
      if (card && card.id) {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('cards')
            .select('*')
            .eq('id', Number(card.id))
            .maybeSingle();
            
          if (error) {
            console.error('Error fetching card details:', error);
          } else if (data) {
            setSupabaseCard(data);
          }
        } catch (error) {
          console.error('Error fetching card details:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    if (isOpen) {
      fetchCardDetails();
    }
  }, [card, isOpen]);
  
  if (!card) return null;
  
  const displayCard = supabaseCard || card;
  
  const colors = getCardColors(displayCard);
  
  const formatAttributes = (attributes: any): string => {
    if (!attributes) return '';
    if (Array.isArray(attributes)) return attributes.join(', ');
    return String(attributes);
  };
  
  const cardImageUrl = getCardImageUrl(displayCard);

  const renderCardDetails = () => {
    const category = displayCard.category || '';

    const commonDetails = (
      <>
        {displayCard.category && (
          <div className="grid grid-cols-2 gap-2">
            <div className="text-muted-foreground">Category</div>
            <div className="font-medium">{displayCard.category}</div>
          </div>
        )}
      </>
    );

    switch (category.toLowerCase()) {
      case 'leader':
        return (
          <div className="space-y-3">
            {commonDetails}
            <div className="grid grid-cols-2 gap-2">
              <div className="text-muted-foreground">Rarity</div>
              <div className="font-medium">{displayCard.rarity}</div>

              <div className="text-muted-foreground">Life</div>
              <div className="font-medium">{displayCard.life}</div>

              <div className="text-muted-foreground">Power</div>
              <div className="font-medium">{displayCard.power}</div>

              {displayCard.attribute && displayCard.attribute.length > 0 && (
                <>
                  <div className="text-muted-foreground">Attribute</div>
                  <div className="font-medium">{Array.isArray(displayCard.attribute) ? displayCard.attribute.join(', ') : displayCard.attribute}</div>
                </>
              )}

              <div className="text-muted-foreground">Type</div>
              <div className="font-medium">{Array.isArray(displayCard.card_type) ? displayCard.card_type.join(', ') : displayCard.card_type}</div>
            </div>
          </div>
        );

      case 'character':
        return (
          <div className="space-y-3">
            {commonDetails}
            <div className="grid grid-cols-2 gap-2">
              <div className="text-muted-foreground">Rarity</div>
              <div className="font-medium">{displayCard.rarity}</div>

              <div className="text-muted-foreground">Cost</div>
              <div className="font-medium">{displayCard.cost}</div>

              <div className="text-muted-foreground">Power</div>
              <div className="font-medium">{displayCard.power}</div>

              {displayCard.attribute && displayCard.attribute.length > 0 && (
                <>
                  <div className="text-muted-foreground">Attribute</div>
                  <div className="font-medium">{Array.isArray(displayCard.attribute) ? displayCard.attribute.join(', ') : displayCard.attribute}</div>
                </>
              )}

              <div className="text-muted-foreground">Type</div>
              <div className="font-medium">{Array.isArray(displayCard.card_type) ? displayCard.card_type.join(', ') : displayCard.card_type}</div>
            </div>
          </div>
        );

      case 'event':
        return (
          <div className="space-y-3">
            {commonDetails}
            <div className="grid grid-cols-2 gap-2">
              <div className="text-muted-foreground">Rarity</div>
              <div className="font-medium">{displayCard.rarity}</div>

              <div className="text-muted-foreground">Cost</div>
              <div className="font-medium">{displayCard.cost}</div>

              <div className="text-muted-foreground">Type</div>
              <div className="font-medium">{Array.isArray(displayCard.card_type) ? displayCard.card_type.join(', ') : displayCard.card_type}</div>
            </div>
          </div>
        );

      case 'don!!':
        return (
          <div className="space-y-3">
            {commonDetails}
          </div>
        );

      default:
        return (
          <div className="space-y-3">
            {commonDetails}
            <div className="grid grid-cols-2 gap-2">
              <div className="text-muted-foreground">Type</div>
              <div className="font-medium">{Array.isArray(displayCard.card_type) ? displayCard.card_type.join(', ') : displayCard.card_type}</div>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby="card-dialog-description"
        className="max-w-4xl p-0 overflow-visible"
      >
        {hasPreviousCard && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-0 -translate-x-full top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100 z-20 border border-border bg-background/70 backdrop-blur-sm shadow"
            onClick={(e) => {
              e.stopPropagation();
              onPreviousCard?.();
            }}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
      
        {hasNextCard && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-0 translate-x-full top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100 z-20 border border-border bg-background/70 backdrop-blur-sm shadow"
            onClick={(e) => {
              e.stopPropagation();
              onNextCard?.();
            }}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          <div className="p-6 flex items-center justify-center bg-gradient-to-br from-background to-muted/50 relative">
            {supabaseCard?.card_number && (
              <div className="absolute top-4 center-4 text-xl font-bold">
                {supabaseCard.card_number}
                {supabaseCard.groupid_liga && (
                  <span className="text-xl font-bold ml-2">
                    ({supabaseCard.groupid_liga})
                  </span>
                )}
              </div>
            )}
            <div className="relative aspect-[3/4] max-h-[500px] w-auto shadow-xl rounded-lg overflow-hidden">
              <CardDetailImageZoom
                src={cardImageUrl}
                alt={displayCard.name}
                className="w-full h-full"
              />
            </div>
          </div>
          
          <div className="flex flex-col h-full p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl">{displayCard.name}</DialogTitle>
              <DialogDescription id="card-dialog-description" className="sr-only">
                {t('cardDetails') ?? 'Card details dialog'}
              </DialogDescription>
              <div className="flex flex-wrap gap-2 mt-2">
                {colors.map((color: string) => (
                  <Badge key={color} className={colorMap[color]}>
                    {colorNames[color] || color}
                  </Badge>
                ))}
              </div>
            </DialogHeader>
            
            <div className="space-y-3 mt-4">
              {renderCardDetails()}
            </div>
            
            {displayCard.card_text && (
              <>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Card Text</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {displayCard.card_text}
                  </p>
                </div>
              </>
            )}

            {(displayCard.url_tcg || displayCard.url_liga) && (
              <>
                <Separator className="my-4" />
                <div className="flex gap-2">
                  {displayCard.url_tcg && (
                    <a
                      href={displayCard.url_tcg}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      TCG
                    </a>
                  )}
                  {displayCard.url_liga && (
                    <a
                      href={displayCard.url_liga}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Liga
                    </a>
                  )}
                </div>
              </>
            )}
            
            <Separator className="my-4" />
            
            <div className="flex-1 mt-2">
              <h3 className="text-sm font-medium mb-2">{t('priceHistory')}</h3>
              <div className="h-[200px] w-full">
                <ChartContainer
                  config={{
                    price: {
                      label: t('price'),
                      theme: {
                        light: "#2563eb",
                        dark: "#3b82f6",
                      },
                    },
                  }}
                >
                  <AreaChart data={priceData}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" label={{ value: t('days'), position: 'insideBottom', offset: -5 }} />
                    <YAxis 
                      domain={['dataMin - 1', 'dataMax + 1']}
                      label={{ value: t('price'), angle: -90, position: 'insideLeft' }}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent formatter={(value) => [`$${value}`, t('price')]} />}
                    />
                    <Area
                      type="monotone" 
                      dataKey="price" 
                      stroke="#3b82f6" 
                      fillOpacity={1}
                      fill="url(#priceGradient)"
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardDetailView;
