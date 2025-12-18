import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMedicines, useLowStockMedicines, useExpiringMedicines } from '@/hooks/useMedicines';
import { useSalesStats, useSales } from '@/hooks/useSales';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import SalesTrendChart from '@/components/dashboard/SalesTrendChart';
import InventoryAnalyticsChart from '@/components/dashboard/InventoryAnalyticsChart';
import { Package, TrendingUp, DollarSign, Activity, AlertTriangle, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const { data: medicines } = useMedicines();
  const { data: lowStock } = useLowStockMedicines();
  const { data: expiring } = useExpiringMedicines(30);
  const { data: monthStats } = useSalesStats('month');
  const { data: logs } = useAuditLogs(10);
  const { data: sales } = useSales();

  const inventoryValue = medicines?.reduce((sum, m) => sum + (m.price * m.quantity), 0) || 0;

  const stats = [
    { title: 'Total Medicines', value: medicines?.length || 0, icon: Package, color: 'text-primary' },
    { title: 'Monthly Sales', value: `₹${monthStats?.total?.toFixed(2) || '0.00'}`, icon: TrendingUp, color: 'text-green-600' },
    { title: 'Inventory Value', value: `₹${inventoryValue.toFixed(2)}`, icon: DollarSign, color: 'text-blue-600' },
    { title: 'Low Stock Items', value: lowStock?.length || 0, icon: AlertTriangle, color: 'text-amber-600' },
    { title: 'Expiring Soon', value: expiring?.length || 0, icon: Clock, color: 'text-red-600' },
    { title: 'Total Transactions', value: monthStats?.count || 0, icon: Activity, color: 'text-purple-600' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-bold">Admin Dashboard</h1>
        
        {/* Key Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SalesTrendChart sales={sales} days={14} />
          <InventoryAnalyticsChart medicines={medicines} lowStock={lowStock} expiring={expiring} />
        </div>

        {/* Recent Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {logs?.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              ) : (
                logs?.map(log => (
                  <div key={log.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                    <div className="flex-1">
                      <span className="font-medium text-sm">{log.action}</span>
                      <span className="text-muted-foreground text-sm"> by {log.user_name || 'Unknown'}</span>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
