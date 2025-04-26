
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const CACHE_KEY = 'CURRENT_USD_BRL_RATE';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const client = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if we're updating via cron
    const { isUpdate } = await req.json().catch(() => ({ isUpdate: false }));

    if (isUpdate) {
      console.log('Updating exchange rate from cron job');
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      const rate = data.rates.BRL;

      // Store in KV storage
      await client.from('config').upsert({
        key: CACHE_KEY,
        value: rate,
        updated_at: new Date().toISOString()
      });

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Regular request - return cached rate
    const { data: config } = await client.from('config')
      .select('value, updated_at')
      .eq('key', CACHE_KEY)
      .single();

    return new Response(JSON.stringify({
      rate: config?.value ?? null,
      lastUpdated: config?.updated_at ?? null
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})
