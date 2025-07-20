import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const rateLimit = new Map<string, { count: number, timestamp: number }>();

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

    // Get the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify the JWT
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-T ype': 'application/json' },
      });
    }

    // Rate limiting
    const userIdentifier = user.id;
    const limit = 10; // 10 requests
    const window = 60000; // 60 seconds
    const now = Date.now();

    const userRequestInfo = rateLimit.get(userIdentifier);

    if (userRequestInfo && now - userRequestInfo.timestamp < window) {
      if (userRequestInfo.count >= limit) {
        return new Response(JSON.stringify({ error: 'Too many requests' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      rateLimit.set(userIdentifier, { count: userRequestInfo.count + 1, timestamp: userRequestInfo.timestamp });
    } else {
      rateLimit.set(userIdentifier, { count: 1, timestamp: now });
    }

    const bodySchema = z.object({
      endpoint: z.string().trim().min(1),
      method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]),
      statusCode: z.number().int().min(100).max(599),
      responseTime: z.number().int().min(0),
      userAgent: z.string().optional(),
    });

    const result = bodySchema.safeParse(await req.json());

    if (!result.success) {
      return new Response(JSON.stringify({ error: 'Invalid request body', issues: result.error.issues }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { endpoint, method, statusCode, responseTime, userAgent } = result.data;

    // Get client IP from headers
    const ipAddress = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown'

    // Log API usage to database
    const { error } = await supabaseClient
      .from('api_usage_logs')
      .insert({
        endpoint: endpoint,
        method: method,
        status_code: statusCode,
        response_time_ms: responseTime,
        user_id: user.id,
        ip_address: ipAddress,
        user_agent: userAgent || req.headers.get('user-agent') || 'unknown'
      })

    if (error) {
      console.error('Error logging API usage:', error.message);
      return new Response(
        JSON.stringify({ error: 'An unexpected error occurred while logging API usage.' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('API Logger Error:', error.message);
    const status = error.message.includes('body') ? 400 : 500;
    return new Response(
      JSON.stringify({ error: 'An internal server error occurred.' }),
      {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
})