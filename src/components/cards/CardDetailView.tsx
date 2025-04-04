
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

interface CardDetailViewProps {
  card: CardType | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Type for the combined card data from both sources
type DisplayCardType = CardType | Database['public']['Tables']['cards']['Row'];

// Mapping color names for display
const colorNames: Record<string, string> = {
  Red: 'Red',
  Green: 'Green',
  Blue: 'Blue',
  Purple: 'Purple',
  Black: 'Black',
  Yellow: 'Yellow',
  // Legacy mappings for backward compatibility
  white: 'White',
  blue: 'Blue',
  black: 'Black',
  red: 'Red',
  green: 'Green',
  yellow: 'Yellow',
  purple: 'Purple',
};

// Tailwind class mapping for colors
const colorMap: Record<string, string> = {
  Red: 'bg-red-100 text-red-800',
  Green: 'bg-green-100 text-green-800',
  Blue: 'bg-blue-100 text-blue-800',
  Purple: 'bg-purple-100 text-purple-800',
  Black: 'bg-gray-700 text-white',
  Yellow: 'bg-yellow-100 text-yellow-800',
  // Legacy mappings for backward compatibility
  white: 'bg-amber-100 text-amber-800',
  blue: 'bg-blue-100 text-blue-800',
  black: 'bg-gray-700 text-white',
  red: 'bg-red-100 text-red-800',
  green: 'bg-green-100 text-green-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  purple: 'bg-purple-100 text-purple-800',
};

// Dummy price history data
const generatePriceData = () => {
  const data = [];
  const startPrice = Math.random() * 20 + 5; // Start between $5 and $25
  
  for (let i = 0; i < 30; i++) {
    // Create some random fluctuation
    const dayPrice = startPrice + (Math.random() * 10 - 5) * (i / 15);
    data.push({
      day: i + 1,
      price: Math.max(0.5, parseFloat(dayPrice.toFixed(2))),
    });
  }
  
  return data;
};

// Helper function to get image URL from either card type
const getCardImageUrl = (card: DisplayCardType): string => {
  if ('imageUrl' in card) {
    return card.imageUrl;
  } else if ('artwork_url' in card) {
    let url = card.artwork_url;
    // If the URL starts with 'card-images/', it's a path in Supabase Storage
    if (url && url.startsWith('card-images/')) {
      // Convert to a public URL
      const { data } = supabase.storage.from('card-images').getPublicUrl(url);
      return data.publicUrl;
    }
    return url;
  }
  return '';
};

// Helper function to get card type from either card type
const getCardType = (card: DisplayCardType): string => {
  if ('type' in card) {
    return card.type;
  } else if ('card_type' in card) {
    return card.card_type || '';
  }
  return '';
};

// Helper function to get set from either card type
const getCardSet = (card: DisplayCardType): string => {
  if ('set' in card) {
    return card.set;
  } else if ('set_id' in card) {
    return card.set_id;
  }
  return '';
};

// Helper function to get colors from either card type
const getCardColors = (card: DisplayCardType): string[] => {
  if ('colors' in card) {
    return Array.isArray(card.colors) ? card.colors : [];
  }
  return [];
};

const CardDetailView: React.FC<CardDetailViewProps> = ({ card, isOpen, onOpenChange }) => {
  const [priceData] = useState(generatePriceData());
  const { t } = useLanguage();
  const [supabaseCard, setSupabaseCard] = useState<Database['public']['Tables']['cards']['Row'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch card details from Supabase if available
  useEffect(() => {
    const fetchCardDetails = async () => {
      if (card && card.id) {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('cards')
            .select('*')
            .eq('id', card.id)
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
  
  // Use supabase data if available, otherwise fallback to the card prop
  const displayCard = supabaseCard || card;
  
  // Ensure colors array exists
  const colors = getCardColors(displayCard);
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          {/* Left side - Card Image */}
          <div className="p-6 flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
            <div className="relative aspect-[3/4] max-h-[500px] w-auto shadow-xl rounded-lg overflow-hidden">
              <img
                src={getCardImageUrl(displayCard)}
                alt={displayCard.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Right side - Details and Price Graph */}
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
            
            {/* Card Details */}
            <div className="space-y-3 mt-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">{t('type')}</div>
                <div className="font-medium">{getCardType(displayCard)}</div>
                
                <div className="text-muted-foreground">{t('cost')}</div>
                <div className="font-medium">{displayCard.cost}</div>
                
                <div className="text-muted-foreground">{t('rarity')}</div>
                <div className="font-medium">
                  {'rarity' in displayCard ? displayCard.rarity : ''}
                </div>
                
                <div className="text-muted-foreground">{t('set')}</div>
                <div className="font-medium">{getCardSet(displayCard)}</div>
                
                {/* Show additional fields from Supabase if available */}
                {supabaseCard && (
                  <>
                    {supabaseCard.series && (
                      <>
                        <div className="text-muted-foreground">Series</div>
                        <div className="font-medium">{supabaseCard.series}</div>
                      </>
                    )}
                    
                    {supabaseCard.card_number && (
                      <>
                        <div className="text-muted-foreground">Card Number</div>
                        <div className="font-medium">{supabaseCard.card_number}</div>
                      </>
                    )}
                    
                    {supabaseCard.parallel && (
                      <>
                        <div className="text-muted-foreground">Parallel</div>
                        <div className="font-medium">{supabaseCard.parallel}</div>
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
                    
                    {supabaseCard.attribute && (
                      <>
                        <div className="text-muted-foreground">Attribute</div>
                        <div className="font-medium">{supabaseCard.attribute}</div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {/* Price History Graph */}
            <div className="flex-1 mt-2">
              <h3 className="text-sm font-medium mb-2">{t('priceHistory')}</h3>
              <div className="h-[200px] w-full">
                <ChartContainer
                  config={{
                    price: {
                      label: t('price'),
                      theme: {
                        light: "#2563eb", // blue-600
                        dark: "#3b82f6", // blue-500
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
