
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Create a Supabase client using environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Interface definitions
interface PriceData {
  productId: number;
  lowPrice: number | null;
  midPrice: number | null;
  highPrice: number | null;
  marketPrice: number | null;
  // Add other possible fields that might be in the JSON response
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Update prices function triggered");

    // STEP 1: Check if update is needed
    const lastUpdatedResponse = await fetch('https://tcgcsv.com/last-updated.txt');
    if (!lastUpdatedResponse.ok) {
      throw new Error(`Failed to fetch last updated date: ${lastUpdatedResponse.statusText}`);
    }
    
    const externalLastUpdate = (await lastUpdatedResponse.text()).trim();
    console.log(`External last update: ${externalLastUpdate}`);

    // Get the last update from our database
    const { data: lastUpdateData, error: lastUpdateError } = await supabase
      .from('price_update_log')
      .select('last_update')
      .eq('id', 1)
      .single();

    if (lastUpdateError) {
      console.error("Error fetching last update date from database:", lastUpdateError);
      throw new Error(`Failed to fetch last update from database: ${lastUpdateError.message}`);
    }

    const dbLastUpdate = lastUpdateData?.last_update;
    console.log(`Database last update: ${dbLastUpdate}`);

    // Check if update is needed
    if (dbLastUpdate === externalLastUpdate) {
      console.log("No update needed, skipping...");
      return new Response(JSON.stringify({ message: "No update needed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      });
    }

    // STEP 2: Fetch the pricing JSONs
    // Define the card sets URLs to fetch
    // This is a placeholder - later you might want to store these URLs in the database
    // or fetch them dynamically from another endpoint
    const setUrls = [
      'https://tcgcsv.com/tcgplayer/68/3189/prices',
      // Add more URLs as needed
    ];

    // Fetch all price data
    const allPriceData: PriceData[] = [];

    for (const url of setUrls) {
      console.log(`Fetching prices from: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`Failed to fetch prices from ${url}: ${response.statusText}`);
        continue; // Skip this URL if we can't fetch it and try the next one
      }
      
      const jsonResponse = await response.json();

      if (Array.isArray(jsonResponse?.results)) {
        allPriceData.push(...jsonResponse.results);
      } else {
        console.warn(`No results array found for URL: ${url}`);
      }
    }

    console.log(`Fetched prices for ${allPriceData.length} cards`);

    // STEP 2.5: Filter out prices for cards that don't exist
    const productIds = Array.from(new Set(allPriceData.map(p => p.productId)));
    const { data: existingCards, error: fetchCardsError } = await supabase
      .from('cards')
      .select('id')
      .in('id', productIds);
    if (fetchCardsError) {
      throw new Error(`Failed to fetch existing cards: ${fetchCardsError.message}`);
    }
    const existingIds = new Set(existingCards.map(c => c.id));
    const filteredPriceData = allPriceData.filter(p => existingIds.has(p.productId));
    console.log(`Filtered price data: ${filteredPriceData.length} valid cards`);

    if (filteredPriceData.length === 0) {
      throw new Error('No valid price data: no matching cards found');
    }

    // STEP 3: Insert new prices into the database
    const currentTimestamp = new Date().toISOString();
    const priceHistoryInserts = filteredPriceData.map(price => ({
      card_id: price.productId,
      price_min_market_us: price.lowPrice,
      price_avg_market_us: price.midPrice,
      price_max_market_us: price.highPrice,
      price_market_market_us: price.marketPrice,
      recorded_at: currentTimestamp,
      source: 'tcg' // Assuming the source is 'tcg'
    }));

    // Insert in batches to avoid hitting request size limits
    const batchSize = 100;
    for (let i = 0; i < priceHistoryInserts.length; i += batchSize) {
      const batch = priceHistoryInserts.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from('price_history')
        .insert(batch);
      
      if (insertError) {
        console.error(`Error inserting batch ${i/batchSize + 1}:`, insertError);
        throw new Error(`Failed to insert price history batch: ${insertError.message}`);
      }
      
      console.log(`Inserted batch ${i/batchSize + 1} of ${Math.ceil(priceHistoryInserts.length/batchSize)}`);
    }

    // STEP 4: Update the last update timestamp in the database
    const { error: updateError } = await supabase
      .from('price_update_log')
      .update({ last_update: externalLastUpdate })
      .eq('id', 1);

    if (updateError) {
      console.error("Error updating last update timestamp:", updateError);
      throw new Error(`Failed to update last update timestamp: ${updateError.message}`);
    }

    console.log("Price update completed successfully");
    return new Response(
      JSON.stringify({ 
        message: "Price update completed successfully", 
        updated: priceHistoryInserts.length 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );

  } catch (error) {
    console.error("Error updating prices:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
