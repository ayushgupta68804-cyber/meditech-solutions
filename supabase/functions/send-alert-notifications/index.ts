import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Initialize clients
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

interface AlertData {
  id: string;
  medicine_id: string;
  type: string;
  message: string;
  medicine?: {
    name: string;
    quantity: number;
    expiry_date: string;
  };
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  notify_email: boolean;
  notify_sms: boolean;
  notify_low_stock: boolean;
  notify_expiry: boolean;
}

// Send Email using Resend
async function sendEmail(to: string, subject: string, htmlContent: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await resend.emails.send({
      from: "MediTech Alerts <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      html: htmlContent,
    });
    console.log("Email sent successfully:", response);
    return { success: true };
  } catch (error: any) {
    console.error("Email send error:", error);
    return { success: false, error: error.message };
  }
}

// Send SMS using Twilio
async function sendSMS(to: string, message: string): Promise<{ success: boolean; error?: string }> {
  if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
    return { success: false, error: "Twilio credentials not configured" };
  }

  try {
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
    
    const formData = new URLSearchParams();
    formData.append("To", to);
    formData.append("From", twilioPhoneNumber);
    formData.append("Body", message);

    const response = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Twilio error:", data);
      return { success: false, error: data.message || "SMS sending failed" };
    }

    console.log("SMS sent successfully:", data.sid);
    return { success: true };
  } catch (error: any) {
    console.error("SMS send error:", error);
    return { success: false, error: error.message };
  }
}

// Generate email HTML template
function generateEmailTemplate(alerts: AlertData[], type: "instant" | "daily"): string {
  const title = type === "daily" ? "📋 Daily MediTech Alert Report" : "🚨 MediTech Instant Alert";
  
  const alertRows = alerts.map(alert => {
    const icon = alert.type === "low_stock" ? "📦" : alert.type === "expiry" ? "⏰" : "❌";
    const typeLabel = alert.type === "low_stock" ? "Low Stock" : alert.type === "expiry" ? "Expiring Soon" : "Out of Stock";
    return `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px; text-align: center;">${icon}</td>
        <td style="padding: 12px;">${typeLabel}</td>
        <td style="padding: 12px;">${alert.message}</td>
      </tr>
    `;
  }).join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; }
        .header { background: #3B82F6; color: white; padding: 24px; text-align: center; }
        .content { padding: 24px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #f3f4f6; padding: 12px; text-align: left; }
        .footer { background: #f9fafb; padding: 16px; text-align: center; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">${title}</h1>
          <p style="margin: 8px 0 0 0;">MediTech Smart Pharmacy Solution</p>
        </div>
        <div class="content">
          <p>You have <strong>${alerts.length}</strong> alert(s) that require your attention:</p>
          <table>
            <thead>
              <tr>
                <th style="width: 50px;"></th>
                <th>Type</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              ${alertRows}
            </tbody>
          </table>
          <p style="margin-top: 24px;">
            <a href="${supabaseUrl.replace('.supabase.co', '')}" 
               style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Dashboard
            </a>
          </p>
        </div>
        <div class="footer">
          <p>This is an automated alert from MediTech Pharmacy.</p>
          <p>© 2024-25 MediTech - Mumbai University Project</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate SMS message
function generateSMSMessage(alerts: AlertData[], type: "instant" | "daily"): string {
  if (type === "daily") {
    const lowStockCount = alerts.filter(a => a.type === "low_stock").length;
    const expiryCount = alerts.filter(a => a.type === "expiry").length;
    return `MediTeck Daily Alert: ${lowStockCount} low stock, ${expiryCount} expiring medicines. Check dashboard for details.`;
  } else {
    const alert = alerts[0];
    return `MediTeck Alert: ${alert.message}`;
  }
}

// Log notification
async function logNotification(
  userId: string | null,
  alertId: string | null,
  notificationType: "email" | "sms",
  recipient: string,
  subject: string | null,
  message: string,
  status: "sent" | "failed",
  errorMessage?: string
) {
  await supabase.from("notification_logs").insert({
    user_id: userId,
    alert_id: alertId,
    notification_type: notificationType,
    recipient: recipient,
    subject: subject,
    message: message,
    status: status,
    error_message: errorMessage,
  });
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type = "instant", alertIds = [] } = await req.json().catch(() => ({}));
    
    console.log(`Processing ${type} notifications for ${alertIds.length} alerts`);

    // Get users with notification preferences
    const { data: users, error: usersError } = await supabase
      .from("profiles")
      .select("*")
      .or("notify_email.eq.true,notify_sms.eq.true");

    if (usersError) {
      throw new Error(`Failed to fetch users: ${usersError.message}`);
    }

    if (!users || users.length === 0) {
      return new Response(JSON.stringify({ message: "No users with notifications enabled" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get alerts
    let alertsQuery = supabase
      .from("alerts")
      .select(`
        id,
        medicine_id,
        type,
        message,
        is_read,
        medicines:medicine_id (name, quantity, expiry_date)
      `)
      .eq("is_read", false);

    if (alertIds.length > 0) {
      alertsQuery = alertsQuery.in("id", alertIds);
    }

    const { data: alerts, error: alertsError } = await alertsQuery;

    if (alertsError) {
      throw new Error(`Failed to fetch alerts: ${alertsError.message}`);
    }

    if (!alerts || alerts.length === 0) {
      return new Response(JSON.stringify({ message: "No unread alerts to send" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Found ${alerts.length} alerts to process`);

    const results = {
      emailsSent: 0,
      smsSent: 0,
      emailsFailed: 0,
      smsFailed: 0,
    };

    // Process notifications for each user
    for (const user of users as UserProfile[]) {
      // Filter alerts based on user preferences
      const userAlerts = alerts.filter((alert: any) => {
        if (alert.type === "low_stock" || alert.type === "out_of_stock") {
          return user.notify_low_stock;
        }
        if (alert.type === "expiry") {
          return user.notify_expiry;
        }
        return true;
      });

      if (userAlerts.length === 0) continue;

      // Send Email
      if (user.notify_email && user.email) {
        const subject = type === "daily" 
          ? `📋 MediTeck Daily Report - ${userAlerts.length} Alerts`
          : `🚨 MediTeck Alert: ${userAlerts[0].message}`;
        
        const htmlContent = generateEmailTemplate(userAlerts as AlertData[], type);
        const emailResult = await sendEmail(user.email, subject, htmlContent);

        await logNotification(
          user.id,
          userAlerts[0].id,
          "email",
          user.email,
          subject,
          `${userAlerts.length} alerts`,
          emailResult.success ? "sent" : "failed",
          emailResult.error
        );

        if (emailResult.success) {
          results.emailsSent++;
        } else {
          results.emailsFailed++;
        }
      }

      // Send SMS
      if (user.notify_sms && user.mobile) {
        const smsMessage = generateSMSMessage(userAlerts as AlertData[], type);
        const smsResult = await sendSMS(user.mobile, smsMessage);

        await logNotification(
          user.id,
          userAlerts[0].id,
          "sms",
          user.mobile,
          null,
          smsMessage,
          smsResult.success ? "sent" : "failed",
          smsResult.error
        );

        if (smsResult.success) {
          results.smsSent++;
        } else {
          results.smsFailed++;
        }
      }
    }

    console.log("Notification results:", results);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Notifications processed",
      results 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error in send-alert-notifications:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
