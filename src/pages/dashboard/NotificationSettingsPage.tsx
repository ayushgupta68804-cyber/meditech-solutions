import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Bell, Mail, Phone, Package, Clock, Send, Loader2 } from "lucide-react";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";

export default function NotificationSettingsPage() {
  const { settings, isLoading, updateSettings, updateMobile, sendTestNotification } = useNotificationSettings();
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    if (settings?.mobile) {
      setMobile(settings.mobile);
    }
  }, [settings?.mobile]);

  const handleToggle = (key: string, value: boolean) => {
    updateSettings.mutate({ [key]: value });
  };

  const handleMobileUpdate = () => {
    if (mobile.trim()) {
      updateMobile.mutate(mobile.trim());
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            Notification Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure how you receive alerts for low stock and expiring medicines.
          </p>
        </div>

        {/* Notification Channels */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notification Channels</CardTitle>
            <CardDescription>Choose how you want to receive alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Notifications */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Label className="font-medium">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts via email
                  </p>
                </div>
              </div>
              <Switch
                checked={settings?.notify_email ?? true}
                onCheckedChange={(checked) => handleToggle("notify_email", checked)}
                disabled={updateSettings.isPending}
              />
            </div>

            {/* SMS Notifications */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Label className="font-medium">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts via SMS on your mobile
                  </p>
                </div>
              </div>
              <Switch
                checked={settings?.notify_sms ?? false}
                onCheckedChange={(checked) => handleToggle("notify_sms", checked)}
                disabled={updateSettings.isPending}
              />
            </div>

            {/* Mobile Number Input */}
            {settings?.notify_sms && (
              <div className="p-4 border rounded-lg bg-muted/50">
                <Label className="font-medium">Mobile Number for SMS</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Enter your mobile number with country code (e.g., +91XXXXXXXXXX)
                </p>
                <div className="flex gap-2">
                  <Input
                    type="tel"
                    placeholder="+91XXXXXXXXXX"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleMobileUpdate}
                    disabled={updateMobile.isPending || !mobile.trim()}
                  >
                    {updateMobile.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alert Types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alert Types</CardTitle>
            <CardDescription>Choose which alerts you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Low Stock Alerts */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Package className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <Label className="font-medium">Low Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when medicine stock is running low
                  </p>
                </div>
              </div>
              <Switch
                checked={settings?.notify_low_stock ?? true}
                onCheckedChange={(checked) => handleToggle("notify_low_stock", checked)}
                disabled={updateSettings.isPending}
              />
            </div>

            {/* Expiry Alerts */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Clock className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <Label className="font-medium">Expiry Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when medicines are expiring soon (30 days)
                  </p>
                </div>
              </div>
              <Switch
                checked={settings?.notify_expiry ?? true}
                onCheckedChange={(checked) => handleToggle("notify_expiry", checked)}
                disabled={updateSettings.isPending}
              />
            </div>
          </CardContent>
        </Card>

        {/* Test Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Test Notifications</CardTitle>
            <CardDescription>Send a test notification to verify your settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => sendTestNotification.mutate("email")}
              disabled={sendTestNotification.isPending}
              className="gap-2"
            >
              {sendTestNotification.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send Test Alert
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              This will send current unread alerts to your configured channels.
            </p>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-primary mb-2">📱 How Notifications Work</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Instant Alerts:</strong> Sent immediately when new low stock or expiry alert is detected</li>
              <li>• <strong>Daily Report:</strong> Consolidated email/SMS sent every morning at 8 AM</li>
              <li>• <strong>SMS:</strong> Requires valid mobile number with country code</li>
              <li>• <strong>Email:</strong> Sent to your registered email address</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
