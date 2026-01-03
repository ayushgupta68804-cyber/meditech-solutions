import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface Sale {
  created_at: string;
  total_amount: number;
}

interface SalesTrendChartProps {
  sales: Sale[] | undefined;
  days?: number;
  dateRange?: DateRange;
}

const chartConfig = {
  sales: {
    label: 'Sales',
    color: 'hsl(var(--primary))',
  },
};

const SalesTrendChart = ({ sales, days = 14, dateRange }: SalesTrendChartProps) => {
  const chartData = useMemo(() => {
    const endDate = dateRange?.to || new Date();
    const startDate = dateRange?.from || subDays(endDate, days - 1);
    
    const dateRangeInterval = eachDayOfInterval({ start: startDate, end: endDate });
    
    return dateRangeInterval.map((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const daySales = sales?.filter((s) => 
        format(new Date(s.created_at), 'yyyy-MM-dd') === dateStr
      ) || [];
      
      const total = daySales.reduce((sum, s) => sum + (s.total_amount || 0), 0);
      
      return {
        date: format(date, 'MMM dd'),
        sales: total,
        count: daySales.length,
      };
    });
  }, [sales, days, dateRange]);

  const totalSales = chartData.reduce((sum, d) => sum + d.sales, 0);
  const totalTransactions = chartData.reduce((sum, d) => sum + d.count, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          Sales Trend
        </CardTitle>
        <div className="text-right">
          <p className="text-2xl font-bold">₹{totalSales.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">{totalTransactions} transactions</p>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              tickLine={false}
              axisLine={false}
              className="text-xs fill-muted-foreground"
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value}`}
              className="text-xs fill-muted-foreground"
            />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Sales']}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#salesGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SalesTrendChart;
