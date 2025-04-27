
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const CACHE_KEY = 'CURRENT_USD_BRL_RATE';
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 30; // 30 requests per minute

interface RateLimitInfo {
  count: number;
  timestamp: number;
}

const rateLimitStore = new Map<string, RateLimitInfo>();

function isRateLimited(clientId: string): boolean {
  const now = Date.now();
  const clientInfo = rateLimitStore.get(clientId);

  if (!clientInfo) {
    rateLimitStore.set(clientId, { count: 1, timestamp: now });
    return false;
  }

  if (now - clientInfo.timestamp > RATE_LIMIT_WINDOW) {
    // Reset if window has expired
    rateLimitStore.set(clientId, { count: 1, timestamp: now });
    return false;
  }

  if (clientInfo.count >= MAX_REQUESTS) {
    return true;
  }

  // Increment counter
  clientInfo.count++;
  rateLimitStore.set(clientId, clientInfo);
  return false;
}

// Clean up old rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now - value.timestamp > RATE_LIMIT_WINDOW) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client identifier (IP or API key)
    const clientId = req.headers.get('x-client-info') || req.headers.get('x-forwarded-for') || 'unknown';

    // Check rate limit
    if (isRateLimited(clientId)) {
      return new Response(
        JSON.stringify({
          error: 'Too many requests',
          details: 'Rate limit exceeded. Please try again later.'
        }), {
          status: 429,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Retry-After': '60'
          }
        }
      );
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    console.log(`SUPABASE_URL available: ${Boolean(SUPABASE_URL)}`);
    console.log(`SERVICE_ROLE_KEY available: ${Boolean(SUPABASE_SERVICE_ROLE_KEY)}`);
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Environment variables SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY are not set");
    }

    const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check if we're updating via cron
    const { isUpdate } = await req.json().catch(() => ({ isUpdate: false }));

    if (isUpdate) {
      console.log('Updating exchange rate from cron job');
      try {
        console.log('Fetching exchange rate from external API');
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        
        if (!response.ok) {
          console.error(`Exchange API error: ${response.status} - ${await response.text()}`);
          throw new Error(`Exchange rate API error: ${response.status}`);
        }
        
        const data = await response.json();
        const rate = data.rates.BRL;
        
        console.log(`Successfully fetched rate: 1 USD = ${rate} BRL`);

        // Store in config table
        console.log('Updating config table with new rate');
        const { data: insertResult, error: insertError } = await client.from('config').upsert({
          key: CACHE_KEY,
          value: rate,
          updated_at: new Date().toISOString()
        });

        if (insertError) {
          console.error('Database insertion error:', insertError);
          throw new Error(`Failed to update database: ${insertError.message}`);
        }

        console.log('Database update successful:', insertResult);

        return new Response(JSON.stringify({ 
          success: true,
          message: 'Exchange rate updated successfully',
          rate
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      } catch (error) {
        console.error('Error updating exchange rate:', error);
        return new Response(JSON.stringify({ 
          error: 'Failed to update exchange rate',
          details: error.message || 'External API or database error'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 503,
        });
      }
    }

    // Regular request - return cached rate
    const { data: config, error: dbError } = await client.from('config')
      .select('value, updated_at')
      .eq('key', CACHE_KEY)
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(JSON.stringify({ 
        error: 'Service unavailable',
        details: 'Unable to retrieve exchange rate data'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 503,
      });
    }

    return new Response(JSON.stringify({
      rate: config?.value ?? null,
      lastUpdated: config?.updated_at ?? null
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message || 'An unexpected error occurred'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})
