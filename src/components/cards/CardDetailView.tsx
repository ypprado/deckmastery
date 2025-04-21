import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card as CardType } from '@/hooks/use-decks';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          <div className="p-6 flex items-center justify-center bg-gradient-to-br from-background to-muted/50 relative">
            <div className="relative aspect-[3/4] max-h-[500px] w-auto shadow-xl rounded-lg overflow-hidden">
              <img
                src={getCardImageUrl(displayCard)}
                alt={displayCard.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="absolute inset-y-0 left-0 flex items-center -ml-12">
              {hasPreviousCard && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="opacity-80 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreviousCard?.();
                  }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              )}
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center -mr-12">
              {hasNextCard && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="opacity-80 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNextCard?.();
                  }}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex flex-col h-full p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl">{displayCard.name}</DialogTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                {colors.map((color: string) => (
                  <Badge key={color} className={colorMap[color]}>
                    {colorNames[color] || color}
                  </Badge>
                ))}
              </div>
            </DialogHeader>
            
            <div className="space-y-3 mt-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">{t('type')}</div>
                <div className="font-medium">{formatCardType(getCardType(displayCard))}</div>
                
                <div className="text-muted-foreground">{t('cost')}</div>
                <div className="font-medium">{displayCard.cost}</div>
                
                <div className="text-muted-foreground">{t('rarity')}</div>
                <div className="font-medium">
                  {'rarity' in displayCard ? displayCard.rarity : ''}
                </div>
                
                <div className="text-muted-foreground">{t('set')}</div>
                <div className="font-medium">{getCardSet(displayCard)}</div>
                
                {supabaseCard && (
                  <>
                    {supabaseCard.card_number && (
                      <>
                        <div className="text-muted-foreground">Card Number</div>
                        <div className="font-medium">{supabaseCard.card_number}</div>
                      </>
                    )}
                    
                    {supabaseCard.card_number_liga && (
                      <>
                        <div className="text-muted-foreground">Liga Card Number</div>
                        <div className="font-medium">{supabaseCard.card_number_liga}</div>
                      </>
                    )}
                    
                    {supabaseCard.attribute && supabaseCard.attribute.length > 0 && (
                      <>
                        <div className="text-muted-foreground">Attributes</div>
                        <div className="font-medium">{formatAttributes(supabaseCard.attribute)}</div>
                      </>
                    )}
                    
                    {supabaseCard.subTypeName && (
                      <>
                        <div className="text-muted-foreground">Sub Type</div>
                        <div className="font-medium">{supabaseCard.subTypeName}</div>
                      </>
                    )}
                    
                    {supabaseCard.url_tcg && (
                      <>
                        <div className="text-muted-foreground">TCG URL</div>
                        <div className="font-medium">
                          <a href={supabaseCard.url_tcg} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            View on TCG
                          </a>
                        </div>
                      </>
                    )}
                    
                    {supabaseCard.url_liga && (
                      <>
                        <div className="text-muted-foreground">Liga URL</div>
                        <div className="font-medium">
                          <a href={supabaseCard.url_liga} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            View on Liga
                          </a>
                        </div>
                      </>
                    )}
                    
                    {supabaseCard.language && (
                      <>
                        <div className="text-muted-foreground">Language</div>
                        <div className="font-medium">{supabaseCard.language}</div>
                      </>
                    )}
                    
                    {supabaseCard.category && (
                      <>
                        <div className="text-muted-foreground">Category</div>
                        <div className="font-medium">{supabaseCard.category}</div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
            
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
