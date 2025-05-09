
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CACHE_KEY = 'CURRENT_USD_BRL_RATE';

export const useExchangeRate = () => {
  return useQuery({
    queryKey: ['exchangeRate'],
    queryFn: async () => {
      // Query the exchange_rate table directly instead of invoking the edge function
      const { data, error } = await supabase
        .from('exchange_rate')
        .select('value, updated_at')
        .eq('key', CACHE_KEY)
        .single();
      
      if (error) {
        console.error('Error fetching exchange rate:', error);
        throw error;
      }
      
      return {
        rate: data?.value ?? null,
        lastUpdated: data?.updated_at ?? null
      };
    },
    refetchInterval: 1000 * 60 * 60 * 8, // Refetch every 8 hours
    retry: 2,
  });
};
