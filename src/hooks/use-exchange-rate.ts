import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useExchangeRate = () => {
  return useQuery({
    queryKey: ['exchangeRate'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-exchange-rate');
      if (error) {
        console.error('Error fetching exchange rate:', error);
        throw error;
      }
      return data;
    },
    refetchInterval: 1000 * 60 * 60 * 8,
    retry: 2,
  });
};