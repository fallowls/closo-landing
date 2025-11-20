import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Phone, Search, Calendar, Clock, PhoneIncoming, PhoneOutgoing, PhoneMissed } from "lucide-react";
import AdminLayout from "./AdminLayout";

interface CallLog {
  id: number;
  contactId: number;
  userId: string;
  callType: 'incoming' | 'outgoing' | 'missed';
  duration: number;
  status: string;
  notes: string;
  createdAt: string;
}

export default function CallLogs() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: calls, isLoading } = useQuery<CallLog[]>({
    queryKey: ['call-logs'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/call-logs');
      return response.json();
    },
    refetchInterval: 30000,
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCallIcon = (type: string) => {
    switch (type) {
      case 'incoming': return PhoneIncoming;
      case 'outgoing': return PhoneOutgoing;
      case 'missed': return PhoneMissed;
      default: return Phone;
    }
  };

  const getCallBadgeVariant = (type: string) => {
    switch (type) {
      case 'incoming': return 'default';
      case 'outgoing': return 'secondary';
      case 'missed': return 'destructive';
      default: return 'outline';
    }
  };

  const filteredCalls = calls?.filter(call =>
    call.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.contactId.toString().includes(searchTerm)
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
            Call Logs
          </h1>
          <p className="text-slate-600 mt-2">
            Monitor all call activities and interactions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{calls?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Incoming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {calls?.filter(c => c.callType === 'incoming').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Outgoing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {calls?.filter(c => c.callType === 'outgoing').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Missed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {calls?.filter(c => c.callType === 'missed').length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Call History</CardTitle>
                <CardDescription className="mt-1">
                  {filteredCalls?.length || 0} calls recorded
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search calls..."
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
                  <p className="mt-4 text-slate-600">Loading call logs...</p>
                </div>
              </div>
            ) : filteredCalls && filteredCalls.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-slate-100">
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Contact</TableHead>
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold">Duration</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCalls.map((call) => {
                    const CallIcon = getCallIcon(call.callType);
                    return (
                      <TableRow key={call.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell>
                          <Badge variant={getCallBadgeVariant(call.callType)} className="gap-1">
                            <CallIcon className="h-3 w-3" />
                            {call.callType}
                          </Badge>
                        </TableCell>
                        <TableCell>Contact #{call.contactId}</TableCell>
                        <TableCell className="font-medium">{call.userId || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Clock className="h-4 w-4" />
                            {formatDuration(call.duration || 0)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{call.status || 'Completed'}</Badge>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatDate(call.createdAt)}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Phone className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="font-medium text-slate-900 mb-2">No call logs yet</h3>
                <p className="text-slate-500 text-sm">
                  {searchTerm ? "Try adjusting your search" : "Call logs will appear here"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
