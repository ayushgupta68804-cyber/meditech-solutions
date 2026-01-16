import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Validate cron secret for authentication
function validateCronAuth(req: Request): boolean {
  const authHeader = req.headers.get('Authorization');
  const cronSecret = Deno.env.get('CRON_SECRET_KEY');
  
  if (!cronSecret) {
    console.error('CRON_SECRET_KEY not configured');
    return false;
  }
  
  return authHeader === `Bearer ${cronSecret}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Validate authentication
  if (!validateCronAuth(req)) {
    console.log('Unauthorized cron request attempted');
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    console.log("Running daily alert report...");

    // Get all unread alerts
    const { data: alerts, error: alertsError } = await supabase
      .from("alerts")
      .select("id")
      .eq("is_read", false);

    if (alertsError) {
      throw new Error(`Failed to fetch alerts: ${alertsError.message}`);
    }

    if (!alerts || alerts.length === 0) {
      console.log("No unread alerts for daily report");
      return new Response(JSON.stringify({ 
        success: true, 
        message: "No unread alerts to report" 
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send daily report notifications
    const alertIds = alerts.map(a => a.id);
    
    const { data, error } = await supabase.functions.invoke("send-alert-notifications", {
      body: { type: "daily", alertIds },
    });

    if (error) {
      throw new Error(`Failed to send notifications: ${error.message}`);
    }

    console.log("Daily report sent successfully:", data);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Daily report sent for ${alerts.length} alerts`,
      data
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error in daily-alert-report:", error);
    return new Response(JSON.stringify({ error: "An error occurred processing the request" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
