import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Lock, Search, Calendar, AlertTriangle } from "lucide-react";
import AdminLayout from "./AdminLayout";

interface FailedLogin {
  id: number;
  userId: string;
  ipAddress: string;
  userAgent: string;
  failureReason: string;
  createdAt: string;
}

export default function FailedLogins() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: attempts, isLoading } = useQuery<FailedLogin[]>({
    queryKey: ['failed-logins'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/failed-logins');
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

  const filteredAttempts = attempts?.filter(attempt =>
    attempt.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attempt.ipAddress?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ipAttemptCounts = attempts?.reduce((acc: any, attempt) => {
    acc[attempt.ipAddress] = (acc[attempt.ipAddress] || 0) + 1;
    return acc;
  }, {});

  const suspiciousIPs = Object.entries(ipAttemptCounts || {})
    .filter(([_, count]) => (count as number) >= 3)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            Failed Login Attempts
          </h1>
          <p className="text-slate-600 mt-2">
            Monitor authentication failures and suspicious activities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Failures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{attempts?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {attempts?.filter(a => new Date(a.createdAt).toDateString() === new Date().toDateString()).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Suspicious IPs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{suspiciousIPs.length}</div>
            </CardContent>
          </Card>
        </div>

        {suspiciousIPs.length > 0 && (
          <Card className="border-red-200 bg-red-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-900">
                <AlertTriangle className="h-5 w-5" />
                Suspicious IP Addresses
              </CardTitle>
              <CardDescription className="text-red-700">
                IP addresses with multiple failed login attempts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {suspiciousIPs.map(([ip, count], idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                    <div className="flex items-center gap-3">
                      <Lock className="h-4 w-4 text-red-600" />
                      <span className="font-mono text-sm font-medium text-slate-900">{ip}</span>
                    </div>
                    <Badge variant="destructive">{String(count)} attempts</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Failed Login History</CardTitle>
                <CardDescription className="mt-1">
                  {filteredAttempts?.length || 0} failed attempts
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search attempts..."
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
                  <p className="mt-4 text-slate-600">Loading failed logins...</p>
                </div>
              </div>
            ) : filteredAttempts && filteredAttempts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-slate-100">
                    <TableHead className="font-semibold">User ID</TableHead>
                    <TableHead className="font-semibold">IP Address</TableHead>
                    <TableHead className="font-semibold">Reason</TableHead>
                    <TableHead className="font-semibold">User Agent</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttempts.map((attempt) => (
                    <TableRow key={attempt.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium">{attempt.userId || 'Unknown'}</TableCell>
                      <TableCell className="font-mono text-sm">{attempt.ipAddress}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">{attempt.failureReason || 'Invalid credentials'}</Badge>
                      </TableCell>
                      <TableCell className="text-slate-600 max-w-xs truncate text-sm">
                        {attempt.userAgent || 'N/A'}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(attempt.createdAt)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Lock className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="font-medium text-slate-900 mb-2">No failed login attempts</h3>
                <p className="text-slate-500 text-sm">
                  {searchTerm ? "Try adjusting your search" : "This is a good sign!"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
