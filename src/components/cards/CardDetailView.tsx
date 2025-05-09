import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card as CardType, AttributeType } from '@/types/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CardDetailImageZoom from '@/components/ui/card-detail-image-zoom';
import { usePriceHistory } from '@/hooks/use-price-history';
import { format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { useExchangeRate } from "@/hooks/use-exchange-rate";
import { parseHtml } from '@/utils/validation';
import { useLocation } from 'react-router-dom';

// Update the CardType interface to include the missing properties from the error messages
interface ExtendedCardType extends CardType {
  url_market_us?: string;
  url_market_br?: string;
  category?: string;
  life?: number;
  power?: number;
  card_type?: string | string[];
  attribute?: AttributeType[];
  card_text?: string;
}

interface CardDetailViewProps {
  card: ExtendedCardType | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onNextCard?: () => void;
  onPreviousCard?: () => void;
  hasNextCard?: boolean;
  hasPreviousCard?: boolean;
}

// Update the DisplayCardType to include the properties from both CardType and Supabase Row
type DisplayCardType = ExtendedCardType | Database['public']['Tables']['cards']['Row'];

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
  } else if ('groupid_market_br' in card) {
    return card.groupid_market_br || '';
  }
  return '';
};

const getCardColors = (card: DisplayCardType): string[] => {
  if ('colors' in card) {
    return Array.isArray(card.colors) ? card.colors : [];
  }
  return [];
};

// Helper function to safely get url_market_us
const getCardUrlmarket_us = (card: DisplayCardType): string | undefined => {
  if ('url_market_us' in card) {
    return card.url_market_us;
  }
  return undefined;
};

