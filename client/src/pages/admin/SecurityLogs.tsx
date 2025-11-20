import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Shield, Search, Calendar, AlertTriangle } from "lucide-react";
import AdminLayout from "./AdminLayout";

interface SecurityLog {
  id: number;
  userId: string;
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  ipAddress: string;
  createdAt: string;
}

export default function SecurityLogs() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: logs, isLoading } = useQuery<SecurityLog[]>({
    queryKey: ['security-logs'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/security-logs');
      return response.json();
    },
    refetchInterval: 10000,
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

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const filteredLogs = logs?.filter(log =>
    log.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.eventType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.userId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            Security Logs
          </h1>
          <p className="text-slate-600 mt-2">
            Monitor security events and potential threats
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{logs?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Critical</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {logs?.filter(l => l.severity === 'critical').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">High</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {logs?.filter(l => l.severity === 'high').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {logs?.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Security Events</CardTitle>
                <CardDescription className="mt-1">
                  {filteredLogs?.length || 0} events recorded
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search events..."
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
                  <p className="mt-4 text-slate-600">Loading security logs...</p>
                </div>
              </div>
            ) : filteredLogs && filteredLogs.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-slate-100">
                    <TableHead className="font-semibold">Severity</TableHead>
                    <TableHead className="font-semibold">Event Type</TableHead>
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold">IP Address</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <Badge variant={getSeverityVariant(log.severity)} className="gap-1">
                          {log.severity === 'critical' || log.severity === 'high' ? (
                            <AlertTriangle className="h-3 w-3" />
                          ) : null}
                          {log.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.eventType}</Badge>
                      </TableCell>
                      <TableCell className="font-medium max-w-md truncate">{log.description}</TableCell>
                      <TableCell>{log.userId || 'N/A'}</TableCell>
                      <TableCell className="text-slate-600 font-mono text-sm">{log.ipAddress}</TableCell>
                      <TableCell className="text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(log.createdAt)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Shield className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="font-medium text-slate-900 mb-2">No security events</h3>
                <p className="text-slate-500 text-sm">
                  {searchTerm ? "Try adjusting your search" : "Security events will appear here"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
