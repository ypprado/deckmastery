
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

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Cleanup price history function triggered");
    
    // Calculate the date 2 weeks ago
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const cutoffDate = twoWeeksAgo.toISOString();
    
    console.log(`Deleting price history records older than: ${cutoffDate}`);

    // Delete records older than the cutoff date
    const { data, error, count } = await supabase
      .from('price_history')
      .delete()
      .lt('recorded_at', cutoffDate)
      .select('count');

    if (error) {
      throw new Error(`Failed to delete old price history: ${error.message}`);
    }

    console.log(`Successfully deleted ${count} old price history records`);

    return new Response(
      JSON.stringify({ 
        message: "Price history cleanup completed successfully", 
        deletedCount: count,
        cutoffDate: cutoffDate
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );

  } catch (error) {
    console.error("Error cleaning up price history:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
