import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Medicine {
  id: string;
  name: string;
  batch_no: string | null;
  barcode: string | null;
  expiry_date: string | null;
  mfg_date: string | null;
  quantity: number;
  price: number;
  min_threshold: number;
  description: string | null;
  seller_info: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface MedicineInput {
  name: string;
  batch_no?: string;
  barcode?: string;
  expiry_date?: string;
  mfg_date?: string;
  quantity: number;
  price: number;
  min_threshold?: number;
  description?: string;
  seller_info?: string;
}

export const useMedicines = (search?: string) => {
  return useQuery({
    queryKey: ['medicines', search],
    queryFn: async () => {
      let query = supabase
        .from('medicines')
        .select('*')
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(`name.ilike.%${search}%,barcode.ilike.%${search}%,batch_no.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Medicine[];
    },
  });
};

export const useMedicineByBarcode = (barcode: string) => {
  return useQuery({
    queryKey: ['medicine-barcode', barcode],
    queryFn: async () => {
      if (!barcode) return null;
      
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .eq('barcode', barcode)
        .maybeSingle();

      if (error) throw error;
      return data as Medicine | null;
    },
    enabled: !!barcode,
  });
};

export const useAddMedicine = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (medicine: MedicineInput) => {
      const { data, error } = await supabase
        .from('medicines')
        .insert({
          ...medicine,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Log to audit
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'ADD_MEDICINE',
        meta_json: { medicine_id: data.id, name: medicine.name },
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
  });
};

export const useUpdateMedicine = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...medicine }: MedicineInput & { id: string }) => {
      const { data, error } = await supabase
        .from('medicines')
        .update(medicine)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Log to audit
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'UPDATE_MEDICINE',
        meta_json: { medicine_id: id, name: medicine.name },
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
  });
};

export const useDeleteMedicine = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      // Get medicine name for audit log
      const { data: medicine } = await supabase
        .from('medicines')
        .select('name')
        .eq('id', id)
        .single();

      const { error } = await supabase
        .from('medicines')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Log to audit
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'DELETE_MEDICINE',
        meta_json: { medicine_id: id, name: medicine?.name },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
  });
};

export const useLowStockMedicines = () => {
  return useQuery({
    queryKey: ['medicines-low-stock'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .filter('quantity', 'lte', 5)
        .order('quantity', { ascending: true });

      if (error) throw error;
      return data as Medicine[];
    },
  });
};

export const useExpiringMedicines = (days: number = 30) => {
  return useQuery({
    queryKey: ['medicines-expiring', days],
    queryFn: async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);
      
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .lte('expiry_date', futureDate.toISOString().split('T')[0])
        .gte('expiry_date', new Date().toISOString().split('T')[0])
        .order('expiry_date', { ascending: true });

      if (error) throw error;
      return data as Medicine[];
    },
  });
};
