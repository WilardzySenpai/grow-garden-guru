import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { endpoint, method, statusCode, responseTime, userId, userAgent } = await req.json()

    // Get client IP from headers
    const ipAddress = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown'

    // Log API usage to database
    const { error } = await supabaseClient
      .from('api_usage_logs')
      .insert({
        endpoint: endpoint || 'unknown',
        method: method || 'GET',
        status_code: statusCode || 200,
        response_time_ms: responseTime || 0,
        user_id: userId || null,
        ip_address: ipAddress,
        user_agent: userAgent || req.headers.get('user-agent') || 'unknown'
      })

    if (error) {
      console.error('Error logging API usage:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to log API usage' }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('API Logger Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})