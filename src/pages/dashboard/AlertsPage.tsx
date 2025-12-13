import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAlerts, useMarkAlertRead } from '@/hooks/useAlerts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Bell, AlertTriangle, Package, Calendar, Check } from 'lucide-react';
import { format } from 'date-fns';

const AlertsPage = () => {
  const { data: alerts, isLoading } = useAlerts();
  const markRead = useMarkAlertRead();
  const { toast } = useToast();

  const handleMarkRead = async (alertId: string) => {
    try {
      await markRead.mutateAsync(alertId);
      toast({ title: 'Alert marked as read' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'low_stock':
        return <Package className="h-5 w-5 text-warning" />;
      case 'expiry':
        return <Calendar className="h-5 w-5 text-destructive" />;
      case 'out_of_stock':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  const getAlertBg = (type: string) => {
    switch (type) {
      case 'low_stock':
        return 'border-l-4 border-l-warning bg-warning/5';
      case 'expiry':
        return 'border-l-4 border-l-destructive bg-destructive/5';
      case 'out_of_stock':
        return 'border-l-4 border-l-destructive bg-destructive/5';
      default:
        return 'border-l-4 border-l-primary bg-primary/5';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold">Alerts</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bell className="h-4 w-4" />
            {alerts?.length || 0} active alerts
          </div>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading...</div>
        ) : !alerts?.length ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium">No Active Alerts</p>
              <p className="text-muted-foreground">All systems are running smoothly!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <Card key={alert.id} className={getAlertBg(alert.type)}>
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium">{alert.message}</p>
                        {alert.medicines?.name && (
                          <p className="text-sm text-muted-foreground">
                            Medicine: {alert.medicines.name}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-muted-foreground">
                          {alert.created_at && format(new Date(alert.created_at), 'PPp')}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkRead(alert.id)}
                        disabled={markRead.isPending}
                        className="shrink-0 gap-1"
                      >
                        <Check className="h-4 w-4" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AlertsPage;
