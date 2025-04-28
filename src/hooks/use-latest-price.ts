import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLatestPrice = (cardId: string | number) => {
  return useQuery({
    queryKey: ["latest-price", cardId],
    queryFn: async () => {
      const numericCardId = typeof cardId === 'string' ? parseInt(cardId, 10) : cardId;
      const { data, error } = await supabase
        .from("price_history")
        .select("recorded_at, price_min_market_br, price_market_market_us")
        .eq("card_id", numericCardId)
        .order("recorded_at", { ascending: false })
        .limit(10); // fetch latest 10 entries

      if (error) throw error;
      if (!data) return null;

      // Find the most recent BR and US prices separately
      let latestBR = null;
      let latestUS = null;

      for (const entry of data) {
        if (latestBR === null && entry.price_min_market_br !== null) {
          latestBR = {
            recorded_at: entry.recorded_at,
            price_min_market_br: entry.price_min_market_br,
          };
        }
        if (latestUS === null && entry.price_market_market_us !== null) {
          latestUS = {
            recorded_at: entry.recorded_at,
            price_market_market_us: entry.price_market_market_us,
          };
        }
        if (latestBR && latestUS) break; // Stop early if both found
      }

      return {
        price_min_market_br: latestBR?.price_min_market_br ?? null,
        price_market_market_us: latestUS?.price_market_market_us ?? null,
      };
    },
  });
};