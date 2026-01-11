import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface NotificationSettings {
  notify_email: boolean;
  notify_sms: boolean;
  notify_low_stock: boolean;
  notify_expiry: boolean;
}

export function useNotificationSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["notification-settings", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("notify_email, notify_sms, notify_low_stock, notify_expiry, mobile")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<NotificationSettings>) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update(newSettings)
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-settings"] });
      toast.success("Notification settings updated!");
    },
    onError: (error: any) => {
      toast.error(`Failed to update settings: ${error.message}`);
    },
  });

  const updateMobile = useMutation({
    mutationFn: async (mobile: string) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({ mobile })
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-settings"] });
      toast.success("Mobile number updated!");
    },
    onError: (error: any) => {
      toast.error(`Failed to update mobile: ${error.message}`);
    },
  });

  const sendTestNotification = useMutation({
    mutationFn: async (type: "email" | "sms") => {
      const { data, error } = await supabase.functions.invoke("send-alert-notifications", {
        body: { type: "instant", alertIds: [] },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Test notification sent!");
    },
    onError: (error: any) => {
      toast.error(`Failed to send test: ${error.message}`);
    },
  });

  return {
    settings,
    isLoading,
    updateSettings,
    updateMobile,
    sendTestNotification,
  };
}
