import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PieChart, Pie, ResponsiveContainer, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { 
  Edit, 
  Trash2, 
  Share, 
  Download, 
  Copy, 
  ArrowLeft, 
  BarChart4,
  ListFilter,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useDecks, type Card as CardType } from "@/hooks/use-decks";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CardList = ({ 
  cards, 
  groupBy = "type" 
}: { 
  cards: { card: CardType; quantity: number }[]; 
  groupBy?: "type" | "cost" | "rarity";
}) => {
  const groupedCards = cards.reduce((acc, { card, quantity }) => {
    const key = card[groupBy];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push({ card, quantity });
    return acc;
  }, {} as Record<string, { card: CardType; quantity: number }[]>);

  const sortedGroups = Object.keys(groupedCards).sort((a, b) => {
    if (groupBy === "cost") {
      return Number(a) - Number(b);
    }
    return a.localeCompare(b);
  });

  return (
    <div className="space-y-6">
      {sortedGroups.map((group) => (
        <div key={group} className="animate-scale-up">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-medium">{group}</h3>
            <Badge variant="outline" className="text-xs">
              {groupedCards[group].reduce((acc, { quantity }) => acc + quantity, 0)}
            </Badge>
          </div>
          <div className="space-y-1">
            {groupedCards[group]
              .sort((a, b) => a.card.name.localeCompare(b.card.name))
              .map(({ card, quantity }) => (
                <div
                  key={card.id}
                  className="flex items-center py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div className="w-8 text-center font-medium text-sm text-muted-foreground">
                    {quantity}x
                  </div>
                  <div className="ml-2 flex-1">
                    <div className="text-sm">{card.name}</div>
                  </div>
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
                          'bg-gray-200'
                        )}
                      />
                    ))}
                    <div className="ml-2 text-xs text-muted-foreground">
                      {card.cost}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const DeckView = () => {
  const { id } = useParams<{ id: string }>();
  const { getDeck, deleteDeck } = useDecks();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [deck, setDeck] = useState<ReturnType<typeof getDeck>>(undefined);
  const [cardGrouping, setCardGrouping] = useState<"type" | "cost" | "rarity">("type");
  
  useEffect(() => {
    if (id) {
      const deckData = getDeck(id);
      if (deckData) {
        setDeck(deckData);
        console.log("Loaded deck:", deckData); // Debug log
      } else {
        toast({
          title: "Deck not found",
          description: "The deck you're looking for doesn't exist.",
          variant: "destructive"
        });
        navigate("/dashboard");
      }
    }
  }, [id, getDeck, navigate, toast]);

  if (!deck) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const totalCards = deck.cards.reduce((acc, { quantity }) => acc + quantity, 0);
  
  const colorCounts = deck.cards.reduce((acc, { card, quantity }) => {
    card.colors.forEach(color => {
      acc[color] = (acc[color] || 0) + quantity;
    });
    return acc;
  }, {} as Record<string, number>);

  const colorData = Object.entries(colorCounts).map(([color, count]) => ({
    name: color.charAt(0).toUpperCase() + color.slice(1),
    value: Math.round((count / totalCards) * 100)
  }));

  const typeData = deck.cards.reduce((acc, { card, quantity }) => {
    acc[card.type] = (acc[card.type] || 0) + quantity;
    return acc;
  }, {} as Record<string, number>);

  const typeChartData = Object.entries(typeData).map(([type, count]) => ({
    name: type,
    count
  }));

  const manaCurve = deck.cards.reduce((acc, { card, quantity }) => {
    acc[card.cost] = (acc[card.cost] || 0) + quantity;
    return acc;
  }, {} as Record<number, number>);

  const manaChartData = Object.entries(manaCurve)
    .map(([cost, count]) => ({
      cost: Number(cost),
      count
    }))
    .sort((a, b) => a.cost - b.cost);

  const COLORS = ['#16a34a', '#2563eb', '#000000', '#dc2626', '#f59e0b'];
  const colorMap: Record<string, string> = {
    green: COLORS[0],
    blue: COLORS[1],
    black: COLORS[2],
    red: COLORS[3],
    white: COLORS[4]
  };

  const handleDeleteDeck = () => {
    if (window.confirm("Are you sure you want to delete this deck? This action cannot be undone.")) {
      deleteDeck(deck.id);
      navigate("/");
    }
  };

  const handleEditDeck = () => {
    navigate(`/deck/${deck.id}/edit`);
  };

  const handleCopyDeck = () => {
    toast({
      title: "Deck copied",
      description: "A copy of this deck has been created."
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{deck.name}</h1>
              <Badge>{deck.format}</Badge>
            </div>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              <div className="flex items-center text-sm">
                <Clock className="h-3 w-3 mr-1" />
                <span>Updated {formatDistanceToNow(new Date(deck.updatedAt), { addSuffix: true })}</span>
              </div>
              <span>•</span>
              <span className="text-sm">{totalCards} cards</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
          <Button variant="outline" size="sm" onClick={handleEditDeck}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopyDeck}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDeleteDeck}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {deck.description && (
        <Card>
          <CardContent className="p-4 text-sm">
            {deck.description}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 animate-scale-up">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Cards</CardTitle>
              <div className="flex items-center gap-1">
                <Button 
                  variant={cardGrouping === "type" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setCardGrouping("type")}
                  className="h-8 text-xs"
                >
                  By Type
                </Button>
                <Button 
                  variant={cardGrouping === "cost" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setCardGrouping("cost")}
                  className="h-8 text-xs"
                >
                  By Cost
                </Button>
                <Button 
                  variant={cardGrouping === "rarity" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setCardGrouping("rarity")}
                  className="h-8 text-xs"
                >
                  By Rarity
                </Button>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4 overflow-auto max-h-[600px]">
            <CardList cards={deck.cards} groupBy={cardGrouping} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="animate-scale-up">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Deck Stats</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <Tabs defaultValue="colors">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="colors" className="flex-1">
                    <div className="flex items-center justify-center">
                      <BarChart4 className="h-4 w-4 mr-2" />
                      <span>Colors</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="types" className="flex-1">
                    <div className="flex items-center justify-center">
                      <ListFilter className="h-4 w-4 mr-2" />
                      <span>Types</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="colors" className="mt-0">
                  <div className="h-[200px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={colorData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {colorData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={colorMap[entry.name.toLowerCase()]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {colorData.map((entry) => (
                      <div 
                        key={entry.name}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: colorMap[entry.name.toLowerCase()] }}
                        />
                        <span>{entry.name}: {entry.value}%</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="types" className="mt-0">
                  <div className="h-[200px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={typeChartData}
                        margin={{
                          top: 5,
                          right: 5,
                          left: 5,
                          bottom: 5,
                        }}
                      >
                        <XAxis dataKey="name" scale="band" tick={{fontSize: 10}} />
                        <YAxis allowDecimals={false} tick={{fontSize: 10}} />
                        <Tooltip />
                        <Bar dataKey="count" fill="hsl(var(--primary))" barSize={30} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="animate-scale-up">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Mana Curve</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={manaChartData}
                    margin={{
                      top: 5,
                      right: 5,
                      left: 5,
                      bottom: 5,
                    }}
                  >
                    <XAxis 
                      dataKey="cost" 
                      scale="band" 
                      tick={{fontSize: 10}}
                      tickFormatter={(value) => `${value}`}
                    />
                    <YAxis allowDecimals={false} tick={{fontSize: 10}} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DeckView;
