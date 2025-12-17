import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Package, AlertTriangle } from 'lucide-react';

interface Medicine {
  id: string;
  name: string;
  quantity: number;
  price: number;
  expiry_date?: string;
}

interface InventoryAnalyticsChartProps {
  medicines: Medicine[] | undefined;
  lowStock: Medicine[] | undefined;
  expiring: Medicine[] | undefined;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--warning))',
  'hsl(var(--destructive))',
  'hsl(var(--success))',
];

const chartConfig = {
  inStock: {
    label: 'In Stock',
    color: 'hsl(var(--success))',
  },
  lowStock: {
    label: 'Low Stock',
    color: 'hsl(var(--warning))',
  },
  outOfStock: {
    label: 'Out of Stock',
    color: 'hsl(var(--destructive))',
  },
  expiring: {
    label: 'Expiring Soon',
    color: 'hsl(var(--accent))',
  },
};

const InventoryAnalyticsChart = ({ medicines, lowStock, expiring }: InventoryAnalyticsChartProps) => {
  const statusData = useMemo(() => {
    if (!medicines) return [];

    const outOfStock = medicines.filter((m) => (m.quantity || 0) === 0).length;
    const low = (lowStock?.length || 0) - outOfStock;
    const normal = medicines.length - (lowStock?.length || 0);

    return [
      { name: 'In Stock', value: normal, fill: 'hsl(var(--success))' },
      { name: 'Low Stock', value: low > 0 ? low : 0, fill: 'hsl(var(--warning))' },
      { name: 'Out of Stock', value: outOfStock, fill: 'hsl(var(--destructive))' },
    ].filter((d) => d.value > 0);
  }, [medicines, lowStock]);

  const topMedicinesByValue = useMemo(() => {
    if (!medicines) return [];

    return medicines
      .map((m) => ({
        name: m.name.length > 15 ? m.name.substring(0, 15) + '...' : m.name,
        value: (m.quantity || 0) * (m.price || 0),
        quantity: m.quantity || 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [medicines]);

  const totalValue = medicines?.reduce((sum, m) => sum + (m.quantity || 0) * (m.price || 0), 0) || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Stock Status Pie Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="h-5 w-5 text-primary" />
            Stock Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <p className="font-medium text-success">{medicines?.filter((m) => (m.quantity || 0) > 5).length || 0}</p>
              <p className="text-muted-foreground">Healthy</p>
            </div>
            <div>
              <p className="font-medium text-warning">{lowStock?.length || 0}</p>
              <p className="text-muted-foreground">Low</p>
            </div>
            <div>
              <p className="font-medium text-destructive">{expiring?.length || 0}</p>
              <p className="text-muted-foreground">Expiring</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Medicines by Value */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-lg">
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-accent" />
              Top by Value
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              Total: ₹{totalValue.toFixed(0)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[220px] w-full">
            <BarChart data={topMedicinesByValue} layout="vertical" margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
              <XAxis 
                type="number" 
                tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
                className="text-xs fill-muted-foreground"
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={80}
                tickLine={false}
                axisLine={false}
                className="text-xs fill-muted-foreground"
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Value']}
              />
              <Bar 
                dataKey="value" 
                fill="hsl(var(--primary))" 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryAnalyticsChart;
