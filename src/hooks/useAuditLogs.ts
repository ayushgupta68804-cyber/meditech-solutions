import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  meta_json: Record<string, unknown> | null;
  created_at: string;
  user_email?: string;
  user_name?: string;
}

export const useAuditLogs = (limit: number = 50) => {
  return useQuery({
    queryKey: ['audit-logs', limit],
    queryFn: async () => {
      const { data: logs, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Fetch user info for each log
      const userIds = [...new Set(logs?.map(l => l.user_id).filter(Boolean) as string[])];
      
      const profiles: Record<string, { name: string; email: string }> = {};
      
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, name, email')
          .in('id', userIds);
        
        profilesData?.forEach(p => {
          profiles[p.id] = { name: p.name, email: p.email || '' };
        });
      }

      return logs?.map(log => ({
        ...log,
        meta_json: log.meta_json as Record<string, unknown> | null,
        user_email: log.user_id ? profiles[log.user_id]?.email : undefined,
        user_name: log.user_id ? profiles[log.user_id]?.name : undefined,
      })) as AuditLog[];
    },
  });
};
