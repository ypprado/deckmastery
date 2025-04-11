
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
import { GameCategory } from '@/hooks/use-decks';
import { CardSet } from '@/types/cardDatabase';
import { useCardDatabase } from '@/hooks/use-card-database';

const setFormSchema = z.object({
  name: z.string().min(2, {
    message: "Set name must be at least 2 characters.",
  }),
  releaseYear: z.coerce.number().positive({
    message: "Release year must be a positive number.",
  }),
});

type SetFormValues = z.infer<typeof setFormSchema>;

interface AdminSetFormProps {
  gameCategory: GameCategory;
}

const AdminSetForm: React.FC<AdminSetFormProps> = ({ gameCategory }) => {
  const { addSet, sets } = useCardDatabase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<SetFormValues>({
    resolver: zodResolver(setFormSchema),
    defaultValues: {
      name: "",
      releaseYear: new Date().getFullYear(),
    },
  });

  const onSubmit = async (values: SetFormValues) => {
    setIsSubmitting(true);
    try {
      const newSet: CardSet = {
        id: Date.now(), // Using timestamp as a temporary ID, will be replaced by the database
        name: values.name,
        releaseYear: values.releaseYear,
        gameCategory,
      };
      
      await addSet(newSet);
      toast.success(`Set "${values.name}" added successfully for ${gameCategory}`);
      form.reset();
    } catch (error) {
      console.error("Error adding set:", error);
      toast.error("Failed to add set. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Add New Card Set</h2>
        <p className="text-muted-foreground">Create a new card set for {gameCategory}</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Set Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Core Set 2023" {...field} />
                </FormControl>
                <FormDescription>
                  The official name of this card set
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="releaseYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Release Year</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Set"}
          </Button>
        </form>
      </Form>
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Current Sets for {gameCategory}</h3>
        {sets.filter(set => set.gameCategory === gameCategory).length === 0 ? (
          <p className="text-muted-foreground">No sets available for this game category yet</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sets
              .filter(set => set.gameCategory === gameCategory)
              .map(set => (
                <div key={set.id} className="border rounded-md p-4">
                  <h4 className="font-medium">{set.name}</h4>
                  <p className="text-sm text-muted-foreground">Released: {set.releaseYear}</p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSetForm;
