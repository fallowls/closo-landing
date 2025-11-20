import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { History, Search, Calendar, User, FileText } from "lucide-react";
import AdminLayout from "./AdminLayout";

interface AuditEntry {
  id: number;
  userId: string;
  userRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  changes: any;
  ipAddress: string;
  createdAt: string;
}

export default function AuditTrail() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: entries, isLoading } = useQuery<AuditEntry[]>({
    queryKey: ['audit-trail'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/audit-trail');
      return response.json();
    },
    refetchInterval: 30000,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionBadgeVariant = (action: string): "default" | "secondary" | "destructive" | "outline" => {
    if (action.includes('delete')) return 'destructive';
    if (action.includes('create')) return 'default';
    if (action.includes('update')) return 'secondary';
    return 'outline';
  };

  const filteredEntries = entries?.filter(entry =>
    entry.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.resourceType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <History className="w-6 h-6 text-white" />
            </div>
            Audit Trail
          </h1>
          <p className="text-slate-600 mt-2">
            Complete history of all system changes and actions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{entries?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {entries?.filter(e => new Date(e.createdAt).toDateString() === new Date().toDateString()).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {new Set(entries?.map(e => e.userId)).size || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Resource Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {new Set(entries?.map(e => e.resourceType)).size || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Audit Log</CardTitle>
                <CardDescription className="mt-1">
                  {filteredEntries?.length || 0} entries recorded
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search audit trail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-slate-600">Loading audit trail...</p>
                </div>
              </div>
            ) : filteredEntries && filteredEntries.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-slate-100">
                    <TableHead className="font-semibold">Action</TableHead>
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold">Role</TableHead>
                    <TableHead className="font-semibold">Resource</TableHead>
                    <TableHead className="font-semibold">IP Address</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <Badge variant={getActionBadgeVariant(entry.action)}>
                          {entry.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-slate-400" />
                          <span className="font-medium">{entry.userId || 'System'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={entry.userRole === 'admin' ? 'default' : 'secondary'}>
                          {entry.userRole || 'user'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">{entry.resourceType}</span>
                          {entry.resourceId && (
                            <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">
                              #{entry.resourceId}
                            </code>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-slate-600">{entry.ipAddress}</TableCell>
                      <TableCell className="text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">{formatDate(entry.createdAt)}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <History className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="font-medium text-slate-900 mb-2">No audit entries yet</h3>
                <p className="text-slate-500 text-sm">
                  {searchTerm ? "Try adjusting your search" : "Audit entries will appear here"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
