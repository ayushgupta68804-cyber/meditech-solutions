import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMedicines, useLowStockMedicines } from '@/hooks/useMedicines';
import { useSalesStats } from '@/hooks/useSales';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { Package, TrendingUp, DollarSign, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const { data: medicines } = useMedicines();
  const { data: lowStock } = useLowStockMedicines();
  const { data: monthStats } = useSalesStats('month');
  const { data: logs } = useAuditLogs(10);

  const inventoryValue = medicines?.reduce((sum, m) => sum + (m.price * m.quantity), 0) || 0;

  const stats = [
    { title: 'Total Medicines', value: medicines?.length || 0, icon: Package, color: 'text-primary' },
    { title: 'Monthly Sales', value: `₹${monthStats?.total?.toFixed(2) || '0.00'}`, icon: TrendingUp, color: 'text-success' },
    { title: 'Inventory Value', value: `₹${inventoryValue.toFixed(2)}`, icon: DollarSign, color: 'text-accent' },
    { title: 'Low Stock Items', value: lowStock?.length || 0, icon: Activity, color: 'text-warning' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-bold">Admin Dashboard</h1>
        
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

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {logs?.slice(0, 5).map(log => (
                <div key={log.id} className="flex justify-between border-b pb-2 text-sm">
                  <div>
                    <span className="font-medium">{log.action}</span>
                    <span className="text-muted-foreground"> by {log.user_name || 'Unknown'}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {new Date(log.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
