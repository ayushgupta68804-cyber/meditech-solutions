import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SaleItem {
  medicine_id: string;
  medicine_name: string;
  quantity: number;
  unit_price: number;
}

export interface SaleItemDB {
  id: string;
  quantity: number;
  unit_price: number;
  medicine_name?: string;
}

export interface Sale {
  id: string;
  user_id: string | null;
  customer_name: string | null;
  customer_contact: string | null;
  total_amount: number;
  created_at: string;
  sale_items?: SaleItemDB[];
  user_name?: string;
}

export interface CreateSaleItemInput {
  medicine_id: string;
  quantity: number;
  unit_price: number;
}

export interface CreateSaleInput {
  customer_name?: string | null;
  customer_contact?: string | null;
  items: CreateSaleItemInput[];
}

export const useSales = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['sales', startDate, endDate],
    queryFn: async () => {
      let query = supabase
        .from('sales')
        .select(`
          *,
          sale_items (
            id,
            quantity,
            unit_price,
            medicine_id
          )
        `)
        .order('created_at', { ascending: false });

      if (startDate) {
        query = query.gte('created_at', startDate);
      }
      if (endDate) {
        query = query.lte('created_at', endDate);
      }

      const { data: salesData, error } = await query;
      if (error) throw error;

      // Get user names and medicine names
      const userIds = [...new Set(salesData?.map(s => s.user_id).filter(Boolean) as string[])];
      const medicineIds = [...new Set(salesData?.flatMap(s => s.sale_items?.map((i: { medicine_id: string }) => i.medicine_id) || []).filter(Boolean) as string[])];

      let profiles: Record<string, string> = {};
      let medicines: Record<string, string> = {};

      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', userIds);
        profilesData?.forEach(p => { profiles[p.id] = p.name; });
      }

      if (medicineIds.length > 0) {
        const { data: medsData } = await supabase
          .from('medicines')
          .select('id, name')
          .in('id', medicineIds);
        medsData?.forEach(m => { medicines[m.id] = m.name; });
      }

      return salesData?.map(sale => ({
        ...sale,
        user_name: sale.user_id ? profiles[sale.user_id] : undefined,
        sale_items: sale.sale_items?.map((item: { id: string; quantity: number; unit_price: number; medicine_id: string }) => ({
          id: item.id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          medicine_name: medicines[item.medicine_id],
        })),
      })) as Sale[];
    },
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateSaleInput) => {
      const totalAmount = input.items.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0
      );

      // Create sale
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert({
          user_id: user?.id,
          customer_name: input.customer_name,
          customer_contact: input.customer_contact,
          total_amount: totalAmount,
        })
        .select()
        .single();

      if (saleError) throw saleError;

      // Create sale items
      const saleItems = input.items.map(item => ({
        sale_id: sale.id,
        medicine_id: item.medicine_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }));

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems);

      if (itemsError) throw itemsError;

      // Update medicine quantities atomically to prevent race conditions
      for (const item of input.items) {
        // Use atomic decrement function to prevent race conditions
        const { data: newQuantity, error: decrementError } = await supabase
          .rpc('decrement_medicine_quantity', {
            _medicine_id: item.medicine_id,
            _amount: item.quantity
          });

        if (decrementError) {
          // If we failed to decrement, we should handle the error
          // The sale and items have already been created, so we need to handle this gracefully
          console.error('Failed to update medicine quantity:', decrementError);
          throw new Error(
            decrementError.message.includes('Insufficient') 
              ? `Insufficient stock for one or more medicines` 
              : `Failed to update inventory: ${decrementError.message}`
          );
        }

        // Log inventory change
        await supabase.from('inventory_logs').insert({
          medicine_id: item.medicine_id,
          change_amount: -item.quantity,
          reason: `Sale: ${sale.id}`,
        });

        // Create alert if low stock (newQuantity is returned from the atomic function)
        if (newQuantity !== null && newQuantity <= 5) {
          // Get medicine name for alert
          const { data: med } = await supabase
            .from('medicines')
            .select('name')
            .eq('id', item.medicine_id)
            .single();
          const medicineName = med?.name || 'Unknown medicine';
          
          await supabase.from('alerts').insert({
            medicine_id: item.medicine_id,
            type: newQuantity === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK',
            message: newQuantity === 0 
              ? `${medicineName} is out of stock!`
              : `${medicineName} is running low (${newQuantity} left)`,
          });
        }
      }

      // Log to audit
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'CREATE_SALE',
        meta_json: { sale_id: sale.id, total: totalAmount, items: input.items.length },
      });

      return sale;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};

export const useTodaySales = () => {
  const today = new Date().toISOString().split('T')[0];
  
  return useQuery({
    queryKey: ['sales-today'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales')
        .select('total_amount')
        .gte('created_at', today);

      if (error) throw error;
      
      const total = data?.reduce((sum, sale) => sum + Number(sale.total_amount), 0) || 0;
      const count = data?.length || 0;
      
      return { total, count };
    },
  });
};

export const useSalesStats = (period: 'day' | 'week' | 'month' = 'month') => {
  return useQuery({
    queryKey: ['sales-stats', period],
    queryFn: async () => {
      const now = new Date();
      let startDate: Date;
      
      switch (period) {
        case 'day':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
      }

      const { data, error } = await supabase
        .from('sales')
        .select('total_amount, created_at')
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      const total = data?.reduce((sum, sale) => sum + Number(sale.total_amount), 0) || 0;
      const count = data?.length || 0;

      return { total, count, sales: data };
    },
  });
};