// Helper function to safely get url_market_br
const getCardUrlMarketBR = (card: DisplayCardType): string | undefined => {
  if ('url_market_br' in card) {
    return card.url_market_br;
  }
  return undefined;
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
  const { t } = useLanguage();
  const [supabaseCard, setSupabaseCard] = useState<Database['public']['Tables']['cards']['Row'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

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

  const { data: priceHistory, isLoading: isPriceLoading } = usePriceHistory(card?.id || 0);
  const { data: exchangeRateData } = useExchangeRate();
  const formatPriceData = (data: typeof priceHistory) => {
    if (!data) return [];

    const groupedData: Record<string, { date: string; BR?: number; US?: number }> = {};

    data.forEach(entry => {
      const date = format(new Date(entry.recorded_at), 'MMM dd');

      if (!groupedData[date]) {
        groupedData[date] = { date };
      }

      if (entry.price_min_market_br !== null) {
        groupedData[date].BR = entry.price_min_market_br;
      }
      if (entry.price_market_market_us !== null) {
        groupedData[date].US = parseFloat((entry.price_market_market_us * (exchangeRateData?.rate || 1)).toFixed(2));
      }
    });

    return Object.values(groupedData).sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  };

  const chartConfig = {
    BR: {
      theme: {
        light: "#dc2626",
        dark: "#ef4444",
      },
    },
    US: {
      theme: {
        light: "#2563eb",
        dark: "#3b82f6",
      },
    },
  };
  
  if (!card) return null;
  
  const displayCard = supabaseCard || card as DisplayCardType;
  
  const colors = getCardColors(displayCard);
  
  const formatAttributes = (attributes: any): string => {
    if (!attributes) return '';
    if (Array.isArray(attributes)) return attributes.join(', ');
    return String(attributes);
  };
  
  const cardImageUrl = getCardImageUrl(displayCard);

  // Get the card category safely
  const getCategory = (card: DisplayCardType): string => {
    if ('category' in card) {
      return card.category || '';
    }
    return '';
  };

  // Get card_type safely
  const getCardTypeValue = (card: DisplayCardType): string | string[] => {
    if ('card_type' in card) {
      return card.card_type || [];
    } else if ('type' in card) {
      return card.type || [];
    }
    return [];
  };

  // Get attribute safely
  const getAttribute = (card: DisplayCardType): any[] => {
    if ('attribute' in card) {
      return Array.isArray(card.attribute) ? card.attribute : [];
    }
    return [];
  };

  // Get life safely
  const getLife = (card: DisplayCardType): number => {
    if ('life' in card) {
      return card.life || 0;
    }
    return 0;
  };

  // Get power safely
  const getPower = (card: DisplayCardType): number => {
    if ('power' in card) {
      return card.power || 0;
    }
    return 0;
  };

  // Get rarity safely
  const getRarity = (card: DisplayCardType): string => {
    return card.rarity || '';
  };

  // Get cost safely
  const getCost = (card: DisplayCardType): number => {
    return card.cost || 0;
  };

  // Get card text safely
  const getCardText = (card: DisplayCardType): string => {
    let text = '';
    if ('card_text' in card) {
      text = card.card_text || '';
    } else if ('flavorText' in card) {
      text = card.flavorText || '';
    }
    return text;
  };

  const renderCardDetails = () => {
    const category = getCategory(displayCard);

    switch (category.toLowerCase()) {
      case 'leader':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-[auto,1fr] gap-x-[20px] gap-y-2">
              <div className="text-muted-foreground">Category</div>
              <div className="font-medium">{category}</div>

              <div className="text-muted-foreground">Rarity</div>
              <div className="font-medium">{getRarity(displayCard)}</div>

              <div className="text-muted-foreground">Life</div>
              <div className="font-medium">{getLife(displayCard)}</div>

              <div className="text-muted-foreground">Power</div>
              <div className="font-medium">{getPower(displayCard)}</div>

              {getAttribute(displayCard).length > 0 && (
                <>
                  <div className="text-muted-foreground">Attribute</div>
                  <div className="font-medium">{formatAttributes(getAttribute(displayCard))}</div>
                </>
              )}

              <div className="text-muted-foreground">Type</div>
              <div className="font-medium">{formatCardType(getCardTypeValue(displayCard))}</div>
            </div>
          </div>
        );

      case 'character':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-[auto,1fr] gap-x-[20px] gap-y-2">
              <div className="text-muted-foreground">Category</div>
              <div className="font-medium">{category}</div>

              <div className="text-muted-foreground">Rarity</div>
              <div className="font-medium">{getRarity(displayCard)}</div>

              <div className="text-muted-foreground">Cost</div>
              <div className="font-medium">{getCost(displayCard)}</div>

              <div className="text-muted-foreground">Power</div>
              <div className="font-medium">{getPower(displayCard)}</div>

              {getAttribute(displayCard).length > 0 && (
                <>
                  <div className="text-muted-foreground">Attribute</div>
                  <div className="font-medium">{formatAttributes(getAttribute(displayCard))}</div>
                </>
              )}

              <div className="text-muted-foreground">Type</div>
              <div className="font-medium">{formatCardType(getCardTypeValue(displayCard))}</div>
            </div>
          </div>
        );

      case 'event':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-[auto,1fr] gap-x-[20px] gap-y-2">
              <div className="text-muted-foreground">Category</div>
              <div className="font-medium">{category}</div>

              <div className="text-muted-foreground">Rarity</div>
              <div className="font-medium">{getRarity(displayCard)}</div>

              <div className="text-muted-foreground">Cost</div>
              <div className="font-medium">{getCost(displayCard)}</div>

              <div className="text-muted-foreground">Type</div>
              <div className="font-medium">{formatCardType(getCardTypeValue(displayCard))}</div>
            </div>
          </div>
        );

      case 'don!!':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-[auto,1fr] gap-x-[20px] gap-y-2">
              <div className="text-muted-foreground">Category</div>
              <div className="font-medium">{category}</div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-[auto,1fr] gap-x-[20px] gap-y-2">
              <div className="text-muted-foreground">Category</div>
              <div className="font-medium">{category}</div>

              <div className="text-muted-foreground">Type</div>
              <div className="font-medium">{formatCardType(getCardTypeValue(displayCard))}</div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full min-h-[600px]">
          <div className="p-6 flex items-center justify-center bg-gradient-to-br from-background to-muted/50 relative">
            {supabaseCard?.card_number && (
              <div className="absolute top-4 center-4 text-xl font-bold">
                {supabaseCard.card_number}
                {supabaseCard.groupid_market_br && (
                  <span className="text-xl font-bold ml-2">
                    ({supabaseCard.groupid_market_br})
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
            
            {getCardText(displayCard) && (
              <>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div 
                    className="text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: parseHtml(getCardText(displayCard)) }}
                  />
                </div>
              </>
            )}

            {(getCardUrlmarket_us(displayCard) || getCardUrlMarketBR(displayCard)) && (
              <>
                <Separator className="my-4" />
                <div className="flex gap-2">
                  {getCardUrlmarket_us(displayCard) && (
                    <a
                      href={getCardUrlmarket_us(displayCard)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Market US
                    </a>
                  )}
                  {getCardUrlMarketBR(displayCard) && (
                    <a
                      href={getCardUrlMarketBR(displayCard)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Market BR
                    </a>
                  )}
                </div>
              </>
            )}
            
            <Separator className="my-4" />
            
            <div className="flex-1 mt-2">
              <h3 className="text-sm font-medium mb-2">{t('priceHistory')}</h3>
              {isPriceLoading ? (
                <div className="h-[200px] w-full">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : priceHistory && priceHistory.length > 0 ? (
                <div className="h-[200px] w-full">
                  <ChartContainer config={chartConfig}>
                    <AreaChart data={formatPriceData(priceHistory)}>
                      <Legend 
                        verticalAlign="top"
                        align="right"
                        layout="horizontal"
                        wrapperStyle={{ top: 0, right: 20 }}
                      />
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        label={{ value: t('days'), position: 'insideBottom', offset: -5 }} 
                      />
                      <YAxis 
                        label={{ value: t('price'), angle: -90, position: 'insideLeft' }}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent 
                          formatter={(value, name) => [
                            Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                            name === 'BR' ? ' - BR' : ' - US (converted)'
                          ]}
                        />}
                      />
                      <Area
                        type="monotone"
                        dataKey="BR"
                        stroke="var(--color-BR)"
                        fill="var(--color-BR)"
                        fillOpacity={0.1}
                      />
                      <Area
                        type="monotone"
                        dataKey="US"
                        stroke="var(--color-US)"
                        fill="var(--color-US)"
                        fillOpacity={0.1}
                      />
                    </AreaChart>
                  </ChartContainer>
                </div>
              ) : (
                <div className="h-[200px] w-full flex items-center justify-center border rounded-lg bg-muted/10">
                  <p className="text-muted-foreground">No price data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardDetailView;
