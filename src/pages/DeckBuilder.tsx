import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Save, 
  Search, 
  Plus, 
  Minus, 
  X, 
  ArrowLeft,
  Filter,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useDecks, useCards, Card as CardType, GameCategory, gameCategories } from "@/hooks/use-decks";
import { cn } from "@/lib/utils";
import GameCategorySelector from "@/components/shared/GameCategorySelector";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import CardPagination from "@/components/card-library/CardPagination";

const DeckBuilder = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { saveDeck, updateDeck, getDeck, activeGameCategory, changeGameCategory } = useDecks();
  const { cards: allCards, searchCards, activeGameCategory: cardGameCategory, changeGameCategory: changeCardCategory } = useCards();
  const { t } = useLanguage();
  
  const [deckName, setDeckName] = useState("");
  const [deckFormat, setDeckFormat] = useState("Standard");
  const [deckDescription, setDeckDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCards, setSelectedCards] = useState<{ card: CardType; quantity: number }[]>([]);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 20;

  useEffect(() => {
    if (id) {
      console.log("Edit mode detected. Loading deck with ID:", id);
      setIsEditMode(true);
      setIsLoading(true);
      
      setTimeout(() => {
        const deckData = getDeck(id);
        console.log("Retrieved deck data for editing:", deckData);
        
        if (deckData) {
          setDeckName(deckData.name);
          setDeckFormat(deckData.format);
          setDeckDescription(deckData.description || "");
          setSelectedCards(deckData.cards);
          
          if (deckData.gameCategory !== activeGameCategory) {
            changeGameCategory(deckData.gameCategory);
          }
        } else {
          console.error(`Deck with ID ${id} not found for editing`);
          toast.error(t('deckNameRequired'));
          navigate("/dashboard");
        }
        setIsLoading(false);
      }, 500);
    } else {
      setIsEditMode(false);
      setIsLoading(false);
    }
  }, [id, getDeck, navigate, activeGameCategory, changeGameCategory, t]);

  if (activeGameCategory !== cardGameCategory) {
    changeCardCategory(activeGameCategory);
  }

  const filteredCards = searchQuery
    ? searchCards(searchQuery)
    : allCards.filter(card => {
        if (activeColor && !card.colors.includes(activeColor)) return false;
        return card.gameCategory === activeGameCategory;
      });

  // Calculate pagination
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
  
  const availableColors = Array.from(new Set(
    allCards
      .filter(card => card.gameCategory === activeGameCategory)
      .flatMap(card => card.colors)
  ));

  const colorMap: Record<string, string> = {
    white: 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
    black: 'bg-gray-700 text-white dark:bg-gray-900 dark:text-gray-100',
    red: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
    green: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100',
  };

  const toggleColor = (color: string) => {
    setActiveColor(activeColor === color ? null : color);
  };

  const addCard = (card: CardType) => {
    setSelectedCards(prev => {
      const existingCard = prev.find(item => item.card.id === card.id);
      if (existingCard) {
        return prev.map(item => 
          item.card.id === card.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { card, quantity: 1 }];
    });
  };

  const removeCard = (cardId: string) => {
    setSelectedCards(prev => {
      const existingCard = prev.find(item => item.card.id === cardId);
      if (existingCard && existingCard.quantity > 1) {
        return prev.map(item => 
          item.card.id === cardId 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        );
      }
      return prev.filter(item => item.card.id !== cardId);
    });
  };

  const calculateDeckColors = () => {
    const colors = new Set<string>();
    selectedCards.forEach(({ card }) => {
      card.colors.forEach(color => colors.add(color));
    });
    return Array.from(colors);
  };

  const handleSaveDeck = async () => {
    if (!deckName) {
      toast.error(t('deckNameRequired'));
      return;
    }

    if (selectedCards.length === 0) {
      toast.error(t('deckNeedsCards'));
      return;
    }

    const deckCards = selectedCards.map(item => ({
      card: item.card,
      quantity: item.quantity
    }));

    const colors = calculateDeckColors();
    const coverCard = selectedCards.length > 0 ? selectedCards[0].card : undefined;

    if (isEditMode && id) {
      updateDeck(id, {
        name: deckName,
        format: deckFormat || "Standard",
        description: deckDescription,
        cards: deckCards,
        colors,
        coverCard,
        gameCategory: activeGameCategory
      });
      
      toast.success(t('deckUpdated'));
      navigate(`/deck/${id}`);
    } else {
      try {
        const newDeck = await saveDeck({
          name: deckName,
          format: deckFormat || "Standard",
          description: deckDescription,
          cards: deckCards,
          colors,
          coverCard,
          gameCategory: activeGameCategory
        });

        if (newDeck && newDeck.id) {
          toast.success(t('deckCreated'));
          navigate(`/deck/${newDeck.id}`);
        }
      } catch (error) {
        console.error("Error saving deck:", error);
        toast.error(t('errorSavingDeck'));
      }
    }
  };

  const clearFilters = () => {
    setActiveColor(null);
    setSearchQuery("");
  };

  const isAnyFilterActive = activeColor !== null || searchQuery.length > 0;

  const totalCards = selectedCards.reduce((acc, { quantity }) => acc + quantity, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const getFormatLabel = (format: string) => {
    switch (format) {
      case 'Standard': return t('standard');
      case 'Modern': return t('modern');
      case 'Commander': return t('commander');
      case 'Legacy': return t('legacy');
      case 'Vintage': return t('vintage');
      case 'Casual': return t('casual');
      default: return format;
    }
  };

  const getTypeKey = (card: CardType, type: string | string[]): React.Key => {
    if (typeof type === 'string') {
      return `${card.id}-${type}`;
    } else if (Array.isArray(type)) {
      return `${card.id}-${type.join('-')}`;
    }
    return card.id;
  };

  const displayCardType = (type: string | string[]): string => {
    if (typeof type === 'string') {
      return type;
    } else if (Array.isArray(type)) {
      return type.join(', ');
    }
    return '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditMode ? t('editDeck') : t('createNewDeck')}
        </h1>
      </div>

      <GameCategorySelector 
        activeCategory={activeGameCategory}
        onCategoryChange={changeGameCategory}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card className="animate-scale-up">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deck-name">{t('deckName')}</Label>
                <Input
                  id="deck-name"
                  placeholder={t('enterDeckName')}
                  value={deckName}
                  onChange={(e) => setDeckName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deck-format">{t('format')}</Label>
                <Select value={deckFormat} onValueChange={setDeckFormat}>
                  <SelectTrigger id="deck-format">
                    <SelectValue placeholder={t('selectFormat')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">{t('standard')}</SelectItem>
                    <SelectItem value="Modern">{t('modern')}</SelectItem>
                    <SelectItem value="Commander">{t('commander')}</SelectItem>
                    <SelectItem value="Legacy">{t('legacy')}</SelectItem>
                    <SelectItem value="Vintage">{t('vintage')}</SelectItem>
                    <SelectItem value="Casual">{t('casual')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deck-description">{t('description')}</Label>
                <Textarea
                  id="deck-description"
                  placeholder={t('describeStrategy')}
                  rows={4}
                  value={deckDescription}
                  onChange={(e) => setDeckDescription(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <Button 
                  className="w-full"
                  onClick={handleSaveDeck}
                  disabled={deckName === "" || selectedCards.length === 0}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? t('updateDeck') : t('saveDeck')}
                </Button>
              </div>
            </CardContent>
          </Card>

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
                          onClick={() => addCard(card)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => removeCard(card.id)}
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
        </div>

        <div className="md:col-span-2 space-y-4">
          <Card className="animate-scale-up">
            <CardContent className="p-4 space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={t('searchCards')}
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {isAnyFilterActive && (
                  <Button variant="ghost" onClick={clearFilters} className="shrink-0">
                    <X className="h-4 w-4 mr-2" />
                    {t('clearAll')}
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">{t('colors')}</Label>
                </div>
                <div className="flex flex-wrap gap-1">
                  {availableColors.map(color => (
                    <Badge
                      key={color}
                      variant={activeColor === color ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer hover:bg-muted transition-colors",
                        activeColor === color && colorMap[color]
                      )}
                      onClick={() => toggleColor(color)}
                    >
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentCards.length === 0 ? (
              <div className="col-span-full py-12 text-center">
                <Filter className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">{t('noCardsFound')}</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                  {t('tryAdjustingFilters')}
                </p>
                <Button onClick={clearFilters} variant="outline" className="mt-4">
                  {t('clearFilters')}
                </Button>
              </div>
            ) : (
              currentCards.map(card => {
                const isSelected = selectedCards.some(item => item.card.id === card.id);
                const quantity = selectedCards.find(item => item.card.id === card.id)?.quantity || 0;
                
                return (
                  <Card 
                    key={getTypeKey(card, card.type)} 
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
                          onClick={() => addCard(card)}
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
              })
            )}
          </div>

          {totalPages > 1 && (
            <CardPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DeckBuilder;
