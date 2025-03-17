
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import GameCategorySelector from '@/components/shared/GameCategorySelector';
import { useStaticData } from '@/hooks/use-static-data';
import { GameCategory } from '@/hooks/use-decks';

const StaticDataManager = () => {
  const navigate = useNavigate();
  const [activeGameCategory, setActiveGameCategory] = useState<GameCategory>('magic');
  
  const { 
    cards, 
    decks, 
    loading, 
    error, 
    fetchStaticData
  } = useStaticData();

  const handleLoadData = () => {
    fetchStaticData(activeGameCategory);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Static Data Viewer</h1>
      </div>

      <p className="text-muted-foreground">
        View the static JSON card and deck data included in the application.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Select Game Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <GameCategorySelector 
              activeCategory={activeGameCategory}
              onCategoryChange={(category) => setActiveGameCategory(category)}
            />

            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleLoadData} disabled={loading} className="flex-1">
                {loading ? (
                  <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Database className="h-4 w-4 mr-2" />
                )}
                Load Data
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="cards">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cards">Cards ({cards.length})</TabsTrigger>
          <TabsTrigger value="decks">Decks ({decks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {cards.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No cards loaded. Load data to view cards.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cards.map((card) => (
                    <div key={card.id} className="border rounded-md p-4">
                      <div className="aspect-[3/4] mb-2 overflow-hidden rounded-md">
                        <img 
                          src={card.imageUrl} 
                          alt={card.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-medium">{card.name}</h3>
                      <p className="text-sm text-muted-foreground">{card.type} • {card.rarity}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decks" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {decks.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No decks loaded. Load data to view decks.
                </p>
              ) : (
                <div className="space-y-4">
                  {decks.map((deck) => (
                    <div key={deck.id} className="border rounded-md p-4">
                      <h3 className="font-medium text-lg">{deck.name}</h3>
                      <p className="text-sm text-muted-foreground">{deck.format} • {deck.cards.length} cards</p>
                      <Separator className="my-2" />
                      <p className="text-sm">{deck.description || "No description"}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">About Static Data</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Data Organization</h3>
              <p className="text-sm text-muted-foreground">
                The static data is organized by game category with separate collections for cards and decks.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">Static File Structure</h3>
              <p className="text-sm text-muted-foreground">
                All data is stored in the project under src/utils/sampleJsonStructure.ts with the following structure:
              </p>
              <pre className="bg-muted p-2 rounded-md mt-2 text-xs overflow-auto">
{`staticCardDatabase = {
  magic: {
    cards: [...],
    decks: [...]
  },
  pokemon: {
    cards: [...],
    decks: [...]
  },
  yugioh: {
    cards: [...],
    decks: [...]
  },
  onepiece: {
    cards: [...],
    decks: [...]
  }
}`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-medium">Using the Data</h3>
              <p className="text-sm text-muted-foreground">
                To modify the static data, edit the src/utils/sampleJsonStructure.ts file directly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaticDataManager;
