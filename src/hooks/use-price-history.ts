
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type PriceHistoryEntry = {
  recorded_at: string;
  price_min_liga: number | null;
  price_market_tcg: number | null;
};

export const usePriceHistory = (cardId: string | number, days: number = 30) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - days);

  return useQuery({
    queryKey: ["price-history", cardId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("price_history")
        .select("recorded_at, price_min_liga, price_market_tcg")
        .eq("card_id", cardId)
        .gte("recorded_at", thirtyDaysAgo.toISOString())
        .order("recorded_at", { ascending: true });

      if (error) throw error;

      return data as PriceHistoryEntry[];
    },
  });
};
