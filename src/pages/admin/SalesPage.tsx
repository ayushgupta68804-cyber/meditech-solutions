import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useSales } from '@/hooks/useSales';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart3, DollarSign, ShoppingBag, Calendar } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

const SalesPage = () => {
  const { data: sales, isLoading } = useSales();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredSales = sales?.filter((sale) => {
    if (!dateFrom && !dateTo) return true;
    const saleDate = new Date(sale.created_at || '');
    const from = dateFrom ? new Date(dateFrom) : new Date(0);
    const to = dateTo ? new Date(dateTo + 'T23:59:59') : new Date();
    return saleDate >= from && saleDate <= to;
  });

  const today = new Date();
  const todaySales = sales?.filter((s) => {
    const saleDate = new Date(s.created_at || '');
    return saleDate.toDateString() === today.toDateString();
  });

  const weekSales = sales?.filter((s) => {
    const saleDate = new Date(s.created_at || '');
    return isWithinInterval(saleDate, { start: startOfWeek(today), end: endOfWeek(today) });
  });

  const monthSales = sales?.filter((s) => {
    const saleDate = new Date(s.created_at || '');
    return isWithinInterval(saleDate, { start: startOfMonth(today), end: endOfMonth(today) });
  });

  const todayTotal = todaySales?.reduce((sum, s) => sum + (s.total_amount || 0), 0) || 0;
  const weekTotal = weekSales?.reduce((sum, s) => sum + (s.total_amount || 0), 0) || 0;
  const monthTotal = monthSales?.reduce((sum, s) => sum + (s.total_amount || 0), 0) || 0;
  const filteredTotal = filteredSales?.reduce((sum, s) => sum + (s.total_amount || 0), 0) || 0;

  const stats = [
    { title: "Today's Sales", value: `₹${todayTotal.toFixed(2)}`, count: todaySales?.length || 0, icon: DollarSign, color: 'text-primary' },
    { title: "This Week", value: `₹${weekTotal.toFixed(2)}`, count: weekSales?.length || 0, icon: Calendar, color: 'text-accent' },
    { title: "This Month", value: `₹${monthTotal.toFixed(2)}`, count: monthSales?.length || 0, icon: BarChart3, color: 'text-success' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-bold">Sales Overview</h1>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.count} transactions</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Date Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter by Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <Label>From</Label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>To</Label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredSales?.length || 0} sales | Total: ₹{filteredTotal.toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Sales History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground">Loading...</div>
            ) : !filteredSales?.length ? (
              <div className="py-8 text-center">
                <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-muted-foreground">No sales found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>
                          {sale.created_at && format(new Date(sale.created_at), 'dd/MM/yyyy HH:mm')}
                        </TableCell>
                        <TableCell>{sale.customer_name || 'Walk-in'}</TableCell>
                        <TableCell>{sale.customer_contact || '-'}</TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{sale.total_amount?.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SalesPage;
