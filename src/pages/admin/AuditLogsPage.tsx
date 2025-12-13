import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, User, Package, Receipt, Settings } from 'lucide-react';
import { format } from 'date-fns';

const AuditLogsPage = () => {
  const { data: logs, isLoading } = useAuditLogs(100);

  const getActionIcon = (action: string) => {
    if (action.includes('medicine')) return <Package className="h-4 w-4" />;
    if (action.includes('sale')) return <Receipt className="h-4 w-4" />;
    if (action.includes('user')) return <User className="h-4 w-4" />;
    return <Settings className="h-4 w-4" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes('add') || action.includes('create')) return 'text-success';
    if (action.includes('delete')) return 'text-destructive';
    if (action.includes('update')) return 'text-warning';
    return 'text-primary';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="font-heading text-2xl font-bold">Audit Logs</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Activity History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground">Loading...</div>
            ) : !logs?.length ? (
              <div className="py-8 text-center">
                <Shield className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-muted-foreground">No audit logs found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="whitespace-nowrap text-sm">
                          {log.created_at && format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss')}
                        </TableCell>
                        <TableCell>
                          <div className={`flex items-center gap-2 ${getActionColor(log.action)}`}>
                            {getActionIcon(log.action)}
                            <span className="font-medium">{log.action}</span>
                          </div>
                        </TableCell>
                        <TableCell>{log.user_name || 'System'}</TableCell>
                        <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                          {log.meta_json ? JSON.stringify(log.meta_json).slice(0, 100) : '-'}
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

export default AuditLogsPage;
