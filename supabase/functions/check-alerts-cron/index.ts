import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Running alert check cron job...");

    // Get all medicines
    const { data: medicines, error: medicinesError } = await supabase
      .from("medicines")
      .select("id, name, quantity, min_threshold, expiry_date");

    if (medicinesError) {
      throw new Error(`Failed to fetch medicines: ${medicinesError.message}`);
    }

    const newAlerts: Array<{
      medicine_id: string;
      type: string;
      message: string;
    }> = [];

    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    for (const medicine of medicines || []) {
      // Check for out of stock
      if (medicine.quantity === 0) {
        // Check if alert already exists
        const { data: existingAlert } = await supabase
          .from("alerts")
          .select("id")
          .eq("medicine_id", medicine.id)
          .eq("type", "out_of_stock")
          .eq("is_read", false)
          .single();

        if (!existingAlert) {
          newAlerts.push({
            medicine_id: medicine.id,
            type: "out_of_stock",
            message: `${medicine.name} is out of stock!`,
          });
        }
      }
      // Check for low stock
      else if (medicine.quantity <= (medicine.min_threshold || 5)) {
        const { data: existingAlert } = await supabase
          .from("alerts")
          .select("id")
          .eq("medicine_id", medicine.id)
          .eq("type", "low_stock")
          .eq("is_read", false)
          .single();

        if (!existingAlert) {
          newAlerts.push({
            medicine_id: medicine.id,
            type: "low_stock",
            message: `${medicine.name} is low on stock (${medicine.quantity} units remaining)`,
          });
        }
      }

      // Check for expiring medicines (within 30 days)
      if (medicine.expiry_date) {
        const expiryDate = new Date(medicine.expiry_date);
        if (expiryDate <= thirtyDaysFromNow && expiryDate > today) {
          const { data: existingAlert } = await supabase
            .from("alerts")
            .select("id")
            .eq("medicine_id", medicine.id)
            .eq("type", "expiry")
            .eq("is_read", false)
            .single();

          if (!existingAlert) {
            const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
            newAlerts.push({
              medicine_id: medicine.id,
              type: "expiry",
              message: `${medicine.name} expires in ${daysUntilExpiry} days (${medicine.expiry_date})`,
            });
          }
        }
      }
    }

    // Insert new alerts
    if (newAlerts.length > 0) {
      const { data: insertedAlerts, error: insertError } = await supabase
        .from("alerts")
        .insert(newAlerts)
        .select("id");

      if (insertError) {
        throw new Error(`Failed to insert alerts: ${insertError.message}`);
      }

      console.log(`Created ${newAlerts.length} new alerts`);

      // Trigger instant notifications for new alerts
      if (insertedAlerts && insertedAlerts.length > 0) {
        const alertIds = insertedAlerts.map(a => a.id);
        
        // Call the notification function
        await supabase.functions.invoke("send-alert-notifications", {
          body: { type: "instant", alertIds },
        });
      }
    } else {
      console.log("No new alerts to create");
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Processed ${medicines?.length || 0} medicines, created ${newAlerts.length} new alerts` 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error in check-alerts-cron:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
