import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMedicines, useLowStockMedicines, useExpiringMedicines } from '@/hooks/useMedicines';
import { useTodaySales } from '@/hooks/useSales';
import { useAlerts } from '@/hooks/useAlerts';
import { Package, AlertTriangle, TrendingUp, Bell } from 'lucide-react';

const UserDashboard = () => {
  const { data: medicines } = useMedicines();
  const { data: lowStock } = useLowStockMedicines();
  const { data: expiring } = useExpiringMedicines(30);
  const { data: todaySales } = useTodaySales();
  const { data: alerts } = useAlerts();

  const stats = [
    { title: 'Total Medicines', value: medicines?.length || 0, icon: Package, color: 'text-primary' },
    { title: 'Low Stock Items', value: lowStock?.length || 0, icon: AlertTriangle, color: 'text-warning' },
    { title: "Today's Sales", value: `₹${todaySales?.total?.toFixed(2) || '0.00'}`, icon: TrendingUp, color: 'text-success' },
    { title: 'Active Alerts', value: alerts?.length || 0, icon: Bell, color: 'text-destructive' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-bold">Staff Dashboard</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(lowStock?.length || 0) > 0 && (
          <Card className="border-warning/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <AlertTriangle className="h-5 w-5" /> Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lowStock?.slice(0, 5).map(med => (
                  <div key={med.id} className="flex justify-between text-sm">
                    <span>{med.name}</span>
                    <span className="font-medium text-destructive">{med.quantity} left</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {(expiring?.length || 0) > 0 && (
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" /> Expiring Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {expiring?.slice(0, 5).map(med => (
                  <div key={med.id} className="flex justify-between text-sm">
                    <span>{med.name}</span>
                    <span className="font-medium">{med.expiry_date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
