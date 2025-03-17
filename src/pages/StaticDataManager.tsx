
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Upload, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import GameCategorySelector from '@/components/shared/GameCategorySelector';
import { useStaticData } from '@/hooks/use-static-data';
import { GameCategory, gameCategories } from '@/hooks/use-decks';

const StaticDataManager = () => {
  const navigate = useNavigate();
  const [activeGameCategory, setActiveGameCategory] = useState<GameCategory>('magic');
  const [baseUrl, setBaseUrl] = useState('https://raw.githubusercontent.com/yourusername/card-data/main');
  
  const { 
    cards, 
    decks, 
    loading, 
    error, 
    fetchStaticData, 
    exportToJson 
  } = useStaticData({ baseUrl });

  const handleFetchData = () => {
    fetchStaticData(activeGameCategory);
  };

  const handleExportData = () => {
    exportToJson(activeGameCategory);
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
        <h1 className="text-3xl font-bold tracking-tight">Static Data Manager</h1>
      </div>

      <p className="text-muted-foreground">
        Manage your deck data using static JSON files hosted on GitHub Pages or any other hosting service.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Configure Static Data Source</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <label htmlFor="baseUrl" className="text-sm font-medium">Base URL</label>
              <Input 
                id="baseUrl"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://raw.githubusercontent.com/yourusername/card-data/main"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This should be the base URL to your JSON files. The system will fetch from [baseUrl]/[gameCategory]/cards.json
              </p>
            </div>

            <GameCategorySelector 
              activeCategory={activeGameCategory}
              onCategoryChange={(category) => setActiveGameCategory(category)}
            />

            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleFetchData} disabled={loading} className="flex-1">
                {loading ? (
                  <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Fetch Data
              </Button>
              <Button onClick={handleExportData} variant="outline" className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Export Current Data
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
                  No cards loaded. Fetch data to view cards.
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
                  No decks loaded. Fetch data to view decks.
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
          <h2 className="text-xl font-semibold mb-4">How to Use Static Data</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">1. Export your data</h3>
              <p className="text-sm text-muted-foreground">Use the "Export Current Data" button to save your cards and decks as JSON files.</p>
            </div>
            
            <div>
              <h3 className="font-medium">2. Host your JSON files</h3>
              <p className="text-sm text-muted-foreground">
                Create a GitHub repository with the following structure:
              </p>
              <pre className="bg-muted p-2 rounded-md mt-2 text-xs overflow-auto">
{`repository/
├── magic/
│   ├── cards.json
│   └── decks.json
├── pokemon/
│   ├── cards.json
│   └── decks.json
├── yugioh/
│   ├── cards.json
│   └── decks.json
└── onepiece/
    ├── cards.json
    └── decks.json`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-medium">3. Set your base URL</h3>
              <p className="text-sm text-muted-foreground">
                Use the raw GitHub URL format: https://raw.githubusercontent.com/[username]/[repo]/[branch]
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">4. Fetch and use the data</h3>
              <p className="text-sm text-muted-foreground">
                Click "Fetch Data" to load the cards and decks for the selected game category.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaticDataManager;
