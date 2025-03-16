
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import GameCategorySelector from '@/components/shared/GameCategorySelector';
import { GameCategory, gameCategories, useCards } from '@/hooks/use-decks';
import { CardDatabaseFormValues, CardSet } from '@/types/cardDatabase';
import AdminCardSetSelector from '@/components/admin/AdminCardSetSelector';
import AdminSetForm from '@/components/admin/AdminSetForm';
import AdminCardForm from '@/components/admin/AdminCardForm';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('card-sets');
  const { activeGameCategory, changeGameCategory } = useCards();
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="mb-6">
        <GameCategorySelector 
          activeCategory={activeGameCategory}
          onCategoryChange={changeGameCategory}
          className=""
        />
      </div>
      
      <Tabs defaultValue="card-sets" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="card-sets">Manage Card Sets</TabsTrigger>
          <TabsTrigger value="cards">Add Cards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="card-sets" className="mt-6">
          <AdminSetForm gameCategory={activeGameCategory} />
        </TabsContent>
        
        <TabsContent value="cards" className="mt-6">
          <AdminCardForm gameCategory={activeGameCategory} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
