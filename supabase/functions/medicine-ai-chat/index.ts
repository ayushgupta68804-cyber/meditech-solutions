import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('Missing or invalid authorization header');
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client and verify the JWT token
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify the token and get user claims
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);

    if (claimsError || !claimsData?.claims) {
      console.log('Invalid authentication token:', claimsError?.message);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log('Authenticated user:', userId);

    // Parse and validate request body
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate message structure
    for (const msg of messages) {
      if (!msg.role || !msg.content || typeof msg.content !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Invalid message format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      // Limit message content length
      if (msg.content.length > 5000) {
        return new Response(
          JSON.stringify({ error: 'Message content too long' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Limit number of messages in conversation
    if (messages.length > 50) {
      return new Response(
        JSON.stringify({ error: 'Too many messages in conversation' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Sending request to AI gateway with messages:', messages.length, 'for user:', userId);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are MediBot, an expert AI health assistant for MediTeck pharmacy. Your role is to provide helpful information about medicines AND recommend suitable exercises for health conditions.

When a user asks about a medicine, provide:
1. **Generic Name & Brand Names** - What the medicine is called
2. **Uses** - What conditions it treats
3. **Dosage** - Typical dosage instructions (when to take, how often)
4. **Side Effects** - Common side effects to be aware of
5. **Precautions** - Important warnings and drug interactions
6. **Storage** - How to store the medicine properly

When a user mentions a health issue or asks for exercises, provide:
1. **Recommended Exercises** - Specific exercises that help with their condition
2. **How to Do It** - Step-by-step instructions for each exercise
3. **Duration & Frequency** - How long and how often to do each exercise
4. **Benefits** - How these exercises help with their condition
5. **Precautions** - When to avoid or modify exercises
6. **Yoga/Stretching** - Relevant yoga poses or stretches if applicable

Common health conditions and exercise recommendations:
- **Back Pain**: Cat-cow stretch, bird-dog, pelvic tilts, walking
- **Diabetes**: Walking, cycling, swimming, strength training
- **Hypertension/BP**: Brisk walking, cycling, swimming, yoga breathing
- **Joint Pain/Arthritis**: Water aerobics, gentle stretching, tai chi
- **Stress/Anxiety**: Deep breathing, yoga, walking, meditation
- **Obesity/Weight Loss**: Cardio exercises, strength training, HIIT
- **Heart Health**: Moderate cardio, walking, swimming
- **Migraine**: Neck stretches, relaxation exercises, yoga

Always include disclaimers:
- For medicines: "This information is for educational purposes only. Always consult a doctor or pharmacist before taking any medication."
- For exercises: "Consult your doctor before starting any new exercise routine, especially if you have existing health conditions."

Be concise, accurate, and helpful. Format your responses clearly with bullet points or sections. If asked about both medicine and exercise for a condition, provide both.

Respond in the same language the user uses (Hindi or English).`
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ error: 'AI gateway error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Medicine AI chat error:', error);
    return new Response(JSON.stringify({ error: 'An error occurred processing your request' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
