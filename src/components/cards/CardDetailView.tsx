
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card as CardType } from '@/hooks/use-decks';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

interface CardDetailViewProps {
  card: CardType | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const colorNames: Record<string, string> = {
  white: 'White',
  blue: 'Blue',
  black: 'Black',
  red: 'Red',
  green: 'Green',
  yellow: 'Yellow',
  purple: 'Purple',
};

const colorMap: Record<string, string> = {
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

const CardDetailView: React.FC<CardDetailViewProps> = ({ card, isOpen, onOpenChange }) => {
  const [priceData] = React.useState(generatePriceData());
  const { t } = useLanguage();
  
  if (!card) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          {/* Left side - Card Image */}
          <div className="p-6 flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
            <div className="relative aspect-[3/4] max-h-[500px] w-auto shadow-xl rounded-lg overflow-hidden">
              <img
                src={card.imageUrl}
                alt={card.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Right side - Details and Price Graph */}
          <div className="flex flex-col h-full p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl">{card.name}</DialogTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                {card.colors.map(color => (
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
                <div className="font-medium">{card.type}</div>
                
                <div className="text-muted-foreground">{t('cost')}</div>
                <div className="font-medium">{card.cost}</div>
                
                <div className="text-muted-foreground">{t('rarity')}</div>
                <div className="font-medium">{card.rarity}</div>
                
                <div className="text-muted-foreground">{t('set')}</div>
                <div className="font-medium">{card.set}</div>
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
