
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign } from "lucide-react";

export const ExchangeRate = () => {
  const { toast } = useToast();

  const { data, isError } = useQuery({
    queryKey: ['exchangeRate'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-exchange-rate');
      if (error) {
        console.error('Error fetching exchange rate:', error);
        throw error;
      }
      console.log('Exchange rate data:', data);
      return data;
    },
    refetchInterval: 1000 * 60 * 60 * 8, // Refetch every 8 hours
    retry: 2
  });

  if (isError || !data?.rate) {
    return null;
  }

  return (
    <div className="hidden md:flex items-center text-sm text-muted-foreground">
      <DollarSign className="h-4 w-4 mr-1" />
      <span>1 USD = {Number(data.rate).toFixed(2)} BRL</span>
    </div>
  );
};
