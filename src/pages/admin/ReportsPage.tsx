import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useMedicines, useLowStockMedicines, useExpiringMedicines } from '@/hooks/useMedicines';
import { useSales } from '@/hooks/useSales';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Package, AlertTriangle, Calendar, TrendingUp } from 'lucide-react';
import { format, subDays } from 'date-fns';
import SalesTrendChart from '@/components/dashboard/SalesTrendChart';
import InventoryAnalyticsChart from '@/components/dashboard/InventoryAnalyticsChart';

const ReportsPage = () => {
  const { data: medicines } = useMedicines();
  const { data: lowStock } = useLowStockMedicines();
  const { data: expiring } = useExpiringMedicines(30);
  const { data: sales } = useSales();

  const downloadCSV = (data: any[], filename: string) => {
    if (!data?.length) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((row) =>
      Object.values(row).map((v) => `"${v ?? ''}"`).join(',')
    ).join('\n');
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Top selling medicines calculation
  const last30Days = subDays(new Date(), 30);
  const recentSales = sales?.filter((s) => new Date(s.created_at || '') >= last30Days);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-bold">Reports</h1>

        {/* Analytics Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          <SalesTrendChart sales={sales} days={30} />
          <div className="lg:col-span-1">
            <InventoryAnalyticsChart medicines={medicines} lowStock={lowStock} expiring={expiring} />
          </div>
        </div>

        <Tabs defaultValue="low-stock" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="low-stock" className="gap-2">
              <Package className="h-4 w-4" />
              Low Stock
            </TabsTrigger>
            <TabsTrigger value="expiring" className="gap-2">
              <Calendar className="h-4 w-4" />
              Expiring
            </TabsTrigger>
            <TabsTrigger value="inventory" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="sales" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Sales
            </TabsTrigger>
          </TabsList>

          {/* Low Stock Report */}
          <TabsContent value="low-stock">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Low Stock Medicines (Below Threshold)</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadCSV(
                    lowStock?.map((m) => ({
                      Name: m.name,
                      Batch: m.batch_no,
                      Quantity: m.quantity,
                      Threshold: m.min_threshold,
                      Price: m.price,
                    })) || [],
                    'low_stock_report'
                  )}
                  disabled={!lowStock?.length}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                {!lowStock?.length ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No low stock items found.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Current Qty</TableHead>
                        <TableHead>Threshold</TableHead>
                        <TableHead>Shortage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lowStock.map((m) => (
                        <TableRow key={m.id}>
                          <TableCell className="font-medium">{m.name}</TableCell>
                          <TableCell>{m.batch_no || '-'}</TableCell>
                          <TableCell className="text-destructive font-medium">{m.quantity}</TableCell>
                          <TableCell>{m.min_threshold}</TableCell>
                          <TableCell className="text-destructive">
                            -{(m.min_threshold || 5) - (m.quantity || 0)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expiring Report */}
          <TabsContent value="expiring">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Medicines Expiring in 30 Days</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadCSV(
                    expiring?.map((m) => ({
                      Name: m.name,
                      Batch: m.batch_no,
                      Expiry: m.expiry_date,
                      Quantity: m.quantity,
                      Price: m.price,
                    })) || [],
                    'expiring_medicines_report'
                  )}
                  disabled={!expiring?.length}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                {!expiring?.length ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No medicines expiring soon.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Days Left</TableHead>
                        <TableHead>Quantity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expiring.map((m) => {
                        const daysLeft = Math.ceil(
                          (new Date(m.expiry_date || '').getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                        );
                        return (
                          <TableRow key={m.id}>
                            <TableCell className="font-medium">{m.name}</TableCell>
                            <TableCell>{m.batch_no || '-'}</TableCell>
                            <TableCell>{m.expiry_date && format(new Date(m.expiry_date), 'dd/MM/yyyy')}</TableCell>
                            <TableCell className={daysLeft <= 7 ? 'text-destructive font-medium' : 'text-warning'}>
                              {daysLeft} days
                            </TableCell>
                            <TableCell>{m.quantity}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Full Inventory */}
          <TabsContent value="inventory">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Full Inventory Report</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadCSV(
                    medicines?.map((m) => ({
                      Name: m.name,
                      Batch: m.batch_no,
                      Barcode: m.barcode,
                      Quantity: m.quantity,
                      Price: m.price,
                      MfgDate: m.mfg_date,
                      ExpiryDate: m.expiry_date,
                      Seller: m.seller_info,
                    })) || [],
                    'inventory_report'
                  )}
                  disabled={!medicines?.length}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                {!medicines?.length ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No medicines in inventory.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {medicines.map((m) => (
                        <TableRow key={m.id}>
                          <TableCell className="font-medium">{m.name}</TableCell>
                          <TableCell>{m.batch_no || '-'}</TableCell>
                          <TableCell>{m.quantity}</TableCell>
                          <TableCell>₹{m.price?.toFixed(2)}</TableCell>
                          <TableCell>₹{((m.quantity || 0) * (m.price || 0)).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales Report */}
          <TabsContent value="sales">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Sales Report (Last 30 Days)</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadCSV(
                    recentSales?.map((s) => ({
                      Date: s.created_at,
                      Customer: s.customer_name,
                      Contact: s.customer_contact,
                      Amount: s.total_amount,
                    })) || [],
                    'sales_report'
                  )}
                  disabled={!recentSales?.length}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                {!recentSales?.length ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No sales in the last 30 days.
                  </div>
                ) : (
                  <>
                    <div className="mb-4 rounded-lg bg-muted p-4">
                      <p className="text-sm text-muted-foreground">Total Sales (30 days)</p>
                      <p className="text-2xl font-bold">
                        ₹{recentSales.reduce((sum, s) => sum + (s.total_amount || 0), 0).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">{recentSales.length} transactions</p>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentSales.slice(0, 20).map((s) => (
                          <TableRow key={s.id}>
                            <TableCell>
                              {s.created_at && format(new Date(s.created_at), 'dd/MM/yyyy HH:mm')}
                            </TableCell>
                            <TableCell>{s.customer_name || 'Walk-in'}</TableCell>
                            <TableCell className="text-right font-medium">₹{s.total_amount?.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
