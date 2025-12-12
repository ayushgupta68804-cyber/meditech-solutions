import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Alert {
  id: string;
  medicine_id: string;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
  medicines?: {
    name: string;
  };
}

export const useAlerts = () => {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alerts')
        .select(`
          *,
          medicines (name)
        `)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Alert[];
    },
  });
};

export const useMarkAlertRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from('alerts')
        .update({ is_read: true })
        .eq('id', alertId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};
