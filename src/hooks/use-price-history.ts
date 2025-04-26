
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export type PriceHistoryEntry = {
  recorded_at: string;
  price_min_liga: number | null;
  price_market_tcg: number | null;
};

export const usePriceHistory = (cardId: string | number, days: number = 30) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - days);
  const thirtyDaysAgoDateOnly = format(thirtyDaysAgo, 'yyyy-MM-dd');

  return useQuery({
    queryKey: ["price-history", cardId],
    queryFn: async () => {
      // Convert cardId to number if it's a string
      const numericCardId = typeof cardId === 'string' ? parseInt(cardId, 10) : cardId;
      const { data, error } = await supabase
        .from("price_history")
        .select("recorded_at, price_min_liga, price_market_tcg")
        .eq("card_id", numericCardId)
        .gte("recorded_at", thirtyDaysAgoDateOnly)
        .order("recorded_at", { ascending: true });

      if (error) throw error;
      console.log('Fetched price history:', data);

      return data as PriceHistoryEntry[];
    },
  });
};
