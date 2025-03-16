import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { GameCategory } from '@/hooks/use-decks';
import { CardDetails, CardDatabaseFormValues } from '@/types/cardDatabase';
import { useCardDatabase } from '@/hooks/use-card-database';
import AdminCardSetSelector from './AdminCardSetSelector';

const cardFormSchema = z.object({
  setId: z.string().min(1, { message: "Please select a set" }),
  name: z.string().min(2, { message: "Card name must be at least 2 characters" }),
  type: z.string().min(1, { message: "Card type is required" }),
  cost: z.coerce.number().int().min(0),
  rarity: z.string().min(1, { message: "Rarity is required" }),
  imageUrl: z.string().url({ message: "Please enter a valid image URL" }),
  flavorText: z.string().optional(),
  artist: z.string().optional(),
  legality: z.string().optional(),
  price: z.coerce.number().min(0).optional(),
  colors: z.array(z.string()).optional(),
});

interface ColorOption {
  id: string;
  label: string;
}

const getColorOptions = (gameCategory: GameCategory): ColorOption[] => {
  switch (gameCategory) {
    case 'magic':
      return [
        { id: 'white', label: 'White' },
        { id: 'blue', label: 'Blue' },
        { id: 'black', label: 'Black' },
        { id: 'red', label: 'Red' },
        { id: 'green', label: 'Green' },
        { id: 'colorless', label: 'Colorless' },
      ];
    case 'pokemon':
      return [
        { id: 'grass', label: 'Grass' },
        { id: 'fire', label: 'Fire' },
        { id: 'water', label: 'Water' },
        { id: 'lightning', label: 'Lightning' },
        { id: 'psychic', label: 'Psychic' },
        { id: 'fighting', label: 'Fighting' },
        { id: 'darkness', label: 'Darkness' },
        { id: 'metal', label: 'Metal' },
        { id: 'fairy', label: 'Fairy' },
        { id: 'dragon', label: 'Dragon' },
        { id: 'colorless', label: 'Colorless' },
      ];
    case 'yugioh':
      return [
        { id: 'dark', label: 'Dark' },
        { id: 'light', label: 'Light' },
        { id: 'earth', label: 'Earth' },
        { id: 'water', label: 'Water' },
        { id: 'fire', label: 'Fire' },
        { id: 'wind', label: 'Wind' },
        { id: 'divine', label: 'Divine' },
      ];
    case 'onepiece':
      return [
        { id: 'red', label: 'Red' },
        { id: 'blue', label: 'Blue' },
        { id: 'green', label: 'Green' },
        { id: 'purple', label: 'Purple' },
        { id: 'yellow', label: 'Yellow' },
        { id: 'black', label: 'Black' },
      ];
    default:
      return [];
  }
};

type CardFormValues = z.infer<typeof cardFormSchema>;

interface AdminCardFormProps {
  gameCategory: GameCategory;
}

const AdminCardForm: React.FC<AdminCardFormProps> = ({ gameCategory }) => {
  const { addCard, sets, getSetById } = useCardDatabase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const colorOptions = getColorOptions(gameCategory);
  
  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      setId: "",
      name: "",
      type: "",
      cost: 0,
      rarity: "",
      imageUrl: "",
      flavorText: "",
      artist: "",
      legality: "",
      price: 0,
      colors: [],
    },
  });

  const onSubmit = async (values: CardFormValues) => {
    setIsSubmitting(true);
    try {
      const set = getSetById(values.setId);
      if (!set) {
        toast.error("Selected set not found.");
        return;
      }
      
      const newCard: CardDetails = {
        id: `card_${Date.now()}`,
        name: values.name,
        set: values.setId,
        setName: set.name,
        imageUrl: values.imageUrl,
        type: values.type,
        cost: values.cost,
        rarity: values.rarity,
        colors: values.colors || [],
        gameCategory,
        flavorText: values.flavorText,
        artist: values.artist,
        legality: values.legality ? [values.legality] : undefined,
        price: values.price,
      };
      
      await addCard(newCard);
      toast.success(`Card "${values.name}" added successfully to ${set.name}`);
      form.reset();
    } catch (error) {
      console.error("Error adding card:", error);
      toast.error("Failed to add card. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Add New Card</h2>
        <p className="text-muted-foreground">Add a new card to the {gameCategory} database</p>
      </div>
      
      {sets.filter(set => set.gameCategory === gameCategory).length === 0 ? (
        <div className="p-4 border rounded-md bg-muted">
          <p>You need to create at least one card set before adding cards.</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => {
              const element = document.querySelector('[data-value="card-sets"]');
              if (element instanceof HTMLElement) {
                element.click();
              }
            }}
          >
            Go to Card Sets
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="setId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Set</FormLabel>
                  <FormControl>
                    <AdminCardSetSelector 
                      sets={sets}
                      value={field.value}
                      onChange={field.onChange}
                      gameCategory={gameCategory}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Dragon Guardian" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Creature, Spell, Monster" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost/Level</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rarity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rarity</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Common, Rare, Mythic" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (USD)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="colors"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Colors</FormLabel>
                    <FormDescription>
                      Select the colors associated with this card
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {colorOptions.map((option) => (
                      <FormField
                        key={option.id}
                        control={form.control}
                        name="colors"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={option.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.id)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentValues, option.id]);
                                    } else {
                                      field.onChange(
                                        currentValues.filter((value) => value !== option.id)
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/card-image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="flavorText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Flavor Text</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="The flavor text that appears on the card..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="artist"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Artist</FormLabel>
                    <FormControl>
                      <Input placeholder="Card artist name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="legality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Legality</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Standard, Modern, Limited" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Card"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default AdminCardForm;
