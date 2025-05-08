import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDecks, useCards, Card as CardType, GameCategory } from "@/hooks/use-decks";
import { cn } from "@/lib/utils";
import GameCategorySelector from "@/components/shared/GameCategorySelector";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import DeckForm from "@/components/deck-builder/DeckForm";
import SelectedCardsList from "@/components/deck-builder/SelectedCardsList";
import CardFilters from "@/components/deck-builder/CardFilters";
import CardGrid from "@/components/deck-builder/CardGrid";

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
      setIsEditMode(true);
      setIsLoading(true);
      
      setTimeout(() => {
        const deckData = getDeck(id);
        if (deckData) {
          setDeckName(deckData.name);
          setDeckFormat(deckData.format);
          setDeckDescription(deckData.description || "");
          setSelectedCards(deckData.cards);
          
          if (deckData.gameCategory !== activeGameCategory) {
            changeGameCategory(deckData.gameCategory);
          }
        } else {
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

    const colors = calculateDeckColors();
    const coverCard = selectedCards.length > 0 ? selectedCards[0].card : undefined;

    if (isEditMode && id) {
      updateDeck(id, {
        name: deckName,
        format: deckFormat || "Standard",
        description: deckDescription,
        cards: selectedCards,
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
          cards: selectedCards,
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

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
          <DeckForm
            deckName={deckName}
            setDeckName={setDeckName}
            deckFormat={deckFormat}
            setDeckFormat={setDeckFormat}
            deckDescription={deckDescription}
            setDeckDescription={setDeckDescription}
            onSave={handleSaveDeck}
            selectedCardsCount={selectedCards.length}
            isEditMode={isEditMode}
          />

          <SelectedCardsList
            selectedCards={selectedCards}
            onAddCard={addCard}
            onRemoveCard={removeCard}
          />
        </div>

        <div className="md:col-span-2 space-y-4">
          <CardFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeColor={activeColor}
            onColorToggle={toggleColor}
            availableColors={availableColors}
            onClearFilters={clearFilters}
            colorMap={colorMap}
            isAnyFilterActive={isAnyFilterActive}
          />

          <CardGrid
            cards={currentCards}
            selectedCards={selectedCards}
            onAddCard={addCard}
            onClearFilters={clearFilters}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default DeckBuilder;
